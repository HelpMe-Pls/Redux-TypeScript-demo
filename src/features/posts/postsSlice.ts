/* Responsible for handling all updates to posts data.
We're gonna use createSlice function (from Redux toolkit) to make a reducer function that knows how to
handle out posts data. It needs to some initial data included so that
the Redux store has those values loaded when the app starts up */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../api/client'
import { RootState } from '../../app/store'

interface IPostState {
    posts: any[],
    status: string,
    error: any
}

const initialState: IPostState = {
    posts: [],
    status: 'idle',
    error: null
}

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {    // 'posts/fetchPosts' (a string) will be used as the prefix for the generated action types
    const response = await client.get('/fakeApi/posts')
    return response.posts   // response is logged in console by miragejs or we can view it in the "Action" tab from Redux Devtool 
    // this second param as a "payload creator" callback function t0hat should return a Promise containing some data, or a rejected Promise with an error
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
            const existingPost = state.posts.find((post) => post.id === postId)
            if (existingPost) {
                existingPost.reactions[reaction]++
            }
        },
        postUpdated(state, action) {
            const { id, title, content } = action.payload
            const existingPost = state.posts.find((post) => post.id === id)
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
            state.posts = state.posts.concat(action.payload)
        },
        [fetchPosts.rejected.toString()]: (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        },
        [addNewPost.fulfilled.toString()]: (state, action) => {
            // We can directly add the new post object to our posts array
            state.posts.push(action.payload)
        }
    }
})

/* When we write {postAdded} reducer function, {createSlice} will automatically generate an "action creator" function with
the same name. We can export it and use it in our UI component to dispatch an action when the user clicks "Save Post" */
export const { postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer   //to import it in the store

export const selectAllPosts = (state: RootState) => state.posts.posts

export const selectPostById = (state: RootState, postId: string) => state.posts.posts.find(post => post.id === postId)

