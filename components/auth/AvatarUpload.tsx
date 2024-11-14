import React from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";

interface AvatarUploadProps {
  onPress: () => void;
  avatarUrl?: string;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  onPress,
  avatarUrl,
}) => {
  return (
    <View style={styles.photoContainer}>
      <View style={styles.photoPlaceholder}></View>
      <TouchableOpacity style={styles.addPhotoButton} onPress={onPress}>
        <AntDesign name="pluscircleo" size={25} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  photoContainer: {
    position: "absolute",
    top: -60,
    left: Dimensions.get("window").width / 2 - 60,
    zIndex: 1,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: COLORS.input.background,
    borderRadius: 16,
  },
  addPhotoButton: {
    position: "absolute",
    right: -12.5,
    bottom: 14,
    backgroundColor: COLORS.background,
    borderRadius: 50,
  },
});
