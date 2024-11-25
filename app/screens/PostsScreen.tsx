import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { COLORS, FONTS } from "@/constants/theme";
import { Header } from "@/components/common/Header";

export default function PostsScreen() {
  return (
    <View style={styles.container}>
      <Header title="Публікації" />
      <View style={styles.userInfo}>
        <Image
          source={require("@/assets/images/avatar.jpg")}
          style={styles.avatar}
        />
        <View style={styles.textContainer}>
          <Text style={styles.userName}>Natali Romanova</Text>
          <Text style={styles.userEmail}>email@example.com</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 16,
    marginRight: 8,
  },
  textContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 13,
    lineHeight: 15.23,
    fontFamily: FONTS.medium,
    color: COLORS.text.primary,
  },
  userEmail: {
    fontSize: 11,
    lineHeight: 12.89,
    fontFamily: FONTS.regular,
    color: COLORS.input.placeholderText,
  },
});
