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
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import {
  createGroup,
  editGroup,
  groupListAPI,
  userListAPI,
  userListByGroupAPI,
} from "../../service/apiUrl";
import Chat from "../chat/index";
import ModalForAddEdit from "../chat/modal";

const Dashboard = () => {
  const socket = io.connect("http://localhost:4000");

  const { fullname } = JSON.parse(localStorage.getItem("data"));
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
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      group_name: "",
      created_by: fullname,
      users: [],
    },
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

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
    socket.emit("join_room", { fullname, room: groupDetails });
  };

  const handleShowModal = (type, list) => {
    if (type === "edit") {
      setModalShowForEdit(true);
      formik.setFieldValue("group_name", selectedGroup.group_name);
    } else {
      formik.setFieldValue("group_name", "");
      setModalShowForAdd(true);
    }
  };
  return (
    <Box display="flex">
      <Box>
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          <Box display={"flex"} justifyContent={"space-between"}>
            <Typography fontSize={20} marginLeft={2}>
              {fullname}
            </Typography>
            <Typography align="right">
              <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={openForAdd ? "long-menu" : undefined}
                aria-expanded={openForAdd ? "true" : undefined}
                aria-haspopup="true"
                onClick={handleClick}
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
          {groupList.map((item, index) => {
            return (
              <ListItem
                alignItems="flex-start flexDirection-column"
                key={index}
              >
                <ListItemAvatar>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                </ListItemAvatar>
                <ListItemText
                  primary={item.group_name}
                  onClick={() => joinGroup(item)}
                />

                <Divider variant="inset" component="li" />
              </ListItem>
            );
          })}
          <Divider variant="inset" component="li" />
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary="Summer BBQ"
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    to Scott, Alex, Jennifer
                  </Typography>
                  {" — Wish I could come, but I'm out of town this…"}
                </React.Fragment>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary="Oui Oui"
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    Sandra Adams
                  </Typography>
                  {" — Do you have Paris recommendations? Have you ever…"}
                </React.Fragment>
              }
            />
          </ListItem>
        </List>
      </Box>
      <Box flex={1}>
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          <Box display={"flex"} justifyContent={"space-between"}>
            <Typography fontSize={20} marginLeft={2}>
              {selectedGroup.group_name}
            </Typography>
            <Typography align="right">
              <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={openForEdit ? "long-menu" : undefined}
                aria-expanded={openForEdit ? "true" : undefined}
                aria-haspopup="true"
                onClick={handleClickForEdit}
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
                    width: "20ch",
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
          {selectedGroup && (
            <Chat username={fullname} room={selectedGroup} socket={socket} />
          )}
        </List>
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
      {/* <Modal
        open={isModalShowForAdd}
        onClose={() => handleCloseModal()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box component="form" sx={style} onSubmit={formik.handleSubmit}>
          <Grid item xs={12}>
            <TextField
              name="group_name"
              label="Group Name"
              required
              fullWidth
              {...formik.getFieldProps("group_name")}
            />
          </Grid>
          <Autocomplete
            name="users"
            id="users"
            multiple
            disablePortal
            options={usersList}
            getOptionLabel={(option) => option.fullname}
            getOptionValue={(option) => option._id}
            value={formik.values.users || []}
            onChange={(event, newValue) => {
              const selectedIds = newValue.map((option) => option);
              formik.setFieldValue("users", selectedIds);
            }}
            renderInput={(params) => {
              return <TextField {...params} label="Users" />;
            }}
            renderTags={(value, getTagProps) =>
              (value || []).map((option, index) => {
                return (
                  <Chip
                    label={option ? option.fullname : "Name not available"}
                    {...getTagProps({ index })}
                    onDelete={() => {
                      const newUsers = [...formik.values.users];
                      newUsers.splice(index, 1);
                      formik.setFieldValue("users", newUsers);
                    }}
                  />
                );
              })
            }
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 1, mb: 2 }}
          >
            Create Group
          </Button>
        </Box>
      </Modal>
      <Modal
        open={isModalShowForEdit}
        onClose={() => handleCloseModal()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box component="form" sx={style} onSubmit={formik.handleSubmit}>
          <Grid item xs={12}>
            <TextField
              name="group_name"
              label="Group Name"
              required
              fullWidth
              {...formik.getFieldProps("group_name")}
            />
          </Grid>
          <Autocomplete
            name="users"
            id="users"
            multiple
            disablePortal
            options={usersList}
            getOptionLabel={(option) => option.fullname}
            getOptionValue={(option) => option._id}
            value={formik.values.users || []}
            onChange={(event, newValue) => {
              const selectedIds = newValue.map((option) => option);
              formik.setFieldValue("users", selectedIds);
            }}
            renderInput={(params) => {
              return <TextField {...params} label="Users" />;
            }}
            renderTags={(value, getTagProps) =>
              (value || []).map((option, index) => {
                return (
                  <Chip
                    label={option ? option.fullname : "Name not available"}
                    {...getTagProps({ index })}
                    onDelete={() => {
                      const newUsers = [...formik.values.users];
                      newUsers.splice(index, 1);
                      formik.setFieldValue("users", newUsers);
                    }}
                  />
                );
              })
            }
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 1, mb: 2 }}
          >
            Create Group
          </Button>
        </Box>
      </Modal> */}
    </Box>
  );
};

export default Dashboard;
