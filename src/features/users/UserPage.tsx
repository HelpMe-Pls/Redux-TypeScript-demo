import { useSelector } from 'react-redux'
import { Link, RouteComponentProps } from 'react-router-dom'

import { IUserState, selectUserById } from '../users/usersSlice'
import { selectPostsByUser } from '../posts/postsSlice'
import { RootState } from '../../app/store'

export const UserPage = ({ match }: RouteComponentProps<{ userId: string }>) => {
    const { userId } = match.params

    const user = useSelector<RootState, IUserState | undefined>(state => selectUserById(state, userId))

    // run the React profiler while fetching notifications, we should see that <UserPage> doesn't re-render anymore 
    //=>help us avoid unnecessary re-renders, and also avoid doing potentially complex or expensive calculations if the input data hasn't changed
    const postsForUser = useSelector<RootState, Post[]>(state => selectPostsByUser(state, userId))

    // const postsForUser = useSelector((state: RootState) => {
    //     const allPosts = selectAllPosts(state)  // the type of allPosts: any[] coz IPostState.posts: any[]
    //     return allPosts.filter(post => post.user === userId)
    //     // this means that useSelector always returns a new array reference, so our component will re-render after every action even if the posts data hasn't changed! 
    // fix this with the alternating code above
    // })
    /* we can take data (in this case: {user}) from one useSelector call, or from props, and use that to help decide
       what (in this case: {post}) to read from the store in another useSelector call (in this case: {postsForUser}). */

    if (!user) {        //to catch that {undefined} state from {user}
        return (
            <section>
                <h2>User Not Found</h2>
            </section>
        )
    }

    const postTitles = postsForUser.map(post => (
        <li key={post.id}>
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
        </li>
    ))

    return (
        <section>
            <h2>{user.name}</h2>
            {/* undefined {name} happens if the {selectUserById} from `usersSlice` and the {useSelector} from {user}
                are implicitly returned by the fat arrow. To fix it we have to explicitly add the {return} keyword.
                Then, the {user} object maybe undefined so we have to add {?} behind it */}
            <ul>{postTitles}</ul>
        </section>
    )
}