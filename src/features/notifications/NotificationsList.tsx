import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { formatDistanceToNow, parseISO } from 'date-fns'
import classnames from 'classnames'

import { selectAllUsers } from '../users/usersSlice'

import {
    selectAllNotifications,
    allNotificationsRead,
    INotiState
} from './notificationsSlice'


export const NotificationsList = () => {
    const dispatch = useDispatch()
    const notifications = useSelector(selectAllNotifications) // the {notifications}'s type is implicitly returned by TS
    const users = useSelector(selectAllUsers)

    useEffect(() => {
        dispatch(allNotificationsRead({}))    // executes on every renders, passing in an empty curly brace as an initial payload 
    })

    const renderedNotifications = notifications.map((notification) => {     // chek if it's actually {any} type
        const date = parseISO(notification.date)
        const timeAgo = formatDistanceToNow(date)
        const user = users.find(user => user.id === notification.user) || { // use EntityId for User's state to fix this
            name: 'Unknown User'
        }

        const notificationClassname = classnames('notification', {
            new: notification.isNew
        })

        return (
            <div key={notification.id} className={notificationClassname}>
                <div>
                    <b>{user.name}</b> {notification.message}
                </div>
                <div title={notification.date}>
                    <i>{timeAgo} ago</i>
                </div>
            </div>
        )
    })

    return (
        <section className="notificationsList">
            <h2>Notifications</h2>
            {renderedNotifications}
        </section>
    )
}