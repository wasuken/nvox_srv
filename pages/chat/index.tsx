import Head from "next/head";
import Image from "next/image";
import styled from "styled-components";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const ChatSpace = styled.div`
  height: 50px;
`;

const ChatLogList = styled.div`
  width: 80vw;
  height: 400px;
  overflow: scroll;
`;
const UserChat = styled.div`
  display: flex;
  justify-content: flex-start;
  margin: 5px;
`;
const SystemChat = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 5px;
`;
const ChatContent = styled.div`
  width: 300px;
  padding: 20px;
  border: 1px solid blue;
  border-radius: 10px;
`;
const ChatLogListHeader = styled.div`
  display: flex;
  position: fixed;
  z-index: 2;
  justify-content: space-evenly;
  padding: 5px;
  width: 80vw;
  background: #66666644;
`;
const ChatLogListHeaderCol = styled.div`
  margin: 3px;
`;

export default function Index() {
  const [text, setText] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [loading, setLoading] = useState(false);
  function PostChat() {
    if (loading) return;
    setLoading(true);
    setChatLog([
      ...chatLog,
      {
        text,
        user: 0, // user
      },
    ]);
    const updatedChatLog = [
      ...chatLog,
      {
        text,
        user: 0, // user
      },
    ]
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/openai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: text }),
    })
      .then((res) => res.json())
      .then((json) => {
        setChatLog([
          ...updatedChatLog,
          {
            text: json.text,
            user: 1, // system
            path: json.path,
          },
        ]);
        setText("");
        setLoading(false);
      });
  }
  return (
    <div>
      <ChatLogList>
        <ChatLogListHeader>
          <ChatLogListHeaderCol>User</ChatLogListHeaderCol>
          <ChatLogListHeaderCol>System</ChatLogListHeaderCol>
        </ChatLogListHeader>
        <ChatSpace />
        {chatLog.map((chat, key) =>
          chat.user === 0 ? (
            <UserChat key={key}>
              <ChatContent>{chat.text}</ChatContent>
            </UserChat>
          ) : (
            <SystemChat key={key}>
              <ChatContent>
                {chat.text}
                <figure>
                  <audio controls src={`/${chat.path}`}>
                    <a href={`/${chat.path}`}>Download audio</a>
                  </audio>
                </figure>
              </ChatContent>
            </SystemChat>
          )
        )}
        {loading ? "Loading..." : ""}
      </ChatLogList>
      <div>
        <Form.Control
          onChange={(e) => setText(e.target.value)}
          value={text}
          as="textarea"
          placeholder="Leave a comment here"
        />
      </div>
      <Button variant="primary" onClick={() => PostChat()}>
        post
      </Button>
    </div>
  );
}
