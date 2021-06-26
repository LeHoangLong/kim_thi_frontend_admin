import React from 'react';
import { Provider } from 'react-redux';
import { store } from './reducers/RootReducer';
import { LocatorInitializer } from './widgets/background/LocatorInitializer';
import { UserStateListener } from './widgets/background/UserStateListener';
import './widgets/Common.scss';

function App() {
  return (
    <Provider store={ store }>
      <LocatorInitializer>
        <UserStateListener></UserStateListener>
      </LocatorInitializer>
    </Provider>
  );
}

export default App;
