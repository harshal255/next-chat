'use client';
import React, { useState } from "react";
import {
    Box,
    Flex,
    Text,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
} from "@chakra-ui/react";
import Auth from "../components/Authentication/Auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Home = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [index, setIndex] = useState<number | undefined>(undefined);
    const handleloginopen = () => {
        setIndex(0);
        onOpen();
    };

    const handlesignupopen = () => {
        setIndex(1);
        onOpen();
    };

    return (
        <Box h={"max-content"} verticalAlign="middle">
            <Flex direction="column" align="center" justify="center" minH="80vh">
                <Box textAlign="center">
                    <Text fontSize={"7xl"} fontWeight={"bold"} fontFamily={"Work sans"}>
                        NextChat Application
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" mb={4}>
                        Online Chatting App Based On NextJS-15
                    </Text>
                    <Button mr={3} onClick={handleloginopen}>
                        Login
                    </Button>
                    <Button colorScheme="purple" onClick={handlesignupopen}>
                        Sign Up
                    </Button>
                </Box>
            </Flex>
            {/* Copyright */}
            <Text
                fontSize="sm"
                position={"fixed"}
                bottom={2}
                left={"calc(50% - 155px)"}
                mt={4}
                textAlign="center"
            >
                &copy; 2025 NextChat. All rights reserved.
                <Link href="https://github.com/harshal255" target="_blank">
                    <Text as="u" color="purple.500" ml={1}>
                        Harshal Kahar
                    </Text>
                </Link>
            </Text>
            {/* Auth */}
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                colorScheme="red"
                size={{ base: "md", md: "xl" }}
            >
                <ModalOverlay />
                <ModalContent w={{ base: "95vw" }}>
                    <ModalHeader></ModalHeader>
                    <ModalBody>
                        <Auth tabindex={index} />
                    </ModalBody>
                    <ModalCloseButton />
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default Home;
