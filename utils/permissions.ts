import { Platform, PermissionsAndroid } from "react-native";

export const requestCameraPermission = async () => {
  if (Platform.OS === "android") {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Доступ до камери",
          message: "Додаток потребує доступу до камери для створення фото",
          buttonNeutral: "Запитати пізніше",
          buttonNegative: "Відмінити",
          buttonPositive: "OK",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
};

export const requestLocationPermission = async () => {
  if (Platform.OS === "android") {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Доступ до геолокації",
          message:
            "Додаток потребує доступу до геолокації для визначення місця фото",
          buttonNeutral: "Запитати пізніше",
          buttonNegative: "Відмінити",
          buttonPositive: "OK",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
};
