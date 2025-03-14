import React, {useCallback} from 'react';
import {ListItem} from '@rneui/themed';
import {TProduct} from '../../Products/screens/types';
import {useStores} from '../../../common/models/helpers/useStores';
import {observer} from 'mobx-react-lite';

interface Props {
  item: TProduct;
}

const BasketItem: React.FC<Props> = observer(({item}) => {
  const {basketStore} = useStores();

  const removeItem = useCallback(() => {
    basketStore.removeProduct(item.id);
  }, [basketStore, item.id]);

  return (
    <ListItem key={item.id.toString()} bottomDivider>
      <ListItem.Content key={'content' + item.id}>
        <ListItem.Title>{item.name}</ListItem.Title>
        <ListItem.Subtitle>
          Цена: {item.price} ₽ x {item.count}
        </ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron
        onPress={removeItem}
        name="delete"
        color="#EB5757"
        type="material"
      />
    </ListItem>
  );
});

export {BasketItem};
