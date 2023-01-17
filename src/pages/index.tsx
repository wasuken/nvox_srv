import Head from "next/head";
import Image from "next/image";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import WavList from "../components/WavList";

const Top = styled.div``;
const Middle = styled.div``;
const MyCont = styled.div`
  width: 50%;
  padding: 15px 0 15px;
`;

export default function Index() {
  return (
    <div>
      <div>
        <h2>
          <a href="/rss">RSS</a>
        </h2>
        <div>RSSを読み上げる</div>
      </div>
      <div>
        <h2>
          <a href="/joffer">Job Offer</a>
        </h2>
        <div>求人情報の分析を行う</div>
      </div>
      <div>
        <h2>
          <a href="/learn">学習</a>
        </h2>
        <div>学習のメモの管理、音声ファイルの生成</div>
      </div>
    </div>
  );
}
