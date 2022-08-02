/* Everytime we create a new slice, we need to add its reducer function to our store */

import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import notificationsReducer from '../features/notifications/notificationsSlice';
import postsReducer from '../features/posts/postsSlice';
import usersReducer from '../features/users/usersSlice';


export const store = configureStore({
  reducer: {
    posts: postsReducer,
    users: usersReducer,
    notifications: notificationsReducer
  },
  /* This tells Redux that we want our TOP-LEVEL STATE OBJECT to have a field named `posts` inside, and all the 
  data for `state.posts` (e.g from the `useSelector` hooks) will be updated by the `postsReducer` function
  when actions are dispatched, same thing for `users` and `notifications` */
});


export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
