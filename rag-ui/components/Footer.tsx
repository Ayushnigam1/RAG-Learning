"use client";

import { Box, Text, VStack, HStack, Icon, Link } from "@chakra-ui/react";
import { FiHeart, FiGithub, FiMail } from "react-icons/fi";

const Footer = () => {
  return (
    <Box 
      as="footer" 
      bg="bg.subtle" 
      borderTop="1px solid" 
      borderColor="border.subtle"
      mt="auto"
      py={8}
    >
      <VStack gap={4}>
        {/* Social Links */}
        <HStack gap={6}>
          <Link 
            href="https://github.com/Ayushnigam1" 
            target="_blank" 
            rel="noopener noreferrer"
            color="fg.muted"
            _hover={{ color: "fg.emphasized" }}
            transition="color 0.2s"
          >
            <Icon as={FiGithub} w={5} h={5} />
          </Link>
          <Link 
            href="mailto:ayush27nigam02@gmail.com"
            color="fg.muted"
            _hover={{ color: "fg.emphasized" }}
            transition="color 0.2s"
          >
            <Icon as={FiMail} w={5} h={5} />
          </Link>
        </HStack>

        {/* Made with love text */}
        <HStack gap={1} color="fg.muted">
          <Text fontSize="sm">Made with</Text>
          <Icon as={FiHeart} w={4} h={4} color="red.500" />
          <Text fontSize="sm">for the AI community</Text>
        </HStack>

        {/* Copyright */}
        <Text fontSize="sm" color="fg.subtle">
          © {new Date().getFullYear()} RAG Chat App. All rights reserved.
        </Text>
      </VStack>
    </Box>
  );
};

export default Footer;