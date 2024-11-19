import React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import LoginScreen from "./component/LoginScreen";
import ClientList from "./component/ClientList";
import FormClient from "./component/FormClient";
import About from "./component/About";
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function BottomNavegator() {
  return (
    <Tab.Navigator
      initialRouteName="Clientes"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "FormClient") {
            iconName = "home";
            return <Icon name={iconName} color={color} size={size} />;
          } else if (route.name === "Clientes") {
            iconName = "view-dashboard";
          } else {
            iconName = "login";
          }
          return <Icon name={iconName} color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen
        name="FormClient1"
        component={FormClient}
        options={{
          title: "Cliente",
          tabBarLabel: "Cadastro de Cliente",
        }}
      />
      <Tab.Screen
        name="Clientes"
        component={ClientList}
        options={{
          tabBarLabel: "Clientes",
        }}
      />
      <Tab.Screen
        name="Sobre"
        component={About}
        options={{
          tabBarLabel: "Sobre",
        }}
      />
    </Tab.Navigator>
  );
}
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        {/* Tela de Login sem aba */}
        <Stack.Screen
          name="FormClient"
          component={FormClient}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Client"
          component={ClientList}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Tela"
          component={BottomNavegator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
