import { IoMdSend } from "react-icons/io";
import { IoIosAttach } from "react-icons/io";
import Chat from "./Chat";
import darkPattern from "../assets/moroccan-flower-dark.png";
import lightPattern from "../assets/moroccan-flower.png";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ThemeBtn from "./ThemeBtn";
import { Link, useNavigate } from "react-router";
import { baseURl } from "../config/axios";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { toast } from "react-hot-toast";
import { addMessages, isSubscribed } from "../store/slice/ChatRoomSlice";

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
  const chatBoxRef = useRef(null);
  const subscriptionRef = useRef(null);

  useEffect(() => {
    if (!details.roomId || !details.username) {
      navigate("/"); // only if not properly joined
    }
  }, [details, connection, navigate]);

  ///page intit:
  //meses ko liad krane honmge

  //stompclient ko inti n krne khonge]
  //scbscribe
  useEffect(() => {
    // sockjs object
    const sock = new SockJS(`${baseURl}/chat`);
    console.log("this is sock",sock)
    const client = new Client({
      webSocketFactory: () => sock,
      reconnectDelay: 5000,
      onConnect: () => {

        toast.success("Connected");
        console.log("subsref",subscriptionRef)
        console.log("subsref.current",subscriptionRef.current)
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
          console.log("inside subsref");
        }
        subscriptionRef.current=client.subscribe(`/topic/room/${details.roomId}`, (message) => {
          console.log("message",message);
          const newmsg = JSON.parse(message.body);
          console.log("newmsg",newmsg);
          console.log("Received:", message);
          dispatch(addMessages(newmsg));
        });
        dispatch(isSubscribed());
      },

      onStompError: (frame) => {
        console.error("Broker error:", frame.headers["message"]);
      },
    });

    // ✅ Correct place to activate client
    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, [details.roomId, dispatch]);

  //send msg
  const sendmessage = () => {
    if (stompClient && stompClient.connected && input.trim()) {
      const newmsg = {
        sender: currentUser,
        content: input,
        roomId: details.roomId,
      };

      console.log("newmsg",newmsg);

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
    console.log("Unsubscribed from topic");
  }

  if (stompClient) {
    stompClient.deactivate();
    setStompClient(null);
    console.log("STOMP client deactivated");
  }

  navigate("/"); // go back home
};


  return (
    <>
      <div className="h-screen w-full flex flex-col bg-gray-100 text-slate-900 dark:bg-gray-700 text-sm md:text-lg">
        {/* HEADER */}
        <header className="flex md:bg-red-400 justify-between items-center py-2 px-6 md:px-12 h-[10%] bg-green-800 text-slate-200 text-sm md:text-lg dark:bg-slate-900">
          <div className="capitalize ">Room: {details.roomId}</div>
          <div className="capitalize ">{details.username}</div>
          <div className="flex justify-between gap-6 md:gap-12 items-center">
            <div
              onClick={handleExit}
              className="capitalize  bg-red-400 text-black dark:text-white font-semibold py-1 px-3 rounded-lg cursor-pointer "
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
            backgroundImage: `url(${
              theme === "dark" ? darkPattern : lightPattern
            })`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          <div
            className={`absolute inset-0 ${
              theme === "dark" ? "opacity-50 bg-black" : "opacity-10 bg-black"
            }`}
          ></div>

          {/* Chat content */}
          <div className="relative z-10 h-full overflow-y-auto ">
            <Chat />
          </div>
        </main>

        {/* FOOTER */}
        <footer className="p-2 w-full bg-gray-100 dark:bg-gray-800 dark:md:bg-gray-700 md:max-w-[50%] md:ml-[25%]">
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
              className="bg-white border border-gray-500 dark:border-gray-700 dark:bg-slate-600 dark:text-white text-sm w-full focus:outline-none px-3 py-2 rounded-full"
            />
            <button className="text-xl bg-green-800 text-slate-200 p-2 rounded-full">
              <IoIosAttach />
            </button>
            <button
              onClick={sendmessage}
              className="text-xl bg-green-800 text-slate-200 p-2 rounded-full"
            >
              <IoMdSend />
            </button>
          </div>
        </footer>
      </div>
    </>
  );
}

export default ChatRoom;
