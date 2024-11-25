import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Header } from "@/components/common/Header";
import { COLORS, FONTS, SIZES } from "@/constants/theme";

export default function CreatePostsScreen() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = () => {
    console.log("New post:", { photo, title, location });
  };

  return (
    <View style={styles.container}>
      <Header title="Створити публікацію" />

      <View style={styles.content}>
        <View style={styles.photoContainer}>
          <View style={styles.photoPlaceholder}>
            {photo ? (
              <Image source={{ uri: photo }} style={styles.photo} />
            ) : null}
            <TouchableOpacity
              style={[
                styles.addPhotoButton,
                photo ? styles.addPhotoButtonWithPhoto : null,
              ]}
              onPress={() => console.log("Take photo")}
            >
              <Feather
                name="camera"
                size={24}
                color={photo ? COLORS.text.primary : COLORS.text.secondary}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.photoText}>
            {photo ? "Редагувати фото" : "Завантажте фото"}
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Назва..."
              value={title}
              onChangeText={setTitle}
              placeholderTextColor={COLORS.input.placeholderText}
            />
          </View>

          <View style={styles.inputContainer}>
            <Feather
              name="map-pin"
              size={24}
              color={COLORS.input.placeholderText}
              style={styles.locationIcon}
            />
            <TextInput
              style={[styles.input, styles.locationInput]}
              placeholder="Місцевість..."
              value={location}
              onChangeText={setLocation}
              placeholderTextColor={COLORS.input.placeholderText}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            (!photo || !title || !location) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!photo || !title || !location}
        >
          <Text
            style={[
              styles.submitButtonText,
              (!photo || !title || !location) &&
                styles.submitButtonTextDisabled,
            ]}
          >
            Опубліковати
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  photoContainer: {
    marginBottom: 32,
  },
  photoPlaceholder: {
    height: 240,
    backgroundColor: COLORS.input.background,
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  addPhotoButton: {
    width: 60,
    height: 60,
    backgroundColor: COLORS.background,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  addPhotoButtonWithPhoto: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  photoText: {
    fontSize: 16,
    color: COLORS.input.placeholderText,
    fontFamily: FONTS.regular,
  },
  form: {
    gap: 16,
    marginBottom: 32,
  },
  inputContainer: {
    position: "relative",
  },
  input: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.input.border,
    fontFamily: FONTS.regular,
    fontSize: 16,
  },
  locationInput: {
    paddingLeft: 28,
  },
  locationIcon: {
    position: "absolute",
    left: 0,
    top: 13,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    height: SIZES.input.height,
    borderRadius: SIZES.borderRadius.button,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.input.background,
  },
  submitButtonText: {
    color: COLORS.background,
    fontSize: SIZES.text.button,
    fontFamily: FONTS.regular,
  },
  submitButtonTextDisabled: {
    color: COLORS.input.placeholderText,
  },
});
