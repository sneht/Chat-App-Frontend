/* eslint-disable react-hooks/exhaustive-deps */
import style from "./style.module.css";
import { useState, useEffect, useRef } from "react";

const Messages = ({ socket }) => {
  const [messagesRecieved, setMessagesReceived] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesColumnRef = useRef(null);
  const userData = JSON.parse(localStorage.getItem("data"));

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessagesReceived((state) => [
        ...state,
        {
          message: data?.message,
          fullname: data.fullname,
          __createdtime__: data.__createdtime__,
        },
      ]);
    });

    return () => socket.off("receive_message");
  }, [socket]);

  useEffect(() => {
    const isPageRefreshed = window.performance.navigation.type === 1;

    if (isPageRefreshed) {
      socket.emit("pageRefresh", userData);
    }
  }, []);

  useEffect(() => {
    socket.on("last_100_messages", (last100Messages) => {
      last100Messages = JSON.parse(last100Messages);
      last100Messages = sortMessagesByDate(last100Messages);
      setMessagesReceived((state) => [...last100Messages, ...state]);
    });

    return () => socket.off("last_100_messages");
  }, [socket]);

  const [userName, setUserName] = useState("");

  useEffect(() => {
    socket.on("user_is_typing", (data) => {
      setUserName(data.username);
      setIsTyping(true);

      const typingTimeout = setTimeout(() => {
        setIsTyping(false);
      }, 3000);
      
      return () => clearTimeout(typingTimeout);
    });
  }, [socket]);

  useEffect(() => {
    messagesColumnRef.current.scrollTop =
      messagesColumnRef.current.scrollHeight;
  }, [messagesRecieved,isTyping]);

  function sortMessagesByDate(messages) {
    return messages.sort(
      (a, b) => parseInt(a.__createdtime__) - parseInt(b.__createdtime__)
    );
  }

  function formatDateFromTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  return (
    <div className={style.messagesColumn} ref={messagesColumnRef}>
      {messagesRecieved.map((msg, i) => {
        const userName = msg?.fullname ? msg.fullname : msg.sent_by;
        return (
          <div
            className={
              (style.message,
              userData?.fullname === userName
                ? style.message_end
                : style.message_start)
            }
            key={i}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className={style.msgMeta}>
                {formatDateFromTimestamp(msg.__createdtime__ || msg.createdAt)}
              </span>
            </div>
            <p className={style.msgText}>{msg.message}</p>
            <br />
          </div>
        );
      })}
      {isTyping && userName !== userData.fullname && (
        <span>{userName} is typing...</span>
      )}
    </div>
  );
};

export default Messages;
