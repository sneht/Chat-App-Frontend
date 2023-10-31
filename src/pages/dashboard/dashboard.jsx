/* eslint-disable react-hooks/exhaustive-deps */
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useFormik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import {
  createGroup,
  editGroup,
  groupListAPI,
  userListAPI,
  userListByGroupAPI,
} from "../../service/apiUrl";
import Messages from "../chat/messages";
import ModalForAddEdit from "../chat/modal";
import SendMessage from "../chat/send-message";
import { SocketContext } from "../context/socketContext";
import WelcomeMessage from "../welcome-message/welcomeMessage";
import * as Yup from "yup";

const Dashboard = () => {
  const { socket } = useContext(SocketContext);

  const userData = JSON.parse(localStorage.getItem("data"));
  const [usersList, setUsersList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [isModalShowForAdd, setModalShowForAdd] = useState(false);
  const [isModalShowForEdit, setModalShowForEdit] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("");

  useEffect(() => {
    getAllUserList();
    getAllGroupList();
  }, []);

  useEffect(() => {
    if (isModalShowForAdd) {
      getAllUserList();
    }
    if (isModalShowForEdit) {
      getUserListByGroup();
    }
  }, [isModalShowForAdd, isModalShowForEdit]);

  const getAllUserList = async () => {
    const response = await userListAPI();
    const { success, data } = response || {};
    if (success) {
      setUsersList(data);
    }
  };

  const getAllGroupList = async () => {
    const response = await groupListAPI();
    const { success, data } = response || {};
    if (success) {
      setGroupList(data);
    }
  };

  const getUserListByGroup = async () => {
    const response = await userListByGroupAPI(selectedGroup._id);
    const { success, data } = response || {};
    if (success) {
      setUsersList(data);
    }
  };

  const options = ["New Group", "Settings"];
  const optionsOfGroup = [
    "Add members in this group",
    "Remove members from this group",
  ];
  const ITEM_HEIGHT = 48;
  const [anchorElForAdd, setAnchorElForAdd] = useState(null);
  const [anchorElForEdit, setAnchorElForEdit] = useState(null);
  const openForAdd = Boolean(anchorElForAdd);
  const openForEdit = Boolean(anchorElForEdit);

  const handleClick = (event) => {
    setAnchorElForAdd(event.currentTarget);
  };

  const handleClickForEdit = (event) => {
    setAnchorElForEdit(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElForAdd(null);
  };

  const handleCloseForEdit = () => {
    setAnchorElForEdit(null);
  };

  const handleCloseModal = () => {
    setModalShowForAdd(false);
    setModalShowForEdit(false);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  const addGroupValidation = Yup.object().shape({
    group_name: Yup.string().required("Group name is required"),
    users: Yup.array().required("User required"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema: addGroupValidation,
    initialValues: {
      group_name: "",
      created_by: userData.fullname,
      users: null,
    },
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });
  console.log(formik.errors);
  const handleSubmit = async (values) => {
    const userIds = [];
    const { group_name, created_by, users } = values || {};
    users.map((item) => userIds.push(item._id));
    const body = {
      group_name,
      created_by,
      users: userIds,
    };
    if (isModalShowForAdd) {
      const response = await createGroup(body);
      console.log("response", response);
      setModalShowForAdd(false);
    }
    if (isModalShowForEdit) {
      const response = await editGroup(selectedGroup._id, body);
      console.log("response", response);
      setModalShowForEdit(false);
    }
  };

  const joinGroup = (groupDetails) => {
    setSelectedGroup(groupDetails);
    socket.emit("join_room", {
      fullname: userData.fullname,
      room: groupDetails,
      userData,
    });
  };

  const handleShowModal = (type, list) => {
    if (type === "edit") {
      setModalShowForEdit(true);
      formik.setFieldValue("group_name", selectedGroup.group_name);
    } else {
      setAnchorElForAdd(null);
      formik.setFieldValue("group_name", "");
      setModalShowForAdd(true);
    }
  };

  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(" ")[0][0]}`,
    };
  }

  return (
    <Box display="flex">
      <Box width={"290px"} height={"100vh"} borderRight={"1px solid #dbdbdb"}>
        <List
          sx={{ width: "100%", bgcolor: "background.paper", paddingTop: "0px" }}
        >
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            sx={{ backgroundColor: "#036055" }}
            height={"65px"}
          >
            <Typography
              fontSize={20}
              marginLeft={2}
              sx={{ padding: "14px", color: "white" }}
            >
              {userData.fullname}
            </Typography>
            <Typography align="right">
              <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={openForAdd ? "long-menu" : undefined}
                aria-expanded={openForAdd ? "true" : undefined}
                aria-haspopup="true"
                onClick={handleClick}
                sx={{ color: "white", padding: "16px" }}
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
                {options.map((option) => (
                  <MenuItem
                    key={option}
                    selected={option === "Pyxis"}
                    onClick={() => handleShowModal("add", options)}
                  >
                    {option}
                  </MenuItem>
                ))}
              </Menu>
            </Typography>
          </Box>
          <Box sx={{ overflowY: "auto", height: "100vh" }}>
            {groupList.map((item, index) => {
              return (
                <ListItem
                  alignItems="flex-start flexDirection-column"
                  key={index}
                  sx={{
                    cursor: "pointer",
                    borderBottom: "1px solid rgba(220, 220, 220, 0.568)",
                  }}
                  onClick={() => joinGroup(item)}
                >
                  <ListItemAvatar>
                    <Avatar {...stringAvatar(item.group_name)} />
                  </ListItemAvatar>
                  <ListItemText primary={item.group_name} />

                  <Divider variant="inset" component="li" />
                </ListItem>
              );
            })}
          </Box>
        </List>
      </Box>
      <Box flex={1} height={"100vh"}>
        {selectedGroup && (
          <List
            sx={{
              width: "100%",
              bgcolor: "background.paper",
              paddingTop: "0px",
            }}
          >
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              sx={{ backgroundColor: "#036055" }}
              height={"65px"}
            >
              <Box display={"flex"} marginLeft={"1%"}>
                <ListItemAvatar sx={{ padding: "10px" }}>
                  <Avatar {...stringAvatar(selectedGroup.group_name)} />
                </ListItemAvatar>
                <Typography
                  fontSize={20}
                  marginLeft={2}
                  padding={"13px"}
                  color={"white"}
                >
                  {selectedGroup.group_name}
                </Typography>
              </Box>
              <Typography align="right">
                <IconButton
                  aria-label="more"
                  id="long-button"
                  aria-controls={openForEdit ? "long-menu" : undefined}
                  aria-expanded={openForEdit ? "true" : undefined}
                  aria-haspopup="true"
                  onClick={handleClickForEdit}
                  sx={{ color: "white", padding: "16px" }}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  id="long-menu"
                  MenuListProps={{
                    "aria-labelledby": "long-button",
                  }}
                  anchorEl={anchorElForEdit}
                  open={openForEdit}
                  onClose={handleCloseForEdit}
                  PaperProps={{
                    style: {
                      maxHeight: ITEM_HEIGHT * 4.5,
                      width: "30ch",
                      left: "1428px",
                    },
                  }}
                >
                  {optionsOfGroup.map((option) => (
                    <MenuItem
                      key={option}
                      selected={option === "Pyxis"}
                      onClick={() => handleShowModal("edit", optionsOfGroup)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </Menu>
              </Typography>
            </Box>
            <Messages />
            <SendMessage room={selectedGroup} username={userData.fullname} />
          </List>
        )}
        {!selectedGroup && <WelcomeMessage userData={userData} />}
      </Box>
      <ModalForAddEdit
        show={isModalShowForAdd || isModalShowForEdit}
        style={style}
        formik={formik}
        usersList={usersList}
        handleCloseModal={handleCloseModal}
        isEdit={isModalShowForEdit}
        isAdd={isModalShowForAdd}
      />
    </Box>
  );
};

export default Dashboard;
