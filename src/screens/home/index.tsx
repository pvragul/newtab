import {
  View,
  Text,
  Pressable,
  Platform,
  NativeModules,
  BackHandler,
  Image,
  Dimensions,
  ActivityIndicator,
  TextInput,
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
  AllIcon,
  HappyIcon,
} from '../../assets/images';
import { useCallback, useEffect, useRef, useState } from 'react';
import CustomSlideModal from '../../components/customSlideModal';
import { IAppDetail } from '../../interface';
import Store from '../../store';
import {
  useCustomNavigation,
  useCustomRoute,
  RootStackParamList,
} from '../../../navigation';
import { useFocusEffect } from '@react-navigation/native';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import {
  GestureHandlerRootView,
  FlatList as GestureFlatList,
} from 'react-native-gesture-handler';
import CustomButton from '../../components/customButton';
import { openApp, openAppInfo, uninstallApp } from '../../utils/common';
const { SystemSettings, ScreenLocker } = NativeModules;

const HomeScreen = () => {
  const { theme } = useTheme();
  const styles = styleSheet(theme);
  const { width } = Dimensions.get('window');
  const navigation = useCustomNavigation();
  const [userName, setUserName] = useState('');
  const [openNameInput, setOpenNameInput] = useState<boolean>(false);
  const route = useCustomRoute();
  const [appList, setAppList] = useState<IAppDetail[]>([]);
  const [enableReorder, setEnableReorder] = useState(false);
  const [isDefault, setIsDefault] = useState<boolean | null>(null);
  const [showAppIcon, setShowAppIcon] = useState<boolean>(true);
  const [enableDoubleTapLock, setEnableDoubleTapLock] =
    useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [selectedApp, setSelectedApp] = useState<IAppDetail | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const listRef = useRef<GestureFlatList<IAppDetail>>(null);
  const [selectedAppForMenu, setSelectedAppForMenu] =
    useState<IAppDetail | null>(null);

  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const checkBatteryOptimizationIgnored = async () => {
      const isBatteryOptimizationIgnored =
        await SystemSettings.isBatteryOptimizationIgnored();
      if (!isBatteryOptimizationIgnored) {
        await SystemSettings.requestDisableBatteryOptimization();
      }
    };
    checkBatteryOptimizationIgnored();

    const checkIsDefault = async () => {
      const isDefaultLauncher = await SystemSettings.isDefaultLauncher();
      setIsDefault(isDefaultLauncher);
    };
    checkIsDefault();
  }, []);

  useFocusEffect(
    useCallback(() => {
      requestAnimationFrame(() => {
        listRef.current?.scrollToOffset({
          offset: 0,
          animated: false,
        });
      });
    }, []),
  );

  if (listRef) {
    console.log('----------------------------------------------');
    console.log('listRef', listRef);
    console.log('----------------------------------------------');
    console.log('listRefz', listRef?.current);
  }
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (selectedAppForMenu) {
          setSelectedAppForMenu(null);
        }
        // Return true to prevent exiting the app on Home screen
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [selectedAppForMenu]),
  );

  const loadApps = async () => {
    setIsFetching(true);
    let selectedAppsList = await Store.get<IAppDetail[]>(Store.KEY, []);
    selectedAppsList = selectedAppsList.filter(item => !!item);
    if (
      selectedAppsList.length !== 0 &&
      !selectedAppsList.some(item => item.packageName === 'allApps')
    ) {
      selectedAppsList.push({
        name: 'All Apps',
        packageName: 'allApps',
        activityName: '',
        iconUri: '',
      });
    }
    setAppList(selectedAppsList);
    setIsFetching(false);
  };

  useEffect(() => {
    loadApps();
    const checkIconEnabled = async () => {
      const isEnabled = await Store.get(Store.SHOW_APP_ICON_KEY, true);
      setShowAppIcon(isEnabled);
      const isLockEnabled = await Store.get(
        Store.ENABLE_DOUBLE_TAP_LOCK_KEY,
        false,
      );
      setEnableDoubleTapLock(isLockEnabled);
    };
    const checkUserName = async () => {
      const storedUserName = await Store.get(Store.USER_NAME_KEY, '');
      const trimmedUserName = storedUserName.trim();
      setUserName(trimmedUserName);
      setOpenNameInput(!trimmedUserName);
    };
    checkIconEnabled();
    checkUserName();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const routeParams = route.params as RootStackParamList['Home'];
      if (routeParams?.refresh) {
        loadApps();
        Store.get(Store.SHOW_APP_ICON_KEY, true).then(setShowAppIcon);
        Store.get(Store.ENABLE_DOUBLE_TAP_LOCK_KEY, false).then(
          setEnableDoubleTapLock,
        );
      }
    }, [route.params]),
  );

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const syncUserName = async () => {
        const storedUserName = await Store.get(Store.USER_NAME_KEY, '');
        const trimmedUserName = storedUserName.trim();

        if (!isActive) {
          return;
        }

        setUserName(trimmedUserName);
        setOpenNameInput(!trimmedUserName);
      };

      syncUserName();

      return () => {
        isActive = false;
      };
    }, []),
  );

  const lockScreen = async () => {
    try {
      await ScreenLocker.lockScreen();
    } catch (e: any) {
      console.warn('Failed to lock screen', e);
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

  const getGreeting = (date: Date) => {
    const hour = date.getHours();
    if (hour < 6) {
      return 'Good Early Morning';
    } else if (hour < 12) {
      return 'Good Morning';
    } else if (hour < 18) {
      return 'Good Afternoon';
    } else if (hour < 22) {
      return 'Good Evening';
    } else {
      return 'Good Night';
    }
  };

  useEffect(() => {
    const currentTime = new Date();
    const greeting = getGreeting(currentTime);
    setGreeting(greeting);
    const interval = setInterval(() => {
      const currentTime = new Date();
      const greeting = getGreeting(currentTime);
      setGreeting(greeting);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const RenderItem = ({ item, drag }: RenderItemParams<IAppDetail>) => {
    const openMenu = () => {
      setEnableReorder(true);
      setSelectedAppForMenu(item);
    };
    const lastTap = useRef(0);
    const tapTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleTap = () => {
      const now = Date.now();
      const DOUBLE_PRESS_DELAY = 250;

      if (enableDoubleTapLock) {
        if (lastTap.current && now - lastTap.current < DOUBLE_PRESS_DELAY) {
          if (tapTimeout.current) clearTimeout(tapTimeout.current);
          console.log('Double tap detected');
          lockScreen();
        } else {
          if (enableReorder) {
            setEnableReorder(false);
            setSelectedAppForMenu(null);
          } else {
            tapTimeout.current = setTimeout(() => {
              item.packageName === 'allApps'
                ? navigation.navigate('AllApps')
                : openApp(item, setError);
              setSelectedAppForMenu(null);
            }, DOUBLE_PRESS_DELAY);
          }
        }
        lastTap.current = now;
      } else {
        if (enableReorder) {
          setEnableReorder(false);
          setSelectedAppForMenu(null);
        } else {
          item.packageName === 'allApps'
            ? navigation.navigate('AllApps')
            : openApp(item, setError);
          setSelectedAppForMenu(null);
        }
      }
    };

    return (
      <Pressable
        key={item?.packageName}
        style={[
          styles.appContainer,
          selectedApp?.packageName === item.packageName &&
            styles.appContainerSelected,
        ]}
        onPress={() => {
          setSelectedAppForMenu(null);
          handleTap();
        }}
        onLongPress={() => {
          if (selectedAppForMenu) {
            setSelectedAppForMenu(null);
          } else {
            openMenu();
          }
        }}
      >
        <View
          key={item?.packageName + '_container'}
          style={[styles.appContainer, styles.flexRow]}
        >
          <View style={[styles.flexRow, styles.alignCenter, { gap: 10 }]}>
            {enableReorder && (
              <Pressable
                style={styles.moreButton}
                onLongPress={() => {
                  setEnableReorder(true);
                  setSelectedAppForMenu(null);
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
            {showAppIcon && item.name !== 'All Apps' && (
              <Image
                key={item?.packageName + '_icon'}
                source={{ uri: item?.iconUri }}
                style={{
                  width: 24,
                  height: 24,
                  opacity: enableReorder ? 0.2 : 1,
                }}
              />
            )}
            {showAppIcon && item.name === 'All Apps' && (
              <View style={{ opacity: enableReorder ? 0.2 : 1 }}>
                <AllIcon width={24} height={24} fill={theme.textPrimary} />
              </View>
            )}
            <Text
              style={[
                styles.appName,
                { paddingLeft: enableReorder && !showAppIcon ? 30 : 0 },
              ]}
            >
              {item?.name}
            </Text>
          </View>
          {selectedAppForMenu &&
            selectedAppForMenu.packageName === item.packageName &&
            item.name !== 'All Apps' && (
              <View style={[styles.flexRow, styles.alignCenter, { gap: 10 }]}>
                <Pressable onPress={() => openAppInfo(item, setError)}>
                  <InformationIcon
                    width={15}
                    height={15}
                    fill={theme.textPrimary}
                  />
                </Pressable>
                <Pressable onPress={() => handleRemoveFromHome(item)}>
                  <RemoveIcon width={15} height={15} fill={theme.textPrimary} />
                </Pressable>
                <Pressable onPress={() => uninstallApp(item, setError)}>
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
          <AddIcon width={24} height={24} fill={theme.textPrimary} />
        </Pressable>
        <Pressable
          style={styles.menuButton}
          onPress={() => {
            navigation.navigate('Settings', {
              isDefault: isDefault,
            });
          }}
        >
          <SettingsIcon width={24} height={24} fill={theme.textPrimary} />
        </Pressable>
      </View>
      <View style={[styles.logoContainer]}>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Text style={styles.greetings}>{greeting}!</Text>
            <HappyIcon width={20} height={20} fill={theme.textPrimary} />
          </View>
          <Text
            style={[
              styles.greetings,
              { fontSize: 24, color: theme.textPrimary },
            ]}
          >
            {userName}
          </Text>
          {/* <Text style={styles.subtitle}>Start clean. Stay focused.</Text> */}
        </View>
      </View>

      {isFetching && (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={theme.textPrimary} />
        </View>
      )}

      {!isFetching && appList.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No apps selected</Text>
          <CustomButton
            title="Select apps"
            variants="secondary"
            onPress={() => navigation.navigate('AppSelector')}
          />
        </View>
      )}

      {appList.length > 0 && (
        <GestureHandlerRootView>
          <DraggableFlatList
            ref={listRef}
            style={[styles.appListContainer, { width }]}
            data={appList}
            keyExtractor={item => item.packageName}
            renderItem={RenderItem}
            onDragEnd={({ data }) => {
              setEnableReorder(false);
              setSelectedApp(null);
              (async () => await Store.save(Store.KEY, data))();
              loadApps();
            }}
          />
        </GestureHandlerRootView>
      )}

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
              variants={'tertiary'}
              // onPress={openSetDefaultSettings}
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
            style={{
              fontWeight: 'bold',
              fontSize: 16,
              textAlign: 'center',
              color: theme.textPrimary,
            }}
          >
            Error
          </Text>
          <Text style={{ textAlign: 'center', color: theme.textPrimary }}>
            {error}
          </Text>
        </View>
      </CustomSlideModal>

      <CustomSlideModal
        key="username"
        visible={openNameInput}
        position="center"
        footer={
          <View style={{ alignItems: 'center', width: '100%' }}>
            <CustomButton
              onPress={async () => {
                await Store.save(Store.USER_NAME_KEY, userName.trim());
                setOpenNameInput(false);
              }}
              disabled={!(userName.trim().length > 2)}
              variants={'secondary'}
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
            What's your name?
          </Text>
          <Text
            style={{
              textAlign: 'center',
              color: theme.textPrimary,
            }}
          >
            Please enter your name to personalize your experience
          </Text>
          <TextInput
            style={{
              width: '100%',
              borderColor: 'gray',
              borderWidth: 1,
              borderRadius: 5,
              color: theme.textPrimary,
            }}
            value={userName}
            onChangeText={setUserName}
          />
        </View>
      </CustomSlideModal>
    </View>
  );
};

export default HomeScreen;
