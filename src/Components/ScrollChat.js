import React from "react";
import {
  isEndMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../AllChatLogics";
import { ChatState } from "../Context/chatProvider";
import ScrollableFeed from "react-scrollable-feed";
import { Tooltip, Avatar } from "@chakra-ui/react";

export const ScrollChat = ({ messages }) => {
  const { userDetails } = ChatState();
  const { user } = userDetails;
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((mes, idx) => (
          <div style={{ display: "flex" }} key={idx}>
            {(isSameSender(messages, mes, idx, user._id) ||
              isEndMessage(messages, idx, user._id)) && (
              <Tooltip
                label={mes.sender.name}
                placement="bottom-start"
                hasArrow
              >
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor={"pointer"}
                  name={mes.sender.name}
                  src={mes.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  mes.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, mes, idx, user._id),
                marginTop: isSameUser(messages, mes, idx, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {mes.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};
