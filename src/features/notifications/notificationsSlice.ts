import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
    EntityId,
    EntityState,
    SliceCaseReducers
} from '@reduxjs/toolkit'

import { RootState, AppDispatch } from '../../app/store'
import { client } from '../../api/client'

export interface INotiState {
    id: EntityId
    date: string
    message: string
    user: number
    read: boolean
    isNew: boolean
}

const notificationsAdapter = createEntityAdapter<INotiState>({
    sortComparer: (a, b) => b.date.localeCompare(a.date),
})


export const fetchNotifications = createAsyncThunk<
    INotiState[],
    void,
    {
        dispatch: AppDispatch,
        state: RootState
    }
>(
    'notifications/fetchNotifications',
    async (_, { getState }) => {        // explain these 2 params ?
        const allNotifications = selectAllNotifications(getState()) // y getState() when it's already returns state.notifications ?
        const [latestNotification] = allNotifications       // Since the array of notifications is sorted newest first, we can grab the latest one using array destructuring
        // But sometimes it doesn't work as expected: some unread post got lost between read posts
        const latestTimestamp = latestNotification ? latestNotification.date : ''
        const response = await client.get(
            `/fakeApi/notifications?since=${latestTimestamp}`
        )
        return response.notifications as INotiState[]
    }
)

const notificationsSlice = createSlice<EntityState<INotiState>, SliceCaseReducers<EntityState<INotiState>>, 'notifications'>({
    name: 'notifications',
    initialState: notificationsAdapter.getInitialState(),
    reducers: {
        allNotificationsRead(state: EntityState<INotiState>) {
            Object.values(state.entities).forEach((notification) => {  // {notification} from the {state} could be undefined
                if (notification) { // so we gotta make sure it's defined before initiating new value
                    notification.read = true    // marks all notifications as read
                }
            })
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchNotifications.fulfilled, (state, action) => {
            Object.values(state.entities).forEach((notification) => {
                if (notification) { // to make sure that there's no undefined edge case
                    // Any notifications we've read are no longer new
                    notification.isNew = !notification.read
                }
            })
            notificationsAdapter.upsertMany(state, action.payload)
        })
    }
})

export default notificationsSlice.reducer   //to be imported in store

export const { allNotificationsRead } = notificationsSlice.actions  // to be dispatched in the view (NotificationsList)

export const {
    selectAll: selectAllNotifications,
} = notificationsAdapter.getSelectors<RootState>((state) => state.notifications)