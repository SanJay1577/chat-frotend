import { Box } from '@chakra-ui/react'
import React, {   useState }  from 'react'


import ChatBox from '../Components/ChatBox.js';
import { SearchDraw } from '../Components/Misc/SearchDraw.js';
import MyChats from '../Components/MyChats.js';
import  { ChatState } from '../Context/chatProvider'




const ChatPage = () => {

  const {userDetails} = ChatState();
 const [repeatFetch, setRepeatFetch] = useState(false); 
  return (

   <div style={{width:"100%"}}>
       {userDetails && (<SearchDraw/>)}
       <Box 
       display="flex"
       justifyContent="space-between"
       width="100%"
       height="94vh"
       padding="10px"
       >
       {userDetails && (<MyChats repeatFetch={repeatFetch} />) } 
        {userDetails && (<ChatBox repeatFetch={repeatFetch} setRepeatFetch={setRepeatFetch}/>)}

       </Box>
   </div>

  )
}

export default ChatPage