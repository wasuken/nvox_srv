import Head from "next/head";
import Image from "next/image";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const InputArea = styled.div``;
const InputTitleArea = styled.div``;
const InputDescArea = styled.div``;
const InputButtonArea = styled.div``;
const LearnListArea = styled.div``;

interface Learn {
  id: string;
  name: string;
}

export default function Index() {
  // const queryClient = useQueryClient();
  const { data: learnList } = useQuery<Learn[]>("learnList", fetchList);
  const [_loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  // const mut = useMutation(post, {
  //   onSuccess: () => {
  //     queryClient.invalidateQueries("learnList");
  //     setName("");
  //     setDesc("");
  //   },
  // });
  async function fetchList() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/learn`);
    const json = await res.json();
    return json;
  }
  function post(iName: string, iDescription: string) {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/learn`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: iName, description: iDescription }),
    })
      .then((res) => res.json())
      .then((json) => {
        setLoading(false);
      });
  }
  return (
    <div>
      <InputArea>
        <InputTitleArea>
          <h3>学習タイトル</h3>
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </InputTitleArea>
        <InputDescArea>
          <h3>学習概要(任意)</h3>
          <div>
            <textarea
              cols={30}
              rows={10}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            ></textarea>
          </div>
        </InputDescArea>
        <InputButtonArea>
          <button onClick={() => post(name, desc)}>POST</button>
        </InputButtonArea>
      </InputArea>
      <LearnListArea>
        <h3>学習一覧</h3>
        <div>
          <ul>
            {learnList &&
              learnList.map((learn, i) => (
                <li key={i}>
                  <a href={`/learn/${learn.id}`}>{learn.name}</a>
                </li>
              ))}
          </ul>
        </div>
      </LearnListArea>
    </div>
  );
}
