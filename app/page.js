"use client";
import { useState, useEffect, useRef } from "react";
import { Box, Stack, TextField, Button, Typography } from "@mui/material";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi, I'm the Headstarter support agent. How can I assist you today?`,
    },
  ]);

  const [message, setMessage] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);
    setMessage("");

    try {
      const response = await fetch("api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([...messages, { role: "user", content: message }]),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let result = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value || new Uint8Array());
        setMessages((messages) => {
          const lastMessage = messages[messages.length - 1];
          const otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            {
              ...lastMessage,
              content: lastMessage.content + result,
            },
          ];
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor="#f4f4f9"
    >
      <Typography
        variant="h4"
        color="#333"
        mb={4}
        fontWeight="bold"
        textAlign="center"
        sx={{
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
        }}
      >
        Welcome to our Latest Chatbot!
      </Typography>

      <Stack
        direction="column"
        width="400px"
        height="600px"
        border="1px solid #ddd"
        p={2}
        spacing={2}
        bgcolor="#ffffff"
        borderRadius={8}
        boxShadow="0px 4px 8px rgba(0, 0, 0, 0.1)"
      >
        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
          id="chat-container"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={message.role === "assistant" ? "flex-start" : "flex-end"}
            >
              <Box
                bgcolor={message.role === "assistant" ? "#007bff" : "#28a745"}
                color="white"
                borderRadius={16}
                p={2}
                maxWidth="80%"
                sx={{
                  wordBreak: "break-word",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                {message.content}
              </Box>
            </Box>
          ))}
          <div ref={chatEndRef} />
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{ bgcolor: "#f9f9f9" }}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            sx={{
              bgcolor: '#007bff',
              color: 'white',
              '&:hover': {
                bgcolor: '#0056b3',
              },
              borderRadius: 16,
            }}
          >
            SEND
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
