export interface Post {
  id: string;
  userId: string;
  image: any;
  title: string;
  location: string;
  comments: number;
  likes: number;
  createdAt: string;
}

export interface PostFormData {
  image: string;
  title: string;
  location: string;
}
