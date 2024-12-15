import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Modal,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS, FONTS } from "@/constants/theme";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import CommentsScreen from "./CommentsScreen";
import MapScreen from "./MapScreen";
import { LocationData } from "@/types/location";
import { RootState } from "@/redux/store";
import { setUserPosts, togglePostLike } from "@/redux/posts/postsSlice";
import { getUserPosts, toggleLike, Post } from "@/services/posts";
import { getCoordinates } from "@/services/geocoding";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";

type NavigationProp = StackNavigationProp<RootStackParamList>;

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const userPosts = useSelector((state: RootState) => state.posts.userPosts);

  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    null
  );

  useEffect(() => {
    if (user && isFocused) {
      loadUserPosts();
    }
  }, [user, isFocused]);

  const loadUserPosts = async () => {
    try {
      if (user) {
        const posts = await getUserPosts(user.id);
        dispatch(setUserPosts(posts));
      }
    } catch (error) {
      console.error("Error loading user posts:", error);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      if (user) {
        await toggleLike(postId, user.id);
        dispatch(togglePostLike({ postId, userId: user.id }));
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleComments = (post: Post) => {
    setSelectedPost(post);
    setIsCommentsVisible(true);
  };

  const handleLocation = async (location: string) => {
    const coordinates = await getCoordinates(location);
    if (coordinates) {
      setSelectedLocation({
        ...coordinates,
        title: location,
      });
      setIsMapVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/mountains-bg.jpg")}
        style={styles.backgroundImage}
      >
        <ScrollView>
          <View style={styles.profileWrapper}>
            <View style={styles.profileContainer}>
              <View style={styles.avatarContainer}>
                <Image
                  source={
                    user?.avatar
                      ? { uri: user.avatar }
                      : require("@/assets/images/avatar.jpg")
                  }
                  style={styles.avatar}
                />
              </View>

              <TouchableOpacity
                style={styles.logoutButton}
                onPress={() => navigation.navigate("LoginScreen" as never)}
              >
                <Feather name="log-out" size={24} color={COLORS.grey} />
              </TouchableOpacity>

              <Text style={styles.username}>{user?.login || "User"}</Text>

              <View style={styles.postsContainer}>
                {userPosts.map((post) => (
                  <View key={post.id} style={styles.post}>
                    <TouchableOpacity
                      style={styles.imageContainer}
                      onPress={() => handleComments(post)}
                    >
                      <Image
                        source={{ uri: post.image }}
                        style={styles.postImage}
                      />
                    </TouchableOpacity>
                    <Text style={styles.postTitle}>{post.title}</Text>
                    <View style={styles.postInfo}>
                      <View style={styles.postStats}>
                        <TouchableOpacity
                          style={styles.statsItem}
                          onPress={() => handleComments(post)}
                        >
                          <Feather
                            name="message-circle"
                            size={24}
                            color={COLORS.primary}
                          />
                          <Text style={styles.statsText}>
                            {post.commentsCount || 0}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.statsItem}
                          onPress={() => handleLike(post.id)}
                        >
                          <Feather
                            name="thumbs-up"
                            size={24}
                            color={
                              post.likes?.[user?.id || ""]
                                ? COLORS.primary
                                : COLORS.grey
                            }
                          />
                          <Text style={styles.statsText}>
                            {Object.keys(post.likes || {}).length}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity
                        style={styles.locationContainer}
                        onPress={() => handleLocation(post.location)}
                      >
                        <Feather
                          name="map-pin"
                          size={24}
                          color={COLORS.text.primary}
                        />
                        <Text style={styles.locationText}>{post.location}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>

      {selectedPost && (
        <CommentsScreen
          isVisible={isCommentsVisible}
          onClose={() => {
            setIsCommentsVisible(false);
            setSelectedPost(null);
          }}
          postId={selectedPost.id}
          postImage={selectedPost.image}
        />
      )}

      {selectedLocation && (
        <Modal
          visible={isMapVisible}
          animationType="slide"
          transparent={true}
          statusBarTranslucent={true}
          onRequestClose={() => setIsMapVisible(false)}
        >
          <MapScreen
            location={selectedLocation}
            onClose={() => {
              setIsMapVisible(false);
              setSelectedLocation(null);
            }}
          />
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  profileWrapper: {
    marginTop: 147,
    minHeight: SCREEN_HEIGHT - 147,
  },
  profileContainer: {
    position: "relative",
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 16,
    paddingTop: 92,
    paddingBottom: 43,
    minHeight: SCREEN_HEIGHT - 147,
  },
  avatarContainer: {
    position: "absolute",
    top: -60,
    alignSelf: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 16,
  },
  avatarButton: {
    position: "absolute",
    right: -12.5,
    top: 81,
    backgroundColor: COLORS.background,
    borderRadius: 50,
  },
  logoutButton: {
    position: "absolute",
    right: 16,
    top: 22,
    color: COLORS.grey,
  },
  username: {
    fontSize: 30,
    lineHeight: 35,
    textAlign: "center",
    fontFamily: FONTS.medium,
    color: COLORS.text.primary,
    marginBottom: 33,
  },
  postsContainer: {
    gap: 32,
  },
  post: {
    gap: 8,
  },
  imageContainer: {
    width: "100%",
    height: 240,
    borderRadius: 8,
    overflow: "hidden",
  },
  postImage: {
    width: "100%",
    height: "100%",
  },
  postTitle: {
    fontSize: 16,
    lineHeight: 19,
    fontFamily: FONTS.medium,
    color: COLORS.text.primary,
  },
  postInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  postStats: {
    flexDirection: "row",
    gap: 24,
  },
  statsItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statsText: {
    fontSize: 16,
    color: COLORS.text.primary,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 16,
    color: COLORS.text.primary,
    textDecorationLine: "underline",
  },
});
