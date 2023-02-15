import { StatusBar } from "expo-status-bar";
import { StyleSheet, SafeAreaView } from "react-native";

import { Router } from "./src/router/Router";

import { Auth } from "./src/context/AuthContext";

export default function App() {
  return (
    <Auth>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <Router />
      </SafeAreaView>
    </Auth>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
    paddingHorizontal: 16,
  },
});
