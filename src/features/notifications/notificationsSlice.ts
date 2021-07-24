import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'

import { client } from '../../api/client'


// interface INotiState {
//     read: boolean,
//     isNew: boolean,
//     date: string
// }

const notificationsAdapter = createEntityAdapter({
    sortComparer: (a: any, b: any) => b.date.localeCompare(a.date),
})


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
    initialState: notificationsAdapter.getInitialState(),
    reducers: {
        allNotificationsRead(state) {
            Object.values(state.entities).forEach((notification) => {  // {notification} from the {state} or API ?
                notification.read = true    // marks all notifications as read
            })
        }
    },
    extraReducers: {
        [fetchNotifications.fulfilled.toString()]: (state, action) => {
            Object.values(state.entities).forEach((notification) => {
                // Any notifications we've read are no longer new
                notification.isNew = !notification.read
            })
            notificationsAdapter.upsertMany(state, action.payload)
        }
    }
})

export default notificationsSlice.reducer   //to be imported in store

export const { allNotificationsRead } = notificationsSlice.actions  // to be dispatched in the view (NotificationsList)

export const {
    selectAll: selectAllNotifications,
} = notificationsAdapter.getSelectors((state: any) => state.notifications)