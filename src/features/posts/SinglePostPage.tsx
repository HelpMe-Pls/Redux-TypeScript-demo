
import React from 'react'
import { useSelector } from 'react-redux'
import { Link, RouteComponentProps } from 'react-router-dom'

import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButtons } from './ReactionButtons'
import { RootState } from '../../app/store'
import { selectPostById } from './postsSlice'

export const SinglePostPage = ({ match }: RouteComponentProps<{ postId: string }>) => {
    const { postId } = match.params         // it has to be {match} or it wouldn't work with <Link>

    const post = useSelector((state: RootState) =>
        selectPostById(state, postId)
    )

    if (!post) {
        return (
            <section>
                <h2>Post not found :P</h2>
            </section>
        )
    }

    return (
        <section>
            <article className="post">
                <h2>{post.title}</h2>
                <div>
                    <PostAuthor userId={post.user} />
                    <TimeAgo timestamp={post.date} />
                </div>
                <p className="post-content">{post.content}</p>
                <ReactionButtons post={post} />
                <Link to={`/editPost/${post.id}`} className="button">
                    Edit Post
                </Link>
            </article>
        </section>
    )
}
