import { StyleSheet } from 'react-native';
import { ITheme } from '../../interface';

const styleSheet = (theme: ITheme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      top: 0,
      backgroundColor: theme.background,
      alignItems: 'center',
      width: '100%',
      height: '100%',
      margin: 0,
      padding: 16,
    },
    logoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    greetings: {
      fontSize: 16,
      fontWeight: '600',
      letterSpacing: 1.5,
      color: theme.textPrimary,
    },
    subtitle: {
      marginTop: 8,
      fontSize: 14,
      color: theme.textPrimary, // neutral gray
      letterSpacing: 0.5,
    },
    menuButton: {
      zIndex: 1,
      borderColor: theme.textPrimary,
    },
    topMenuContainer: {
      display: 'flex',
      width: '100%',
      flexDirection: 'row',
      position: 'absolute',
      top: 16,
      right: 16,
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: 16,
    },
    menuContainer: {
      width: '100%',
      height: '100%',
      color: theme.textPrimary,
      gap: 8,
      justifyContent: 'space-between',
    },
    menuModel: {
      flex: 1,
      alignItems: 'center',
      padding: 0,
    },
    menuTitle: {
      fontSize: 18,
      fontWeight: '800',
      letterSpacing: 1.5,
      color: theme.textPrimary,
    },
    menuItem: {
      color: theme.textPrimary,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    menuItemText: {
      fontSize: 14,
      color: theme.textPrimary,
    },
    emptyContainer: {
      flex: 1,
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      zIndex: 10,
    },
    emptyText: {
      fontSize: 16,
      color: theme.textPrimary,
    },
    appListContainer: {
      flex: 1,
      width: '100%',
      padding: 8,
      margin: 0,
    },
    appContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      width: '100%',
      padding: 14,
      gap: 12,
      color: theme.textPrimary,
      position: 'relative',
      // height: 42,
    },
    appContainerSelected: {
      borderColor: theme.textPrimary,
      borderWidth: 1,
    },
    appName: {
      fontSize: 16,
      color: theme.textPrimary,
    },
    appContextMenu: {
      position: 'absolute',
    },
    moreButton: {
      position: 'absolute',
      left: 5,
      zIndex: 10,
    },
    alignCenter: {
      alignItems: 'center',
    },
    flexRow: {
      flexDirection: 'row',
    },
    flexColumn: {
      flexDirection: 'column',
    },
    footerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'absolute',
      width: '100%',
      bottom: 16,
      left: 16,
      right: 16,
    },
    footerText: {
      fontSize: 12,
      color: theme.textPrimary,
    },
    contextMenu: {
      position: 'absolute',
      backgroundColor: theme.background,
      borderRadius: 8,
      height: 150,
      width: 150,
      shadowColor: theme.textPrimary,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    contextMenuItem: {
      padding: 8,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    contextMenuItemText: {
      fontSize: 12,
      color: theme.textPrimary,
    },
  });

export default styleSheet;
