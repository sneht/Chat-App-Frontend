import React from "react";

const WelcomeMessage = ({ userData }) => {
  const { fullname } = userData || {};
  return (
    <div className="main">
      <h1> Welcome! {fullname}</h1>
      <p>Click on a group name to start chatting!</p>
    </div>
  );
};

export default WelcomeMessage;
