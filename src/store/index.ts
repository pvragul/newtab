import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'SELECTED_APPS';
const SHOW_APP_ICON_KEY = 'SHOW_APP_ICON';
const USER_NAME_KEY = 'USER_NAME';

async function save<T>(key: string, packages: T) {
  await AsyncStorage.setItem(key, JSON.stringify(packages));
}

async function get<T>(key: string, fallback: T): Promise<T> {
  const data = await AsyncStorage.getItem(key);

  if (!data) return fallback;

  try {
    return JSON.parse(data) as T;
  } catch {
    return fallback;
  }
}

async function clear(key: string) {
  await AsyncStorage.removeItem(key);
}
const Store = {
  KEY,
  SHOW_APP_ICON_KEY,
  USER_NAME_KEY,
  save,
  get,
  clear,
};
export default Store;
