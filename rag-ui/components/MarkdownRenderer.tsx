import { Box, Code, Heading, Link, Text } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

export default function MarkdownRenderer({ answer }: { answer: string }) {
  return (
    <Box lineHeight="1.7" fontFamily="inherit">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          h1: ({ children }) => <Heading as="h1" size="lg" mt={0} mb={3}>{children}</Heading>,
          h2: ({ children }) => <Heading as="h2" size="md" mt={5} mb={2}>{children}</Heading>,
          h3: ({ children }) => <Heading as="h3" size="sm" mt={4} mb={2}>{children}</Heading>,
          h4: ({ children }) => <Heading as="h4" size="sm" mt={4} mb={2}>{children}</Heading>,
          h5: ({ children }) => <Heading as="h5" size="sm" mt={3} mb={2}>{children}</Heading>,
          h6: ({ children }) => <Heading as="h6" size="sm" mt={3} mb={2}>{children}</Heading>,
          p: ({ children }) => <Text mb={4}>{children}</Text>,
          ul: ({ children }) => <Box as="ul" pl={6} mb={4} listStyleType="disc">{children}</Box>,
          ol: ({ children }) => <Box as="ol" pl={6} mb={4} listStyleType="decimal">{children}</Box>,
          li: ({ children }) => <Box as="li" mb={1}>{children}</Box>,
          blockquote: ({ children }) => (
            <Box borderLeft="4px solid" borderColor="teal.400" pl={4} mb={4} color="fg.muted">
              {children}
            </Box>
          ),
          a: ({ href, children }) => (
            <Link href={href} target="_blank" rel="noreferrer" color="blue.500">
              {children}
            </Link>
          ),
          code: ({ children }) => <Code fontSize="0.9em">{children}</Code>,
          pre: ({ children }) => (
            <Box as="pre" overflowX="auto" p={4} mb={4} borderRadius="md" bg="gray.100">
              {children}
            </Box>
          ),
          table: ({ children }) => (
            <Box as="table" width="100%" mb={4} borderWidth="1px" borderRadius="md">
              {children}
            </Box>
          ),
          th: ({ children }) => <Box as="th" textAlign="left" p={2} borderWidth="1px">{children}</Box>,
          td: ({ children }) => <Box as="td" p={2} borderWidth="1px">{children}</Box>,
        }}
      >
        {answer}
      </ReactMarkdown>
    </Box>
  );
}
