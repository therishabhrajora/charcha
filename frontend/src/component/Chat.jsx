import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

function Chat() {
  const theme = useSelector((state) => state.theme.darkMode);
  const currentUser = useSelector((state) => state.chatroom.currentUser);
  const messages = useSelector((state) => state.chatroom.messages);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-full text-sm w-full overflow-auto p-2 space-y-2 custom-scroll z-10 relative">
      {messages.map((msg, idx) => {
        if (!msg.content?.trim()) return null;
        const isCurrentUser = msg.sender === currentUser;
        const sender = isCurrentUser ? "You" : msg.sender;
        const formatTime = (timeStamp) => {
          return new Date(timeStamp).toLocaleString("en-IN", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
            timeZone: "Asia/Kolkata",
          });
        };

        return (
          <div
            key={`${msg.sender}-${msg.time}-${idx}`}
            className={`flex ${
              isCurrentUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[60%] min-w-[150px] px-4 py-2 rounded-xl break-words ${
                isCurrentUser
                  ? "bg-green-400 text-black dark:bg-green-800 dark:text-white"
                  : "bg-gray-300 text-black dark:bg-gray-600 dark:text-white"
              }`}
            >
              <div className=" capitalize font-bold">{sender}</div>
              <div className="font-normal">{msg.content}</div>

              <small
                className={`mt-1 text-[10px] text-right float-right ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {formatTime(msg.timeStamp)}
              </small>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef}></div>
    </div>
  );
}

export default Chat;
