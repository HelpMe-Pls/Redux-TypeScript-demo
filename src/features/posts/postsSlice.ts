/* Responsible for handling all updates to posts data.
We're gonna use createSlice function (from Redux toolkit) to make a reducer function that knows how to
handle out posts data. It needs to some initial data included so that
the Redux store has those values loaded when the app starts up */

import { createSlice, createAsyncThunk, createSelector, createEntityAdapter } from '@reduxjs/toolkit'
import { client } from '../../api/client'
import { RootState } from '../../app/store'
import { IUserState } from '../users/usersSlice'

// createEntityAdapter defined the {state} for us so we don't have to declare an interface for it ??
// interface IPostState {
//     posts: any[],
//     status: string,
//     error: any
// }

const postsAdapter = createEntityAdapter({
    sortComparer: (a: any, b: any) => b.date.localeCompare(a.date), // sort newer items to the front based on the post.date field
})

// Since we've been storing our data in arrays, that means we have to loop over all the items in the array using array.find()
// until we find the item with the ID we're looking for, and that becomes wasted effort
// What we need is a way to look up a single item based on its ID, directly, without having to check all the other items.
// This process is known as "normalization"
// Redux Toolkit's createEntityAdapter API provides a standardized way to store your data in a slice by taking a collection of items
// and putting them into the shape of { ids: [], entities: {} }

// getInitialState() returns an empty {ids: [], entities: {}} normalized state object
// You can pass in more fields (in this case: {status} and {error}) to getInitialState, and those will be merged in.
const initialState = postsAdapter.getInitialState({
    status: 'idle',
    error: null,
})

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {    // 'posts/fetchPosts' (a string) will be used as the prefix for the generated action types
    const response = await client.get('/fakeApi/posts')
    return response.posts   // response is logged in console by miragejs or we can view it in the "Action" tab from Redux Devtool 
    // this second param as a "payload creator" callback function that should return a Promise containing some data, or a rejected Promise with an error
})

export const addNewPost: any = createAsyncThunk( //We can use {createAsyncThunk} to help with sending data, not just fetching it
    'posts/addNewPost',
    // The payload creator receives the partial `{title, content, user}` object
    async (initialPost) => {
        // We send the initial data to the fake API server with POST method
        const response = await client.post('/fakeApi/posts', { post: initialPost })
        // The response includes the complete post object, including unique ID
        return response.post
    }
)

const postsSlice = createSlice({
    name: 'posts',  //represents action types
    initialState,
    reducers: {
        /* this block is used for hard-coded data
        postAdded: {
            reducer(state, action: PayloadAction<any>) {
                // since the posts slice ONLY knows about the data it's responsible for, the {state} arg will be
                // the array of posts by itself, and not the entire Redux state object.
                state.posts.push(action.payload)  // don't try to mutate any data outside of {createSlice} for the sake of immutability
            },
            prepare(title, content, userId) {
                // If you want to add a meta or error property to your action, or customize the payload of your action,
                // you have to use the {prepare} notation for defining the case reducer
                return {
                    payload: {
                        id: nanoid(),
                        date: new Date().toISOString(),
                        title,
                        content,
                        user: userId,
                        reactions: {
                            thumbsUp: 0,
                            hooray: 0,
                            heart: 0,
                            rocket: 0,
                            eyes: 0,
                        }
                    }
                }
            }
        }, */
        reactionAdded(state, action) {
            const { postId, reaction } = action.payload
            const existingPost = state.entities[postId] // postId from payload
            if (existingPost) {
                existingPost.reactions[reaction]++
            }
        },
        postUpdated(state, action) {
            const { id, title, content } = action.payload
            const existingPost = state.entities[id] // id from payload
            if (existingPost) {
                existingPost.title = title
                existingPost.content = content
            }
        },
    },
    extraReducers: {
        // Is used when a slice reducer needs to respond to other actions that weren't defined as part of its field
        // In this case, we need to listen for the "pending" and "fulfilled" action types dispatched by our fetchPosts thunk defined outside the slice.
        [fetchPosts.pending.toString()]: (state) => {
            state.status = 'loading'
        },
        [fetchPosts.fulfilled.toString()]: (state, action) => {
            state.status = 'succeeded'
            // Add any fetched posts to the array
            // Use the `upsertMany` reducer as a mutating update utility:
            //   to add all of the incoming posts to the state, by passing in the draft {state} and the array of posts in action.payload
            //   If there's any items in action.payload that already existing in our state,
            //   the upsertMany function will merge them together based on matching IDs
            postsAdapter.upsertMany(state, action.payload)
        },
        [fetchPosts.rejected.toString()]: (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        },
        // Use the `addOne` reducer for the fulfilled case to add one new post object to our state
        [addNewPost.fulfilled]: postsAdapter.addOne,
    }
})

/* When we write {postAdded} reducer function, {createSlice} will automatically generate an "action creator" function with
the same name. We can export it and use it in our UI component to dispatch an action when the user clicks "Save Post" */
export const { postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer   //to import it in the store

// Export the customized selectors for this adapter using the generated `getSelectors`    
export const {  //use ES6 destructuring syntax to RENAME them (the GENERATED EntitySelectors, left side of the colon) as we export them and muse them as the old selector names 
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds,
} = postsAdapter.getSelectors((state: RootState) => state.posts)   // Pass in a selector that returns the posts slice of state
// Since the selectors are called with the root Redux state object, they need to know where to find our posts data
// in the Redux state, so we pass in a small selector that returns state.posts

export const selectPostsByUser = createSelector(
    [selectAllPosts, (state: RootState, userId: IUserState) => userId], // not omitting {state} for the sake of calling it in UserPage
    (posts, userId) => posts.filter((post: { user: IUserState }) => post.user === userId)
)

