import {
  BackHandler,
  FlatList,
  NativeModules,
  Pressable,
  Text,
  View,
} from 'react-native';
import styleSheet from './styles';
import { useTheme } from '../../themes/ThemeContext';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IAppDetail } from '../../interface';
import AppRow from '../../components/appRow';
import Store from '../../store';
import {
  RootStackParamList,
  useCustomNavigation,
  useCustomRoute,
} from '../../../navigation';
import CustomSlideModal from '../../components/customSlideModal';
const { LauncherApps } = NativeModules;

const AppSelector = () => {
  const { theme } = useTheme();
  const styles = styleSheet(theme);
  const navigation = useCustomNavigation();
  const route = useCustomRoute();
  const [launchableApps, setlaunchableApps] = useState<IAppDetail[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [openHasChangesModal, setOpenHasChangesModal] =
    useState<boolean>(false);

  const initialSelectedRef = useRef<Set<string>>(new Set());
  const loadSelectedPkgs = async (): Promise<Set<string>> => {
    const data = await Store.get<IAppDetail[]>(Store.KEY, []);
    const initial = Array.isArray(data)
      ? new Set(data.map(item => item.packageName))
      : new Set<string>();
    initialSelectedRef.current = new Set(initial);
    return new Set(initial);
  };
  useEffect(() => {
    const loadAppsList = async () => {
      const selectedList = await loadSelectedPkgs();
      setSelected(selectedList);
      const appsList = await LauncherApps.getLaunchableApps();
      const uniqueApps = appsList.filter(
        (app: IAppDetail, index: number) =>
          appsList.findIndex(
            (item: IAppDetail) => item.packageName === app.packageName,
          ) === index,
      );
      setlaunchableApps(uniqueApps);
    };
    loadAppsList();
  }, []);
  const hasUnsavedChanges = useMemo(() => {
    const initial = initialSelectedRef.current;
    if (initial?.size !== selected.size) return true;

    for (const pkg of selected) {
      if (!initial?.has(pkg)) return true;
    }
    return false;
  }, [selected]);
  useEffect(() => {
    const onBackPress = () => {
      if (!hasUnsavedChanges) return false; // allow default

      setOpenHasChangesModal(true);
      return true; // block navigation
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => sub.remove();
  }, [hasUnsavedChanges]);

  // ------------------ Toggle selection ------------------
  const toggleApp = useCallback((appDetail: IAppDetail) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(appDetail.packageName)
        ? next.delete(appDetail.packageName)
        : next.add(appDetail.packageName);
      return next;
    });
  }, []);

  const renderItem = useCallback(
    (props: { item: IAppDetail }) => {
      return (
        <AppRow
          app={props.item}
          selected={selected.has(props.item.packageName)}
          onToggle={() => toggleApp(props.item)}
        />
      );
    },
    [selected, toggleApp],
  );
  const onCloseModal = () => {
    setOpenHasChangesModal(false);
  };
  const storeSelectedApps = async () => {
    const selectedAppDetails = launchableApps.filter(app =>
      selected.has(app.packageName),
    );
    await Store.save(Store.KEY, Array.from(selectedAppDetails));
    navigation.navigate('Home', {
      refresh: true,
      ts: Date.now(),
    });
  };
  const handleOnPressYes = () => {
    setOpenHasChangesModal(false);
    setSelected(initialSelectedRef.current);
    navigation.goBack();
  };
  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>Select apps</Text>
        {selected.size > 0 && (
          <Pressable onPress={storeSelectedApps}>
            <Text style={styles.appName}>Done</Text>
          </Pressable>
        )}
      </View>
      {launchableApps.length === 0 && (
        <Text style={styles.appName}>Loading apps...</Text>
      )}
      <FlatList
        style={styles.appListContainer}
        data={launchableApps}
        renderItem={renderItem}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={10}
        removeClippedSubviews
      />
      <CustomSlideModal
        visible={openHasChangesModal}
        position="center"
        onClose={onCloseModal}
      >
        <View>
          <Text>Welcome</Text>
          <View style={styles.customModalFooter}>
            <Pressable
              style={styles.footerBtn}
              onPress={() => setOpenHasChangesModal(false)}
            >
              <Text style={{ fontSize: 18 }}>Close</Text>
            </Pressable>
            <Pressable style={styles.footerBtn} onPress={handleOnPressYes}>
              <Text style={{ fontSize: 18, color: theme.background }}>Yes</Text>
            </Pressable>
          </View>
        </View>
      </CustomSlideModal>
      <View style={styles.footer}>
        <Text style={styles.appName}>{selected.size} apps selected</Text>
      </View>
    </View>
  );
};

export default AppSelector;
