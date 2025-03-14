import React, {useCallback} from 'react';
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamsList} from '../../../common/navigation/RootStack';
import {ROUTES} from '../../../common/navigation/routes';
import {Badge, Header, Icon} from '@rneui/themed';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useStores} from '../../../common/models/helpers/useStores';
import {observer} from 'mobx-react-lite';
import {ProductCard} from '../components/ProductCard';
import {useGetProducts} from '../hooks/useGetProducts';

type Props = {
  navigation: StackNavigationProp<RootStackParamsList, ROUTES.Products>;
};

const ProductsScreen: React.FC<Props> = observer(({navigation}) => {
  const {data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage} =
    useGetProducts();
  const {basketStore} = useStores();

  const handleEndReached = useCallback(() => {
    const query = async () => {
      if (!hasNextPage || isFetchingNextPage) return;
      await fetchNextPage();
    };
    query();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <SafeAreaProvider>
      <Header
        backgroundColor="#DABBFC"
        backgroundImageStyle={{}}
        barStyle="light-content"
        centerComponent={{
          text: 'D2CTech',
          style: {color: '#403EA4'},
        }}
        centerContainerStyle={{alignSelf: 'center'}}
        containerStyle={{paddingTop: 0, alignItems: 'center'}}
        placement="center"
        rightComponent={
          <TouchableOpacity
            style={{paddingHorizontal: 13, paddingVertical: 11}}
            onPress={() => navigation.navigate(ROUTES.Basket)}>
            <Icon name="shopping-cart" type="material" color={'#403EA4'} />
            {!!basketStore.products?.length && (
              <Badge
                containerStyle={styles.basketDot}
                value={basketStore.products?.length}
                status="error"
              />
            )}
          </TouchableOpacity>
        }
      />
      <FlatList
        data={data?.results || []}
        renderItem={({item}) => <ProductCard item={item} />}
        keyExtractor={item => item.id.toString()}
        onEndReached={handleEndReached}
        ListFooterComponent={() =>
          isLoading || isFetchingNextPage ? (
            <ActivityIndicator color={'#000000'} style={styles.loader} />
          ) : null
        }
      />
    </SafeAreaProvider>
  );
});

const styles = StyleSheet.create({
  basketDot: {
    position: 'absolute',
    right: 4,
    top: 0,
  },
  loader: {
    marginVertical: 16,
  },
});

export {ProductsScreen};
