import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../app/store'

import { reactionAdded, AvailableReaction, IPostState } from './postsSlice'

const reactionEmoji: { [key in AvailableReaction]: string } = {
    thumbsUp: '👍',
    hooray: '🎉',
    heart: '❤️',
    rocket: '🚀',
    eyes: '👀',
}

export const ReactionButtons = ({ post }: { post: IPostState }) => {
    const dispatch: AppDispatch = useDispatch()

    const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
        return (
            <button
                key={name}
                type="button"
                className="muted-button reaction-button"
                onClick={() =>
                    dispatch(reactionAdded({ postId: post.id, reaction: name as AvailableReaction }))
                }
            >
                {emoji} {post.reactions[name as AvailableReaction]}
            </button>
        )
    })

    return <div>{reactionButtons}</div>
}
