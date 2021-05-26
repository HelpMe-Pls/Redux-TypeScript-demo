import { unwrapResult } from '@reduxjs/toolkit'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../app/store'
import { addNewPost } from './postsSlice'


export const AddPostForm = () => {
    //these 2 states below are only accessed by this form so there's no need to move it into Redux's store
    //the Redux store should only contain data that's considered "global" for the application

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [userId, setUserId] = useState('')
    const [addRequestStatus, setAddRequestStatus] = useState('idle')

    const dispatch = useDispatch()
    const users = useSelector((state: RootState) => state.users)

    const onTitleChanged = (e: any) => setTitle(e.target.value)
    const onContentChanged = (e: any) => setContent(e.target.value)
    const onAuthorChanged = (e: any) => setUserId(e.target.value)

    const canSave = [title, content, userId].every(Boolean) && addRequestStatus === 'idle'
    const onSavePostClicked = async () => {
        if (canSave) {
            try {
                setAddRequestStatus('pending')
                const resultAction: any = await dispatch(
                    // When we call dispatch(addNewPost()), the async thunk returns a Promise from dispatch.
                    // We can await that promise here to know when the thunk has finished its request.
                    // But, we don't yet know if that request succeeded or failed.
                    addNewPost({ title, content, user: userId })
                )
                unwrapResult(resultAction)
                /* {unwrapResult} will return either the actual action.payload value from a fulfilled action,
                or throw an error if it's the rejected action, because {createAsyncThunk} handles any errors internally,
                so that we don't see any messages about "rejected Promises" in our logs */
                setTitle('')
                setContent('')
                setUserId('')
            } catch (err) {
                console.error('Failed to save the post', err)
            } finally {
                setAddRequestStatus('idle')
            }
        }
    }



    const usersOptions = users.map((user) => (
        <option key={user.id} value={user.id}>
            {user.name}
        </option>
    ))

    return (
        <section>
            <h2>Add a New Post</h2>
            <form>
                <label htmlFor="postTitle">Post Title:</label>
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    placeholder="Type sth..."
                    value={title}
                    onChange={onTitleChanged}
                />
                <label htmlFor="postAuthor">Author:</label>
                <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
                    <option value=""></option>
                    {usersOptions}
                </select>
                <label htmlFor="postContent">Content:</label>
                <textarea
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={onContentChanged}
                />
                <button type="button" onClick={onSavePostClicked} disabled={!canSave}>
                    Save Post
                </button>
                {/* button without type will behave as submit type that's y we need to declare it as type="button",
                which does nothing for the button so that its functionality is solely depends on the onClick */}
            </form>
        </section>
    )
}
