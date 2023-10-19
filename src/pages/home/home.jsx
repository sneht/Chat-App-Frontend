import { useNavigate } from "react-router-dom";
import style from "./style.module.css";
import { useEffect, useState } from "react";
import { groupListAPI } from "../../service/apiUrl";

const Home = ({ username, setUsername, room, setRoom, socket }) => {
  const navigate = useNavigate();
  const [groupList, setGroupList] = useState([]);

  useEffect(() => {
    getAllGroupList();
  }, []);

  const getAllGroupList = async () => {
    const response = await groupListAPI();
    const { success, data } = response || {};
    if (success) {
      setGroupList(data);
    }
  };

  const joinRoom = () => {
    if (room !== "" && username !== "") {
      socket.emit("join_room", { username, room });
    }
    const userData = { room, username };
    localStorage.setItem("userData", JSON.stringify(userData));
    navigate("/chat", { replace: true });
  };

  return (
    <div className={style.container}>
      <div className={style.formContainer}>
        <h1>{`<>DevRooms</>`}</h1>
        <input
          className={style.input}
          placeholder="Username..."
          onChange={(e) => setUsername(e.target.value)} // Add this
        />

        <select
          className={style.input}
          onChange={(e) => setRoom(e.target.value)} // Add this
        >
          <option>-- Select Room --</option>
          {groupList.map((item, index) => {
            return <option value="javascript">{item.group_name}</option>;
          })}
          {/* <option value="node">Node</option>
          <option value="express">Express</option>
          <option value="react">React</option> */}
        </select>

        <button
          className="btn btn-secondary"
          style={{ width: "100%" }}
          onClick={joinRoom}
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

export default Home;
