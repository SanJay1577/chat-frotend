import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { genSender } from "../AllChatLogics.js";
import { ChatState } from "../Context/chatProvider";
import { GroupChatComponent } from "./Misc/GroupChatComponent.js";
import { fetchSelectedChat } from "./Misc/miscHelper";
import SkeletonLoading from "./SkeletonLoading";

const MyChats = ({ repeatFetch }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { userDetails, chat, setChat, selectedChat, setSelecteChat } =
    ChatState();
  const { user, token } = userDetails;
  const toast = useToast();
  const fetchChats = () => {
    fetchSelectedChat(token)
      .then((data) => {
        if (data.error) {
          toast({
            title: data.error,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
        } else {
          setChat(data);
        }
      })
      .catch((error) => {
        toast({
          title: "Error Occured!",
          description: error,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      });
  };

  useEffect(() => {
    fetchChats();
    setLoggedUser(user);

    // eslint-disable-next-line
  }, [repeatFetch]);
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        Chats
        <GroupChatComponent>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group
          </Button>
        </GroupChatComponent>
      </Box>

      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chat ? (
          <Stack overflowY="scroll">
            {chat?.map((chatItem, idx) => (
              <Box
                onClick={() => setSelecteChat(chatItem)}
                cursor="pointer"
                bg={selectedChat === chatItem ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chatItem ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={idx}
              >
                <Text>
                  {!chatItem?.isGroupChat
                    ? genSender(loggedUser, chatItem?.users)
                    : chatItem?.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <SkeletonLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
