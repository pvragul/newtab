import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/themes/ThemeContext';
import Navigation from './navigation';
import { StyleSheet } from 'react-native';
/**
 * The main App component, which wraps the Navigation component
 * with a ThemeProvider and a SafeAreaProvider.
 */
function App() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <Navigation />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

export default App;

const styleSheet = (theme: any) => StyleSheet.create({});
