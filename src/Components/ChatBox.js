import { Box } from "@chakra-ui/react";
import { ChatState } from "../Context/chatProvider";
import SoloChat from "./SoloChat";
import "./styles.css";

const ChatBox = ({ repeatFetch, setRepeatFetch }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SoloChat repeatFetch={repeatFetch} setRepeatFetch={setRepeatFetch} />
    </Box>
  );
};
export default ChatBox;
