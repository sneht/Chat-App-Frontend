import React, { createContext } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  // https://chat-app-backend-qtdx.onrender.com")
  // http://localhost:4000
  const socket = io.connect("https://chat-app-backend-qtdx.onrender.com");
  const userData = JSON.parse(localStorage.getItem("data"));
  return (
    <SocketContext.Provider value={{ socket, userData }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, SocketContext };
