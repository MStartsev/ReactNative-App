import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { COLORS, FONTS } from "@/constants/theme";

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const navigation = useNavigation();
  const route = useRoute();

  const isHomeScreen = route.name === "Posts";

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        {!isHomeScreen && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
        {isHomeScreen && (
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => navigation.navigate("LoginScreen" as never)}
          >
            <Feather name="log-out" size={24} color={COLORS.grey} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 88,
    paddingTop: 44,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.input.border,
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    position: "relative",
  },
  title: {
    fontSize: 17,
    fontFamily: FONTS.medium,
    color: COLORS.text.primary,
    lineHeight: 22,
  },
  backButton: {
    position: "absolute",
    left: 16,
    height: "100%",
    justifyContent: "center",
  },
  logoutButton: {
    position: "absolute",
    right: 16,
    height: "100%",
    justifyContent: "center",
  },
});
