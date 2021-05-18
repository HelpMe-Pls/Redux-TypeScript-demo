/* Everytime we create a new slice, we need to add its reducer function to our store */

import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import postsReducer from '../features/posts/postsSlice';

export const store = configureStore({
  reducer: {
    posts: postsReducer,
  },
  /* This tells Redux that we want our TOP-LEVEL STATE OBJECT to have a field named {posts} inside, and all the 
  data for {state.posts} (e.g from the useSelector hook) will be updated by the {postsReducer} function
  when actions are dispatched */
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
