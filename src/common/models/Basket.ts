import {Instance, types} from 'mobx-state-tree';
import {TProduct} from '../../features/Products/screens/types';

export const BasketModel = types
  .model('Basket', {
    products: types.optional(types.array(types.frozen<TProduct>()), []),
  })
  .actions(self => ({
    addProduct(product: TProduct) {
      self.products.push(product);
      // Отправляем событие на бэк о добавлении продукта
      // api.addProduct({productID: product.id})
    },
    removeProduct(productId: number) {
      self.products.replace(
        self.products.filter(product => product.id !== productId),
      );
    },
    clearBasket() {
      self.products.clear();
    },
    updateProduct(updatedProduct: TProduct) {
      const productToUpdate = self.products.find(
        p => p.id === updatedProduct.id,
      );
      if (productToUpdate) {
        const index = self.products.indexOf(productToUpdate);
        if (index !== -1) {
          // Отправляем событие на бэк об изменении продукта
          // api.updateProduct({product: updatedProduct})
          self.products.splice(index, 1, updatedProduct);
        }
      }
    },
  }));

export interface IBasketModel extends Instance<typeof BasketModel> {}
