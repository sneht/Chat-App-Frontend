import { get, patch, post } from "./api";

export const createUser = (body) => {
  return post("user", body);
};

export const loginUser = (body) => {
  return post("login", body);
};

export const userListAPI = () => {
  return get("user");
};

export const userListByGroupAPI = (id) => {
  return get(`user/${id}`);
};

export const groupListAPI = () => {
  return get("group");
};

export const createGroup = (body) => {
  return post("group", body);
};

export const editGroup = (id, body) => {
  return patch(`group/${id}`, body);
};
