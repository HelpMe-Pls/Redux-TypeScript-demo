import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { client } from '../../api/client'
import { RootState } from '../../app/store'


/* interface INotiState {

}

const initialState: INotiState = {

} */


export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async (_, { getState }) => {
        const allNotifications = selectAllNotifications(getState())
        const [latestNotification] = allNotifications
        const latestTimestamp = latestNotification ? latestNotification.date : ''
        const response = await client.get(
            `/fakeApi/notifications?since=${latestTimestamp}`
        )
        return response.notifications
    }
)

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: [],
    reducers: {
        allNotificationsRead(state) {   // check if action is required and define action's type if it is ?
            state.forEach((notification: any) => {
                notification.read = true
            })
        }
    },
    extraReducers: {
        [fetchNotifications.fulfilled.toString()]: (state: any[], action) => {  // why tf any[] works but not RootState
            state.forEach(notification => {
                // Any notifications we've read are no longer new
                notification.isNew = !notification.read
            })
            state.push(...action.payload)
            // Sort with newest first
            state.sort((a, b) => b.date.localeCompare(a.date))
        }
    }
})

export default notificationsSlice.reducer

export const { allNotificationsRead } = notificationsSlice.actions

export const selectAllNotifications: any = (state: RootState) => state.notifications