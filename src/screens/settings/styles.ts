import { StyleSheet } from 'react-native';
import { ITheme } from '../../interface';

const styleSheet = (theme: ITheme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: theme.background,
      padding: 16,
      gap: 16,
    },
    header: {
      width: '100%',
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    title: {
      fontSize: 20,
      fontWeight: '800',
      letterSpacing: 1.5,
      color: theme.textPrimary,
      marginBottom: 10,
    },
    text: {
      fontSize: 14,
      color: theme.textPrimary,
    },
    switchContainer: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.background,
    },
  });

export default styleSheet;
