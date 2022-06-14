import { Box } from "@chakra-ui/react";
import "./index.css";
import { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Nav from "./components/Nav";
import AnimatedRoutes from "./components/AnimatedRoutes";
import { AccountContext } from "./Helper/Context";
import { UsersContext } from "./Helper/UserContext";
function App({}) {
  const [accounts, setAccounts] = useState("");
  const [users, setUsers] = useState("");
  return (
    <AccountContext.Provider value={{ accounts, setAccounts }}>
      <UsersContext.Provider value={{ users, setUsers }}>
        <Box w="100%" h="100vh" overflow="hidden">
          <Router>
            <Nav />
            <AnimatedRoutes />
          </Router>
        </Box>
      </UsersContext.Provider>
    </AccountContext.Provider>
  );
}

export default App;
