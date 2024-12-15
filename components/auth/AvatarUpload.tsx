import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";

interface AvatarUploadProps {
  onPress: () => void;
  avatarUri?: string;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  onPress,
  avatarUri,
}) => {
  return (
    <View style={styles.photoContainer}>
      <View style={styles.photoPlaceholder}>
        {avatarUri && (
          <Image
            source={{ uri: avatarUri }}
            style={styles.avatarImage}
            resizeMode="cover"
          />
        )}
      </View>
      <TouchableOpacity
        style={[
          styles.addPhotoButton,
          avatarUri ? styles.removePhotoButton : null,
        ]}
        onPress={onPress}
      >
        <AntDesign
          name={avatarUri ? "closecircleo" : "pluscircleo"}
          size={25}
          color={avatarUri ? "#E8E8E8" : COLORS.primary}
        />
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
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  addPhotoButton: {
    position: "absolute",
    right: -12.5,
    bottom: 14,
    backgroundColor: COLORS.background,
    borderRadius: 50,
  },
  removePhotoButton: {
    transform: [{ rotate: "45deg" }],
  },
});
