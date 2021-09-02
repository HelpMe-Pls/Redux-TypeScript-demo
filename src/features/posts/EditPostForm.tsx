import { ChangeEvent, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RouteComponentProps, useHistory } from 'react-router-dom'
import { AppDispatch, RootState } from '../../app/store'

import { IPostState, postUpdated, selectPostById } from './postsSlice'

export const EditPostForm = ({ match }: RouteComponentProps<{ postId: string }>) => {
    const { postId } = match.params

    const post = useSelector<RootState, IPostState | undefined>((state =>
        selectPostById(state, postId)
    ))

    // this block of code placed here is illegal because it violates the rules of hook (if there's no post, the useState hooks would never be executed)
    // if (!post) {
    //     return (
    //         <section>
    //             <h2>Post Not Found</h2>
    //         </section>
    //     )
    // }

    const [title, setTitle] = useState(post ? post.title : '')
    const [content, setContent] = useState(post ? post.content : '')

    const dispatch: AppDispatch = useDispatch()
    const history = useHistory()

    // {post} is possibly undefined so we gotta cover it 
    if (!post) {
        return (
            <section>
                <h2>Post Not Found</h2>
            </section>
        )
    }

    const onTitleChanged = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)
    const onContentChanged = (e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)

    const onSavePostClicked = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (title && content) {
            dispatch(postUpdated({ id: postId, title, content }))
            history.push(`/posts/${postId}`)
        }
    }

    return (
        <section>
            <h2>Edit Post</h2>
            <form onSubmit={onSavePostClicked}>
                <label htmlFor="postTitle">Post Title:</label>
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    placeholder="Roll it back..."
                    value={title}
                    onChange={onTitleChanged}
                />
                <label htmlFor="postContent">Content:</label>
                <textarea
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={onContentChanged}
                />
            </form>
            <button type="submit">
                Save Post
            </button>
        </section>
    )
}
