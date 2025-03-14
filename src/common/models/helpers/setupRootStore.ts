import {applySnapshot, IDisposer, onSnapshot} from 'mobx-state-tree';
import {RootStore, RootStoreSnapshot} from '../RootStore';
import * as storage from '../../utils/storage';

const ROOT_STATE_STORAGE_KEY = 'root-v1';

/**
 * Инициалиroot state.
 */
let _disposer: IDisposer | undefined;
export async function setupRootStore(rootStore: RootStore) {
  let restoredState: RootStoreSnapshot | undefined | null;

  try {
    // load the last known state from AsyncStorage
    restoredState = (await storage.load(
      ROOT_STATE_STORAGE_KEY,
    )) as RootStoreSnapshot | null;
    applySnapshot(rootStore, restoredState);
  } catch (e) {
    // if there's any problems loading, then inform the dev what happened
    if (__DEV__) {
      console.log(JSON.stringify(e), null);
    }
  }

  // stop tracking state changes if we've already setup
  if (_disposer) {
    _disposer();
  }

  // track changes & save to AsyncStorage
  _disposer = onSnapshot(rootStore, snapshot =>
    storage.save(ROOT_STATE_STORAGE_KEY, snapshot),
  );

  const unsubscribe = (): void => {
    if (_disposer) {
      _disposer();
    }
    _disposer = undefined;
  };

  return {rootStore, restoredState, unsubscribe};
}
