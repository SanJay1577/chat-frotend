import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { signupMethod } from "./authHelper";
import { useHistory } from "react-router-dom";
import { ChatState } from "../../Context/chatProvider";

const Signup = () => {
  const [show, setShow] = useState(false);
  const history = useHistory();
  const { setUserDetails, setSelecteChat } = ChatState();
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
    pic: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { name, email, password, pic } = userInfo;

  const handleChange = (name) => (event) => {
    const value = event.target.value;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const postPicDetails = (pics) => {
    console.log(pics);
    setLoading(true);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chatty-app");
      data.append("cloud_name", "sanjaycoder");
      fetch("https://api.cloudinary.com/v1_1/sanjaycoder/image/upload", {
        method: "POST",
        body: data,
        headers: {
          Accept: "applicatio/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUserInfo({ ...userInfo, pic: data.url.toString() });
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    } else {
      toast({
        title: "Error Uploading image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };

  const handleShow = () => setShow(!show);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    signupMethod(userInfo)
      .then((data) => {
        if (data.error) {
          toast({
            title: "Error Occured",
            description: data.error,
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);
        } else {
          setLoading(true);
          toast({
            title: "Registration Successful",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "bottom",
          });
          localStorage.setItem("userDetails", JSON.stringify(data));
          const userdetails = JSON.parse(localStorage.getItem("userDetails"));
          setUserDetails(userdetails);
          setSelecteChat();
          setLoading(false);
          history.push("/chats");
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <VStack spacing="5px">
      <FormControl isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          name="name"
          value={name}
          onChange={handleChange("name")}
          placeholder="Enter Your Name"
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Enter Your Email</FormLabel>
        <Input
          type="email"
          name="email"
          value={email}
          onChange={handleChange("email")}
          placeholder="Enter Your Name"
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            name="password"
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
      <FormControl id="pic">
        <FormLabel>Upload Your Picture</FormLabel>
        <Input
          type="file"
          name="pic"
          p={1.5}
          onChange={(event) => postPicDetails(event.target.files[0])}
          accept="image/*"
        />
      </FormControl>
      <Button
        colorScheme="teal"
        width="100%"
        type="submit"
        onClick={handleSubmit}
        style={{ marginTop: 15 }}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
