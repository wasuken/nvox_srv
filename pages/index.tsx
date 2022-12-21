import Head from "next/head";
import Image from "next/image";
import styled from "styled-components";
import { useState, useEffect } from "react";

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
    const url = e.target.value;
    setWavList([]);
    setSelectedRSS(url);
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
          <input
            type="url"
            placeholder="rss url"
            value={rssUrl}
            onChange={(e) => setRSSUrl(e.target.value)}
          />
          <button onClick={PostRSSClick}>Post</button>
        </div>
        <select onChange={RSSSelectChange}>
          <option value="">No Selected</option>
          {rssList.map((rss, i) => (
            <option key={i} value={rss.id}>
              {rss.name}
            </option>
          ))}
        </select>
        <button onClick={RSSSelectClick}>選択したRSSから記事一覧を表示</button>
        <button onClick={ReacquireRSSClick}>再取得</button>
      </Top>
      <Middle>
        <h2>wav file list </h2>
        <WavList list={wavList} />
      </Middle>
    </div>
  );
}
