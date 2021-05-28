import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { client } from '../../api/client'
import { RootState } from '../../app/store'

export interface IUserState {
    id: string,
    name: string
}

const initialState: IUserState[] = []

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await client.get('/fakeApi/users')
    return response.users
})

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchUsers.fulfilled.toString()]: (state, action) => {     // why {state} isn't used but when we omit it, shits hit the fan
            return action.payload
        }
    }
})

export const selectAllUsers = (state: RootState) => state.users     // to be imported in UsersList

export const selectUserById = (state: RootState, userId: string) => {   // to be imported in UserPage
    return (state.users.find((user: any) => user.id === userId))
}

export default usersSlice.reducer
