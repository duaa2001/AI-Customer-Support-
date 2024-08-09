"use client";
import { useState } from "react";
import { Box, Stack, TextField, Button, Typography } from "@mui/material";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi, I'm the Headstarter support agent, how can I assist you today?`,
    },
  ]);

  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    setMessage("");
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);
    const response = await fetch("api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([...messages, { role: "user", content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let result = "";
      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result;
        }
        const text = decoder.decode(value || new Uint8Array(), );
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            {
              ...lastMessage,
              content: lastMessage.content + text,
            },
          ];
        });
      });
    });
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor="black"
    >
      <Typography
      variant="h4"
      color="white"
      mb={4}
      fontWeight="bold"
      textAlign="center" 
      sx={{
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', 
      }}
    >
      Welcome to our Latest Chatbot!
    </Typography>

      <Stack
        direction="column"
        width="500px"
        height="600px"
        border="5px solid gray"
        p={2}
        spacing={3}
        bgcolor="white"
        borderRadius={8}
      >
        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === "assistant" ? "flex-start" : "flex-end"
              }
            >
              <Box
                bgcolor={
                  message.role === "assistant"
                    ? "darkblue"
                    : "gray"
                }
                color="white"
                borderRadius={16}
                p={3}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>

        <Stack direction="row" spacing={2}></Stack>
        <TextField
          label="Message"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button variant="contained" onClick={sendMessage}
        sx={{
          bgcolor: 'mediumseagreen', 
          color: 'white', 
          '&:hover': {
            bgcolor: 'seagreen',  
          },
        }}>
          SEND
        </Button>
      </Stack>
    </Box>
  );
}
