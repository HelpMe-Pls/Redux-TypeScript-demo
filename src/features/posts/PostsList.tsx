import { useDispatch, useSelector } from 'react-redux'

import { fetchPosts, selectPostIds } from './postsSlice'
import { RootState } from '../../app/store'
import { useEffect } from 'react'



export const PostsList = () => {
    /* The component reads data from the Redux store using the {useSelector} hook.  
    useSelector will be called with the entire Redux {state} abject as a parameter, and should return
    the specific data that this component needs from the store 
    Any time an action has been dispatched and the store has been updated, {useSelector} will re-run to update the data */
    const dispatch = useDispatch()
    const orderedPostIds = useSelector(selectPostIds)

    const postStatus = useSelector((state: RootState) => state.posts.status)
    const error = useSelector((state: RootState) => state.posts.error)

    useEffect(() => { //only try to fetch the list of posts once
        if (postStatus === 'idle') {
            dispatch(fetchPosts())
        }
    }, [postStatus, dispatch])

    let content

    if (postStatus === 'loading') {
        content = <div className="loader">Loading...</div>
    } else if (postStatus === 'succeeded') {
        content = orderedPostIds.map((postID) => (
            <PostExcerpt key={postID} postId={postID} />
            // Now, if we try clicking a reaction button on one of the posts while profiling,
            // we should see that only this component is re-rendered
        ))
    } else if (postStatus === 'failed') {
        content = <div>{error}</div>

    }

    return (
        <section className="posts-list">
            <h2>Posts</h2>
            {content}
        </section>
    )
}