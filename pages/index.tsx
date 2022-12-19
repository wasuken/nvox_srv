import Head from "next/head";
import Image from "next/image";
import styled from "styled-components";
import { useState, useEffect } from "react";

const Top = styled.div``;

const Middle = styled.div``;

export default function Index() {
  const [rssList, setRSSList] = useState([]);
  const [wavList, setWavList] = useState([]);
  const [rssUrl, setRSSUrl] = useState("");
  const [selectedRSS, setSelectedRSS] = useState("");
  function PostRSSClick() {
    fetch(`/api/rss`, {
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
    fetch(`/api/rss`)
      .then((res) => res.json())
      .then((json) => setRSSList(json));
  }
  function fetchWavList(id) {
    fetch(`/api/rss/wavs/${id}`)
      .then((res) => res.json())
      .then((json) => {
        console.log(json[0])
        setWavList(json[0].rssItems)
      });
  }
  function RSSSelectChange(e){
    // wav listを更新する
    const id = e.target.value;
    setWavList([]);
    if(id === "") return;
    fetchWavList(id);
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
            <option key={i} value={rss.id}>{rss.url}</option>
          ))}
        </select>
      </Top>
      <Middle>
        <h2>wav file list </h2>
        <ul>
        {wavList.map((wav, i) => (
          <li key={i}>
            {wav.link}
          </li>
        ))}
        </ul>
      </Middle>
    </div>
  );
}
