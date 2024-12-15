import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Modal,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { COLORS, FONTS } from "@/constants/theme";
import { RootState } from "@/redux/store";
import { updatePostComments } from "@/redux/posts/postsSlice";
import { Dimensions } from "react-native";
import {
  addComment as addCommentToDb,
  getPostComments,
  Comment as CommentType,
} from "@/services/comments";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

interface CommentsScreenProps {
  isVisible: boolean;
  onClose: () => void;
  postId: string;
  postImage: string;
}

export default function CommentsScreen({
  isVisible,
  onClose,
  postId,
  postImage,
}: CommentsScreenProps) {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (isVisible) {
      loadComments();
    }
  }, [isVisible]);

  const loadComments = async () => {
    try {
      const postComments = await getPostComments(postId);
      setComments(postComments);

      dispatch(
        updatePostComments({
          postId,
          commentsCount: postComments.length,
        })
      );
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  };

  const handleSubmit = async () => {
    if (!user || !comment.trim()) return;

    try {
      const newComment = await addCommentToDb(postId, {
        userId: user.id,
        userName: user.login,
        userAvatar: user.avatar,
        text: comment.trim(),
      });

      setComments((prev) => [...prev, newComment]);
      dispatch(
        updatePostComments({
          postId,
          commentsCount: comments.length + 1,
        })
      );

      setComment("");
      Keyboard.dismiss();

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 300);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const renderComment = ({ item }: { item: CommentType }) => {
    const isOwnComment = item.userId === user?.id;

    return (
      <View
        style={[
          styles.commentContainer,
          isOwnComment ? styles.ownComment : styles.otherComment,
        ]}
      >
        {!isOwnComment && (
          <Image
            source={
              item.userAvatar
                ? { uri: item.userAvatar }
                : require("@/assets/images/avatar.jpg")
            }
            style={styles.avatar}
          />
        )}
        <View style={styles.commentContent}>
          <View
            style={[
              styles.commentBubble,
              isOwnComment ? styles.ownBubble : styles.otherBubble,
            ]}
          >
            <Text style={styles.userName}>{item.userName}</Text>
            <Text style={styles.commentText}>{item.text}</Text>
            <Text style={styles.commentDate}>
              {new Date(item.createdAt).toLocaleString("uk-UA", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        </View>
        {isOwnComment && (
          <Image
            source={
              user.avatar
                ? { uri: user.avatar }
                : require("@/assets/images/avatar.jpg")
            }
            style={styles.avatar}
          />
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Feather
                name="arrow-left"
                size={24}
                color={COLORS.text.primary}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Коментарі</Text>
          </View>

          <View style={styles.content}>
            <TouchableOpacity onPress={toggleFullScreen}>
              <Image source={{ uri: postImage }} style={styles.postImage} />
            </TouchableOpacity>
            <FlatList
              ref={flatListRef}
              data={comments}
              renderItem={renderComment}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.commentsList}
            />
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
            style={styles.inputContainer}
          >
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Коментувати..."
                value={comment}
                onChangeText={setComment}
                placeholderTextColor={COLORS.input.placeholderText}
                multiline
              />
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  !comment.trim() && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={!comment.trim()}
              >
                <Feather
                  name="arrow-up"
                  size={24}
                  color={
                    comment.trim()
                      ? COLORS.background
                      : COLORS.input.placeholderText
                  }
                />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>

      <Modal
        visible={isFullScreen}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
        onRequestClose={() => setIsFullScreen(false)}
      >
        <View style={styles.fullScreenContainer}>
          <TouchableOpacity
            style={styles.closeFullScreenButton}
            onPress={() => setIsFullScreen(false)}
          >
            <Feather name="x" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.fullScreenImageContainer}
            onPress={() => setIsFullScreen(false)}
          >
            <Image
              source={{ uri: postImage }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    height: 88,
    paddingTop: 44,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.input.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: FONTS.medium,
    color: COLORS.text.primary,
  },
  closeButton: {
    position: "absolute",
    left: 16,
    bottom: 10,
    padding: 8,
  },
  content: {
    flex: 1,
  },
  postImage: {
    width: "91.5%",
    height: SCREEN_WIDTH * 0.64,
    marginHorizontal: "auto",
    marginVertical: 32,
    borderRadius: 8,
  },
  commentsList: {
    paddingHorizontal: 16,
  },
  commentContainer: {
    flexDirection: "row",
    marginBottom: 24,
    alignItems: "flex-start",
    gap: 16,
  },
  ownComment: {
    justifyContent: "flex-end",
  },
  otherComment: {
    justifyContent: "flex-start",
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  commentContent: {
    flex: 1,
    maxWidth: "70%",
  },
  commentBubble: {
    padding: 16,
    backgroundColor: COLORS.input.background,
    borderRadius: 6,
  },
  ownBubble: {
    borderTopLeftRadius: 6,
    borderTopRightRadius: 0,
  },
  otherBubble: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 6,
  },
  userName: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  commentText: {
    color: COLORS.text.primary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
    fontFamily: FONTS.regular,
  },
  commentDate: {
    color: COLORS.input.placeholderText,
    fontSize: 10,
    textAlign: "right",
    fontFamily: FONTS.regular,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.input.border,
    padding: 16,
  },
  inputWrapper: {
    position: "relative",
    width: "100%",
  },
  input: {
    backgroundColor: COLORS.input.background,
    borderWidth: 1,
    borderColor: COLORS.input.border,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingRight: 50,
    minHeight: 50,
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: COLORS.text.primary,
  },
  submitButton: {
    position: "absolute",
    right: 8,
    top: 8,
    width: 34,
    height: 34,
    backgroundColor: COLORS.primary,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.input.background,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImageContainer: {
    flex: 1,
    width: "100%",
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
});
