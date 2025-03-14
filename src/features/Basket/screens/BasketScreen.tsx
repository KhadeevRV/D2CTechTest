import React, {useCallback, useState} from 'react';
import {View, StyleSheet, FlatList, Alert} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamsList} from '../../../common/navigation/RootStack';
import {ROUTES} from '../../../common/navigation/routes';
import {observer} from 'mobx-react-lite';
import {Button, Header, Text, CheckBox} from '@rneui/themed';
import {TProduct} from '../../Products/screens/types';
import {useStores} from '../../../common/models/helpers/useStores';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {BasketItem} from '../components/BasketItem';
import {api} from '../../../common/network/api';
import {runInAction} from 'mobx';

interface Props {
  navigation: StackNavigationProp<RootStackParamsList, ROUTES.Basket>;
}

const BasketScreen: React.FC<Props> = observer(({navigation}) => {
  const {basketStore} = useStores();
  const totalPrice = basketStore.products.reduce(
    (sum: number, product: TProduct) => sum + product.price * product.count,
    0,
  );
  const {bottom} = useSafeAreaInsets();
  const [errorType, setErrorType] = useState('');
  const [leaveAtDoor, setLeaveAtDoor] = useState(false);
  const [callOnDelivery, setCallOnDelivery] = useState(false);
  const [loading, setLoading] = useState(false);

  const onPay = useCallback(async () => {
    setLoading(true);
    try {
      const ids = basketStore.products.map(i => i.id);
      // ? Отправляем опции "Оставить у двери", "Позвонить при доставке" (leaveAtDoor, callOnDelivery)
      await api.buyProducts({ids, price: totalPrice, errorType});
      Alert.alert('Успешно', 'Товары успешно куплены');
      runInAction(() => {
        basketStore.clearBasket();
      });
    } catch (e) {
      const errorMessage =
        (e as {message: string})?.message || 'Неизвестная ошибка';
      Alert.alert('Ошибка', JSON.stringify(errorMessage));
    } finally {
      setLoading(false);
    }
  }, [basketStore, totalPrice, errorType]);

  const renderFooter = useCallback(
    () => (
      <>
        <CheckBox
          containerStyle={styles.checkbox}
          checked={leaveAtDoor}
          onPress={() => setLeaveAtDoor(prev => !prev)}
          title="Оставить у двери"
          key={'leaveAtDoor'}
        />
        <CheckBox
          containerStyle={styles.checkbox}
          checked={callOnDelivery}
          onPress={() => setCallOnDelivery(prev => !prev)}
          title="Позвонить при доставке"
          key={'callOnDelivery'}
        />
      </>
    ),
    [callOnDelivery, leaveAtDoor],
  );

  const onSetErrorType = (type: string) => {
    if (errorType === type) {
      setErrorType('');
      return;
    }
    setErrorType(type);
  };

  return (
    <SafeAreaProvider>
      <Header
        backgroundColor="#DABBFC"
        leftComponent={{
          icon: 'arrow-back',
          onPress: () => navigation.goBack(),
          color: '#403EA4',
        }}
        centerComponent={{text: 'Корзина', style: {color: '#403EA4'}}}
      />
      {basketStore.products.length === 0 ? (
        <View style={styles.emptyView} key={'emptyView'}>
          <Text h2 style={styles.emptyMessage}>
            Корзина пуста. Добавьте товаров для заказа
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={basketStore.products}
            renderItem={({item}) => <BasketItem item={item} />}
            keyExtractor={item => item.id.toString()}
            ListFooterComponent={renderFooter}
          />
          <View style={[styles.totalContainer, {paddingBottom: bottom}]}>
            <CheckBox
              containerStyle={styles.checkbox}
              checked={errorType === 'service'}
              onPress={() => onSetErrorType('service')}
              title="Cервис недоступен"
            />
            <CheckBox
              containerStyle={styles.checkbox}
              checked={errorType === 'stock'}
              onPress={() => onSetErrorType('stock')}
              title="Недостаток товара"
            />
            <View style={styles.row}>
              <Text h4>Итого: {totalPrice} ₽</Text>
              <Button
                title={loading ? 'Loading...' : 'Pay'}
                onPress={onPay}
                disabled={loading}
              />
            </View>
          </View>
        </>
      )}
    </SafeAreaProvider>
  );
});

const styles = StyleSheet.create({
  checkbox: {
    margin: 0,
    padding: 0,
  },
  emptyMessage: {
    alignSelf: 'center',
    textAlign: 'center',
  },
  emptyView: {
    flex: 1,
    justifyContent: 'center',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
  },
});

export {BasketScreen};
