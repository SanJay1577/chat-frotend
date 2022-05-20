import React, { useState } from "react";
import {
  IconButton,
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  useToast,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  FormControl,
  Input,
  Button,
  ModalFooter,
  Spinner,
} from "@chakra-ui/react";
import { ChatState } from "../../Context/chatProvider";
import { ViewIcon } from "@chakra-ui/icons";
import { UserBadge } from "../userAvatars/userBadge";
import { UserList } from "../userAvatars/UserList";
import {addToGroup, getAllUsers, removeUser, renameGroup} from "./miscHelper.js"; 

const UpdateGroup = ({ repeatFetch, setRepeatFetch, fetchMessages}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { userDetails, selectedChat, setSelecteChat } = ChatState();
  const { user, token } = userDetails;
  const [groupName, setGroupName] = useState(""); 
  const [nameLoading, setNameLoading] = useState(false); 
  const [loading, setLoading] = useState(false); 
  const [search, setSearch] = useState("");
  const [result, setResult] = useState([]); 
  const toast = useToast(); 

  const handleRename = () =>{
      setNameLoading(true); 
    if(!groupName) {
       toast({
        title: "Please fill name",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom", 
       })
       setNameLoading(false)
    };
    const renameContent = {
        chatId:selectedChat._id,
        chatName:groupName,
    }; 
    renameGroup(token, renameContent).then((data)=>{
        if(data.error){
            toast({
                title: data.error,
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom", 
               })
               setNameLoading(false)
        } else{
            setSelecteChat(data); 
            setRepeatFetch(!repeatFetch)
            setNameLoading(false);
        }
    })
    setGroupName(""); 
  }

  const handleSearch = (userSearch)=>{
    setSearch(userSearch); 
    if(!userSearch)
    return ;
    try {
      setLoading(true); 
      getAllUsers(search, token).then((data)=>{
        if(data.error){
          toast({
            title: data.error,
              status: "error",
               duration: 5000,
                isClosable: true,
               position: "bottom-left",
          })
          setLoading(false);
        }else{
           setLoading(false);
           setResult(data); 
        }
      })
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false)
    }
}
  const handleAddUser = (addUser)=>{
    if(selectedChat.users.find((u)=>u._id===addUser._id)){
      toast({
        title: "User Already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      }); 
      return;
    }
    if(selectedChat.groupAdmin._id !== user._id){
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      }); 
      return;
    }
    const editContent = {
      chatId:selectedChat._id,
      userId:addUser._id
    }; 
       setLoading(true)
      addToGroup(token, editContent).then((data)=>{
        if(data.error){
          toast({
            title: data.error,
                 status: "error",
                 duration: 5000,
                  isClosable: true,
                 position: "bottom",
          }); 
          setLoading(false); 
        }else{
          setSelecteChat(data); 
          setRepeatFetch(!repeatFetch)
          setLoading(false)
        }
      }).catch((err)=>{
        toast({
          title: "Error Occured!",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        }); 
        setLoading(false); 
      })
    setGroupName(""); 
  }; 

  const handleRemove = (removeuser) => {
    if(selectedChat.groupAdmin._id !== user._id && removeuser._id !== user._id){
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      })
      return; 
    }
    const removeContent = {
      chatId:selectedChat._id,
      userId:removeuser._id
    }
     removeUser(token, removeContent).then((data)=>{
        setLoading(true)
       if(data.error){
          toast({
            title: data.error,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
          }); 
          setLoading(false)
       }else{
         removeuser._id === user._id ? setSelecteChat():setSelecteChat(data); 
         setRepeatFetch(!repeatFetch); 
         fetchMessages();
         setLoading(false); 
       }
     })
     setGroupName(""); 
     setResult(); 
  };


  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadge
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin._id}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input 
              placeholder="Chat Name"
               mb={3} 
               value = {groupName}
               onChange={(event)=>setGroupName(event.target.value)}
               />
              <Button variant="solid" 
              colorScheme="blue" 
              ml={1}
              isLoading={nameLoading}
              onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {loading ? (
              <Spinner size="lg" />
            ) : (
                result?.map((user) => (
                <UserList
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroup;
