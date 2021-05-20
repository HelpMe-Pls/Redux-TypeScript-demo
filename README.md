This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Basic Redux data flow:
- Our posts list read the initial set of posts from the store with `useSelector` and rendered the initial UI
- We dispatched the `postAdded` action containing the data for the new post entry
- The posts reducer saw the `postAdded` action, and updated the posts array (in the store) with the new entry
- The Redux store told the UI that some data had changed
- The posts list read the updated posts array (from the `useSelector` hook), and re-rendered itself to show the new post
- Redux state is updated by "reducer functions":
    - Reducers always calculate a new state immutably, by copying existing state values and modifying the copies with the new data
    - The Redux Toolkit `createSlice` function generates "slice reducer" functions for you, and lets you write "mutating" code that is turned into safe immutable updates
    - Those slice reducer functions are added to the `reducer` field in `configureStore`, and that defines the data and state field names inside the Redux store
- React components read data from the store with the `useSelector` hook
    - Selector functions receive the whole `state` object, and should return a value
    - Selectors will re-run whenever the Redux store is updated, and if the data they return has changed, the component will re-render
- React components dispatch actions to update the store using the `useDispatch` hook
    - `createSlice` will generate action creator functions for each reducer we add to a slice
    - Call `dispatch(someActionCreator())` in a component to dispatch an action
    - Reducers will run, check to see if this action is relevant, and return new state if appropriate
    - Temporary data like form input values should be kept as React component state. Dispatch a Redux action to update the store when the user is done with the form.

## Using Redux data:
- Any React component can use data from the Redux store as needed
    - Any component can read any data that is in the Redux store
    - Multiple components can read the same data, even at the same time
    - Components should extract the smallest amount of data they need to render themselves
    - Components can combine values from props, state, and the Redux store to determine what UI they need to render. They can read multiple pieces of data from the store, and reshape the data as needed for display.
    - Any component can dispatch actions to cause state updates
- Redux action creators can prepare action objects with the right contents
    - createSlice and createAction can accept a "prepare callback" that returns the action payload
    - Unique IDs and other random values should be put in the action, not calculated in the reducer
- Reducers should contain the actual state update logic
    - Reducers can contain whatever logic is needed to calculate the next state
    - Action objects should contain just enough info to describe what happened