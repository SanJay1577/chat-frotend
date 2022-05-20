import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { loginMethod } from "./authHelper";
import { useHistory } from "react-router-dom";
import { ChatState } from "../../Context/chatProvider";

const Login = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();
  const { setUserDetails, setSelecteChat } = ChatState();
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  const { email, password } = userInfo;
  const handleShow = () => setShow(!show);
  const handleChange = (name) => (event) => {
    const value = event.target.value;
    setUserInfo({ ...userInfo, [name]: value });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    loginMethod(userInfo).then((data) => {
      if (data.error) {
        toast({
          title: "Error Occured!",
          description: data.error,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
      } else {
        setLoading(true);
        toast({
          title: "Login Successful",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
        localStorage.setItem("userDetails", JSON.stringify(data));
        const userInfo = JSON.parse(localStorage.getItem("userDetails"));
        setUserDetails(userInfo);
        setSelecteChat();
        setLoading(false);
        history.push("/chats");
      }
    });
  };
  return (
    <VStack spacing="5px">
      <FormControl id="email" isRequired>
        <FormLabel>Enter Your Email</FormLabel>
        <Input
          type="email"
          value={email}
          onChange={handleChange("email")}
          placeholder="Enter Your Name"
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            value={password}
            onChange={handleChange("password")}
            placeholder="Enter Your Password"
          />
          <InputRightElement width="4rem">
            <Button h="1.75rem" size="sm" bg="white" onClick={handleShow}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="teal"
        width="100%"
        style={{ marginTop: 15 }}
        isLoading={loading}
        onClick={handleSubmit}
      >
        Login
      </Button>
    </VStack>
  );
};

export default Login;
