import React from 'react';
import {RootNavigator} from './src/common/navigation/RootNavigator';
import {initMocks} from './src/common/network/mocks';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

initMocks();
const queryClient = new QueryClient();

function App(): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <RootNavigator />
    </QueryClientProvider>
  );
}

export default App;
