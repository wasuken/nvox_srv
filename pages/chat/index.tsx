import Head from "next/head";
import Image from "next/image";
import styled from "styled-components";
import { useState, useEffect } from "react";

const ChatLogList = styled.div`
  width: 60vw;
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
  width: 400px;
  padding: 20px;
  border: 1px solid blue;
  border-radius: 10px;
`;
const ChatLogListHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;
const ChatLogListHeaderCol = styled.div``;

export default function Index() {
  const [text, setText] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [loading, setLoading] = useState(false);
  function PostChat() {
    setLoading(true);
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
          ...chatLog,
          {
            text,
            user: 0, // user
          },
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
  if (loading) return <p>Loading...</p>;
  return (
    <div>
      <ChatLogList>
        <ChatLogListHeader>
          <ChatLogListHeaderCol>User</ChatLogListHeaderCol>
          <ChatLogListHeaderCol>System</ChatLogListHeaderCol>
        </ChatLogListHeader>
        {chatLog.map((chat) =>
          chat.user === 0 ? (
            <UserChat>
              <ChatContent>
                {chat.text}
              </ChatContent>
            </UserChat>
          ) : (
            <SystemChat>
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
      </ChatLogList>
      <div>
        <textarea
          cols="30"
          rows="10"
          onChange={(e) => setText(e.target.value)}
          value={text}
        ></textarea>
      </div>
      <button onClick={() => PostChat()}>post</button>
    </div>
  );
}
