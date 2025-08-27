import { IoMdSend } from "react-icons/io";
import { IoIosAttach } from "react-icons/io";
import Chat from "./Chat";
import darkPattern from "../assets/moroccan-flower-dark.png";
import lightPattern from "../assets/moroccan-flower.png";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ThemeBtn from "./ThemeBtn";
import { useNavigate } from "react-router";
import { baseURl } from "../config/axios";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { toast } from "react-hot-toast";
import {
  addMessages,
  isSubscribed,
  setConnection,
} from "../store/slice/ChatRoomSlice";

function ChatRoom() {
  const currentUser = useSelector((state) => state.chatroom.currentUser);
  const theme = useSelector((state) => state.theme.darkMode);
  const details = useSelector((state) => state.chatroom.details);
  const connection = useSelector((state) => state.chatroom.connection);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const inputRef = useRef(null);
  const subscriptionRef = useRef(null);

  useEffect(() => {
    if (!details.roomId || !details.username) {
      navigate("/");
    }
  }, [details, connection, navigate]);

  useEffect(() => {
    const sock = new SockJS(`${baseURl}/chat`);

    const client = new Client({
      webSocketFactory: () => sock,
      reconnectDelay: 5000,
      onConnect: () => {
        toast.success("Connected");
        dispatch(setConnection(true));

        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
        }
        subscriptionRef.current = client.subscribe(
          `/topic/room/${details.roomId}`,
          (message) => {
            const newmsg = JSON.parse(message.body);
            dispatch(addMessages(newmsg));
          }
        );
        dispatch(isSubscribed());
      },
      onStompError: (frame) => {
        console.error("Broker error:", frame.headers["message"]);
      },
      onWebSocketClose: () => {
        dispatch(setConnection(false));
        dispatch(isSubscribed(false));
      },
      onWebSocketError: () => {
        dispatch(setConnection(false));
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, [details.roomId, dispatch]);

  const sendmessage = () => {
    if (stompClient && stompClient.connected && input.trim()) {
      const newmsg = {
        sender: currentUser,
        content: input,
        roomId: details.roomId,
      };

      stompClient.publish({
        destination: `/app/sendMessage/${details.roomId}`,
        body: JSON.stringify(newmsg),
      });
      setInput("");
    }
  };

  const handleExit = () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
      dispatch(setConnection(false));
      dispatch(isSubscribed(false));
    }

    if (stompClient) {
      stompClient.deactivate();
      setStompClient(null);
    }

    navigate("/");
  };

  return (
    <div
      className={`h-screen w-full flex flex-col text-sm md:text-lg ${
        theme === "dark" ? "dark-background dark-text" : "light-background light-text"
      }`}
    >
      {/* HEADER */}
      <header
        className={`flex justify-between items-center py-2 px-6 md:px-12 h-[10%] ${
          theme === "dark" ? "dark-background dark-text" : "light-background light-text"
        }`}
      >
        <div className="capitalize font-semibold">Room: {details.roomId}</div>
        <div className="capitalize font-semibold">{details.username}</div>
        <div className="flex justify-between gap-6 md:gap-12 items-center">
          <div
            onClick={handleExit}
            className={`capitalize font-semibold py-1 px-3 rounded-lg cursor-pointer transition-all duration-300 ${
              theme === "dark" ? "dark-sender" : "light-sender"
            }`}
          >
            exit room
          </div>
          <ThemeBtn />
        </div>
      </header>

      {/* MAIN CHAT AREA */}
      <main
  className="flex-1 relative overflow-auto"
  style={{
    backgroundImage: `url(${theme === "dark" ? darkPattern : lightPattern})`,
    backgroundRepeat: "repeat", // repeat looks better for patterns
    backgroundSize: "auto",     // don’t stretch, keep tile effect
    backgroundPosition: "center",
  }}
>
  {/* Overlay (semi-transparent, not solid) */}
  <div
    className={`absolute inset-0 ${
      theme === "dark"
        ? "bg-dark-background/80"   // 80% opacity dark overlay
        : "bg-light-background/80" // 80% opacity light overlay
    }`}
  ></div>

  {/* Chat content */}
  <div className="relative z-10 h-full overflow-y-auto">
    <Chat />
  </div>
</main>


      {/* FOOTER */}
      <footer
        className={`p-2 w-full transition-all duration-300 md:max-w-[50%] md:ml-[25%] ${
          theme === "dark" ? "dark-background" : "light-secondary-1"
        }`}
      >
        <div className="flex items-center gap-3">
          <input
            type="text"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendmessage();
              }
            }}
            placeholder="Enter your message"
            className={`border text-sm w-full focus:outline-none px-3 py-2 rounded-full transition-all duration-300 ${
              theme === "dark" ? "dark-input" : "light-input"
            }`}
          />
          <button
            className={`text-xl p-2 rounded-full text-white transition-all duration-300 ${
              theme === "dark" ? "dark-sender" : "light-sender"
            }`}
          >
            <IoIosAttach />
          </button>
          <button
            onClick={sendmessage}
            className={`text-xl p-2 rounded-full text-white transition-all duration-300 ${
              theme === "dark" ? "dark-sender" : "light-sender"
            }`}
          >
            <IoMdSend />
          </button>
        </div>
      </footer>
    </div>
  );
}

export default ChatRoom;
