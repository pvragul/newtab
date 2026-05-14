import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: { refresh: boolean; ts: number };
  AppSelector: undefined;
  AllApps: undefined;
  Settings: {
    isDefault: boolean | null;
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const useCustomNavigation = () => useNavigation<NavigationProp>();
export const useCustomRoute = () => useRoute<RouteProp<RootStackParamList>>();
