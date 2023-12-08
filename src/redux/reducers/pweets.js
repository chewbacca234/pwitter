import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

export const pweetsSlice = createSlice({
  name: 'pweets',
  initialState,
  reducers: {
    loadPweets: (state, action) => {
      state = action.payload;
    },
    addPweet: (state, action) => {
      state.unshift(action.payload);
    },
    likePweet: (state, action) => {
      const index = state.findIndex(
        Pweet => Pweet._id === action.payload.PweetId
      );
      const isLiked = state[index].likes.some(
        like => like.username === action.payload.username
      );

      if (isLiked) {
        state[index].likes = state[index].likes.filter(
          like => like.username !== action.payload.username
        );
      } else {
        state[index].likes.push({ username: action.payload.username });
      }
    },
    deletePweet: (state, action) => {
      state = state.filter(Pweet => Pweet._id !== action.payload);
    },
  },
});

export const { loadPweets, addPweet, likePweet, deletePweet } =
  pweetsSlice.actions;
export default pweetsSlice.reducer;
