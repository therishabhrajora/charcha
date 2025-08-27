import { Link, useNavigate } from "react-router";
import speechBubble from "../assets/speech-bubble.png";
import ThemeBtn from "./ThemeBtn";
import toast from "react-hot-toast";
import {
  createRoomApi,
  getRoomMessages,
  joinRoomApi,
} from "../services/Service";
import {
  setdetails,
  setMessages,
  setConnection,
  setCurrentUser,
} from "../store/slice/ChatRoomSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./loader";
import { useState } from "react";

function JoinCreateChat() {
  const navigate = useNavigate();
  const details = useSelector((state) => state.chatroom.details);
  const theme = useSelector((state) => state.theme.darkMode);
  const dispatch = useDispatch();
  const [loader, setloader] = useState(false);

  const handleform = (e) => {
    dispatch(setdetails({ ...details, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    if (details.username.trim() !== "" && details.roomId.trim() !== "") {
      return true;
    }
    toast.error("Invalid inputs");
    return false;
  };

  const getMessages = async (roomId) => {
    const res = await getRoomMessages(roomId);
    dispatch(setMessages(res));
  };

  const joinRoom = async () => {
    if (validateForm()) {
      try {
        setloader(true);
        await joinRoomApi(details.roomId);

        await getMessages(details.roomId);
        dispatch(setCurrentUser(details.username));
        dispatch(setConnection(true));
        toast.success("Joined!");
        navigate("/chat");
      } catch (error) {
        if (error.response?.status === 400) {
          toast.error(error.response.data);
        }
      } finally {
        setloader(false);
      }
    }
  };

  const createRoom = async () => {
    if (validateForm()) {
      try {
        setloader(true);
        await createRoomApi(details);

        await getMessages(details.roomId);
        dispatch(setCurrentUser(details.username));
        dispatch(setConnection(true));
        toast.success("Room created");
        navigate("/chat");
      } catch (error) {
        if (error.response?.status === 400) {
          toast.error(error.response.data);
        }
      } finally {
        setloader(false);
      }
    }
  };

  if (loader) return <Loader />;

  return (
    <div className="relative">
      {/* Theme Toggle */}
      <div className={`absolute right-3 top-3 p-2 ${theme === "dark" ? "dark-background" : "light-background"}`}>
        <ThemeBtn />
      </div>

      {/* Main Container */}
      <div className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "dark-background" : "light-background"}`}>
        <div className={`p-8 m-10 shadow-lg rounded-2xl transition-all duration-300
          ${theme === "dark" ? "dark-receiver shadow-dark-secondary-2" : "light-receiver shadow-gray-400"}
        `}>
          {/* Logo */}
          <div className="flex justify-center mb-5">
            <img src={speechBubble} alt="Speech Bubble" className="w-[80px]" />
          </div>

          {/* Title */}
          <h1 className={`text-2xl font-bold text-center mb-2 ${theme === "dark" ? "dark-text" : "light-text"}`}>
            Join or Create a Room
          </h1>

          {/* Form */}
          <div>
            {/* Username */}
            <label htmlFor="name" className={`w-full m-1 font-semibold ${theme === "dark" ? "dark-text" : "light-text"}`}>
              Your name
            </label>
            <input
              type="text"
              id="name"
              name="username"
              onChange={handleform}
              value={details.username}
              placeholder="Enter your name"
              className={`w-full m-1 px-3 py-1 rounded focus:ring-2 focus:outline-none
                ${theme === "dark" ? "dark-input focus:ring-dark-primary-1" : "light-input focus:ring-light-primary-1"}
              `}
            />

            {/* Room ID */}
            <label htmlFor="room" className={`w-full m-1 font-semibold ${theme === "dark" ? "dark-text" : "light-text"}`}>
              Room ID
            </label>
            <input
              type="text"
              id="room"
              name="roomId"
              value={details.roomId}
              onChange={handleform}
              placeholder="Enter room name"
              className={`w-full m-1 px-3 py-1 rounded focus:ring-2 focus:outline-none
                ${theme === "dark" ? "dark-input focus:ring-dark-primary-1" : "light-input focus:ring-light-primary-1"}
              `}
            />

            {/* Buttons */}
            <div className="flex justify-between mt-2">
              <div
                onClick={joinRoom}
                className={`py-1 px-3 rounded cursor-pointer text-white shadow-md transition-all duration-300
                  ${theme === "dark" ? "dark-sender shadow-black" : "light-sender shadow-gray-700"}
                `}
              >
                Join Room
              </div>
              <div
                onClick={createRoom}
                className={`py-1 px-3 rounded cursor-pointer text-white shadow-md transition-all duration-300
                  ${theme === "dark" ? "dark-sender shadow-black" : "light-sender shadow-gray-700"}
                `}
              >
                Create Room
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={`capitalize text-center text-xs ${theme === "dark" ? "dark-secondary-text" : "light-secondary-text"}`}>
        Developed By: Rishabh Rajora
      </div>
    </div>
  );
}

export default JoinCreateChat;
