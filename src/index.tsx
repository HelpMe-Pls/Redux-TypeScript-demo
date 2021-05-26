import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import store from './app/store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import { fetchUsers } from './features/users/usersSlice';
import './api/server'

/* We only need to fetch the list of users once, and we want to do it right when the application starts.
 We can do that here, and directly dispatch the {fetchUsers} thunk because we have the store here */

store.dispatch(fetchUsers())  // has to be EXECUTED, not just getting the function out

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
