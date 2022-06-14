import {
  Box,
  Button,
  Flex,
  useToast,
  Text,
  Progress,
  CircularProgress,
  Spacer,
  Link,
} from "@chakra-ui/react";
import "react-slideshow-image/dist/styles.css";
import { useEffect, useState } from "react";
import { tokenAddr } from "../constants";
import { ethers } from "ethers";
import NFTMarket from "../NFTMarket.json";
import { Icon } from "@iconify/react";
import { useContext } from "react";
import { AccountContext } from "../Helper/Context";

const Marketplace = () => {
  const [nfts, setNFTs] = useState([]);
  const { accounts, setAccount } = useContext(AccountContext);
  const [isLoading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const toast = useToast();
  const onBuy = async (id, _price) => {
    setBtnLoading(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const sign = provider.getSigner();
    const contract = new ethers.Contract(tokenAddr, NFTMarket.abi, sign);
    const price = ethers.utils.parseUnits(_price.toString(), "ether");
    try {
      const bought = await contract.buyNFTs(id, { value: price });
      await bought.wait();
      setBtnLoading(false);
      toast({
        title: "Success",
        description: "You've bought the NFT!",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (err) {
      console.log(err);
      setBtnLoading(false);
      toast({
        title: "Error",
        description: "An error occurred.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    const fetchNFTs = async () => {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const sign = provider.getSigner();
      const contract = new ethers.Contract(tokenAddr, NFTMarket.abi, sign);
      console.log(contract);
      await contract.fetchItems().then((res) => {
        setNFTs(res);
        console.log(res);
        setLoading(false);
      });
    };
    accounts[0] && fetchNFTs();
  }, []);
  return (
    <>
      {isLoading == false ? (
        <Box p={2}>
          {nfts
            .filter((i) => i[1] != "0x0000000000000000000000000000000000000000")
            .map((i) => (
              <Flex p={4} w="full">
                <Box>
                  <Text>#{i[1]}</Text>
                  <Text>Seller: {i[1]}</Text>
                  <Text>Owner: {i[2]}</Text>
                  <Text>NFT Contract Address: {i[4]}</Text>
                  <Text>Token ID: {Number(i[5]._hex)}</Text>
                </Box>
                <Spacer />
                <Flex flexDir="column" w="30%">
                  <Button
                    p={2}
                    m={2}
                    colorScheme="orange"
                    onClick={() => onBuy(Number(i[0]._hex), Number(i[3]._hex))}
                    isLoading={btnLoading}
                  >
                    Buy with
                    <Text> &nbsp;{Number(i[3]._hex)} &nbsp;</Text>
                    <Icon icon="cryptocurrency:matic" color="blueviolet" />
                  </Button>
                  <Link
                    isExternal
                    href={`https://mumbai.polygonscan.com/address/${i[4]}`}
                  >
                    <Button m={2} p={2} colorScheme="blue">
                      Details
                    </Button>
                  </Link>
                </Flex>
              </Flex>
            ))}
        </Box>
      ) : (
        <CircularProgress isIndeterminate color="green.300" />
      )}
    </>
  );
};

export default Marketplace;
