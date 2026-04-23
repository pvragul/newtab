# New Tab

**New Tab** is a highly minimalist, "dumb-phone" style Android launcher built with React Native. It intentionally reduces digital noise and user distraction by allowing you to strictly select and display only necessary apps on your home screen. It replaces your default Android launcher with a clean, focused, and customizable interface.

## 🚀 Features

*   **Minimalist Home Screen**: Say goodbye to cluttered pages. Handpick only the most essential applications to display on your launcher home screen.
*   **Launchable App Details**: Access a complete list of all installed launchable applications on your device via the `All Apps` screen. View crucial app details, inspect System App Info, or directly uninstall apps right from the launcher.
*   **Drag-and-Drop Organization**: Easily re-order your selected apps on the home screen using intuitive drag-and-drop gestures.
*   **Double-Tap to Lock**: Instantly turn off and lock your device display with a quick double-tap on any empty space or app element.
*   **Personalized Greeting**: Dynamic, time-based greetings (e.g., "Good Morning", "Good Evening") paired with your personalized username.
*   **Theme & Icon Toggles**: Fully supports Light and Dark modes. Further reduce distractions by hiding application icons entirely for a text-only interface.
*   **Glassmorphism UI**: Beautiful, lightweight, frosted-glass inspired modals and contextual menus without relying on heavy native blur libraries.
*   **Home Intent Deep Linking**: Fully intercepts Android physical Home button presses, routing seamlessly back to the minimalist dashboard via deep links.

## 📱 Usage

1.  **Set as Default Launcher**: Upon first launch, tap the "Settings" icon and select "Set as Default" to make New Tab your primary Android home screen.
2.  **Add Apps**: Tap the `+` (Add) icon on the top menu to browse all installed apps and select the ones you want visible on your home screen.
3.  **Reorder**: Long-press on any app on the home screen to enter reorder mode. Use the drag handle to change the layout.
4.  **App Options**: In reorder mode, you can view App Info, remove the app from your home screen, or completely uninstall the app from your device.
5.  **Settings**: Click the Settings gear to toggle app icons, switch themes, or manage your display name.

## 🛠️ Technology Stack

*   **Framework**: React Native (0.83.1)
*   **Language**: TypeScript
*   **Navigation**: React Navigation (Native Stack)
*   **Storage**: `@react-native-async-storage/async-storage`
*   **Native Integrations (Android)**:
    *   `LauncherAppsModule`: Fetches launchable apps, metadata, and triggers uninstalls.
    *   `SystemSettingsModule`: Checks default launcher status and manages battery optimization.
    *   `ScreenLockerModule`: Uses Android Device Administrator to lock the screen.

## ⚙️ Installation & Setup

Since this application heavily integrates with custom Android Native Modules, it is designed exclusively for Android devices.

### Prerequisites
*   Node.js installed
*   Android Studio / Android SDK set up for React Native

### Steps

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd NewTab
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Run on Android Emulator or Device:**
   ```bash
   npm run android
   ```
   *Note: Ensure you have an Android device connected or an emulator running.*

## 🔒 Permissions Used
*   **Device Administrator**: Required to enable the "Double-Tap to Lock" functionality.
*   **Ignore Battery Optimizations**: Ensures the launcher remains active and responsive in the background.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📄 License
This project is licensed under the MIT License.
