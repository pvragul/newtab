export interface ITheme {
  background: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
}

export interface IconSize {
  width?: number | string;
  height?: number | string;
  fill?: string;
}

export interface IAppDetail {
  name: string;
  packageName: string;
  iconUri?: string;
  activityName?: string;
  order?: number;
}

export type AppDetail = IAppDetail;