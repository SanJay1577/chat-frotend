import React, { useEffect } from "react";
import { ChatState } from "../Context/chatProvider";
import {
  Box,
  Text,
  IconButton,
  Spinner,
  FormControl,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import { genSender, genSenderData } from "../AllChatLogics.js";
import UserModal from "./Misc/UserModal";
import { ArrowBackIcon, ArrowRightIcon } from "@chakra-ui/icons";
import UpdateGroup from "./Misc/UpdateGroup";
import { useState } from "react";
import { sendMessageMethod, fetchAllMessages } from "./Misc/miscHelper";
import { ScrollChat } from "./ScrollChat";
import io from "socket.io-client";

const ENDPOINT = "https://chtty.herokuapp.com/";
var socket, chatCompare;

const SoloChat = ({ repeatFetch, setRepeatFetch }) => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setnewMessage] = useState("");
  const {
    userDetails,
    selectedChat,
    setSelecteChat,
    notification,
    setNotification,
  } = ChatState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typing, setTyping] = useState(false);
  const { user, token } = userDetails;
  const toast = useToast();

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    // eslint-disable-next-line
  }, []);

  const fetchMessages = () => {
    if (!selectedChat) return;
    fetchAllMessages(token, selectedChat._id)
      .then((data) => {
        setLoading(true);
        if (data.error) {
          toast({
            title: data.error,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);
        } else {
          setMessages(data);
          setLoading(false);
          socket.emit("join chat", selectedChat._id);
        }
      })
      .catch((error) => {
        toast({
          title: "Error Occured!",
          description: "Failed to Load the Messages",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
      });
  };

  const sendMessage = async (event) => {
    if ((event.type === "click" || event.key === "Enter") && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      const messageContent = {
        content: newMessage,
        chat: selectedChat._id,
      };
      await sendMessageMethod(token, messageContent)
        .then((data) => {
          if (data.error) {
            toast({
              title: data.error,
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
          } else {
            socket.emit("new message", data);
            setMessages([...messages, data]);
            setnewMessage("");
          }
        })
        .catch((error) => {
          toast({
            title: "Error Occured!",
            description: "Failed to send the Message",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        });
    }
  };

  useEffect(() => {
    fetchMessages();
    chatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (!chatCompare || chatCompare._id !== newMessageRecieved.chat._id) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setRepeatFetch(!repeatFetch);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const typingHandler = (event) => {
    setnewMessage(event.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelecteChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {genSender(user, selectedChat.users)}
                <UserModal user={genSenderData(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroup
                  repeatFetch={repeatFetch}
                  setRepeatFetch={setRepeatFetch}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollChat messages={messages} />
              </div>
            )}
            {isTyping ? <div>typing...</div> : <></>}
            <FormControl
              onKeyDown={sendMessage}
              isRequired
              mt={3}
              display="flex"
              alignItems="center"
            >
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
              <Button
                borderRadius={"50%"}
                display="flex"
                colorScheme="teal"
                fontSize={"10px"}
                onClick={sendMessage}
                ml={{ base: "1", md: "2" }}
              >
                <ArrowRightIcon />
              </Button>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SoloChat;
