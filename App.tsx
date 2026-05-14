import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/themes/ThemeContext';
import Navigation from './navigation';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
/**
 * The main App component, which wraps the Navigation component
 * with a ThemeProvider and a SafeAreaProvider.
 */
function App() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ThemeProvider>
        <SafeAreaProvider>
          <Navigation />
        </SafeAreaProvider>
      </ThemeProvider>
    </KeyboardAvoidingView>
  );
}

export default App;

const styleSheet = (theme: any) => StyleSheet.create({});
