import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../app/store'

export const PostAuthor: React.FC<any> = ({ userId }) => {
    const author = useSelector((state: RootState) =>
        state.users.find((user) => user.id === userId)
    )

    return <span>by {author ? author.name : 'Unknown author'}</span>
}
