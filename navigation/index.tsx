import "react-native-gesture-handler";
import React from "react";
import { Dimensions, StatusBar, StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "@/app/screens/LoginScreen";
import RegistrationScreen from "@/app/screens/RegistrationScreen";
import MainNavigator from "./MainNavigator";
import { statusBarHeight } from "@/constants/theme";
import { RootStackParamList } from "@/types/navigation";

const Stack = createStackNavigator<RootStackParamList>();
const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function Navigation() {
  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="RegistrationScreen"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen
            name="RegistrationScreen"
            component={RegistrationScreen}
          />
          <Stack.Screen name="Home" component={MainNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "100%",
    height: SCREEN_HEIGHT + statusBarHeight,
    backgroundColor: "#FF00FF",
  },
});
