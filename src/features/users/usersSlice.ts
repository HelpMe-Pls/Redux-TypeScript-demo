import { createAsyncThunk, createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import { client } from '../../api/client'
import { RootState } from '../../app/store'

export interface IUserState {
    id: string,
    name: string
}

const usersAdapter = createEntityAdapter<IUserState>()

const initialState = usersAdapter.getInitialState()   // any better way to initiate an empty list ?

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await client.get('/fakeApi/users')
    return response.users
})

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchUsers.fulfilled.toString()]: usersAdapter.setAll
    }
})

export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
} = usersAdapter.getSelectors((state: RootState) => state.users)

export default usersSlice.reducer   // to be imported in store
