import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { client } from '../../api/client'
import { RootState } from '../../app/store'



interface INotiState {
    read: boolean,
    isNew: boolean,
    date: string
}

const initialState: INotiState[] = []


export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async (_, { getState }) => {        // explain these 2 params ?
        const allNotifications = selectAllNotifications(getState()) // y getState() when it's already returns state.notifications ?
        const [latestNotification] = allNotifications       // Since the array of notifications is sorted newest first, we can grab the latest one using array destructuring
        // But sometimes it doesn't work as expected: some unread post got lost between read posts
        const latestTimestamp = latestNotification ? latestNotification.date : ''
        const response = await client.get(
            `/fakeApi/notifications?since=${latestTimestamp}`
        )
        return response.notifications
    }
)

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        allNotificationsRead(state) {   // {state} is implicitly recognized as INotiState[] 
            state.forEach((notification) => {  // {notification} from the {state} or API ?
                notification.read = true    // marks all notifications as read
            })
        }
    },
    extraReducers: {
        [fetchNotifications.fulfilled.toString()]: (state, action) => {
            state.forEach(notification => {
                // Any notifications we've read are no longer new
                notification.isNew = !notification.read     // shit happens
            })
            state.push(...action.payload)   // used spread operator to update the whole list, but for some cases didn't work ?
            // Sort with newest first
            state.sort((a, b) => b.date.localeCompare(a.date))
        }
    }
})

export default notificationsSlice.reducer   //to be imported in store

export const { allNotificationsRead } = notificationsSlice.actions  // to be dispatched in the view (NotificationsList)

export const selectAllNotifications: any = (state: RootState) => state.notifications    // find a way to omit {any} type and it still works