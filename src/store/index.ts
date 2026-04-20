import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'SELECTED_APPS';

async function save<T>(key: string, packages: T) {
  await AsyncStorage.setItem(key, JSON.stringify(packages));
}

async function get<T>(key: string): Promise<T> {
  const data = await AsyncStorage.getItem(key);
  return data ? JSON.parse(data) as T : {} as T;
}

async function clear(key: string) {
  await AsyncStorage.removeItem(key);
}
const Store = {
  KEY,
  save,
  get,
  clear,
};
export default Store;
