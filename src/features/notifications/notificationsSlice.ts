import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { client } from '../../api/client'
import { RootState } from '../../app/store'


/* interface INotiState {

}

const initialState: INotiState[] = {

} */


export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async (_, { getState }) => {        // explain these 2 params ?
        const allNotifications = selectAllNotifications(getState()) // y getState() when it's already returns state.notificaitons ?
        const [latestNotification] = allNotifications       // omit [] and see what happens
        const latestTimestamp = latestNotification ? latestNotification.date : ''
        const response = await client.get(
            `/fakeApi/notifications?since=${latestTimestamp}`
        )
        return response.notifications   // console.log or whatever to see what properties do we need for {notification}
    }
)

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: [],   // why this has to be an array ?
    reducers: {
        allNotificationsRead(state) {   // check if action is required and define action's type if it is ?
            state.forEach((notification: any) => {  // {notification} from the {state} or API ?
                notification.read = true    // define {read} property in INotiState ?
            })
        }
    },
    extraReducers: {
        [fetchNotifications.fulfilled.toString()]: (state: any[], action) => {  // why tf any[] works but not RootState ? (solution: find a way to define interface NotiState) 
            state.forEach(notification => {
                // Any notifications we've read are no longer new
                notification.isNew = !notification.read
            })
            state.push(...action.payload)   // why using spread operator here ?
            // Sort with newest first
            state.sort((a, b) => b.date.localeCompare(a.date))  // how this works ?
        }
    }
})

export default notificationsSlice.reducer

export const { allNotificationsRead } = notificationsSlice.actions

export const selectAllNotifications: any = (state: RootState) => state.notifications    // define INotiState ?