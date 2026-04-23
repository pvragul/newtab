import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  View,
  Modal,
} from 'react-native';
import { ITheme } from '../interface';
import { useTheme } from '../themes/ThemeContext';

export type Position = 'left' | 'right' | 'center' | 'auto';

const { width, height } = Dimensions.get('window');
const SIDE_WIDTH = Math.min(width * 0.60, 320);

export default function CustomSlideModal({
  visible,
  position = 'right',
  onClose,
  children,
  footer,
  containerStyle,
  contentStyle,
}: {
  visible: boolean;
  position?: Position;
  onClose?: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  containerStyle?: object | any[];
  contentStyle?: object | any[];
}) {
  const { theme } = useTheme();
  const styles = styleSheet(theme);
  const [showModal, setShowModal] = useState(visible);
  const translate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const getInitialValue = () => {
    if (position === 'left') return -SIDE_WIDTH;
    if (position === 'right') return SIDE_WIDTH;
    if (position === 'center') return height;
    return 0; // auto
  };

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      translate.setValue(getInitialValue());
      opacity.setValue(0);
      Animated.parallel([
        Animated.timing(translate, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translate, {
          toValue: getInitialValue(),
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowModal(false);
      });
    }
  }, [visible]);

  if (!showModal) return null;

  const getTransformStyle = () => {
    if (position === 'center') return { transform: [{ translateY: translate }] };
    if (position === 'left' || position === 'right') return { transform: [{ translateX: translate }] };
    return {};
  };

  return (
    <Modal
      transparent
      visible={showModal}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        {onClose && <Pressable style={styles.backdrop} onPress={onClose} />}

        <Animated.View
          style={[
            styles.panel,
            position !== 'auto' && styles[position as keyof typeof styles],
            getTransformStyle(),
            { opacity },
            containerStyle,
          ]}
        >
          <View style={[styles.content, contentStyle]}>{children}</View>
          {footer && <View style={styles.footer}>{footer}</View>}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styleSheet = (theme: ITheme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      zIndex: 99,
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      flex: 1,
      // backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dim the background further for more contrast
    },
    panel: {
      position: 'absolute',
      backgroundColor: theme.background, // 70% opacity for more translucency
      borderRadius: 25, // Slightly more rounded for glassy aesthetic
      borderWidth: 1.5, // Thicker shine
      borderColor: theme.textPrimary + '40', // Brighter rim reflection
      shadowColor: theme.textPrimary,
      shadowOffset: {
        width: 0,
        height: 15,
      },
      shadowOpacity: 0.25,
      shadowRadius: 25,
      elevation: 15,
    },
    content: {
      padding: 16,
    },
    left: {
      left: 0,
      top: 0,
      bottom: 0,
      width: SIDE_WIDTH,
      borderRadius: 0,
    },
    right: {
      right: 0,
      top: 0,
      bottom: 0,
      width: SIDE_WIDTH,
      borderRadius: 0,
    },
    center: {
      left: 36,
      right: 36,
      top: height * 0.25,
    },
    auto: {},
    footer: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderTopWidth: 2,
      borderTopColor: theme.background,
    },
  });
