import { createSlice } from "@reduxjs/toolkit";

const ChatRoomSlice = createSlice({
  name: "Chatroom",
  initialState: {
    messages: [],
    details: {
      username: "",
      roomId: "",
    },
    currentUser: "",
    connection: false,
    stompClient: null,
    isSubscribed:false
  },
  reducers: {
    addMessages: (state, action) => {
      state.messages.push(action.payload);
    },
    setdetails: (state, action) => {
      state.details = { ...state.details, ...action.payload };
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setConnection: (state, action) => {
      state.connected = action.payload;
    },
    setStompClient: (state, action) => {
      state.stompClient = action.payload;
    },
    setSubcribed:(state,action)=>{
      state.isSubscribed=!state.isSubscribed;
    }
  },
});

export const {
  addMessages,
  setdetails,
  setMessages,
  setCurrentUser,
  setConnection,
  setStompClient,
  isSubscribed
} = ChatRoomSlice.actions;
export default ChatRoomSlice.reducer;
