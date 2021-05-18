/* Responsible for handling all updates to posts data.
We're gonna use createSlice function (from Redux toolkit) to make a reducer function that knows how to
handle out posts data. It needs to some initial data included so that
the Redux store has those values loaded when the app starts up */

import { createSlice } from '@reduxjs/toolkit'

const initialState = [
    { id: '1', title: 'First post', content: 'lô' },
    { id: '2', title: 'Second post', content: 'lô con cặc' }
]

const postsSlice = createSlice({
    name: 'posts',  //represents action types
    initialState,
    reducers: {
        postAdded(state, action) {
            // since the posts slice ONLY knows about the data it's responsible for, the {state} arg will be
            // the array of posts by itself, and not the entire Redux state object.
            state.push(action.payload)  // don't try to mutate any data outside of {createSlice} for the sake of immutability
        }
    }
})

/* When we write {postAdded} reducer function, {createSlice} will automatically generate an "action creator" function with
the same name. We can export it and use it in our UI component to dispatch an action when the user clicks "Save Post" */
export const { postAdded } = postsSlice.actions


export default postsSlice.reducer   //to import it in the store
