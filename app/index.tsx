import React from "react";
import { View } from "react-native";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_500Medium,
} from "@expo-google-fonts/roboto";
import Registration from "./screens/Registration";
import Login from "./screens/Login";

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
  });

  if (!fontsLoaded) {
    return <View />;
  }

  // return <Registration />;
  return <Login />;
}
