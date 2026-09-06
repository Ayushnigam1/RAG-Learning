"use client";

import { Toaster, toaster } from "@/components/ui/toaster";
import { 
  Box, 
  Button, 
  Card, 
  Container, 
  Heading, 
  HStack, 
  Input, 
  Spinner, 
  Text, 
  Textarea, 
  VStack,
  Icon,
  Flex,
  Avatar
} from "@chakra-ui/react";
import { useState } from "react";
import { FiUpload, FiFile, FiSend, FiMessageSquare } from "react-icons/fi";
import Footer from "@/components/Footer";
import MarkdownRenderer from "@/components/MarkdownRenderer";

// const API_URL = "http://localhost:5050";
const API_URL = "https://rag-learning.onrender.com";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<Array<{ fileName?: unknown; chunkIndex?: unknown; score?: number }>>([]);
  const [File, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {  
    if (e.target.files === null) return;
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) {
      toaster.create({
        title: "Please enter a question.",
        type: "warning",
      });
      return;
    }
    
    setLoading(true);
    setAnswer("");
    setSources([]);
    
    try {
      const response = await fetch(`${API_URL}/api/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Query failed");
      setAnswer(data.answer);
      setSources(data.sources || []);
      
    } catch (error) {
      console.error("Error fetching answer:", error);
      toaster.create({
        title: "Error generating answer.",
        type: "error",
      });
    } finally {
      setLoading(false);
      setQuestion("");
    }
  };

  const hanldeUploadFile = async () => {
    if (!File) {
      toaster.create({
        title: "No file selected",
        type: "warning",
      });
      return;
    }

    setUploading(true);
    console.log("Uploading file:", File.name);
    
    toaster.create({
      title: `Starting ingestion for file ${File.name}`,
      type: "info",
    });

    const formData = new FormData();
    formData.append("file", File);
    
    try {
      const response = await fetch(`${API_URL}/api/ingest`, {
        method: "POST",
        body: formData,
      });
      
      if (response.ok) {
        setFile(null);
        toaster.create({
          title: "File ingested successfully!",
          type: "success",
        });
      } else {
        setFile(null);
        toaster.create({
          title: "Failed to ingest file.",
          type: "error",
        });
      }
    } catch (error) {
      setFile(null);
      toaster.create({
        title: `Failed to upload file.${error}`,
        type: "error",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Toaster />
      <Box 
        minH="100vh" 
        bg="bg.subtle" 
        py={8}
        fontFamily="Menlo, Monaco, Consolas, 'Andale Mono', 'Ubuntu Mono', 'Courier New', monospace"
      >
        <Container maxW="4xl">
          <VStack gap={8}>
            {/* Header Section */}
            <Card.Root width="100%" variant="outline">
              <Card.Body py={8}>
                <VStack gap={4} textAlign="center">
                  <HStack justify="center">
                  <Avatar.Root size="lg" bg="bg.emphasized">
                    <Avatar.Fallback>
                      <Icon as={FiMessageSquare} w={8} h={8} />
                    </Avatar.Fallback>
                  </Avatar.Root>
                  <Heading 
                    size="xl" 
                    color="fg.emphasized"
                    fontWeight="bold"
                  >
                    RAG Chat Application
                  </Heading>
                  </HStack>
                  <Text 
                    fontSize="md" 
                    color="fg.muted"
                    maxW="md"
                  >
                    Upload your documents and get intelligent answers powered by AI
                  </Text>
                </VStack>
              </Card.Body>
            </Card.Root>

            {/* File Upload Section */}
            <Card.Root width="100%" variant="outline">
              <Card.Body gap="4">
                <VStack gap={2} align="start">
                  <Heading size="lg" color="fg.emphasized">
                    Document Ingestion
                  </Heading>
                  <Text color="fg.muted">
                    Upload your PDF documents to build knowledge base
                  </Text>
                </VStack>
                
                <HStack w="100%" gap={4}>
                  <Box flex={1}>
                    <Input
                      type="file"
                      onChange={handleFileChange}
      accept=".pdf,.docx,.txt"
                      variant="outline"
                      size="lg"
                    />
                  </Box>
                  <Button
                    onClick={hanldeUploadFile}
                    disabled={!File || uploading}
                    colorPalette="teal"
                    size="lg"
                    loading={uploading}
                    px={8} 
                  >
                    <FiUpload />{uploading ? "Uploading..." : "Ingest File"}
                  </Button>
                </HStack>
                
                {File && (
                  <HStack 
                    w="100%" 
                    p={3} 
                    bg="bg.subtle" 
                    borderRadius="l2" 
                    border="1px solid" 
                    borderColor="border.subtle"
                  >
                    <Icon as={FiFile} color="fg.muted" />
                    <Text fontSize="sm" color="fg.muted" flex={1}>
                      {File.name}
                    </Text>
                    <Text fontSize="sm" color="fg.subtle">
                      {(File.size / 1024 / 1024).toFixed(2)} MB
                    </Text>
                  </HStack>
                )}
              </Card.Body>
            </Card.Root>

          
            <Card.Root width="100%" variant="outline">
              <Card.Body gap="4">
                <VStack gap={2} align="start">
                  <Heading size="lg" color="fg.emphasized">
                    Ask Questions
                  </Heading>
                  <Text color="fg.muted">
                    Get answers based on your uploaded documents
                  </Text>
                </VStack>
                
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="What would you like to know about your documents?"
                  rows={4}
                  size="lg"
                  fontFamily="inherit"
                />
                
                <Button
                  onClick={handleAsk}
                  disabled={loading || !question.trim()}
                  colorPalette="blue"
                  size="lg"
                  loading={loading}
                  w={{ base: "100%", md: "auto" }}
                  px={8}
               
                >
                 <FiSend /> {loading ? "Generating..." : "Ask Question"}
                </Button>
              </Card.Body>
            </Card.Root>

            {/* Answer Section */}
            {(loading || answer) && (
              <Card.Root width="100%" variant="outline">
                <Card.Body gap="4">
                  <VStack gap={2} align="start">
                    <Heading size="md" color="fg.emphasized">
                      Answer
                    </Heading>
                  </VStack>
                  
                  
                  {loading && (
                    <Flex w="100%" align="center" justify="center" py={8}>
                      <VStack gap={4}>
                        <Spinner size="xl" />
                        <Text color="fg.muted" fontSize="lg">
                          Analyzing your documents...
                        </Text>
                      </VStack>
                    </Flex>
                  )}
                  {!loading && answer && (
                    <Box
                      p={4}
                      bg="bg.subtle"
                      borderRadius="l2"
                      border="1px solid"
                      borderColor="border.subtle"
                      w="100%"
                    >
                      <MarkdownRenderer answer={answer} />
                      {sources.length > 0 && (
                        <Box mt={4}>
                          <Text fontSize="sm" color="fg.muted" mb={2}>
                            Sources
                          </Text>
                          {sources.map((source, index) => (
                            <Text key={`${String(source.fileName)}-${String(source.chunkIndex)}-${index}`} fontSize="sm" color="fg.muted">
                              {String(source.fileName || "Unknown file")} · chunk {String(source.chunkIndex ?? "-")}
                            </Text>
                          ))}
                        </Box>
                      )}
                    </Box>
                  )}
                </Card.Body>
              </Card.Root>
            )}
          </VStack>
        </Container>
      </Box>
      <Footer />
    </>
  );
}
