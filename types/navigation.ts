import { NavigatorScreenParams } from "@react-navigation/native";

export type MainTabParamList = {
  Posts: undefined;
  CreatePost: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  LoginScreen: undefined;
  RegistrationScreen: undefined;
  Home: NavigatorScreenParams<MainTabParamList>;
  Comments: {
    postId: string;
    postImage: any;
  };
  Map: {
    latitude: number;
    longitude: number;
    title: string;
  };
};
