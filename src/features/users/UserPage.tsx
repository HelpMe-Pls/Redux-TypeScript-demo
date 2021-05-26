import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { selectUserById } from '../users/usersSlice'
import { selectAllPosts } from '../posts/postsSlice'
import { RootState } from '../../app/store'

export const UserPage: React.FC<any> = ({ match }) => {
    const { userId } = match.params

    const user = useSelector((state: RootState) => {
        return (selectUserById(state, userId))
    }
    )

    const postsForUser = useSelector((state: RootState) => {
        const allPosts = selectAllPosts(state)  // the type of allPosts: any[] coz IPostState.posts: any[]
        return allPosts.filter(post => post.user === userId)
    })
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