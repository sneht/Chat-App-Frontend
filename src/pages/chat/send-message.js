import { SocketContext } from "../context/socketContext";
import styles from "./style.module.css";
import React, { useContext, useState } from "react";

const SendMessage = ({ username, room }) => {
  const { socket } = useContext(SocketContext);
  const [message, setMessage] = useState("");
  const userData = JSON.parse(localStorage.getItem("data"));

  const sendMessage = (e) => {
    e.preventDefault();
    if (message !== "") {
      const __createdtime__ = Date.now();
      socket.emit("send_message", {
        fullname: username || userData.fullname,
        room: room || userData.room,
        message,
        __createdtime__,
      });
      setMessage("");
    }
  };

  const onChangeHandle = (e) => {
    socket.emit("typing", {
      username: username || userData.fullname,
      room: room.group_name || userData.room,
    });
    setMessage(e);
  };

  return (
    <form onSubmit={sendMessage}>
      <div className={styles.sendMessageContainer}>
        <input
          className={styles.messageInput}
          placeholder="Message..."
          onChange={(e) => onChangeHandle(e.target.value)}
          value={message}
          autoFocus
        />
        <button
          type="submit"
          className="btn btn-primary border-none"
          onSubmit={sendMessage}
        >
          Send Message
        </button>
      </div>
    </form>
  );
};

export default SendMessage;
