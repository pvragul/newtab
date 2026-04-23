import {
  NativeModules,
  Platform,
  Pressable,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import styleSheet from './styles';
import { useTheme } from '../../themes/ThemeContext';
import {
  RootStackParamList,
  useCustomNavigation,
  useCustomRoute,
} from '../../../navigation';
import { useEffect, useState } from 'react';
import Store from '../../store';
import DeviceInfo from 'react-native-device-info';
import { CloseIcon, RemoveIcon } from '../../assets';
import CustomButton from '../../components/customButton';
import CustomSlideModal from '../../components/customSlideModal';
const { SystemSettings } = NativeModules;

const SettingsScreen = () => {
  const { theme, isDark } = useTheme();
  const styles = styleSheet(theme);
  const navigation = useCustomNavigation();
  const route = useCustomRoute();
  const { isDefault = false } = route.params as RootStackParamList['Settings'];
  const [enableShowAppIcon, setEnableShowAppIcon] = useState(true);
  const [userName, setUserName] = useState('');
  const [openNameEditor, setOpenNameEditor] = useState(false);

  const version = DeviceInfo.getVersion();
  const buildNumber = DeviceInfo.getBuildNumber();

  const openSetDefaultSettings = async () => {
    if (Platform.OS === 'android') {
      await SystemSettings.openDefaultLauncherSettings();
    }
  };

  useEffect(() => {
    Store.get(Store.SHOW_APP_ICON_KEY, true).then(setEnableShowAppIcon);
    Store.get(Store.USER_NAME_KEY, '').then((storedUserName: string) => {
      setUserName(storedUserName.trim());
    });
  }, []);

  useEffect(() => {
    Store.save(Store.SHOW_APP_ICON_KEY, enableShowAppIcon);
  }, [enableShowAppIcon]);

  const openSystemThemeSettings = () => {
    if (Platform.OS === 'android') {
      SystemSettings.openDisplaySettings();
    }
  };

  const saveUserName = async () => {
    const trimmedUserName = userName.trim();
    await Store.save(Store.USER_NAME_KEY, trimmedUserName);
    setUserName(trimmedUserName);
    setOpenNameEditor(false);
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Pressable
          onPress={() =>
            navigation.navigate('Home', {
              refresh: true,
              ts: Date.now(),
            })
          }
        >
          <Text style={styles.text}>Back</Text>
        </Pressable>
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.text}>User Name</Text>
        <Pressable onPress={() => setOpenNameEditor(true)}>
          <Text style={styles.text}>{userName || 'Edit'}</Text>
        </Pressable>
      </View>
      <View style={styles.switchContainer}>
        <Text style={styles.text}>Default Launcher</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={'#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => {
            openSetDefaultSettings();
          }}
          disabled={!!isDefault}
          value={isDefault ?? false}
        />
      </View>
      <View style={styles.switchContainer}>
        <Text style={styles.text}>Show App Icon</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={'#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => {
            setEnableShowAppIcon(prev => !prev);
          }}
          value={enableShowAppIcon}
        />
      </View>
      <View style={styles.switchContainer}>
        <Text style={styles.text}>Dark Mode</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={'#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => {
            openSystemThemeSettings();
          }}
          value={isDark}
        />
      </View>
      <View style={styles.switchContainer}>
        <Text style={styles.text}>Remove All Apps</Text>
        <Pressable
          onPress={async () => {
            await Store.save(Store.KEY, []);
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 5,
            }}
          >
            <CloseIcon width={20} height={20} fill={'#f26767'} />
            <Text
              style={[
                styles.text,
                {
                  color: '#f26767',
                },
              ]}
            >
              Remove
            </Text>
          </View>
        </Pressable>
      </View>
      <View
        style={[
          {
            gap: 10,
            position: 'absolute',
            bottom: 20,
            left: 20,
            flex: 1,
            flexDirection: 'row',
          },
        ]}
      >
        <Text style={styles.text}>Version: {version}</Text>
        <Text style={styles.text}>Build Number: {buildNumber}</Text>
      </View>

      <CustomSlideModal
        visible={openNameEditor}
        onClose={() => setOpenNameEditor(false)}
        position="center"
        footer={
          <View style={{ alignItems: 'center', width: '100%' }}>
            <CustomButton
              onPress={saveUserName}
              disabled={userName.trim().length <= 2}
              variants="secondary"
              title="Save"
            />
          </View>
        }
      >
        <View
          style={{
            alignItems: 'center',
            gap: 10,
            flexDirection: 'column',
          }}
        >
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 16,
              textAlign: 'center',
              color: theme.textPrimary,
            }}
          >
            Edit your name
          </Text>
          <Text
            style={{
              textAlign: 'center',
              color: theme.textPrimary,
            }}
          >
            Update the name shown on your home screen.
          </Text>
          <TextInput
            style={{
              width: '100%',
              borderColor: 'gray',
              borderWidth: 1,
              borderRadius: 5,
              color: theme.textPrimary,
              paddingHorizontal: 12,
              paddingVertical: 8,
            }}
            value={userName}
            onChangeText={setUserName}
            placeholder="Enter your name"
            placeholderTextColor={theme.textSecondary}
            autoFocus
          />
        </View>
      </CustomSlideModal>
    </View>
  );
};

export default SettingsScreen;
