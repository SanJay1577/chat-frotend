import { Switch } from "react-router-dom";
import { Route } from "react-router-dom";
import ChatPage from "./Pages/chatPage";
import HomePage from "./Pages/homePage.js"
function App() {
  return (
   <Switch>
 <Route exact path ="/">
  <HomePage/>
 </Route>
 <Route path="/chats">
  <ChatPage/>
 </Route>
  </Switch>

  );
}

export default App;
