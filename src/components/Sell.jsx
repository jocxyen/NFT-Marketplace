import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  NumberInput,
  useDisclosure,
  FormLabel,
  NumberInputField,
  InputLeftElement,
  InputGroup,
  Input,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { BigNumber, ethers } from "ethers";
import NFTMarket from "../NFTMarket.json";
import { tokenAddr } from "../constants";
const Sell = ({ nftAddr, tokenId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const sign = provider.getSigner();
    const contract = new ethers.Contract(tokenAddr, NFTMarket.abi, sign);
    console.log(contract);
    try {
      setLoading(true);

      console.log(price);
      console.log(nftAddr + " " + tokenId);
      const res = await contract.sellNFT(
        nftAddr,
        BigNumber.from(tokenId),
        BigNumber.from(price)
      );
      console.log(res);
      setLoading(false);
      toast({
        title: "Your NFT is up for SALE",
        status: "success",
        isClosable: true,
      });
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  return (
    <>
      <Button colorScheme="blue" w="full" mb={2} onClick={onOpen}>
        Sell 💰
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sell This NFT</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <FormControl isRequired>
                <FormLabel htmlFor="price">Price</FormLabel>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    fontSize="1.2em"
                    children={
                      <Icon icon="cryptocurrency:matic" color="blueviolet" />
                    }
                  />
                  <Input
                    placeholder="Enter amount"
                    type="number"
                    id="price"
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </InputGroup>
              </FormControl>
              <Button
                colorScheme="blue"
                m={2}
                isLoading={loading}
                onClick={handleSubmit}
              >
                Sell
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Sell;
