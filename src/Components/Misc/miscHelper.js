import { API } from "../../backed";

const getAllUsers = async (search, token) => {
  const response = await fetch(`${API}/user?search=${search}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
};

const accessUserChat = async (userId, token) => {
  try {
    const response = await fetch(`${API}/chat`, {
      method: "POST",
      body: JSON.stringify(userId),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const fetchSelectedChat = async (token) => {
  const response = await fetch(`${API}/chat`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
};

const createGroup = async (token, content) => {
  const response = await fetch(`${API}/chat/creategroup`, {
    method: "POST",
    body: JSON.stringify(content),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
};

const renameGroup = async (token, renameContent) => {
  const response = await fetch(`${API}/chat/renamegroup`, {
    method: "PUT",
    body: JSON.stringify(renameContent),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  return data;
};

const addToGroup = async (token, editContent) => {
  const response = await fetch(`${API}/chat/addtogroup`, {
    method: "PUT",
    body: JSON.stringify(editContent),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  return data;
};

const removeUser = async (token, editContent) => {
  const response = await fetch(`${API}/chat/removeuser`, {
    method: "PUT",
    body: JSON.stringify(editContent),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  return data;
};

const sendMessageMethod = async (token, messageContent) => {
  const response = await fetch(`${API}/message`, {
    method: "POST",
    body: JSON.stringify(messageContent),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
};

const fetchAllMessages = async (token, chatId) => {
  const response = await fetch(`${API}/message/${chatId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
};

export {
  getAllUsers,
  accessUserChat,
  fetchSelectedChat,
  createGroup,
  renameGroup,
  addToGroup,
  removeUser,
  sendMessageMethod,
  fetchAllMessages,
};
