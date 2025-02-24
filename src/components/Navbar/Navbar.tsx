"use client";
import React, { useState, useEffect, JSX } from "react";
import {
  Box,
  Button,
  Flex,
  Text,
  Link,
  useDisclosure,
  useColorMode,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { FaGithub, FaMoon, FaSun } from "react-icons/fa";
import ProfileMenu from "./ProfileMenu";
import { useChat } from "@/contexts/ChatProvider";


const Navbar = (props: any) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [icon, setIcon] = useState<JSX.Element | null>(null); // Initial null to avoid hydration mismatch
  const path = typeof window !== "undefined" ? window.location.pathname : ""; // Safe path access
  const { isAuthenticated } = useChat();

  // Sync icon with colorMode after mount
  useEffect(() => {
    setIcon(colorMode === "dark" ? <FaSun /> : <FaMoon />);
  }, [colorMode]);

  const handleToggle = () => {
    toggleColorMode(); // This updates colorMode, and useEffect will handle the icon
  };

  return (
    <>
      {/* for responsive design icons */}
      {/* {!path.includes("dashboard") && ( */}
      <Box
        position={"absolute"}
        top={5}
        left={5}
        display={{
          md: "none",
          base: "flex",
        }}
      >
        <Button
          p={3}
          borderRadius={"full"}
          borderWidth={1}
          fontSize={"small"}
          backgroundColor={"transparent"}
          onClick={handleToggle}
          mx={1}
        >
          {icon}
        </Button>
        <Link
          p={3}
          borderRadius={"full"}
          borderWidth={1}
          fontSize={"small"}
          backgroundColor={"transparent"}
          href="https://github.com/harshal255"
          mx={1}
        >
          <FaGithub />
        </Link>
      </Box>
      {/* )} */}
      <Box
        p={3}
        w={{ base: "94vw", md: "99vw" }}
        m={2}
        borderRadius="10px"
        borderWidth="2px"
        display={{
          base: "none",
          md: "block",
        }}
      >
        <Flex justify={"space-between"}>
          <NextLink href="/">
            <Text fontSize="2xl">NextChat</Text>
          </NextLink>

          <Box
            display={{ base: "none", md: "block" }}
            justifyContent="space-between"
            alignItems="center"
          >
            <Button
              onClick={handleToggle}
              mr={2}
              borderRadius={"full"}
              borderWidth={1}
              fontSize={"small"}
              backgroundColor={"transparent"}
              p={3}
            >
              {icon}
            </Button>
            <Button
              borderRadius={"full"}
              borderWidth={1}
              fontSize={"small"}
              backgroundColor={"transparent"}
              p={3}
              mr={2}
              onClick={() => {
                window.open("https://github.com/harshal255");
              }}
            >
              <FaGithub />
            </Button>
            {isAuthenticated && (
              <ProfileMenu isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
            )}
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default Navbar;
