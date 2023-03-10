import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Login } from "../views/Login"
import { Register } from '../views/Register';
import { CarRide } from '../views/CarRide';
import { Fuel } from '../views/Fuel';
import { Earning } from '../views/Earning';
import { Spent } from '../views/Spent';
import { Kilometers } from '../views/Kilometers';

import { useAuth } from "../hooks/auth";
import { useLoading } from "../hooks/loading";

import { TabNavigator } from "./TabNavigator.routes";

import { LoadingSpinner } from "../components/LoadingSpinner";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#fff'
  },
};

const Stack = createNativeStackNavigator();

export function Router() {
  const { isLoggedIn } = useAuth()
  const { isLoading } = useLoading()

  if(isLoading) {
    return (
      <LoadingSpinner />
    )
  }

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={{ animation: "none", headerShown: false }}
      >

        {!isLoggedIn ?
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
          </> :
          <>
            <Stack.Screen name="TabNavigator" component={TabNavigator} />
            <Stack.Screen name="CarRide" component={CarRide} />
            <Stack.Screen name="Fuel" component={Fuel} />
            <Stack.Screen name="Earning" component={Earning} />
            <Stack.Screen name="Spent" component={Spent} />
            <Stack.Screen name="Kilometers" component={Kilometers} />
          </>
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
}