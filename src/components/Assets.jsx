import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  CircularProgress,
  Image,
  Progress,
  Spacer,
  Text,
  Flex,
  Heading,
  toast,
  useToast,
  Link,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import NFTMarket from "../NFTMarket.json";
import { ethers } from "ethers";
import { tokenAddr, transformCharacterData } from "../constants";
import { AccountContext } from "../Helper/Context";
import { UsersContext } from "../Helper/UserContext";
import Axios from "axios";
import Sell from "./Sell";
import Gift from "./Gift";
const Assets = (props) => {
  const [chainId, setChainId] = useState(80001);
  const [balance, setBalance] = useState({});
  const [gameContract, setContract] = useState({});
  const { accounts, setAccount } = useContext(AccountContext);
  const { users, setUsers } = useContext(UsersContext);
  const toast = useToast();
  // Covalent API request setup

  const url = new URL(
    `https://api.covalenthq.com/v1/${chainId}/address/${users[0]}/balances_v2/?quote-currency=USD&format=JSON&nft=true&no-nft-fetch=false&key=${process.env.REACT_APP_COVALENTAPI}`
  );
  useEffect(() => {
    const fetchData = async () => {
      Axios.get(url).then((res) => {
        setBalance(res.data.data.items);
        console.log(balance);
        return res.data.data.items;
      });
    };
    accounts[0] && console.log(fetchData());
  }, []);
  return (
    <Box
      w="100%"
      as={motion.div}
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      exit={{ x: window.innerWidth, transition: { duration: 0.1 } }}
    >
      {accounts[0] && JSON.stringify(balance) !== "{}" ? (
        <Flex flexWrap="wrap">
          {balance.map(function (i) {
            if (i.nft_data != null && i.nft_data.length > 0) {
              console.log(i);
              return (
                <Box
                  m={4}
                  p={2}
                  borderRadius="20px"
                  w="20%"
                  bgColor="rgba(255, 255, 255, .15)"
                  backdropBlur="5px"
                >
                  <Flex flexDir="column" h="100%" alignItems="center">
                    {i.nft_data[0].external_data?.image ? (
                      <Image
                        w="80px"
                        h="80px"
                        src={i.nft_data[0].external_data.image}
                        borderRadius="100%"
                      />
                    ) : (
                      ""
                    )}
                    <Heading
                      fontWeight="extrabold"
                      fontSize="2xl"
                      bgGradient="linear(to-l, purple.200, teal.300)"
                      bgClip="text"
                    >
                      {i.nft_data[0]?.external_data?.name}
                    </Heading>

                    <Text>{i.contract_name}</Text>
                    <Text>{i.contract_ticker_symbol}</Text>
                    <Text isTruncated w="80%">
                      tokenId: #{i.nft_data[0].token_id}
                    </Text>
                    <Text isTruncated w="80%">
                      contract address:
                      <Link
                        href={`https://mumbai.polygonscan.com/address/${i.contract_address}`}
                        isExternal
                      >
                        {i.contract_address}
                      </Link>
                    </Text>
                    <Spacer />

                    <Sell
                      nftAddr={i.contract_address}
                      tokenId={i.nft_data[0].token_id}
                    />
                    <Gift
                      nftAddr={i.contract_address}
                      tokenId={i.nft_data[0].token_id}
                    />
                  </Flex>
                </Box>
              );
            }
          })}
        </Flex>
      ) : (
        <Center>
          <Text>Please connect your wallet!</Text>
        </Center>
      )}
    </Box>
  );
};

export default Assets;
