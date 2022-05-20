
 const genSender = (loggedUser, users)=>{
     if(!loggedUser || !users) return;
    return users[0]._id === loggedUser._id ? users[1].name: users[0].name; 
}

const genSenderData =  (loggedUser, users)=>{
    return users[0]._id === loggedUser._id ? users[1]: users[0]; 
}

const isSameSenderMargin = (messages, mes, idx, userId)=>{
    if( idx < messages.length - 1 && 
        messages[idx+1].sender._id === mes.sender._id && 
        messages[idx].sender._id !== userId)
        return 33; 
        else if (
                (idx < messages.length-1 && 
                messages[idx+1].sender._id !== mes.sender._id && 
                messages[idx].sender._id !== userId) || 
               ( idx === messages.length-1 && 
                messages[idx].sender._id !== userId)
            )
            return 0; 
            else return "auto"; 
}

const isSameSender = (messages, mes, idx, userId)=>{
    return(
        idx<messages.length -1 &&
        (messages[idx+1].sender._id !== mes.sender._id ||
        messages[1+1].sender._id === undefined) &&
        messages[idx].sender._id !== userId
    ); 
}; 

 const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
  };

  const isEndMessage = (message, idx, userId)=>{
      return (
          idx === message.length-1 &&
          message[message.length - 1].sender._id !== userId &&
          message[message.length-1].sender._id
      ); 
  }; 
export {genSender, genSenderData, isSameSenderMargin, isSameSender, isSameUser, isEndMessage}; 