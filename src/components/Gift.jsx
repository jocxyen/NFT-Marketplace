import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  useDisclosure,
  FormLabel,
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
import Axios from "axios";

const Gift = ({ nftAddr, tokenId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [addr, setAddr] = useState("");
  const [loading, setLoading] = useState(false);
  const url = `https://unstoppabledomains.g.alchemy.com/domains/${addr}`;

  const toast = useToast();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const sign = provider.getSigner();
    const contract = new ethers.Contract(tokenAddr, NFTMarket.abi, sign);
    if (addr.length != 42) {
      Axios.get(url, {
        headers: { Authorization: `Bearer ${process.env.REACT_APP_ALCHEMY_API}` },
      }).then((res) => {
        setAddr(res.data.records["crypto.ETH.address"]);
      });
    }
    try {
      setLoading(true);
      console.log(addr);
      const res = await contract.giftNFT(nftAddr, tokenId, addr);
      res.wait();
      console.log(res);
      setLoading(false);
      toast({
        title: "NFT successfully sent!",
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
      <Button colorScheme="pink" w="full" mb={2} onClick={onOpen}>
        Gift 💛
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Gift This NFT</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <FormControl isRequired>
                <FormLabel htmlFor="receiver">
                  His/Her Address or Unstoppable Domain
                </FormLabel>
                <InputGroup>
                  <Input
                    placeholder="xxx.crypto"
                    type="text"
                    id="receiver"
                    onChange={(e) => setAddr(e.target.value)}
                  />
                </InputGroup>
              </FormControl>
              <Button
                colorScheme="blue"
                m={2}
                isLoading={loading}
                onClick={handleSubmit}
              >
                Gift
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Gift;
