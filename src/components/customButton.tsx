import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';
import { useTheme } from '../themes/ThemeContext';
import { ITheme } from '../interface';

const CustomButton = ({
  title,
  variants,
  onPress,
  disabled,
}: {
  title: string;
  variants: 'primary' | 'secondary' | 'tertiary' | 'danger';
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  disabled?: boolean;
}) => {
  const { theme } = useTheme();
  const styles = styleSheet(theme);
  return (
    <Pressable
      style={[styles.root, styles[variants], disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles[`${variants}_text`]}>{title}</Text>
    </Pressable>
  );
};

export default CustomButton;

const styleSheet = (theme: ITheme) =>
  StyleSheet.create({
    root: {
      padding: 10,
      alignItems: 'center',
      borderRadius: 16,
      borderWidth: 2,
    },
    primary_text: {
      color: theme.textPrimary,
      fontWeight: 'bold',
    },
    secondary_text: {
      color: theme.background,
      fontWeight: 'bold',
    },
    tertiary_text: {
      color: theme.textPrimary,
      fontWeight: 'bold',
    },
    danger_text: {
      color: theme.textPrimary,
      fontWeight: 'bold',
    },
    primary: {
      backgroundColor: theme.background,
      borderColor: theme.background,
    },
    secondary: {
      backgroundColor: theme.textPrimary,
      borderColor: theme.background,
    },
    tertiary: {
      backgroundColor: theme.background,
      borderColor: theme.background,
    },
    danger: {
      backgroundColor: '#f26767',
      borderColor: '#f26767',
    },
    disabled: {
      opacity: 0.5,
    },
  });
