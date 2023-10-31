import axios from "axios";
import { ENDPOINT_URL } from "../utils/helper";

export const post = async (url, body) => {
  const token = localStorage.getItem("token");
  const headers = {
    authorization: token,
  };
  return new Promise((resolve, reject) => {
    axios
      .post(`${ENDPOINT_URL}${url}`, body, { headers })
      .then((res) => {
        const { data } = res || {};
        resolve(data);
      })
      .catch((err) => {
        catchReturn(err, resolve);
      });
  });
};

export const get = async (url) => {
  const token = localStorage.getItem("token");
  const headers = {
    authorization: token,
  };
  return new Promise((resolve, reject) => {
    axios
      .get(`${ENDPOINT_URL}${url}`, { headers })
      .then((res) => {
        const { data } = res || {};
        resolve(data);
      })
      .catch((err) => {
        catchReturn(err, resolve);
      });
  });
};

export const patch = async (url, data) => {
  const token = localStorage.getItem("token");
  const headers = {
    authorization: token,
  };
  return await axios
    .patch(`${ENDPOINT_URL}${url}`, data, { headers })
    .then((res) => {
      if (res.status === 200) {
        if (res.data.success) {
          return res.data;
        } else {
          return [];
        }
      } else {
        return res?.response?.data;
      }
    })
    .catch((err) => {
      return err?.response?.data;
    });
};

export const remove = async (url) => {
  const token = localStorage.getItem("token");
  const headers = {
    authorization: token,
  };
  return new Promise((resolve, reject) => {
    axios
      .delete(`${ENDPOINT_URL}${url}`, { headers })
      .then((res) => {
        const { data } = res || {};
        resolve(data);
      })
      .catch((err) => {
        catchReturn(err, resolve);
      });
  });
};

export const catchReturn = (err, resolve) => {
  const { response, code } = err || {};
  const { data, success } = response || {};
  if (data && success) {
    resolve(data);
  } else if (code === "ERR_NETWORK") {
    const obj = {
      success: false,
      data: null,
      message:
        "There was a problem connecting to the server, Please try again later",
    };
    resolve(obj);
  } else if (code === "ERR_BAD_RESPONSE") {
    const obj = {
      success: false,
      data: null,
      message: "Something went wrong",
    };
    resolve(obj);
  } else {
    resolve(response.data);
  }
};
