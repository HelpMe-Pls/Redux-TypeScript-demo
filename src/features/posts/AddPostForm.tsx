import { unwrapResult } from '@reduxjs/toolkit'
import { ChangeEvent, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addNewPost } from './postsSlice'
import { selectAllUsers } from '../users/usersSlice'
import { Status } from '../../app/status'
import { AppDispatch } from '../../app/store'

export const AddPostForm = () => {
	//these states below are only accessed by this form so there's no need to move it into Redux's store
	//the Redux store should only contain data that's considered "global" for the application

	const [title, setTitle] = useState('')
	const [content, setContent] = useState('')
	const [userId, setUserId] = useState('')
	const [addRequestStatus, setAddRequestStatus] = useState(Status.IDLE)

	const dispatch: AppDispatch = useDispatch()
	const users = useSelector(selectAllUsers)

	const onTitleChanged = (e: ChangeEvent<HTMLInputElement>) =>
		setTitle(e.target.value)
	const onContentChanged = (e: ChangeEvent<HTMLTextAreaElement>) =>
		setContent(e.target.value)
	const onAuthorChanged = (e: ChangeEvent<HTMLSelectElement>) =>
		setUserId(e.target.value)

	const canSave =
		[title, content, userId].every(Boolean) &&
		addRequestStatus === Status.IDLE
	const onSavePostClicked = async (e: ChangeEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (canSave) {
			try {
				setAddRequestStatus(Status.LOADING)
				const resultAction: any = await dispatch(
					// When we call `dispatch(addNewPost())`, the async thunk returns a Promise from dispatch.
					// We can await that promise here to know when the thunk has finished its request.
					// But, we don't yet know if that request succeeded or failed.
					addNewPost({ title, content, user: userId })
				)
				unwrapResult(resultAction)
				/* `unwrapResult` will return either the actual `action.payload` value from a fulfilled action,
                or throw an error if it's the rejected action, because `createAsyncThunk` handles any errors internally,
                so that we don't see any messages about "rejected Promises" in our logs */
				setTitle('')
				setContent('')
				setUserId('')
			} catch (err) {
				console.error('Failed to save the post', err)
			} finally {
				setAddRequestStatus(Status.IDLE)
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
			<form onSubmit={onSavePostClicked}>
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
				<select
					id="postAuthor"
					value={userId}
					onChange={onAuthorChanged}
				>
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
				<button type="submit" disabled={!canSave}>
					Save Post
				</button>
			</form>
		</section>
	)
}
