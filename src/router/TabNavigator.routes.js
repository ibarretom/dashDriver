import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Home } from '../views/Home';
import { CarRidesResume } from '../views/CarRidesResume';

import Icon from "react-native-vector-icons/MaterialIcons"

const Tab = createBottomTabNavigator();

export function TabNavigator() {

  function getIconByRouteName({routeName, focused}) {
    let iconName
    if(routeName === 'Home') {
      iconName = 'home-filled'
    }else if(routeName === 'CarRidesResume') {
      iconName = 'directions-car'
    }
    return iconName
  }

  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      animation: "none",
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        const iconName = getIconByRouteName({routeName: route.name, focused})

        return <Icon size={size} name={iconName} color={color} />
      }
    })}
    >
      <Tab.Screen name="Home" options={{ title: 'Home' }} component={Home} />
      <Tab.Screen name="CarRidesResume" options={{ title: 'Corridas' }} component={CarRidesResume} />
    </Tab.Navigator>
  )
}