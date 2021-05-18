import { useSelector } from 'react-redux'
import { RootState } from '../../app/store'

export const PostsList = () => {
    /* The component reads data from the Redux store using the {useSelector} hook. 
    useSelector will be called with the entire Redux {state} abject as a parameter, and should return
    the specific data that this component needs from the store 
    Any time an action has been dispatched and the store has been updated, {useSelector} will re-run to update the data */

    const posts = useSelector((state: RootState) => state.posts)

    const renderedPosts = posts.map((post: any) => (
        <article className="post-excerpt" key={post.id} >
            <h3>{post.title}</h3>
            <p className="post-content"> {post.content.substring(0, 100)} </p>  {/* post content limited to 100 char */}
        </article>
    ))

    return (
        <section className="posts-list" >
            <h2>Posts</h2>
            {renderedPosts}
        </section>
    )
}