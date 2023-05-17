import Head from "next/head";
import Image from "next/image";
import styled from "styled-components";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const InputArea = styled.div`
  width: 90vw;
`;
const ChatSpace = styled.div`
  height: 50px;
`;

const ChatLogList = styled.div`
  width: 90vw;
  height: 400px;
  overflow: scroll;
  padding-bottom: 10px;
  height: 70vh;
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
  width: 500px;
  padding: 20px;
  border: 1px solid blue;
  border-radius: 10px;
  @media screen and (max-width: 700px) {
    width: 70vw;
  }
`;
const ChatLogListHeader = styled.div`
  display: flex;
  position: fixed;
  z-index: 2;
  justify-content: space-evenly;
  padding: 5px;
  width: 90vw;
  border: 1px solid gray;
`;
const ChatLogListHeaderCol = styled.div`
  margin: 3px;
`;

interface ChatLog {
  text: string;
  user: number;
  path: string;
}

export default function Index() {
  const [text, setText] = useState("");
  const [chatLog, setChatLog] = useState<ChatLog[]>([]);
  const [loading, setLoading] = useState(false);
  function ScrollEnd(target: Element | null) {
    if (target) {
      target.scrollTo(0, target.scrollHeight);
    }
  }
  function PostChat() {
    if (loading) return;
    setLoading(true);
    setChatLog([
      ...chatLog,
      {
        text,
        user: 0, // user
        path: "",
      },
    ]);
    const updatedChatLog = [
      ...chatLog,
      {
        text,
        user: 0, // user
        path: "",
      },
    ];
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
  useEffect(() => {
    const logList = document.querySelector("#loglist");
    ScrollEnd(logList);
  }, [chatLog.length]);
  return (
    <div>
      <ChatLogList id="loglist">
        <ChatLogListHeader>
          <ChatLogListHeaderCol>User</ChatLogListHeaderCol>|
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
      <InputArea>
        <Form.Control
          onChange={(e) => setText(e.target.value)}
          value={text}
          as="textarea"
          placeholder="Leave a comment here"
        />
      </InputArea>
      <Button variant="primary" onClick={() => PostChat()}>
        POST
      </Button>
    </div>
  );
}
