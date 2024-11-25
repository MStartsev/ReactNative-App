import React, { useState } from "react";
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
import { Feather } from "@expo/vector-icons";
import { COLORS, FONTS } from "@/constants/theme";
import { Comment, CommentsScreenProps } from "@/types/comments";
import { Dimensions } from "react-native";
import { opacity } from "react-native-reanimated/lib/typescript/Colors";

const { width } = Dimensions.get("window");

const mockComments: Record<string, Comment[]> = {
  "1": [
    {
      id: "1",
      userId: "user1",
      userAvatar: require("@/assets/images/man.jpg"),
      postId: "1",
      text: "Really love your most recent photo. I've been trying to capture the same thing for a few months and would love some tips!",
      date: "09 червня, 2020 | 08:40",
    },
    {
      id: "2",
      userId: "currentUser",
      userAvatar: require("@/assets/images/avatar.jpg"),
      postId: "1",
      text: "A fast 50mm like f1.8 would help with the bokeh. I've been using primes as they tend to get a bit sharper images.",
      date: "09 червня, 2020 | 09:14",
    },
    {
      id: "3",
      userId: "user1",
      userAvatar: require("@/assets/images/man.jpg"),
      postId: "1",
      text: "Thank you! That was very helpful!",
      date: "09 червня, 2020 | 09:20",
    },
  ],
  "2": [
    {
      id: "1",
      userId: "user2",
      userAvatar: require("@/assets/images/woman.jpg"),
      postId: "2",
      text: "Чудовий захід сонця! Де це знято?",
      date: "10 червня, 2020 | 15:20",
    },
  ],
  "3": [
    {
      id: "1",
      userId: "user3",
      userAvatar: require("@/assets/images/user1.jpg"),
      postId: "3",
      text: "Дуже атмосферне місце!",
      date: "11 червня, 2020 | 12:35",
    },
  ],
};

export default function CommentsScreen({
  isVisible,
  onClose,
  postId,
  postImage,
}: CommentsScreenProps) {
  const [comment, setComment] = useState("");
  const currentUserId = "currentUser";

  const handleSubmit = () => {
    if (comment.trim()) {
      const newComment: Comment = {
        id: Date.now().toString(),
        userId: currentUserId,
        userAvatar: require("@/assets/images/avatar.jpg"),
        postId,
        text: comment,
        date: new Date().toLocaleString("uk-UA", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      console.log("New comment:", newComment);
      setComment("");
      Keyboard.dismiss();
    }
  };

  const renderComment = ({ item }: { item: Comment }) => {
    const isOwnComment = item.userId === currentUserId;

    return (
      <View
        style={[
          styles.commentContainer,
          isOwnComment ? styles.ownComment : styles.otherComment,
        ]}
      >
        {!isOwnComment && (
          <Image source={item.userAvatar} style={styles.avatar} />
        )}
        <View style={styles.commentContent}>
          <View
            style={[
              styles.commentBubble,
              isOwnComment ? styles.ownBubble : styles.otherBubble,
            ]}
          >
            <Text style={styles.commentText}>{item.text}</Text>
            <Text style={styles.commentDate}>{item.date}</Text>
          </View>
        </View>
        {isOwnComment && (
          <Image
            source={require("@/assets/images/avatar.jpg")}
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
            <Image source={postImage} style={styles.postImage} />
            <FlatList
              data={mockComments[postId]}
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
    height: width * 0.64,
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
});
