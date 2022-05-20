import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";


const ChatContext = createContext();
const ChatProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState();
  const [chat, setChat] = useState();
  const [selectedChat, setSelecteChat] = useState();
  const [notification, setNotification] = useState([]); 
 const history = useHistory(); 

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userDetails"));
    setUserDetails(userInfo);
    if(!userInfo){
      history.push("/"); 
    }
  }, [history]);

  return (
    <ChatContext.Provider value={{
        userDetails,
        setUserDetails,
        chat,
        setChat,
        selectedChat,
        setSelecteChat,
        notification,
        setNotification
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
