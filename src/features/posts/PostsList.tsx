import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButtons } from './ReactionButtons'
import { fetchPosts, selectPostIds, selectPostById } from './postsSlice'
import { RootState } from '../../app/store'
import { useEffect } from 'react'


let PostExcerpt: React.FC<any> = ({ postId }) => {
    const post = useSelector((state: RootState) => selectPostById(state, postId))
    return (
        <article className="post-excerpt" key={post.id}>
            <h3>{post.title}</h3>
            <div>
                <PostAuthor userId={post.user} />
                <TimeAgo timestamp={post.date} />
            </div>
            <p className="post-content">{post.content.substring(0, 100)}</p>    {/* posts limited to 100 char */}

            <ReactionButtons post={post} />
            <Link to={`/posts/${post.id}`} className="button muted-button">
                View Post
            </Link>
        </article>
    )
}

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
            // Now, if we try clicking a reaction button on one of the posts while capturing a React component performance
            // profile, we should see that only this component is re-rendered
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