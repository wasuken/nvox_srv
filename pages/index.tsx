import Head from "next/head";
import Image from "next/image";
import styled from "styled-components";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';

import WavList from "../components/WavList";

const Top = styled.div``;

const Middle = styled.div``;

export default function Index() {
  const [rssList, setRSSList] = useState([]);
  const [wavList, setWavList] = useState([]);
  const [rssUrl, setRSSUrl] = useState("");
  const [selectedRSS, setSelectedRSS] = useState("");
  function PostRSSClick() {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/rss`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: rssUrl }),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        setRSSUrl("");
        setWavList([]);
        fetchRSSList();
      });
  }
  function fetchRSSList() {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/rss`)
      .then((res) => res.json())
      .then((json) => setRSSList(json));
  }
  function fetchWavList(id) {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/rss/wavs/${id}`)
      .then((res) => res.json())
      .then((json) => {
        console.log(json[0]);
        setWavList(json[0].rssItems);
      });
  }
  function RSSSelectChange(e) {
    const id = e.target.value;
    fetchWavList(id);
    setSelectedRSS(id);
  }
  function RSSSelectClick() {
    if (selectedRSS === "") return;
    fetchWavList(selectedRSS);
  }
  function ReacquireRSSClick() {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/rss/${selectedRSS}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: selectedRSS }),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        setRSSUrl("");
        setWavList([]);
        fetchRSSList();
      });
  }
  useEffect(() => {
    fetchRSSList();
  }, []);
  return (
    <div>
      <Top>
        <h2>RSS</h2>
        <div>
          <Form.Control
            type="url"
            placeholder="rss url"
            value={rssUrl}
            onChange={(e) => setRSSUrl(e.target.value)}
          >
          </Form.Control>
          <Button variant="primary" onClick={PostRSSClick}>
            Post
          </Button>
        </div>
        <Form.Select onChange={RSSSelectChange} value={selectedRSS}>
          <option>No Selected</option>
          {rssList.map((rss, i) => (
            <option key={i} value={rss.id}>
              {rss.name}
            </option>
          ))}
        </Form.Select>
        <Button variant="primary" onClick={RSSSelectClick}>
          記事一覧を表示
        </Button>
        <Button variant="primary" onClick={ReacquireRSSClick}>
          再取得
        </Button>
      </Top>
      <Middle>
        <h2>wav file list </h2>
        <WavList list={wavList} />
      </Middle>
    </div>
  );
}
