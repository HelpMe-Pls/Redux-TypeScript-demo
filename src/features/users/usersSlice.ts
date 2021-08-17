import { createAsyncThunk, createSlice, createEntityAdapter, EntityId } from '@reduxjs/toolkit'
import { client } from '../../api/client'
import { RootState } from '../../app/store'

export interface IUserState {
    id: EntityId
    firstName: string
    lastName: string
    name: string
    username: string
}

const usersAdapter = createEntityAdapter<IUserState>()

const initialState = usersAdapter.getInitialState()

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await client.get('/fakeApi/users')
    return response.users
})

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchUsers.fulfilled, usersAdapter.setAll)
    }
})

export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
} = usersAdapter.getSelectors((state: RootState) => state.users)

export default usersSlice.reducer   // to be imported in store
