import { StyleSheet } from 'react-native';
import { ITheme } from '../../interface';

const styleSheet = (theme: ITheme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.background,
      alignItems: 'center',
      width: '100%',
      height: '100%',
      padding: 16,
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
      padding: 16,
      color: theme.textPrimary,
    },
    appListContainer: {
      flex: 1,
      width: '100%',
      gap: 10,
      marginBottom: 30,
    },
    appContainer: {
      position: 'relative',
      flex: 1,
      alignItems: 'center',
      padding: 16,
      gap: 10,
      flexDirection: 'row',
      marginBottom: 2,
    },
    appName: {
      fontSize: 18,
      color: theme.textSecondary,
    },
    backDropContainer: {
      flex: 1,
      position: 'absolute',
      top: 0,
      left: 0,
      opacity: 0.5,
      padding: 16,
      gap: 10,
      flexDirection: 'row',
      backgroundColor: theme.accent,
      borderRadius: 20,
    },
    footer: {
      position: 'absolute',
      width: '100%',
      bottom: 0,
      padding: 16,
      alignItems: 'center',
    },
    saveBtn: {
      position: 'absolute',
      bottom: 16,
      right: 16,
    },
    customModalFooter: {
      flex: 1,
      width: '100%',
      flexDirection: 'row',
      borderRadius: 16,
      //   padding: 8,
      borderColor: theme.background,
      //   borderWidth: 2,
      gap: 10,
    },
    footerBtn: {
      flex: 1,
      backgroundColor: theme.accent,
      color: theme.background,
      alignItems: 'center',
      borderRadius: 16,
      justifyContent: 'center',
      padding: 16,
      paddingTop: 8,
      paddingBottom: 8,
      marginTop: 8,
    },
  });

export default styleSheet;
