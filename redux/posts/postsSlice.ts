import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Post } from "@/services/posts";

interface PostsState {
  userPosts: Post[];
  allPosts: Post[];
  isLoading: boolean;
  error: string | null;
}

const initialState: PostsState = {
  userPosts: [],
  allPosts: [],
  isLoading: false,
  error: null,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.allPosts = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setUserPosts: (state, action: PayloadAction<Post[]>) => {
      state.userPosts = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addPost: (state, action: PayloadAction<Post>) => {
      state.allPosts.push(action.payload);
      if (action.payload.userId === state.userPosts[0]?.userId) {
        state.userPosts.push(action.payload);
      }
    },
    updatePost: (state, action: PayloadAction<Post>) => {
      const updatedPost = action.payload;
      state.allPosts = state.allPosts.map((post) =>
        post.id === updatedPost.id ? updatedPost : post
      );
      state.userPosts = state.userPosts.map((post) =>
        post.id === updatedPost.id ? updatedPost : post
      );
    },
    togglePostLike: (
      state,
      action: PayloadAction<{ postId: string; userId: string }>
    ) => {
      const { postId, userId } = action.payload;
      const updatePostLikes = (posts: Post[]) => {
        return posts.map((post) => {
          if (post.id === postId) {
            const likes = { ...post.likes };
            if (likes[userId]) {
              delete likes[userId];
            } else {
              likes[userId] = true;
            }
            return { ...post, likes };
          }
          return post;
        });
      };

      state.allPosts = updatePostLikes(state.allPosts);
      state.userPosts = updatePostLikes(state.userPosts);
    },
    updatePostComments: (
      state,
      action: PayloadAction<{ postId: string; commentsCount: number }>
    ) => {
      const { postId, commentsCount } = action.payload;
      state.allPosts = state.allPosts.map((post) =>
        post.id === postId ? { ...post, commentsCount } : post
      );
      state.userPosts = state.userPosts.map((post) =>
        post.id === postId ? { ...post, commentsCount } : post
      );
    },
  },
});

export const {
  setLoading,
  setError,
  setPosts,
  setUserPosts,
  addPost,
  updatePost,
  togglePostLike,
  updatePostComments,
} = postsSlice.actions;

export default postsSlice.reducer;
