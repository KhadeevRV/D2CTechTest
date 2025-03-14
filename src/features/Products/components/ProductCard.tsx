import React, {useCallback, useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {Card, Button, Icon, Text} from '@rneui/themed';
import {TProduct} from '../screens/types';
import {useStores} from '../../../common/models/helpers/useStores';
import {observer} from 'mobx-react-lite';
import {useInterval} from '../../../common/utils/useInterval';

interface Props {
  item: TProduct;
}

const ProductCard: React.FC<Props> = observer(({item}) => {
  const {basketStore} = useStores();
  const basketProduct = basketStore.products.find(
    product => product.id === item.id,
  );
  const [count, setCount] = useState(basketProduct?.count || item.count);
  const [time, setTime] = useState(0);

  const changeCount = useCallback(
    (value: number) => {
      if (!value) return;
      setCount(value);
      setTime(new Date().getTime());
    },
    [setCount, setTime],
  );

  const updateProduct = useCallback(async () => {
    try {
      // Отправляем событие на бэк об изменении продукта
      // await api.updateProduct({...item, count})
      basketStore.updateProduct({...item, count});
    } catch (e) {
      Alert.alert('Ошибка');
    }
  }, [basketStore, item, count]);

  const delay = 300;
  useInterval(() => {
    if (time !== 0) {
      const date = new Date().getTime();
      if (date - time > 500) {
        updateProduct();
        setTime(0);
      }
    }
  }, delay);

  const onAdd = useCallback(() => changeCount(count + 1), [changeCount, count]);
  const onRemove = useCallback(
    () => changeCount(count - 1),
    [changeCount, count],
  );

  const onAddProduct = useCallback(async () => {
    try {
      // Отправляем запрос на добавление товара
      // await api.addProuct(item.id)
      basketStore.addProduct(item);
    } catch (e) {
      // Ошибка
    }
  }, [basketStore, item]);

  const onRemoveProduct = useCallback(async () => {
    try {
      // Отправляем запрос на удаление товара
      // await api.remove(item.id)
      basketStore.removeProduct(item.id);
    } catch (e) {
      // Ошибка
    }
  }, [basketStore, item]);

  const renderBtn = useCallback(() => {
    if (basketProduct) {
      return (
        <View style={styles.row}>
          <Icon name="remove-circle" onPress={onRemove} />
          <Text h4 style={styles.countText}>
            {count}
          </Text>
          <Icon name="add-circle" onPress={onAdd} />
          <Button title="Убрать из корзины" onPress={onRemoveProduct} />
        </View>
      );
    }
    return (
      <Button
        icon={
          <Icon
            name={'shopping-cart'}
            type="material"
            color={'#FFF'}
            style={styles.icon}
          />
        }
        color={'#403EA4'}
        title="Добавить в корзину"
        onPress={onAddProduct}
      />
    );
  }, [basketProduct, onAddProduct, onRemove, count, onAdd, onRemoveProduct]);

  return (
    <Card containerStyle={styles.container}>
      <Card.Title>{item.name}</Card.Title>
      <Card.Divider />
      <Card.Image
        source={require('../../../assets/images/product.png')}
        style={styles.img}
      />
      <Text style={styles.text}>Цена: {item.price} Р</Text>
      <Text style={styles.text}>Описание: {item.description}</Text>
      {renderBtn()}
    </Card>
  );
});

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
  },
  countText: {
    color: '#000',
    fontSize: 10,
  },
  icon: {
    marginRight: 5,
  },
  img: {
    height: 250,
    resizeMode: 'contain',
    width: '100%',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    marginBottom: 10,
  },
});

export {ProductCard};
