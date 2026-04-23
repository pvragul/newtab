import {
  Dimensions,
  Image,
  NativeModules,
  Pressable,
  Text,
  View,
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
} from '../../../navigation';
import { useFocusEffect } from '@react-navigation/native';
import LinkIcon from '../../assets/images/link_icon';
import Store from '../../store';
import SearchInput from '../../components/SearchInput';
const { LauncherApps } = NativeModules;
const { width } = Dimensions.get('window');

const AllApps = () => {
  const { theme } = useTheme();
  const styles = styleSheet(theme);
  const [launchableApps, setlaunchableApps] = useState<IAppDetail[]>([]);
  const [error, setError] = useState<string>('');
  const [selectedAppsList, setSelectedAppsList] = useState<Set<string>>(
    new Set(),
  );
  const navigation = useCustomNavigation();
  const listRef = useRef<FlatList>(null);
  const [success, setSuccess] = useState<string>('');
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
  };

  const loadAppsList = async () => {
    try {
      await loadSelectedPkgs();
      let appsList = await LauncherApps.getLaunchableApps();
      console.log(appsList?.length);
      //remove duplicates
      appsList = appsList?.filter(
        (app: IAppDetail, index: number) =>
          appsList?.findIndex((a: IAppDetail) => a.name === app.name) ===
            index && app?.name?.toLowerCase() !== 'newtab',
      );
      setlaunchableApps(appsList);
    } catch (error: any) {
      setError(error.message);
    }
  };

  useEffect(() => {
    loadAppsList();
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
  const [menuVisible, setMenuVisible] = useState(false);

  const [selectedApp, setSelectedApp] = useState<IAppDetail | null>(null);
  const [search, setSearch] = useState('');

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
    }, 1000);
  };
  const filteredAppsList = useMemo(() => {
    if (!search) return launchableApps;
    return launchableApps.filter((app: IAppDetail) => {
      return app.name.toLowerCase().includes(search.toLowerCase());
    });
  }, [launchableApps, search]);

  const renderApps = useCallback(
    ({ item }: any = {}) => {
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
                  width: 24,
                  height: 24,
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
                      width={15}
                      height={15}
                      fill={theme.textPrimary}
                    />
                  </Pressable>
                  <Pressable onPress={() => handleLinkApp(item)}>
                    {!isSelected ? (
                      <LinkIcon
                        width={15}
                        height={15}
                        fill={theme.textPrimary}
                      />
                    ) : (
                      <RemoveIcon
                        width={15}
                        height={15}
                        fill={theme.textPrimary}
                      />
                    )}
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
      <GestureHandlerRootView>
        <FlatList
          ref={listRef}
          style={[styles.appListContainer, { width }]}
          data={filteredAppsList}
          renderItem={renderApps}
          keyExtractor={item => item.packageName}
        />
      </GestureHandlerRootView>
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
