import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Modal,
  Dimensions,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { Header } from "@/components/common/Header";
import { COLORS, FONTS, SIZES } from "@/constants/theme";
import {
  CameraView,
  CameraType,
  useCameraPermissions,
  Camera,
} from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { RootState } from "@/redux/store";
import { addPost, setError } from "@/redux/posts/postsSlice";
import { createPost } from "@/services/posts";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function CreatePostsScreen() {
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [locationPermission, requestLocationPermission] =
    Location.useForegroundPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  useEffect(() => {
    (async () => {
      const permissions = await Promise.all([
        Camera.getCameraPermissionsAsync(),
        Location.getForegroundPermissionsAsync(),
      ]);

      const [cameraStatus, locationStatus] = permissions;

      if (!cameraStatus.granted || !locationStatus.granted) {
        try {
          await requestAllPermissions();
        } catch (error) {
          console.log("Error requesting permissions:", error);
        }
      }
    })();
  }, []);

  const requestAllPermissions = async () => {
    try {
      await Promise.all([requestPermission(), requestLocationPermission()]);
    } catch (error) {
      console.log("Error requesting permissions:", error);
    }
  };

  async function handleCapture() {
    if (cameraRef.current) {
      try {
        const result = await cameraRef.current.takePictureAsync();
        if (result?.uri) {
          setPhoto(result.uri);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const resetPhoto = () => {
    setPhoto(null);
  };

  const getCurrentLocation = async () => {
    try {
      if (!locationPermission?.granted) {
        Alert.alert("Помилка", "Немає доступу до геолокації");
        return null;
      }

      const location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address[0]) {
        const { city, country } = address[0];
        return city && country
          ? `${city}, ${country}`
          : country || city || null;
      }
      return null;
    } catch (error) {
      console.log("Error getting location:", error);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!photo || !title) {
      Alert.alert("Помилка", "Додайте фото та назву");
      return;
    }

    setIsSubmitting(true);
    try {
      let finalLocation = location;
      if (!location) {
        const currentLocation = await getCurrentLocation();
        if (currentLocation) {
          finalLocation = currentLocation;
          setLocation(currentLocation);
        } else {
          throw new Error("Не вдалося визначити місцезнаходження");
        }
      }

      // Конвертуємо фото в blob
      const response = await fetch(photo);
      const blob = await response.blob();

      // Створюємо пост
      const postData = {
        imageBlob: blob,
        title,
        location: finalLocation,
      };

      if (user) {
        const newPost = await createPost(
          user.id,
          user.login,
          user.avatar,
          postData
        );
        // Додаємо новий пост до Redux store
        dispatch(addPost(newPost));

        // Очищення форми
        setPhoto(null);
        setTitle("");
        setLocation("");

        // Перенаправлення на PostsScreen
        navigation.navigate("Posts" as never);
      }
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setError(error.message));
        Alert.alert("Помилка", error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!permission || !locationPermission) return <View />;

  if (!permission.granted || !locationPermission.granted) {
    return (
      <View style={styles.container}>
        <Header title="Створити публікацію" />
        <View style={styles.content}>
          <View style={styles.permissionsContainer}>
            <Text style={styles.message}>
              Для використання цих функцій додатка потрібен дозвіл на доступ до
              Вашої камери та геолокації
            </Text>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={requestAllPermissions}
            >
              <Text style={styles.submitButtonText}>Надати доступ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Створити публікацію" />
      <View style={styles.content}>
        <View style={styles.photoContainer}>
          <View style={styles.photoPlaceholder}>
            {photo ? (
              <View
                style={{ width: "100%", height: "100%", position: "relative" }}
              >
                <Image source={{ uri: photo }} style={styles.photo} />
                <TouchableOpacity
                  style={styles.expandButton}
                  onPress={toggleFullScreen}
                  activeOpacity={0.7}
                >
                  <Feather name="maximize-2" size={24} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={{ width: "100%", height: "100%", position: "relative" }}
              >
                <CameraView
                  ref={cameraRef}
                  style={styles.camera}
                  facing={facing}
                >
                  <View style={styles.cameraContent}>
                    <TouchableOpacity
                      style={styles.addPhotoButton}
                      onPress={handleCapture}
                    >
                      <Feather
                        name="camera"
                        size={24}
                        color={COLORS.text.secondary}
                      />
                    </TouchableOpacity>
                  </View>
                </CameraView>
                <TouchableOpacity
                  style={styles.expandButton}
                  onPress={toggleFullScreen}
                  activeOpacity={0.7}
                >
                  <Feather name="maximize-2" size={24} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <TouchableOpacity onPress={photo ? resetPhoto : pickImage}>
            <Text style={styles.photoText}>
              {photo ? "Зробити нове фото" : "Завантажте фото"}
            </Text>
          </TouchableOpacity>
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
            (!photo || !title || isSubmitting) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!photo || !title || isSubmitting}
        >
          <Text
            style={[
              styles.submitButtonText,
              (!photo || !title || isSubmitting) &&
                styles.submitButtonTextDisabled,
            ]}
          >
            {isSubmitting ? "Публікація..." : "Опубліковати"}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isFullScreen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsFullScreen(false)}
      >
        <View style={styles.fullScreenContainer}>
          <TouchableOpacity
            style={styles.closeFullScreenButton}
            onPress={() => setIsFullScreen(false)}
          >
            <Feather name="x" size={24} color="white" />
          </TouchableOpacity>
          {photo ? (
            <Image
              source={{ uri: photo }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          ) : (
            <CameraView
              ref={cameraRef}
              style={styles.fullScreenCamera}
              facing={facing}
            >
              <View style={styles.fullScreenCameraContent}>
                <TouchableOpacity
                  style={styles.fullScreenCaptureButton}
                  onPress={handleCapture}
                >
                  <Feather
                    name="camera"
                    size={32}
                    color={COLORS.text.secondary}
                  />
                </TouchableOpacity>
              </View>
            </CameraView>
          )}
        </View>
      </Modal>
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
  permissionsContainer: {
    flex: 1,
    paddingTop: "24%",
    paddingHorizontal: 16,
  },
  message: {
    textAlign: "center",
    paddingHorizontal: 16,
    paddingBottom: 24,
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: COLORS.text.primary,
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
    position: "relative",
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  photo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  addPhotoButtonWithPhoto: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  cameraContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addPhotoButton: {
    width: 60,
    height: 60,
    backgroundColor: COLORS.background,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    zIndex: 1,
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
    color: COLORS.text.primary,
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
  expandButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(9, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  closeFullScreenButton: {
    position: "absolute",
    top: 44,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  fullScreenCamera: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  fullScreenCameraContent: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 50,
  },
  fullScreenCaptureButton: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.background,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
