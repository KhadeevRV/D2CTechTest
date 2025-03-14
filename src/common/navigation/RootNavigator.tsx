import React from 'react';
import {RootStack} from './RootStack';
import {observer} from 'mobx-react-lite';

const RootNavigator: React.FC = observer(() => {
  return (
    <>
      <RootStack />
    </>
  );
});

export {RootNavigator};
