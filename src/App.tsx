import React from 'react';
import { Provider } from 'react-redux';
import { store } from './reducers/RootReducer';
import { UserStateListener } from './widgets/background/UserStateListener';
import './widgets/Common.scss';

function App() {
  return (
    <Provider store={ store }>
      <UserStateListener></UserStateListener>
    </Provider>
  );
}

export default App;
