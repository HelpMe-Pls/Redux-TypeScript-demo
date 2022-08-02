/* Responsible for handling all updates to posts data.
We're gonna use createSlice function (from Redux toolkit) to make a reducer function that knows how to
handle out posts data. It needs to some initial data included so that
the Redux store has those values loaded when the app starts up */

import { createSlice, createAsyncThunk, createSelector, createEntityAdapter, EntityId, PayloadAction } from '@reduxjs/toolkit'
import { client } from '../../api/client'
import { Status } from '../../app/status'
import { RootState } from '../../app/store'


export interface Reactions {
    thumbsUp: number
    hooray: number
    heart: number
    rocket: number
    eyes: number
}

export type AvailableReaction = keyof Reactions

export interface IPostState {
    id: EntityId
    title: string
    date: string
    content: string
    user: string
    reactions: Reactions
}

export interface AddPostBody {
    title: string
    content: string
    user: string
}

// This `postsAdapter` is kinda like `state.posts` on steroids
const postsAdapter = createEntityAdapter<IPostState>({
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
const initialState = postsAdapter.getInitialState<{ status: Status, error: string | null }>({
    status: Status.IDLE,
    error: null,
})

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (_, { rejectWithValue }) => {    // 'posts/fetchPosts' (a string) will be used as the prefix for the generated action types
    // async acts as a "payload creator" callback function that should return a Promise containing some data, or a rejected Promise with an error
    try {
        const response = await client.get('/fakeApi/posts')
        return response.posts as IPostState[]  // response is logged in console by miragejs or we can view it in the "Action" tab from Redux Devtool 
    }
    catch (err: any) {
        return rejectWithValue(err.message);
    };
})


export const addNewPost = createAsyncThunk( //We can use {createAsyncThunk} to help with sending data, not just fetching it
    'posts/addNewPost',
    // The payload creator receives the partial `{title, content, user}` object
    async (initialPost: AddPostBody) => {
        // We send the initial data to the fake API server with POST method
        const response = await client.post('/fakeApi/posts', { post: initialPost })
        // The response includes the complete post object, including unique ID
        return response.post as IPostState
    }
)

const postsSlice = createSlice({
    name: 'posts',  //represents action types
    initialState,
    reducers: {
        /* this block was used for hard-coded data
        postAdded: {
            reducer(state, action: PayloadAction<any>) {
                // since the posts slice ONLY knows about the data it's responsible for, the `state` arg will be
                // the array of posts by itself, and not the entire Redux state object
                state.posts.push(action.payload)  // don't try to mutate any data outside of {createSlice} for the sake of immutability
            },
            prepare(title, content, userId) {
                // If you want to add a meta or error property to your action, or customize the payload of your action,
                // you have to use the `prepare` notation for defining the reducer's case
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
        reactionAdded(state, action: PayloadAction<{ postId: EntityId, reaction: AvailableReaction }>) {
            const { postId, reaction } = action.payload

            // `state.entities` from `intialState` which is a draft that you can "mutate"
            const existingPost = state.entities[postId] // `postId` from payload

            if (existingPost) {
                existingPost.reactions[reaction]++
            }
        },
        postUpdated(state, action: PayloadAction<{ postId: EntityId, title: string, content: string }>) {
            const { postId, title, content } = action.payload
            const existingPost = state.entities[postId]
            if (existingPost) {
                existingPost.title = title
                existingPost.content = content
            }
        },
    },
    extraReducers: builder => {
        // Is used when a slice reducer needs to respond to other actions that weren't defined as part of its field
        // In this case, we need to listen for the "pending" and "fulfilled" action types dispatched by our fetchPosts thunk defined OUTSIDE the slice.
        builder.addCase(fetchPosts.pending, state => {
            state.status = Status.LOADING
        })
        builder.addCase(fetchPosts.fulfilled, (state, action: PayloadAction<IPostState[]>) => {
            state.status = Status.SUCCEEDED
            // Add any fetched posts to the array
            // Use the `upsertMany` reducer as a mutating update utility:
            //   to add all of the incoming posts to the state, by passing in the draft `state` and the array of posts in action.payload
            //   If there's any items in action.payload that already existing in our state,
            //   the `upsertMany` function will merge them together based on matching IDs
            postsAdapter.upsertMany(state, action.payload)
        })
        builder.addCase(fetchPosts.rejected, (state, action) => {
            state.status = Status.FAILED
            state.error = action.error.message!
        })
        // Use the `addOne` reducer for the fulfilled case to add one new post object to our state
        builder.addCase(addNewPost.fulfilled, postsAdapter.addOne)
    }
})

/* When we write `postUpdate reducer function, {createSlice} will automatically generate an "action creator" function with
the same name, same goes for `reactionAdded`. We can export them and use it in our UI component to dispatch an action when the user clicks "Save Post" */
export const { postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer   // to be imported in the store

// Export the customized selectors for this adapter using the returned values from `getSelectors`    
export const {
    // use ES6 destructuring syntax to RENAME them (the GENERATED EntitySelectors, left side of the colon) 
    // as we export them and use them as the old selector names (right side of the colon)
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds,
} = postsAdapter.getSelectors((state: RootState) => state.posts)   // Pass in a selector that returns the posts slice of the global state: 
// Since the selectors are called with the root Redux state object, they need to know where to find our posts data
// in the Redux state, so we pass in a small selector that returns state.posts

export const selectPostsByUser = createSelector(
    [selectAllPosts, (_state: RootState, userId: EntityId) => userId], // very odd way of declaring the state as {_state} because we're not using it here but calling it in UserPage
    (posts, userId) => posts.filter(post => post.user === userId)
)

