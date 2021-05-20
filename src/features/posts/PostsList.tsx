import { useSelector } from 'react-redux'
import { RootState } from '../../app/store'
import { Link } from 'react-router-dom'

import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButtons } from './ReactionButtons'

export const PostsList = () => {
    /* The component reads data from the Redux store using the {useSelector} hook. 
    useSelector will be called with the entire Redux {state} abject as a parameter, and should return
    the specific data that this component needs from the store 
    Any time an action has been dispatched and the store has been updated, {useSelector} will re-run to update the data */

    const posts = useSelector((state: RootState) => state.posts)

    const orderedPosts = posts
        .slice()
        .sort((a, b) => b.date.localeCompare(a.date))

    const renderedPosts = orderedPosts.map((post) => {
        return (
            <article className="post-excerpt" key={post.id}>
                <h3>{post.title}</h3>
                <div>
                    <PostAuthor userId={post?.user} />
                    <TimeAgo timestamp={post?.date} />
                </div>
                <p className="post-content">{post.content.substring(0, 100)}</p>    {/* posts limited to 100 char */}

                <ReactionButtons post={post} />
                <Link to={`/posts/${post.id}`} className="button muted-button">
                    View Post
                </Link>
            </article>
        )
    })

    return (
        <section className="posts-list">
            <h2>Posts</h2>
            {renderedPosts}
        </section>
    )
}