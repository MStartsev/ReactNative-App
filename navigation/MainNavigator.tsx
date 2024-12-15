import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import PostsScreen from "@/app/screens/PostsScreen";
import CreatePostsScreen from "@/app/screens/CreatePostsScreen";
import ProfileScreen from "@/app/screens/ProfileScreen";
import { COLORS } from "@/constants/theme";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import {
  getFocusedRouteNameFromRoute,
  useRoute,
  ParamListBase,
  TabNavigationState,
} from "@react-navigation/native";
import {
  BottomTabDescriptorMap,
  BottomTabNavigationEventMap,
} from "@react-navigation/bottom-tabs/lib/typescript/src/types";
import { NavigationHelpers } from "@react-navigation/native";

interface CustomTabBarProps {
  state: TabNavigationState<ParamListBase>;
  descriptors: BottomTabDescriptorMap;
  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>;
}

export type MainTabParamList = {
  Posts: undefined;
  Profile: undefined;
  CreatePost: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const CustomTabBar: React.FC<CustomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const route = useRoute();
  const routeName = getFocusedRouteNameFromRoute(route) ?? "Posts";
  const isCreatePostScreen = routeName === "CreatePost";
  const isProfileScreen = routeName === "Profile";

  if (isCreatePostScreen) {
    return (
      <View style={[styles.tabBar, styles.createPostTabBar]}>
        <TouchableOpacity
          style={styles.trashButton}
          onPress={() => navigation.navigate("Posts")}
        >
          <Feather name="trash-2" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
      </View>
    );
  }

  if (isProfileScreen) {
    return (
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate("Posts")}
        >
          <Feather name="grid" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.tab}>
          <View style={styles.addButton}>
            <Feather name="user" size={24} color={COLORS.background} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate("CreatePost")}
        >
          <Feather name="plus" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.tabBar}>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate("Posts")}
      >
        <Feather name="grid" size={24} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate("CreatePost")}
      >
        <View style={styles.addButton}>
          <Feather name="plus" size={24} color={COLORS.background} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate("Profile")}
      >
        <Feather name="user" size={24} color={COLORS.text.primary} />
      </TouchableOpacity>
    </View>
  );
};

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Posts" component={PostsScreen} />
      <Tab.Screen name="CreatePost" component={CreatePostsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    height: 83,
    paddingTop: 9,
    paddingHorizontal: 82,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.input.border,
  },
  createPostTabBar: {
    justifyContent: "center",
    paddingHorizontal: 0,
  },
  tab: {
    flex: 1,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    width: 70,
    height: 40,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  trashButton: {
    width: 70,
    height: 40,
    backgroundColor: COLORS.input.background,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
