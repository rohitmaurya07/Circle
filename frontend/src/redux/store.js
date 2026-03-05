import { configureStore } from '@reduxjs/toolkit'
import { userSlice } from './slices/userSlice'
import { storySlice } from './slices/storySlice'
import { postSlice } from './slices/postSlice'
import { reelsSlice } from './slices/reelsSlice'

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    story: storySlice.reducer,
    posts: postSlice.reducer,
    reels: reelsSlice.reducer,
  },
})
