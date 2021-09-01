import React from 'react'
import { EntityId } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { RootState } from '../../app/store'
import { selectPostById } from './postsSlice'

import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButtons } from './ReactionButtons'

export const PostExcerpt = ({ postId }: { postId: EntityId }) => {
    const post = useSelector((state: RootState) => selectPostById(state, postId))

    if (!post) {
        return (
            <></>
        )
    }

    return (
        <article className="post-excerpt">
            <h3>{post.title}</h3>
            <div>
                <PostAuthor userId={post.user} />
                <TimeAgo timestamp={post.date} />
            </div>
            <p className="post-content">{post.content.substring(0, 100)}</p>
            <ReactionButtons post={post} />
            <Link to={`/posts/${post.id}`} className="button muted-button">
                View Post
            </Link>
        </article>
    )
}