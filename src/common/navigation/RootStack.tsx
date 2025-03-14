import type {FC} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';

import {ROUTES} from './routes';
import {ProductsScreen} from '../../features/Products/screens/ProductsScreen';
import {BasketScreen} from '../../features/Basket/screens/BasketScreen';
import {observer} from 'mobx-react-lite';

export type RootStackParamsList = {
  [ROUTES.Products]: undefined;
  [ROUTES.Basket]: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamsList>();

const RootStack: FC = observer(() => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name={ROUTES.Products} component={ProductsScreen} />
        <Stack.Screen name={ROUTES.Basket} component={BasketScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
});

export {RootStack};
