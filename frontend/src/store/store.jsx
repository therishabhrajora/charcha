import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../store/slice/theme";
import chatRoomReducer from "../store/slice/ChatRoomSlice";
export const store = configureStore({
  reducer: {
    theme: themeReducer,
    chatroom: chatRoomReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
