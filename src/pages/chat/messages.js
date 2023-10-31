/* eslint-disable react-hooks/exhaustive-deps */
import { IconButton, Menu, MenuItem, Typography } from "@mui/material";
import style from "./style.module.css";
import { useState, useEffect, useRef, useContext } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  deleteMessageAPI,
  deleteMessageForEveryoneAPI,
} from "../../service/apiUrl";
import { DeleteChatModal } from "../../modal/deleteModal";
import { SocketContext } from "../context/socketContext";

const Messages = () => {
  const { socket } = useContext(SocketContext);
  const [messagesRecieved, setMessagesReceived] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [anchorElForAdd, setAnchorElForAdd] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState({
    isDeleteForEveryone: false,
    isDeleteForMe: false,
  });
  const { isDeleteForEveryone, isDeleteForMe } = showDeleteModal;
  const [messageId, setMessageId] = useState("");
  const [isLoading, setLoading] = useState(false);
  const messagesColumnRef = useRef(null);
  const userData = JSON.parse(localStorage.getItem("data"));

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessagesReceived((state) => [...state, data]);
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
      setMessagesReceived([]);
      last100Messages = JSON.parse(last100Messages);
      last100Messages = sortMessagesByDate(last100Messages);
      setMessagesReceived((state) => [...last100Messages]);
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
  }, [messagesRecieved, isTyping]);

  function sortMessagesByDate(messages) {
    return messages.sort(
      (a, b) => parseInt(a.__createdtime__) - parseInt(b.__createdtime__)
    );
  }

  function formatDateFromTimestamp(timestamp) {
    const date = new Date(timestamp);
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    const formattedDate = date.toLocaleString(undefined, options);
    return formattedDate;
  }

  const ITEM_HEIGHT = 48;
  const openForAdd = Boolean(anchorElForAdd);

  const handleClick = (event) => {
    setAnchorElForAdd(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElForAdd(null);
  };
  const options = ["Delete for me", "Delete for everyone", "Info"];

  const handleShowDeleteModal = (id, key) => {
    if (key === "Delete for everyone") {
      setShowDeleteModal((prevState) => ({
        ...prevState,
        isDeleteForEveryone: true,
        isDeleteForMe: false,
      }));
    }
    if (key === "Delete for me") {
      setShowDeleteModal((prevState) => ({
        ...prevState,
        isDeleteForMe: true,
        isDeleteForEveryone: false,
      }));
    }
    setAnchorElForAdd(null);
    setMessageId(id);
  };

  const handleDeleteMessage = async () => {
    setLoading(true);
    const response = await deleteMessageAPI(messageId);
    if (response) {
      setShowDeleteModal((prevState) => ({
        ...prevState,
        isDeleteForMe: false,
        isDeleteForEveryone: false,
      }));
      setLoading(false);
      const { success, data } = response || {};
      if (success) {
        socket.emit("join_room", {
          fullname: userData.fullname,
          room: data.group,
          userData,
        });
      }
    }
  };

  const handleDeleteMessageForeveryone = async () => {
    setLoading(true);
    const response = await deleteMessageForEveryoneAPI(messageId);
    if (response) {
      setShowDeleteModal((prevState) => ({
        ...prevState,
        isDeleteForMe: false,
        isDeleteForEveryone: false,
      }));
      setLoading(false);
      const { success, data } = response || {};
      if (success) {
        socket.emit("join_room", {
          fullname: userData.fullname,
          room: data.group,
          userData,
        });
      }
    }
  };

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
                {userData?.fullname === userName ? "You" : userName}
              </span>
              <span className={style.msgMeta}>
                {formatDateFromTimestamp(msg.__createdtime__ || msg.createdAt)}
              </span>
              {userData?.fullname === userName && (
                <Typography align="right">
                  <IconButton
                    aria-label="more"
                    id="long-button"
                    aria-controls={openForAdd ? "long-menu" : undefined}
                    aria-expanded={openForAdd ? "true" : undefined}
                    aria-haspopup="true"
                    onClick={handleClick}
                    style={{ padding: "0px", color: "rgb(153, 217, 234)" }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id="long-menu"
                    MenuListProps={{
                      "aria-labelledby": "long-button",
                    }}
                    anchorEl={anchorElForAdd}
                    open={openForAdd}
                    onClose={handleClose}
                    PaperProps={{
                      style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: "20ch",
                      },
                    }}
                  >
                    {options.map((option, index) => {
                      return (
                        <MenuItem
                          key={index}
                          selected={option === "Pyxis"}
                          onClick={() => handleShowDeleteModal(msg._id, option)}
                        >
                          {option}
                        </MenuItem>
                      );
                    })}
                  </Menu>
                </Typography>
              )}
            </div>
            <p className={style.msgText}>{msg.message}</p>
            <br />
          </div>
        );
      })}
      {isTyping && userName !== userData.fullname && (
        <span>{userName} is typing...</span>
      )}
      <DeleteChatModal
        onClose={() =>
          setShowDeleteModal((prevState) => ({
            ...prevState,
            isDeleteForMe: false,
            isDeleteForEveryone: false,
          }))
        }
        open={isDeleteForEveryone || isDeleteForMe}
        handleDeleteMessage={
          (isDeleteForMe && handleDeleteMessage) ||
          (isDeleteForEveryone && handleDeleteMessageForeveryone)
        }
        isLoading={isLoading}
      />
    </div>
  );
};

export default Messages;
