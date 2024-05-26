export interface ApplicationConfig {
  readonly fonts: string[];
  readonly pageLoaderEnabled: boolean;
  readonly routeLoaderEnabled: boolean;
  readonly minimumLoaderTime: number;
  readonly manualLoader: boolean;
}
