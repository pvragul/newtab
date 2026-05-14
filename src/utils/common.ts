import { NativeModules } from 'react-native';
import { IAppDetail } from '../interface';

const { LauncherApps } = NativeModules;
export const openApp = async (
  app: IAppDetail,
  setError: React.Dispatch<React.SetStateAction<string>>,
) => {
  try {
    await LauncherApps.openApp(
      app.packageName,
      app.activityName, // optional
    );
  } catch (e: any) {
    console.warn('Failed to open app', e);
    setError(e.message);
  }
};
export const openAppInfo = async (
  app: IAppDetail,
  setError: React.Dispatch<React.SetStateAction<string>>,
) => {
  try {
    await LauncherApps.openAppInfo(app.packageName);
  } catch (e: any) {
    console.warn('Failed to open app info', e);
    setError(e.message);
  }
};

export const uninstallApp = async (
  app: IAppDetail,
  setError: React.Dispatch<React.SetStateAction<string>>,
) => {
  try {
    await LauncherApps.uninstallApp(app.packageName);
  } catch (e: any) {
    console.warn('Failed to uninstall app', e);
    setError(e.message);
  }
};
