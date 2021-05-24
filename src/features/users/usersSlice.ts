import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { client } from '../../api/client'
interface IUserState {
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
        [fetchUsers.fulfilled.toString()]: (state, action) => {     //toString() ?
            return action.payload
        }
    }
})

export default usersSlice.reducer
