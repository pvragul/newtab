import {
  NavigationContainer,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import HomeScreen from './src/screens/home';
import AppSelector from './src/screens/selector';
import AllApps from './src/screens/allapps';
import SettingsScreen from './src/screens/settings';

import { RootStackParamList } from './src/navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const linking = {
  prefixes: ['newtab://'],
  config: {
    screens: {
      Home: 'home',
    },
  },
};

const Navigation = () => {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ animation: 'slide_from_left' }}
        />
        <Stack.Screen
          name="AppSelector"
          component={AppSelector}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="AllApps"
          component={AllApps}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ animation: 'slide_from_right' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
