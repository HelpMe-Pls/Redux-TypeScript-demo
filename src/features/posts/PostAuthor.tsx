import React from 'react'
import { useSelector } from 'react-redux'
import { selectUserById } from '../users/usersSlice'
import { RootState } from '../../app/store'

export const PostAuthor: React.FC<any> = ({ userId }) => {
    const author = useSelector((state: RootState) =>
        selectUserById(state, userId)
    )

    return <span>by {author ? author.name : 'Unknown author'}</span>
}

// add note to why we should not use React.FC