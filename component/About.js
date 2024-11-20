import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import ClientList from "./ClientList";
import FormClient from "./FormClient";
import Home from "./Home";
import Settings from "./Settings";
import EquipmentSettings from "./EquipmentSettings";
import PlaceForm from "./PlaceForm";
const Drawer = createDrawerNavigator();

export default function About() {
  return (
    <View>
      <PlaceForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
