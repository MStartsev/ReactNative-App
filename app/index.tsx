import React from "react";
import { View } from "react-native";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_500Medium,
} from "@expo-google-fonts/roboto";

import Navigation from "@/navigation";
// import RegistrationScreen from "./screens/RegistrationScreen";
// import LoginScreen from "./screens/LoginScreen";

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
  });

  if (!fontsLoaded) {
    return <View />;
  }

  return <Navigation />;
  // return <LoginScreen />;
}
