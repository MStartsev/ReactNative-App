import { ImageSourcePropType } from "react-native";

export interface Comment {
  id: string;
  userId: string;
  userAvatar: ImageSourcePropType;
  postId: string;
  text: string;
  date: string;
}

export interface CommentsScreenProps {
  isVisible: boolean;
  onClose: () => void;
  postId: string;
  postImage: any;
}
