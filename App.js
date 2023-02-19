import { StatusBar } from "expo-status-bar";
import { StyleSheet, SafeAreaView } from "react-native";

import { Router } from "./src/router/Router";

import { Auth } from "./src/context/AuthContext";
import { Loading } from "./src/context/LoadingContext";

export default function App() {
  return (
    <Loading>
      <Auth>
        <SafeAreaView style={styles.container}>
          <StatusBar style="auto" />
          <Router />
        </SafeAreaView>
      </Auth>
    </Loading>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
    paddingHorizontal: 16,
  },
});
