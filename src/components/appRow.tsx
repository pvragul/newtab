import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { IAppDetail, ITheme } from '../interface';
import { useTheme } from '../themes/ThemeContext';


interface IAppRow {
  app: IAppDetail;
  selected: boolean;
  onToggle: () => void;
}
const AppRow = React.memo(({ app, selected, onToggle }: IAppRow) => {
  const { theme } = useTheme();
  const styles = styleSheet(theme);
  const animate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animatebackdrop = () => {
      Animated.timing(animate, {
        toValue: selected ? 1 : 0,
        duration: 100,
        useNativeDriver: false,
        easing: Easing.out(Easing.cubic),
      }).start();
    };
    animatebackdrop();
  }, [selected]);
  const opacity = animate.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });
  return (
    <Pressable key={app.activityName} onPress={onToggle}>
      {selected && (
        <Animated.View
          pointerEvents={'none'}
          style={[styles.backDropContainer, { opacity }]}
        >
          <Animated.View style={{ position: 'absolute', right: 16 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.textPrimary }}>✓</Text>
          </Animated.View>
        </Animated.View>
      )}
      <View style={[styles.appContainer]}>
        <Image
          source={{ uri: app.iconUri }}
          style={{ width: 36, height: 36 }}
        />
        <Text style={[styles.appName, selected && styles.appNameSelected]}>
          {app.name}
        </Text>
      </View>
    </Pressable>
  );
});

const styleSheet = (theme: ITheme) =>
  StyleSheet.create({
    appContainer: {
      position: 'relative',
      flex: 1,
      alignItems: 'center',
      padding: 10,
      gap: 10,
      flexDirection: 'row',
      shadowColor: theme.textPrimary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    appName: {
      fontSize: 18,
      color: theme.textSecondary,
    },
    appNameSelected: {
      fontSize: 18,
      color: theme.textPrimary,
    },
    appIconContainer: {
      width: 36,
      height: 36,
      borderRadius: 100,
      overflow: 'hidden',
      backgroundColor: theme.accent,
      justifyContent: 'center',
      alignItems: 'center',
    },
    backDropContainer: {
      flex: 1,
      position: 'absolute',
      top: 0,
      width: '100%',
      left: 0,
      bottom: 2,
      padding: 16,
      gap: 10,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.accent,
      borderRadius: 20,
    },
  });

export default AppRow;
