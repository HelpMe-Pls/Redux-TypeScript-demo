import { nanoid } from '@reduxjs/toolkit'   // Redux's random {id} generator 
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { postAdded } from './postsSlice'

export const AddPostForm = () => {
    //these 2 states below are only accessed by this form so there's no need to move it into Redux's store
    //the Redux store should only contain data that's considered "global" for the application

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    const dispatch = useDispatch()

    const onTitleChanged = (e: any) => setTitle(e.target.value)
    const onContentChanged = (e: any) => setContent(e.target.value)

    const onSavePostClicked = () => {
        if (title && content) {
            dispatch(   //dispatching the action containing data for the current post entry to update the store
                postAdded({
                    id: nanoid(),
                    title,
                    content
                })
            )

            // reset input fields to blank to set up for the next inputs
            setTitle('')
            setContent('')
        }
    }

    return (
        <section>
            <h2>Add a New Post</h2>
            <form>
                <label htmlFor="postTitle">Post Title:</label> {/* htmlFor refers to the {id} of the element this label associated with, in this case, the <input> */}
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    value={title}
                    onChange={onTitleChanged}
                />
                <label htmlFor="postContent">Post Content:</label> {/* if there's NO htmlFor then when we click on the label name (Post Content:) it's not focusing on the input, only focus when we click exactly on the input  */}
                <textarea
                    name="postContent"
                    id="postContent"
                    value={content}
                    onChange={onContentChanged}>
                </textarea> 
                <button type="button" onClick={onSavePostClicked}> Save Post </button>
                {/* figure out why the fuck do we need a button type inside a fcking button */}
            </form>
        </section>
    )
}