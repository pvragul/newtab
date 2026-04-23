# New Tab - Project Documentation

## 1. Project Overview
**New Tab** is a highly minimalist, "dumb-phone" style Android launcher built with **React Native**. It is designed to intentionally reduce digital noise and user distraction by allowing users to select and display only necessary apps on their home screen. The app features a strict monochromatic color palette, glassmorphism modal interfaces, lock-screen capabilities, and draggable app organization.

## 2. Technology Stack
*   **Framework**: React Native (0.83.1)
*   **Language**: TypeScript / JavaScript
*   **Navigation**: React Navigation (Native Stack)
*   **State Management**: Local State (Hooks), React Context (Theme)
*   **Persistence**: `@react-native-async-storage/async-storage`
*   **UI Libraries**:
    *   `react-native-reanimated` (Animations)
    *   `react-native-gesture-handler` (Gestures)
    *   `react-native-draggable-flatlist` (List reordering)
    *   `react-native-svg` (Icons/Images)
*   **Native Modules**: Custom Kotlin modules for Android integration.

## 3. Architecture & Code Flow

### 3.1 Entry Point
1.  **`index.js`**: Registers the main component using `AppRegistry`.
2.  **`App.tsx`**: The root component.
    *   Wraps the app with `ThemeProvider` (for consistent styling).
    *   Wraps the app with `SafeAreaProvider` (for safe area handling).
    *   Renders the `Navigation` component.

### 3.2 Navigation Structure (`navigation.tsx`)
The app uses a Native Stack Navigator equipped with Deep Linking (`newtab://`), structured around four main screens:
1.  **`Home`** (`src/screens/home`): The main dashboard and entry point.
2.  **`AppSelector`** (`src/screens/selector`): The screen to choose which apps to display.
3.  **`AllApps`** (`src/screens/allapps`): Displays a complete list of installed applications.
4.  **`Settings`** (`src/screens/settings`): User preferences, app configuration, and version information.

### 3.3 Data Flow & Persistence
*   **Storage Keys**: 
    *   `SELECTED_APPS` (User's chosen home screen apps)
    *   `SHOW_APP_ICON` (Preference to toggle app icons on/off)
    *   `USER_NAME` (Personalized name for greetings)
*   **Store (`src/store/index.ts`)**: A wrapper around `AsyncStorage` to Save, Get, and Clear data.
*   **Flow**:
    1.  On startup, `HomeScreen` reads the list of selected package names from `AsyncStorage`.
    2.  It initially renders placeholders or known apps (like Play Store, Settings).
    3.  It then calls the native module `LauncherApps.getAppMeta` to "hydrate" the list with real app names and icons.
    4.  When users select apps in `AppSelector`, the list is saved to Storage, and the Home screen is refreshed via navigation parameters (`route.params.refresh`).

### 3.4 Native Integration (Android)
The app relies heavily on deeply integrated Android utilities located in `android/app/src/main/java/com/newtab/`:

*   **`LauncherAppsModule`**:
    *   `getLaunchableApps()`: Returns a list of all installed apps that can be launched.
    *   `getAppMeta(packageName)`: Returns details (name, icon) for a specific package.
    *   `openApp(packageName, activityName)`: Launches the selected application.
    *   `openAppInfo(packageName)`: Triggers the system settings implicit intent to show "App Info".
    *   `uninstallApp(packageName)`: Invokes the Android system intent to uninstall the given package.
*   **`SystemSettingsModule`**:
    *   `openDisplaySettings()`: Opens the Android system display settings (useful for changing system themes).
    *   `isDefaultLauncher()`: Actively probes the system to check if New Tab is the currently set default OS launcher.
    *   `openDefaultLauncherSettings()`: Redirects the user directly to system Default App configurations.
*   **`ScreenLockerModule`**:
    *   `lockScreen()`: Utilizes Android's `DevicePolicyManager` to lock the device immediately via Device Admin privileges.

### 3.5 App Mechanics & User Experience (UX)
*   **Hardware Back Override**: Hardware back press is forcefully disabled on the `HomeScreen` via `useFocusEffect` and `BackHandler` to prevent users from accidentally backing out of their launcher workspace.
*   **Hardware Home Button Routing**: The Android `CATEGORY_HOME` intent is intercepted natively in `MainActivity.kt`. It translates physical Home button presses (from anywhere in the system) into a React Navigation Deep Link (`newtab://home`), ensuring the app always cleanly returns to the Home screen without stack duplication.
*   **Glassmorphism UI**: Native iOS/Android Blur libraries are intentionally omitted to maintain build stability. Handcrafted layout styling with high translucent alphas (e.g., 70% opacity backgrounds) and crisp drop-shadows seamlessly mimic native glassware on the `CustomSlideModal` and contextual menus.
*   **SVG Clock Render**: Introduces an aesthetic, standalone, analog `GlassClock` widget strictly rendered via SVG algorithms inside the Home interface.
*   **User Personalization & Greetings**: The Home screen dynamically greets the user based on the time of day, paired with a persistent, customizable user name.
*   **Double-Tap to Lock**: A quick double-tap on app elements invokes the native `ScreenLockerModule` to immediately turn off the display.
*   **Minimalist Controls**: Through the `Settings` screen, users can globally toggle app icons on/off and switch between Dark/Light modes.

## 4. Directory Structure

```text
root/
├── android/            # Native Android project (contains Native Modules)
├── ios/                # Native iOS project (standard RN, likely unused for this launcher features)
├── src/
│   ├── assets/         # Images and icons
│   ├── components/     # Reusable UI components (AppRow, CustomSlideModal, etc.)
│   ├── interface/      # TypeScript definitions (IAppDetail)
│   ├── screens/        # Screen components (home, selector)
│   ├── store/          # Data persistence layer
│   ├── themes/         # Theme context and definitions
│   └── utils/          # Helper functions (scheduler)
├── App.tsx             # Root Component
├── index.js            # Entry Point
├── navigation.tsx      # Navigation Setup
└── package.json        # Dependencies
```

## 5. Key Scripts
Defined in `package.json`:
*   `npm start`: Start the Metro bundler.
*   `npm run android`: Build and run on Android device/emulator.
*   `npm run lint`: Run ESLint.

## 6. Setup & Installation
1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Run on Android**:
    ```bash
    npm run android
    ```
    *Note: Since this relies on custom Native Modules, you must run the native build at least once.*

## 7. Known Issues / Notes
*   **Draggable List**: The `DraggableFlatList` implementation in `HomeScreen` reliably records and persists the user-determined app order directly to `AsyncStorage`.
*   **Device Admin Access**: Utilizing `ScreenLockerModule` functionality requires explicit Device Admin access/activation accepted on the Android system.
*   **Platform Support**: The custom native launcher modules exist only for Android since Apple iOS firmly isolates OS launcher alterations.

## 8. Build & Release
*   **APK Output Naming**: The Android `build.gradle` is configured to dynamically name the output APK files based on the application name, build type, version name, and version code (e.g., `NewTab-release-v1.0(1).apk`) for streamlined release management.
