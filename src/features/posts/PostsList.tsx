import { useDispatch, useSelector } from 'react-redux'

import { fetchPosts, selectPostIds } from './postsSlice'
import { AppDispatch, RootState } from '../../app/store'
import { useEffect } from 'react'
import { Status } from '../../app/status'
import { PostExcerpt } from './PostExcerpt'

export const PostsList = () => {
	/* The component reads data from the Redux store using the `useSelector` hook.  
    `useSelector` will be called with the entire Redux `state` object as a parameter, and should return the specific data that this component needs from the store 
    Any time an action has been dispatched and the store has been updated, {useSelector} will re-run to update the data */
	const dispatch: AppDispatch = useDispatch()
	const orderedPostIds = useSelector(selectPostIds)

	const postStatus = useSelector((state: RootState) => state.posts.status)
	const error = useSelector((state: RootState) => state.posts.error)

	useEffect(() => {
		//only try to fetch the list of posts once
		if (postStatus === Status.IDLE) {
			dispatch(fetchPosts())
		}
	}, [dispatch, postStatus])

	// let content

	// if (postStatus === Status.LOADING) {
	//     content = <div className="loader">Loading...</div>
	// } else if (postStatus === Status.SUCCEEDED) {
	//     content = orderedPostIds.map((postID) => (
	//         <PostExcerpt key={postID} postId={postID} />
	//         // Now, if we try clicking a reaction button on one of the posts while profiling,
	//         // we should see that only this component is re-rendered
	//     ))
	// } else if (postStatus === Status.FAILED) {
	//     content = <div>{error}</div>

	// }

	const content = (() => {
		switch (postStatus) {
			case Status.LOADING:
				return <div className="loader">Loading&hellip;</div> // &hellip is the symbol for `…`
			case Status.SUCCEEDED:
				return orderedPostIds.map((postId) => (
					<PostExcerpt key={postId} postId={postId} />
				))
			case Status.FAILED:
				return <div>{error}</div>
			default:
				return <span></span>
		}
	})()

	return (
		<section className="posts-list">
			<h2>Posts</h2>
			{content}
		</section>
	)
}
