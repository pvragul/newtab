import { NavigationContainer, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import HomeScreen from './src/screens/home';
import AppSelector from './src/screens/selector';

export type RootStackParamList = {
  Home: { refresh: boolean; ts: number };
  AppSelector: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
export const useCustomNavigation = useNavigation<NavigationProp>;
export const useCustomRoute = useRoute<RouteProp<RootStackParamList>>
const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AppSelector" component={AppSelector} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;