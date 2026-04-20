import {
  View,
  Text,
  Pressable,
  Platform,
  NativeModules,
  BackHandler,
  Image,
  Dimensions,
} from 'react-native';
import styleSheet from './styles';
import { useTheme } from '../../themes/ThemeContext';
import {
  AppLogo,
  SettingsIcon,
  RearrangeIcon,
  AddIcon,
  UninstallIcon,
  InformationIcon,
  RemoveIcon,
} from '../../assets/images';
import { useCallback, useEffect, useRef, useState } from 'react';
import CustomSlideModal from '../../components/customSlideModal';
import { IAppDetail } from '../../interface';
import Store from '../../store';
import { useCustomNavigation, useCustomRoute } from '../../../navigation';
import { useFocusEffect } from '@react-navigation/native';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomButton from '../../components/customButton';
const { SystemSettings, LauncherApps } = NativeModules;

const HomeScreen = () => {
  const { theme } = useTheme();
  const [toggleMenu, setToggleMenu] = useState(false);
  const styles = styleSheet(theme);
  const toggleMenuHandler = () => setToggleMenu(prev => !prev);
  const { width } = Dimensions.get('window');

  const navigation = useCustomNavigation();
  const route = useCustomRoute();
  const [appList, setAppList] = useState<IAppDetail[]>([]);
  const [enableReorder, setEnableReorder] = useState(false);
  const [isDefault, setIsDefault] = useState<boolean | null>(null);
  const [showAppIcon, setShowAppIcon] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedApp, setSelectedApp] = useState<IAppDetail | null>(null);

  useEffect(() => {
    const checkIsDefault = async () => {
      const isDefaultLauncher = await SystemSettings.isDefaultLauncher();
      setIsDefault(isDefaultLauncher);
    };
    checkIsDefault();
  }, []);

  const openSystemThemeSettings = () => {
    if (Platform.OS === 'android') {
      SystemSettings.openDisplaySettings();
    }
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (toggleMenu) {
          setToggleMenu(false);
        }
        // Return true to prevent exiting the app on Home screen
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [toggleMenu]),
  );

  const loadApps = async () => {
    {
      let selectedAppsList = (await Store.get<IAppDetail[]>(Store.KEY)) || [];
      setAppList(selectedAppsList);
    }
  };
  useEffect(() => {
    loadApps();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (route.params?.refresh) {
        loadApps();
      }
    }, [route.params?.ts]),
  );
  const openSetDefaultSettings = async () => {
    if (Platform.OS === 'android') {
      await SystemSettings.openDefaultLauncherSettings();
    }
  };
  const openApp = async (app: IAppDetail) => {
    try {
      await LauncherApps.openApp(
        app.packageName,
        app.activityName, // optional
      );
    } catch (e: any) {
      console.warn('Failed to open app', e);
      setError(e.message);
    }
  };

  const openAppInfo = async (app: IAppDetail) => {
    try {
      await LauncherApps.openAppInfo(app.packageName);
    } catch (e: any) {
      console.warn('Failed to open app info', e);
      setError(e.message);
    }
  };

  const uninstallApp = async (app: IAppDetail) => {
    try {
      await LauncherApps.uninstallApp(app.packageName);
    } catch (e: any) {
      console.warn('Failed to uninstall app', e);
      setError(e.message);
    }
  };
  const handleRemoveFromHome = async (app: IAppDetail) => {
    let filteredApps = appList.filter(
      item => item.packageName !== app.packageName,
    );
    setAppList(filteredApps);
    await Store.save(Store.KEY, filteredApps);
  };
  const renderItem = ({
    item,
    drag,
    isActive,
    getIndex,
  }: RenderItemParams<IAppDetail>) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const itemRef = useRef<View>(null);

    const openMenu = () => {
      setEnableReorder(true);
      setMenuVisible(true);
    };
    return (
      <Pressable
        key={item?.packageName}
        style={[
          styles.appContainer,
          selectedApp?.packageName === item.packageName && styles.appContainerSelected,
        ]}
        onPress={() => {
          if (enableReorder) {
            setEnableReorder(false);
            setMenuVisible(false);
          } else {
            openApp(item);
            setMenuVisible(false);
          }
        }}
        onLongPress={() => {
          if (menuVisible) {
            setMenuVisible(false);
          } else {
            openMenu();
          }
        }}
      >
        <View
          ref={itemRef}
          key={item?.packageName}
          style={[styles.appContainer, styles.flexRow]}
        >
          <View style={[styles.flexRow, styles.alignCenter, { gap: 10 }]}>
            {enableReorder && (
              <Pressable
                style={styles.moreButton}
                onLongPress={() => {
                  setEnableReorder(true);
                  setMenuVisible(false);
                  setSelectedApp(item);
                  drag();
                }}
              >
                <RearrangeIcon
                  width={15}
                  height={15}
                  fill={theme.textPrimary}
                />
              </Pressable>
            )}
            {showAppIcon && (
              <Image
                key={item?.packageName}
                source={{ uri: item?.iconUri }}
                style={{
                  width: 24,
                  height: 24,
                  opacity: enableReorder ? 0.2 : 1,
                }}
              />
            )}
            <Text style={styles.appName}>{item?.name}</Text>
          </View>
          {menuVisible && (
            <View style={[styles.flexRow, styles.alignCenter, { gap: 10 }]}>
              <Pressable onPress={() => openAppInfo(item)}>
                <InformationIcon
                  width={15}
                  height={15}
                  fill={theme.textPrimary}
                />
              </Pressable>
              <Pressable onPress={() => handleRemoveFromHome(item)}>
                <RemoveIcon width={15} height={15} fill={theme.textPrimary} />
              </Pressable>
              <Pressable onPress={() => uninstallApp(item)}>
                <UninstallIcon
                  width={15}
                  height={15}
                  fill={theme.textPrimary}
                />
              </Pressable>
            </View>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.root}>
      <View style={styles.topMenuContainer}>
        <Pressable
          style={styles.menuButton}
          onPress={() => navigation.navigate('AppSelector')}
        >
          <AddIcon
            width={24}
            height={24}
            fill={!toggleMenu ? styles.title.color : 'none'}
          />
        </Pressable>
        <Pressable
          style={styles.menuButton}
          onPress={() => {
            !toggleMenu && toggleMenuHandler();
          }}
        >
          <SettingsIcon
            width={24}
            height={24}
            fill={!toggleMenu ? styles.title.color : 'none'}
          />
        </Pressable>
      </View>
      <View style={[styles.logoContainer]}>
        <AppLogo width={100} height={100} />
        <View>
          <Text style={styles.title}>New Tab</Text>
          <Text style={styles.subtitle}>Start clean. Stay focused.</Text>
        </View>
      </View>
      {/* <FlatList
        data={appList}
        renderItem={renderItem}
        style={styles.appListContainer}
      /> */}
      {appList.length > 0 && (
        <GestureHandlerRootView>
          <DraggableFlatList
            style={[styles.appListContainer, { width }]}
            data={appList}
            keyExtractor={item => item.packageName}
            renderItem={renderItem}
            onDragEnd={({ data }) => {
              setAppList(data);
              setEnableReorder(false);
              setSelectedApp(null);
              (async () => await Store.save(Store.KEY, data))();
            }}
          />
        </GestureHandlerRootView>
      )}
      <CustomSlideModal
        key="settings"
        visible={toggleMenu}
        onClose={toggleMenuHandler}
        position="right"
      >
        <View style={[styles.menuContainer]}>
          <Text style={styles.menuTitle}>Settings</Text>
          <Pressable
            style={styles.menuItem}
            disabled={isDefault}
            onPress={openSetDefaultSettings}
          >
            <Text style={styles.menuItemText}>
              {isDefault ? 'Default Launcher' : 'Set as Default'}
            </Text>
          </Pressable>
          <Pressable
            style={styles.menuItem}
            onPress={() => setShowAppIcon(!showAppIcon)}
          >
            <Text style={styles.menuItemText}>
              {showAppIcon ? 'Hide App Icon' : 'Show App Icon'}
            </Text>
          </Pressable>
          <Pressable style={styles.menuItem}>
            <Text style={styles.menuItemText}>Change Wallpaper</Text>
          </Pressable>
          <Pressable style={styles.menuItem} onPress={openSystemThemeSettings}>
            <Text style={styles.menuItemText}>Change Theme</Text>
          </Pressable>
        </View>
      </CustomSlideModal>
      <CustomSlideModal
        key="default"
        visible={isDefault === false}
        position="center"
        footer={
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <CustomButton
              onPress={() => setIsDefault(null)}
              variants={'secondary'}
              title="Cancel"
            />
            <CustomButton
              onPress={openSetDefaultSettings}
              variants={'tertiary'}
              title="Set as Default"
            />
          </View>
        }
      >
        <View
          style={{
            alignItems: 'center',
            gap: 10,
            padding: 8,
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
            Set NewTab as your default launcher
          </Text>
          <Text
            style={{
              textAlign: 'center',
              color: theme.textPrimary,
            }}
          >
            To show all apps and work properly, NewTab needs to be your Home
            app.
          </Text>
        </View>
      </CustomSlideModal>

      <CustomSlideModal
        key="error"
        visible={!!error}
        onClose={() => setError('')}
        position="center"
      >
        <View
          style={{
            alignItems: 'center',
            gap: 10,
            padding: 8,
            flexDirection: 'column',
          }}
        >
          <Text
            style={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}
          >
            Error
          </Text>
          <Text style={{ textAlign: 'center' }}>{error}</Text>
        </View>
      </CustomSlideModal>
    </View>
  );
};

export default HomeScreen;
