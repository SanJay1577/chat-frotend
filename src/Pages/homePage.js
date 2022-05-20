import React, { useEffect } from 'react'
import "./page.css"; 
import { Container, Box, Text, Tabs, TabList, Tab, TabPanel, TabPanels } from '@chakra-ui/react'
import Login from '../Components/Authentication/Login';
import Signup from '../Components/Authentication/Signup';
import { useHistory } from 'react-router-dom';


const HomePage = () => {
  const history = useHistory(); 
  useEffect(()=>{
    const userInfo = localStorage.getItem("userDetails"); 
    if(userInfo){
      history.push("/chats")
    }
  }, [history])

  return (
    <Container maxW="container.md" >
         <Box
         d="flex"
         justifyContent="center"
         p={3}
         bg="white"
         w="100%"
         m="40px 0 15px 0"
         borderRadius = "lg"
         borderWidth= "1px">
          <Text fontSize="4xl" 
          fontWeight="bolder"
          textAlign="center"
          color="teal">
             CHATTY
          </Text>
         </Box>
         <Box  bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
         <Tabs isFitted variant="soft-rounded" colorScheme="teal">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
            <Login/>
            </TabPanel>
            <TabPanel>
              <Signup/>
            </TabPanel>
          </TabPanels>
        </Tabs>
         </Box>
    </Container>
  )
}

export default HomePage