import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { selectUserById } from '../users/usersSlice'
import { selectPostsByUser } from '../posts/postsSlice'
import { RootState } from '../../app/store'

export const UserPage: React.FC<any> = ({ match }) => {
    const { userId } = match.params

    const user = useSelector((state: RootState) => {
        return (selectUserById(state, userId))
    }
    )

    const postsForUser = useSelector((state: RootState) => selectPostsByUser(state, userId))
    // run the React profiler while fetching notifications, we should see that <UserPage> doesn't re-render anymore 
    //=>help us avoid unnecessary re-renders, and also avoid doing potentially complex or expensive calculations if the input data hasn't changed

    // const postsForUser = useSelector((state: RootState) => {
    //     const allPosts = selectAllPosts(state)  // the type of allPosts: any[] coz IPostState.posts: any[]
    //     return allPosts.filter(post => post.user === userId)
    //     // this means that useSelector always returns a new array reference, and so our component will re-render after every action even if the posts data hasn't changed! 
    // fix this with the alternating code above
    // })
    /* we can take data from one useSelector call, or from props, and use that (in this case: {user}) to help decide
       what (in this case: {post}) to read from the store in another useSelector call (in this case: {postsForUser}). */

    const postTitles = postsForUser.map(post => (
        <li key={post.id}>
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
        </li>
    ))

    return (
        <section>
            <h2>{user?.name}</h2>
            {/* undefined {name} happens if the {selectUserById} from `usersSlice` and the {useSelector} from {user}
                are implicitly returned by the fat arrow. To fix it we have to explicitly add the {return} keyword.
                Then, the {user} object maybe undefined so we have to add {?} behind it */}
            <ul>{postTitles}</ul>
        </section>
    )
}