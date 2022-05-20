import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../Context/chatProvider";
import { UserBadge } from "../userAvatars/userBadge";
import { UserList } from "../userAvatars/UserList";
import { createGroup, getAllUsers } from "./miscHelper.js";

export const GroupChatComponent = ({ children }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [groupName, setGroupName] = useState();
  const [selectedUser, setSelectedUser] = useState([]);
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { userDetails, chat, setChat } = ChatState();
  const { token } = userDetails;
  const handleSearch = (userSearch) => {
    setSearch(userSearch);
    if (!userSearch) return;
    try {
      setLoading(true);
      getAllUsers(search, token).then((data) => {
        if (data.error) {
          toast({
            title: data.error,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
          setLoading(false);
        } else {
          setLoading(false);
          setSearchResult(data);
        }
      });
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };
  const handleGroup = (addUser) => {
    if (selectedUser.includes(addUser)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setSelectedUser([...selectedUser, addUser]);
  };

  const handleDelete = (deleteUser) => {
    setSelectedUser(
      selectedUser.filter((select) => select._id !== deleteUser._id)
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!groupName || !selectedUser) {
      toast({
        title: "Please fill all the feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    const content = {
      name: groupName,
      users: selectedUser.map((user) => user._id),
    };
    createGroup(token, content).then((data) => {
      if (data.error) {
        toast({
          title: data.error,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      } else {
        setChat([...chat, data]);
        onClose();
      }
    });
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(event) => setGroupName(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: Tony, jane,"
                mb={1}
                onChange={(event) => handleSearch(event.target.value)}
              />
            </FormControl>
            <Box w="100%" d="flex" flexWrap="wrap">
              {selectedUser.map((u) => (
                <UserBadge
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
            {loading ? (
              <Spinner ml="auto" display="flex" />
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserList
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSubmit} colorScheme="teal">
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
