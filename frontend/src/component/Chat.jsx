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

  const formatTime = (timeStamp) => {
    let date = new Date(timeStamp);
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  return (
    <div
      className={`h-full text-sm w-full overflow-auto p-4 space-y-4 custom-scroll z-10 relative 
        ${theme === "dark" ? "dark-background dark-text" : "light-background light-text"}
      `}
    >
      {messages.map((msg, idx) => {
        if (!msg.content?.trim()) return null;

        const isCurrentUser = msg.sender === currentUser;

        return (
          <div
            key={`${msg.sender}-${msg.time}-${idx}`}
            className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] md:max-w-[60%] px-4 py-2 rounded-2xl break-words shadow-lg transition-all duration-300 ease-in-out
                ${isCurrentUser 
                  ? (theme === "dark" ? "dark-sender" : "light-sender") 
                  : (theme === "dark" ? "dark-receiver" : "light-receiver")}
              `}
            >
              <div className="capitalize font-bold mb-1">
                {isCurrentUser ? "You" : msg.sender}
              </div>
              <div className="font-normal">{msg.content}</div>

              <small
                className={`mt-1 text-[10px] text-right float-right opacity-80 ${
                  theme === "dark" ? "dark-secondary-text" : "light-secondary-text"
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
