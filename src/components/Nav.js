import React, { useContext, useState } from "react";
import { Box, Button, useToast, Heading, Spacer, Text } from "@chakra-ui/react";
import ConnectModel from "./ConnectModel";
import { Link } from "react-router-dom";
import { AccountContext } from "../Helper/Context";
import { UsersContext } from "../Helper/UserContext";
const Nav = () => {
  const menus = [
    { page: "Home", src: "/" },
    { page: "MyNFTs", src: "/mynfts" },
  ];
  const { accounts, setAccounts } = useContext(AccountContext);
  const { users, setUsers } = useContext(UsersContext);
  const [chain, setChain] = useState("");
  const toast = useToast();
  async function connectWallet() {
    if (window.ethereum) {
      try {
        const response = await window.ethereum
          .request({
            method: "wallet_requestPermissions",
            params: [{ eth_accounts: {} }],
          })
          .then(() =>
            window.ethereum.request({ method: "eth_requestAccounts" })
          );
        setAccounts(response);
        console.log(response);
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        setChain(chainId);
        toast({
          title: "Wallet connected.🦊",
          description: "Wallet connected successfully!",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      toast({
        title: "No Wallet Detected",
        description: "Please install Metamask!",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }
  return (
    <Box
      bgColor="rgba(255, 255, 255, .13)"
      backdropFilter="blur(95px)"
      display="flex"
      alignItems="center"
      zIndex="100"
      w="100%"
    >
      <Heading pl={4}>SellMyNFTs</Heading>
      <Spacer />
      {menus.map((menuItem, index) => (
        <Link
          to={menuItem.src}
          key={index}
          variant="none"
          size="lg"
          fontWeight="bold"
        >
          <Text pl={4} fontWeight="bold">
            {menuItem.page}
          </Text>
        </Link>
      ))}
      <Spacer />
      <ConnectModel
        accounts={accounts}
        setAccounts={setAccounts}
        connectWallet={connectWallet}
        chain={chain}
        setChain={setChain}
        users={users}
        setUsers={setUsers}
      />
    </Box>
  );
};

export default Nav;
