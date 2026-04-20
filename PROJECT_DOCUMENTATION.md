# New Tab - Project Documentation

## 1. Project Overview
**New Tab** is a minimalist Android launcher built with **React Native**. It is designed to help users stay focused by allowing them to select and display only necessary apps on their home screen. The app features a clean interface, dark mode support, and draggable app organization.

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
The app uses a Native Stack Navigator with two main screens:
1.  **`Home`** (`src/screens/home`): The main dashboard.
2.  **`AppSelector`** (`src/screens/selector`): The screen to choose which apps to display.

### 3.3 Data Flow & Persistence
*   **Storage Key**: `SELECTED_APPS`
*   **Store (`src/store/index.ts`)**: A wrapper around `AsyncStorage` to Save, Get, and Clear selected package names.
*   **Flow**:
    1.  On startup, `HomeScreen` reads the list of selected package names from `AsyncStorage`.
    2.  It initially renders placeholders or known apps (like Play Store, Settings).
    3.  It then calls the native module `LauncherApps.getAppMeta` to "hydrate" the list with real app names and icons.
    4.  When users select apps in `AppSelector`, the list is saved to Storage, and the Home screen is refreshed via navigation parameters (`route.params.refresh`).

### 3.4 Native Integration (Android)
The app relies on two custom Native Modules located in `android/app/src/main/java/com/newtab/`:

*   **`LauncherAppsModule`**:
    *   `getLaunchableApps()`: Returns a list of all installed apps that can be launched.
    *   `getAppMeta(packageName)`: Returns details (name, icon) for a specific package.
    *   `openApp(packageName, activityName)`: Launches the selected application.
*   **`SystemSettingsModule`**:
    *   `openDisplaySettings()`: Opens the Android system display settings (useful for changing system themes).

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
*   **Draggable List**: The `DraggableFlatList` implementation in `HomeScreen` appears to utilize a draggable interface, but `onDragEnd` functionality for persisting the new order needs to be verified in the code implementation.
*   **Platform Support**: The custom native modules are currently implemented for Android only. iOS support would require equivalent Swift/Obj-C modules.
