import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import {
  fetchNotifications,
  selectAllNotifications
} from '../features/notifications/notificationsSlice'

export const Navbar = () => {
  const dispatch = useDispatch()
  const notifications = useSelector(selectAllNotifications)
  const numUnreadNotifications = notifications.filter((n) => !n.read).length

  const unreadNotificationsBadge = (() => {
    if (numUnreadNotifications > 0) {
      return (
        <span className="badge">{numUnreadNotifications}</span>
      )
    }
    return <></>
  })()

  // let unreadNotificationsBadge

  // if (numUnreadNotifications > 0) {   
  //   unreadNotificationsBadge = (
  //     <span className="badge">{numUnreadNotifications}</span>
  //   )
  // }

  const fetchNewNotifications = () => {   // not using useEffect because it's activated based OnClick, duh... 
    dispatch(fetchNotifications())
  }
  return (
    <nav>
      <section>
        <h1>Redux_TS Demo</h1>

        <div className="navContent">
          <div className="navLinks">
            <Link to="/">Posts</Link>
            <Link to="/users">Users</Link>
            <Link to="/notifications">
              Notifications {unreadNotificationsBadge}
            </Link>
          </div>
          <button className="button" onClick={fetchNewNotifications}>
            Refresh Notifications
          </button>
        </div>
      </section>
    </nav>
  )
}
