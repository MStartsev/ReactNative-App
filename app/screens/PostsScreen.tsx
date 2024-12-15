import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { COLORS, FONTS } from "@/constants/theme";
import { Header } from "@/components/common/Header";
import { RootState } from "@/redux/store";
import { setPosts, togglePostLike } from "@/redux/posts/postsSlice";
import { getAllPosts, toggleLike } from "@/services/posts";
import { Post } from "@/services/posts";
import CommentsScreen from "./CommentsScreen";
import MapScreen from "./MapScreen";
import { getCoordinates } from "@/services/geocoding";
import { LocationData } from "@/types/location";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function PostsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const posts = useSelector((state: RootState) => state.posts.allPosts);
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    null
  );

  useEffect(() => {
    if (isFocused) {
      loadPosts();
    }
  }, [isFocused]);

  const loadPosts = async () => {
    try {
      const allPosts = await getAllPosts();
      dispatch(setPosts(allPosts));
    } catch (error) {
      console.error("Error loading posts:", error);
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

  const renderPost = ({ item }: { item: Post }) => {
    const likesCount = item.likes ? Object.keys(item.likes).length : 0;
    const isLiked = user ? !!item.likes?.[user.id] : false;

    return (
      <View style={styles.post}>
        <View style={styles.postHeader}>
          <Image source={{ uri: item.userAvatar }} style={styles.userAvatar} />
          <Text style={styles.userName}>{item.userName}</Text>
        </View>
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={() => handleComments(item)}
        >
          <Image source={{ uri: item.image }} style={styles.postImage} />
        </TouchableOpacity>
        <Text style={styles.postTitle}>{item.title}</Text>
        <View style={styles.postInfo}>
          <View style={styles.postStats}>
            <TouchableOpacity
              style={styles.statsItem}
              onPress={() => handleComments(item)}
            >
              <Feather name="message-circle" size={24} color={COLORS.primary} />
              <Text style={styles.statsText}>{item.commentsCount || 0}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.statsItem}
              onPress={() => handleLike(item.id)}
            >
              <Feather
                name="thumbs-up"
                size={24}
                color={isLiked ? COLORS.primary : COLORS.grey}
              />
              <Text style={styles.statsText}>{likesCount}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.locationContainer}
            onPress={() => handleLocation(item.location)}
          >
            <Feather name="map-pin" size={24} color={COLORS.text.primary} />
            <Text style={styles.locationText}>{item.location}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Публікації" />
      <View style={styles.userInfo}>
        <Image
          source={
            user?.avatar
              ? { uri: user.avatar }
              : require("@/assets/images/avatar.jpg")
          }
          style={styles.avatar}
        />
        <View style={styles.textContainer}>
          <Text style={styles.userName}>{user?.login}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>
      </View>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.postsContainer}
      />

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
  postsContainer: {
    padding: 16,
    gap: 32,
  },
  post: {
    gap: 8,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
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
