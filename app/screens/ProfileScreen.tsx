import React, { useState } from "react";
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
import { useNavigation } from "@react-navigation/native";
import CommentsScreen from "./CommentsScreen";
import MapScreen from "./MapScreen";
import { Post } from "@/types/posts";
import { getCoordinates } from "@/services/geocoding";
import { LocationData } from "@/types/location";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    null
  );
  const [selectedPost, setSelectedPost] = useState<{
    id: string;
    image: any;
  } | null>(null);

  const [posts] = useState<Post[]>([
    {
      id: "1",
      userId: "1234567890",
      image: require("@/assets/images/forest.jpg"),
      title: "Ліс",
      location: "Славське, Україна",
      comments: 8,
      likes: 153,
      createdAt: "",
    },
    {
      id: "2",
      userId: "1234567890",
      image: require("@/assets/images/sunset.jpg"),
      title: "Захід на Чорному морі",
      location: "Бухта Ласпі, Україна",
      comments: 3,
      likes: 200,
      createdAt: "",
    },
    {
      id: "3",
      userId: "1234567890",
      image: require("@/assets/images/lodge.jpg"),
      title: "Старий будиночок у Венеції",
      location: "Венеція, Італія",
      comments: 50,
      likes: 200,
      createdAt: "",
    },
  ]);

  const handleCommentsPress = (postId: string, postImage: any) => {
    setSelectedPost({ id: postId, image: postImage });
    setIsCommentsVisible(true);
  };

  const handleLocationPress = async (location: string) => {
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
                  source={require("@/assets/images/avatar.jpg")}
                  style={styles.avatar}
                />
                <TouchableOpacity
                  style={styles.avatarButton}
                  onPress={() => console.log("Change avatar")}
                >
                  <Feather
                    name="x-circle"
                    size={25}
                    color={COLORS.input.placeholderText}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.logoutButton}
                onPress={() => navigation.navigate("LoginScreen" as never)}
              >
                <Feather name="log-out" size={24} color={COLORS.grey} />
              </TouchableOpacity>

              <Text style={styles.username}>Natali Romanova</Text>

              <View style={styles.postsContainer}>
                {posts.map((post) => (
                  <View key={post.id} style={styles.post}>
                    <View style={styles.imageContainer}>
                      <Image source={post.image} style={styles.postImage} />
                    </View>
                    <Text style={styles.postTitle}>{post.title}</Text>
                    <View style={styles.postInfo}>
                      <View style={styles.postStats}>
                        <TouchableOpacity
                          style={styles.statsItem}
                          onPress={() =>
                            handleCommentsPress(post.id, post.image)
                          }
                        >
                          <Feather
                            name="message-circle"
                            size={24}
                            color={COLORS.primary}
                          />
                          <Text style={styles.statsText}>{post.comments}</Text>
                        </TouchableOpacity>
                        <View style={styles.statsItem}>
                          <Feather
                            name="thumbs-up"
                            size={24}
                            color={COLORS.primary}
                          />
                          <Text style={styles.statsText}>{post.likes}</Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={styles.locationContainer}
                        onPress={() => handleLocationPress(post.location)}
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
          onClose={() => setIsCommentsVisible(false)}
          postId={selectedPost.id}
          postImage={selectedPost.image}
        />
      )}

      <Modal
        visible={isMapVisible}
        animationType="slide"
        transparent={true}
        statusBarTranslucent={true}
        onRequestClose={() => setIsMapVisible(false)}
      >
        {selectedLocation && (
          <MapScreen
            location={selectedLocation}
            onClose={() => setIsMapVisible(false)}
          />
        )}
      </Modal>
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
