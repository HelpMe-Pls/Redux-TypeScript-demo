/* Responsible for handling all updates to posts data.
We're gonna use createSlice function (from Redux toolkit) to make a reducer function that knows how to
handle out posts data. It needs to some initial data included so that
the Redux store has those values loaded when the app starts up */

import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit'
import { sub } from 'date-fns'

interface IIniState {
    id: string,
    title: string,
    content: string,
    user: any,
    date: string,
    reactions: any
}

const initialState: IIniState[] = [
    {
        id: '1',
        title: 'First post',
        content: 'lô',
        user: '0',
        date: sub(new Date(), { minutes: 10 }).toISOString(),
        reactions: {
            thumbsUp: 0,
            hooray: 0,
            heart: 0,
            rocket: 0,
            eyes: 0,
        },
    },
    {
        id: '2',
        title: 'Second post',
        content: 'lô con cặc',
        user: '2',
        date: sub(new Date(), { minutes: 5 }).toISOString(),
        reactions: {
            thumbsUp: 0,
            hooray: 0,
            heart: 0,
            rocket: 0,
            eyes: 0,
        },
    }
]

const postsSlice = createSlice({
    name: 'posts',  //represents action types
    initialState,
    reducers: {
        postAdded: {
            reducer(state, action: PayloadAction<any>) {
                // since the posts slice ONLY knows about the data it's responsible for, the {state} arg will be
                // the array of posts by itself, and not the entire Redux state object.
                state.push(action.payload)  // don't try to mutate any data outside of {createSlice} for the sake of immutability
            },
            prepare(title, content, userId) {
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
        },
        reactionAdded(state, action) {
            const { postId, reaction } = action.payload
            const existingPost = state.find((post) => post.id === postId)
            if (existingPost) {
                existingPost.reactions[reaction]++
            }
        },
        postUpdated(state, action) {
            const { id, title, content } = action.payload
            const existingPost = state.find((post) => post.id === id)
            if (existingPost) {
                existingPost.title = title
                existingPost.content = content
            }
        },
    }
})

/* When we write {postAdded} reducer function, {createSlice} will automatically generate an "action creator" function with
the same name. We can export it and use it in our UI component to dispatch an action when the user clicks "Save Post" */
export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions


export default postsSlice.reducer   //to import it in the store
