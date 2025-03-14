import {Instance, SnapshotOut, types} from 'mobx-state-tree';
import {BasketModel} from './Basket';

export const RootStoreModel = types.model('RootStore').props({
  basketStore: types.optional(BasketModel, {products: []}),
});

export interface RootStore extends Instance<typeof RootStoreModel> {}

export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
