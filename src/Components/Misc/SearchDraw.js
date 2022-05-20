import {
  Box,
  Tooltip,
  Button,
  Text,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { ChatState } from "../../Context/chatProvider";
import UserModal from "./UserModal";
import { useHistory } from "react-router-dom";
import { accessUserChat, getAllUsers } from "./miscHelper";
import SkeletonLoading from "../SkeletonLoading";
import { UserList } from "../userAvatars/UserList";
import { genSender } from "../../AllChatLogics";
import NotificationBadge, { Effect } from "react-notification-badge"; 


const SearchDraw = () => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const { userDetails, setUserDetails, setSelecteChat, chat, setChat, notification, setNotification } = ChatState();
  const history = useHistory();
  const { user, token } = userDetails;
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState("");

  const logOutUser = () => {
    localStorage.removeItem("userDetails");
    setUserDetails();
    setSelecteChat();
    history.push("/");
  };
  const handleSearch = (event) => {
    setLoading(true);
    event.preventDefault();
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      setLoading(false);
    }

    getAllUsers(search, token)
      .then((data) => {
        setLoading(true);
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
          setResults(data);
          setLoading(false);
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
        setLoading(false);
      });
  };

  const accesUsers = (userId) => {
    setChatLoading(true);
    accessUserChat({ userId }, token).then((data) => {
        if (data.error) {
          toast({
            title: data.error,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
          setLoading(false);
        } else{
          if(!chat.find((c)=>c._id===data._id)){
          setChat([...chat, data])
          }
          setSelecteChat(data);
          setChatLoading(false);
          
          onClose();
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
        setChatLoading(false);
      });
  };

  return (
    <div>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search people to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <SearchIcon />
            <Text display={{ base: "none", md: "flex" }} px={4}>
              Search People
            </Text>
          </Button>
        </Tooltip>
        <Text
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="bolder"
          color="teal"
        >
          CHATTY
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
              count = {notification.length}
              effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList>
              {!notification.length && "No New Message"}
              {notification.map((notify)=>(
                <MenuItem
                key={notify._id}
                onClick={()=>{
                  setSelecteChat(notify.chat); 
                  setNotification(notification.filter((note)=>note !== notify))
                }}
                >
                 {notify.chat.isGroupChat ? `Message from ${notify.chat.chatName}`:
                 `Message from ${genSender(user, notify.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <UserModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </UserModal>
              <MenuDivider />
              <MenuItem onClick={logOutUser}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                placeholder="Search name or Email"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                mr={2}
                mb={1}
              />
              <Button colorScheme="teal" onClick={handleSearch}>
                Search
              </Button>
            </Box>
            {loading ? (
              <SkeletonLoading />
            ) : (
              results &&
              results?.map((user) => (
                <UserList
                  key={user._id}
                  user={user}
                  handleFunction={() =>accesUsers(user._id)}
                />
              ))
            )}
            {chatLoading && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export { SearchDraw };
