import {
  ActivityIndicator,
  Dimensions,
  Image,
  NativeModules,
  Pressable,
  Text,
  View,
  AppState,
} from 'react-native';
import styleSheet from './styles';
import { useTheme } from '../../themes/ThemeContext';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IAppDetail } from '../../interface';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import { InformationIcon, RemoveIcon, UninstallIcon } from '../../assets';
import { openApp, openAppInfo, uninstallApp } from '../../utils/common';
import CustomSlideModal from '../../components/customSlideModal';
import {
  RootStackParamList,
  useCustomNavigation,
  useCustomRoute,
} from '../../navigation/types';
import { useFocusEffect } from '@react-navigation/native';
import LinkIcon from '../../assets/images/link_icon';
import Store from '../../store';
import SearchInput from '../../components/SearchInput';
import CustomButton from '../../components/customButton';
const { LauncherApps } = NativeModules;
const { width } = Dimensions.get('window');

const AllApps = () => {
  const { theme } = useTheme();
  const styles = styleSheet(theme);
  const [loading, setLoading] = useState<boolean>(true);
  const [launchableApps, setlaunchableApps] = useState<IAppDetail[]>([]);
  const [error, setError] = useState<string>('');
  const [selectedAppsList, setSelectedAppsList] = useState<Set<string>>(
    new Set(),
  );
  const navigation = useCustomNavigation();
  const listRef = useRef<FlatList>(null);
  const [success, setSuccess] = useState<string>('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedApp, setSelectedApp] = useState<IAppDetail | null>(null);
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(20);
  const initialSelectedRef = useRef<Set<string>>(new Set());
  const loadSelectedPkgs = async () => {
    const data = await Store.get<IAppDetail[]>(Store.KEY, []);
    const initial = Array.isArray(data)
      ? new Set(data.map(item => item.packageName))
      : new Set<string>();

    setSelectedAppsList(initial);
    initialSelectedRef.current = initial;
    return;
  };
  const handleSearch = (text: string) => {
    setSearch(text);
    setLimit(20);
  };
  const loadAppsList = async () => {
    try {
      setLoading(true);
      await loadSelectedPkgs();
      let appsList = await LauncherApps.getLaunchableApps();
      //remove duplicates
      appsList = appsList?.filter(
        (app: IAppDetail, index: number) =>
          appsList?.findIndex((a: IAppDetail) => a.name === app.name) ===
            index && app?.name?.toLowerCase() !== 'newtab',
      );
      setlaunchableApps(appsList);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppsList();
    const subscription = AppState.addEventListener(
      'change',
      async nextAppState => {
        if (nextAppState === 'active') {
          setMenuVisible(false);
          setSelectedApp(null);
          await loadAppsList();
          const updatedList = Array.from(selectedAppsList)
            .map(key => {
              const app = launchableApps.find(
                (app: IAppDetail) => app.packageName === key,
              );
              return app;
            })
            .filter(Boolean);
          await Store.save(Store.KEY, updatedList);
          initialSelectedRef.current = selectedAppsList;
          setSelectedAppsList(
            new Set(updatedList.map(item => item?.packageName || '')),
          );
        }
      },
    );
    return () => {
      subscription.remove();
    };
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

  const handleLinkApp = async (appDetail: IAppDetail) => {
    const isSelected = selectedAppsList.has(appDetail.packageName);
    const next = selectedAppsList;
    if (isSelected) {
      next.delete(appDetail.packageName);
    } else {
      next.add(appDetail.packageName);
    }
    setSelectedAppsList(next);
    const selectedAppDetails = Array.from(next)
      .filter(item => !!item)
      .map(key => {
        return launchableApps.find(
          (app: IAppDetail) => app.packageName === key,
        );
      });
    await Store.save(Store.KEY, selectedAppDetails);
    setMenuVisible(false);
    setError('');
    setSuccess(
      `✓ ${appDetail.name} ${
        isSelected ? 'unlinked from' : 'linked to'
      } home screen`,
    );
    setTimeout(() => {
      setSuccess('');
    }, 2000);
  };
  const filteredAppsList = useMemo(() => {
    if (loading) return [];
    if (!search) return launchableApps;
    return launchableApps.filter((app: IAppDetail) => {
      return app.name.toLowerCase().includes(search.toLowerCase());
    });
  }, [launchableApps, search, loading]);

  const displayedAppsList = useMemo(() => {
    return filteredAppsList.slice(0, limit);
  }, [filteredAppsList, limit]);

  const loadMoreApps = useCallback(() => {
    if (limit < filteredAppsList.length) {
      setLimit(prevLimit => prevLimit + 20);
    }
  }, [limit, filteredAppsList.length]);

  const renderApps = useCallback(
    ({ item }: { item: IAppDetail }) => {
      const isSelected = selectedAppsList.has(item.packageName);
      return (
        <Pressable
          key={item?.packageName}
          style={[styles.appContainer]}
          onPress={() => {
            openApp(item, setError);
            setMenuVisible(false);
            setError('');
            navigation.navigate('Home', {
              refresh:
                Array.from(initialSelectedRef.current)?.length !==
                Array.from(selectedAppsList)?.length,
              ts: Date.now(),
            });
          }}
          onLongPress={() => {
            setSelectedApp(item);
            setMenuVisible(true);
          }}
        >
          <View
            key={item?.packageName + '_container'}
            style={[styles.appContainer, styles.flexRow]}
          >
            <View style={[styles.flexRow, styles.alignCenter, { gap: 10 }]}>
              <Image
                key={item?.packageName + '_icon'}
                source={{ uri: item?.iconUri }}
                style={{
                  width: 30,
                  height: 30,
                }}
              />
              <Text style={styles.appName}>{item?.name}</Text>
            </View>
            {menuVisible &&
              item.name !== 'All Apps' &&
              selectedApp?.packageName === item.packageName && (
                <View style={[styles.flexRow, styles.alignCenter, { gap: 10 }]}>
                  <Pressable onPress={() => openAppInfo(item, setError)}>
                    <InformationIcon
                      width={20}
                      height={20}
                      fill={theme.textPrimary}
                    />
                  </Pressable>
                  <Pressable onPress={() => handleLinkApp(item)}>
                    {!isSelected ? (
                      <LinkIcon
                        width={20}
                        height={20}
                        fill={theme.textPrimary}
                      />
                    ) : (
                      <RemoveIcon
                        width={20}
                        height={20}
                        fill={theme.textPrimary}
                      />
                    )}
                  </Pressable>
                  {!item.isSystemApp &&
                    item.installer === 'com.android.vending' && (
                      <Pressable onPress={() => uninstallApp(item, setError)}>
                        <UninstallIcon
                          width={20}
                          height={20}
                          fill={theme.textPrimary}
                        />
                      </Pressable>
                    )}
                </View>
              )}
          </View>
        </Pressable>
      );
    },
    [menuVisible, selectedAppsList, selectedApp, theme],
  );
  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>All Apps</Text>
        <Pressable
          onPress={() =>
            navigation.navigate('Home', {
              refresh:
                Array.from(initialSelectedRef.current)?.length !==
                Array.from(selectedAppsList)?.length,
              ts: Date.now(),
            })
          }
        >
          <Text style={styles.appName}>Back</Text>
        </Pressable>
      </View>
      <SearchInput onSearch={handleSearch} />
      {loading && (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={theme.textPrimary} />
        </View>
      )}
      {!loading && (
        <GestureHandlerRootView>
          <FlatList
            ref={listRef}
            style={[styles.appListContainer, { width }]}
            data={displayedAppsList}
            renderItem={renderApps}
            keyExtractor={item => item.packageName}
            onEndReached={loadMoreApps}
            onEndReachedThreshold={0.5}
            initialNumToRender={20}
            keyboardShouldPersistTaps="always"
          />
        </GestureHandlerRootView>
      )}
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
        key="Success"
        visible={!!success}
        onClose={() => setSuccess('')}
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
            Success
          </Text>
          <Text style={{ textAlign: 'center', color: theme.textPrimary }}>
            {success}
          </Text>
        </View>
      </CustomSlideModal>
    </View>
  );
};

export default AllApps;
