import style from "./style.module.css";
import MessagesReceived from "./messages";
import SendMessage from "./send-message";
import RoomAndUsersColumn from "./room-and-users";

const Chat = ({ username, room, socket }) => {
  return (
    <div className={style.chatContainer}>
      <RoomAndUsersColumn socket={socket} username={username} room={room} />
      <div>
        <MessagesReceived socket={socket} />
        <SendMessage socket={socket} username={username} room={room} />
      </div>
    </div>
  );
};

export default Chat;
