import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { formatDistanceToNow, parseISO } from 'date-fns'
import classnames from 'classnames'

import { selectAllUsers } from '../users/usersSlice'

import {
    selectAllNotifications,
    allNotificationsRead
} from './notificationsSlice'


export const NotificationsList = () => {
    const dispatch = useDispatch()
    const notifications: any = useSelector(selectAllNotifications)   // chek if it's not {any} type then what would it be ?
    const users = useSelector(selectAllUsers)

    useEffect(() => {
        dispatch(allNotificationsRead())    // executes on every renders
    })

    const renderedNotifications = notifications.map((notification: any) => {     // chek if it's actually {any} type
        const date = parseISO(notification.date)
        const timeAgo = formatDistanceToNow(date)
        const user = users.find(user => user.id === notification.user) || {
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