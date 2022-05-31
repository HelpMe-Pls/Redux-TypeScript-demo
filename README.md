# Introduction
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/), [Redux Toolkit](https://redux-toolkit.js.org/) and [TypeScript](https://www.typescriptlang.org/) template:

### `npx create-react-app my-app --template redux-typescript`

It is my attempt to convert [this project](https://github.com/reduxjs/redux-essentials-example-app) into TypeScript to learn Redux along with TypeScript.<br />
Check out the [live demo](https://redux-ts-demo.netlify.app).


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

<br />

# What I've learnt
- Redux is more useful when:
    - You have **large** amounts of application state that are needed in many places in the app.
    - The app state is updated **frequently** over time.
    - The logic to update that state may be complex.
    - The app has a medium or large-sized codebase, and might be worked on by many people.
- Redux is a library for managing **global** application state:
    - Redux is typically used with the [`react-redux`](https://github.com/reduxjs/react-redux) library for integrating Redux and React together.
    - [`redux-toolkit`](https://github.com/reduxjs/redux-toolkit) is the recommended way to write Redux logic.
- Redux uses a "**one-way data flow**" app structure:
    - State describes the condition of the app at a point in time, and UI renders based on that state
    - When something happens in the app:
        - The UI dispatches an action.
        - The store runs the reducers, and the state is updated based on what occurred.
        - The store notifies the UI that the state has changed.
        - The UI re-renders based on the new state.
    - Redux uses several types of code
        - *Actions* are plain objects with a type field, and describe "what happened" in the app.
        - *Reducers* are **functions** that calculate a new state value based on previous state + an action.
        - A Redux *store* runs the root reducer whenever an action is dispatched.

## Basic Redux data flow:
- Our posts list read the initial set of posts from the store with `useSelector` and rendered the initial UI.
- We dispatched the `postAdded` action containing the data for the new post entry.
- The posts reducer saw the `postAdded` action, and updated the posts array (in the store) with the new entry.
- The Redux store told the UI that some data had changed.
- The posts list read the updated posts array (from the `useSelector` hook), and re-rendered itself to show the new post.
- Redux state is updated by "reducer functions":
    - Reducers always calculate a new state immutably, by copying existing state values and modifying the copies with the new data.
    - The Redux Toolkit `createSlice` function generates "slice reducer" functions for you, and lets you write "mutating" code that is turned into safe immutable updates.
    - Those slice reducer functions are added to the `reducer` field in `configureStore`, and that defines the data and state field names inside the Redux store.
- React components read data from the store with the `useSelector` hook.
    - Selector functions receive the whole `state` object, and should return a value.
    - Selectors will re-run whenever the Redux store is updated, and if the data they return has changed, the component will re-render.
- React components dispatch actions to update the store using the `useDispatch` hook:
    - `createSlice` will generate action creator functions for each reducer we add to a slice.
    - Call `dispatch(someActionCreator())` in a component to dispatch an action.
    - Reducers will run, check to see if this action is relevant, and return new state if appropriate.
    - Temporary data like form input values should be kept as React component state. Dispatch a Redux action to update the store when the user is done with the form.



## Using Redux data:
- Any React component can use data from the Redux store as needed:
    - Any component can read any data that is in the Redux store.
    - Multiple components can read the same data, even at the same time.
    - Components should extract the smallest amount of data they need to render themselves.
    - Components can combine values from props, state, and the Redux store to determine what UI they need to render. They can read multiple pieces of data from the store, and reshape the data as needed for display.
    - Any component can dispatch actions to cause state updates.
- Redux action creators can prepare action objects with the right contents:
    - `createSlice` and `createAction` can accept a "prepare callback" that returns the action payload.
    - Unique IDs and other random values should be put in the action, not calculated in the reducer.
- Reducers should contain the actual state update logic:
    - Reducers can contain whatever logic is needed to calculate the next state.
    - Action objects should contain just enough info to describe what happened.


## Async logic and data fetching:
- You can write reusable "selector" functions to encapsulate reading values from the Redux state:
    - Selectors are functions that get the Redux `state` as an argument, and return some data.
- Redux uses plugins called "middleware" to enable async logic:
    - The standard async middleware is called `redux-thunk`, which is included in Redux Toolkit.
    - Thunk functions receive `dispatch` and `getState` as arguments, and can use those as part of async logic.
- You can dispatch additional actions to help track the loading status of an API call:
    - The typical pattern is dispatching a "pending" action before the call, then either a "success" containing the data or a "failure" action containing the error.
    - Loading state should usually be stored as an enum, like 'idle' | 'loading' | 'succeeded' | 'failed'.
- Redux Toolkit has a `createAsyncThunk` API that dispatches these actions for you:
    - `createAsyncThunk` accepts a "payload creator" callback that should return a Promise, and generates pending/fulfilled/rejected action types automatically.
    - Generated action creators like `fetchPosts` dispatch those actions based on the Promise you return.
    - You can listen for these action types in `createSlice` using the `extraReducers` field, and update the state in reducers based on those actions.
    - Action creators can be used to automatically fill in the keys of the `extraReducers` object so the slice knows what actions to listen for.



## Performance and Normalizing data:
- Memoized selector functions can be used to optimize performance:
  - Redux Toolkit re-exports the `createSelector` function from Reselect, which generates memoized selectors.
  - Memoized selectors will only recalculate the results if the input selectors return new values.
  - Memoization can skip expensive calculations, and ensure the same result references are returned.
- There are multiple patterns you can use to optimize React component rendering with Redux:
    - Avoid creating new object/array references inside of `useSelector` - those will cause unnecessary re-renders.
    - Memoized selector functions can be passed to `useSelector` to optimize rendering.
    - `useSelector` can accept an alternate comparison function like `shallowEqual` instead of reference equality.
    - *Components can be wrapped in `React.memo()` to only re-render if their props change*.
    - List rendering can be optimized by having list parent components read just an array of item IDs, passing the IDs to list item children, and retrieving items by ID in the children.
- Normalized state structure is a recommended approach for storing items:
    - "Normalization" means no duplication of data, and keeping items stored in a lookup table by item ID.
    - Normalized state shape usually looks like `{ids: [], entities: {}}`.
- Redux Toolkit's `createEntityAdapter` API helps manage normalized data in a slice:
    - Item IDs can be kept in sorted order by passing in a `sortComparer` option.
    - The adapter object includes:
        - `adapter.getInitialState`, which can accept additional state fields like loading state.
        - Prebuilt reducers for common cases, like `setAll`, `addMany`, `upsertOne`, and `removeMany`.
        - `adapter.getSelectors`, which generates selectors like `selectAll` and `selectById`.
