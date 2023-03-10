import Head from "next/head";
import Image from "next/image";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function trimTitle(title: string) {
  const sepa = " - ";
  return title.split(sepa).slice(1).join(sepa);
}

const InputWorkItem = styled.div`
  margin: auto;
  width: 150px;
`;
const InputWorkArea = styled.div`
  display: flex;
  justify-content: space-between;
  width: 500px;
`;

const List = styled.ul`
  padding: 5px 10px 20px 10px;
`;

const ListItem = styled.li`
  list-style-type: none;
  cursor: pointer;
  border-bottom: 1px solid gray;
  margin-bottom: 10px;
`;

const NaroWorkManageArea = styled.div`
  padding: 10px;
  border: 1px solid red;
  border-radius: 15px;
  margin: 10px;
  overflow: scroll;
`;

const DebugArea = styled.div`
  padding: 10px;
  border: 1px solid red;
  border-radius: 15px;
  margin: 10px;
`;

// サイドバーとメインで構成
const PageLayout = styled.div`
  margin-top: 10px;
  display: flex;
  height: 85vh;
`;

const WavSideBar = styled.div`
  width: 20vw;
  border: 1px solid gray;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 5px 5px 5px gray;
  margin-left: 5px;
  overflow: scroll;
`;

const NaroMainArea = styled.div`
  width: 75vw;
  border: 1px solid gray;
  border-radius: 10px;
  margin-left: 10px;
  box-shadow: 5px 5px 5px gray;
  overflow: scroll;
`;
const NaroInputArea = styled.div`
  padding: 10px;
  border: 2px solid #88112255;
  border-radius: 15px;
  margin: 10px;
`;

// naro/index.tsx
export default function Index() {
  const queryClient = useQueryClient();
  // 作品選択周り
  const [inputNcode, setInputNcode] = useState("");
  const [ncode, setNcode] = useState("");
  const [naro, setNaro] = useState(null);
  async function fetchIdList() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/naro`);
    const json = await res.json();
    return json;
  }
  const { data: idList, status: fetchStatus } = useQuery("idList", fetchIdList);
  async function PostNaro() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/naro`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ncode: inputNcode }),
    });
    const json = await res.json();
    return json;
  }
  function PostNaroClick() {
    PostNaro().then((res) => {
      console.log(res);
      queryClient.invalidateQueries("idList");
      setInputNcode("");
    });
  }

  // 作品の話周り
  const [workFetchStatus, setWorkFetchStatus] = useState("success");
  const [workList, setWorkList] = useState([]);
  const [begin, setBegin] = useState(0);
  const [end, setEnd] = useState(0);
  async function fetchWorkList(ncode: string) {
    if (ncode === "") return [];
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/naro/${ncode}`
    );
    const json = await res.json();
    return json;
  }
  function getNaroWork(ncode: string) {
    setNcode(ncode);
    setNaro(idList.find((x) => x.ncode === ncode));
    setWorkList([]);
    setWorkFetchStatus("loading");
    fetchWorkList(ncode).then((json) => {
      setWorkList(json);
      setWorkFetchStatus("success");
    });
  }
  // 話のWav化リクエスト
  async function requestNaroWorks(ncode: string, begin: number, end: number) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/naro/${ncode}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ begin, end }),
      }
    );
    const json = await res.json();
    return json;
  }
  function fetchNaroWorks(ncode: string, begin: number, end: number) {
    requestNaroWorks(ncode, begin, end).then((res) => {
      console.log(res);
      getNaroWork(ncode);
    });
  }
  async function requestNaroWorkWavs(naro_work_id: number) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/naro/work/${naro_work_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const json = await res.json();
    return json;
  }
  function fetchNaroWorkWavs(naro_work_id: number) {
    requestNaroWorkWavs(naro_work_id).then((res) => {
      console.log(res);
      getNaroWork(ncode);
    });
  }

  return (
    <PageLayout>
      <WavSideBar>
        <div>
          <Form.Control
            type="text"
            placeholder="input ncode"
            value={inputNcode}
            onChange={(e) => setInputNcode(e.target.value)}
          />
          <Button variant="primary" onClick={PostNaroClick}>
            RSS登録
          </Button>
        </div>
        <div>
          <h3>なろうWav</h3>
        </div>
        <List>
          {fetchStatus === "success" &&
            idList.map((idobj, i) => (
              <ListItem key={i} onClick={() => getNaroWork(idobj.ncode)}>
                {idobj.title}
              </ListItem>
            ))}
        </List>
      </WavSideBar>
      <NaroMainArea>
        <DebugArea>
          <h3>Debug Area</h3>
          <div>fetchStatus: {fetchStatus}</div>
          <div>workFetchStatus: {workFetchStatus}</div>
        </DebugArea>
        {ncode !== "" && (
          <NaroWorkManageArea>
            <InputWorkArea>
              <InputWorkItem>話数({naro.totalPage}話)</InputWorkItem>
              <InputWorkItem>
                <Form.Control
                  type="number"
                  placeholder="input begin"
                  value={begin}
                  onChange={(e) => setBegin(parseInt(e.target.value))}
                />
              </InputWorkItem>
              <InputWorkItem>
                <Form.Control
                  type="number"
                  placeholder="input end"
                  value={end}
                  onChange={(e) => setEnd(parseInt(e.target.value))}
                />
              </InputWorkItem>
              <Button
                variant="primary"
                onClick={() => fetchNaroWorks(ncode, begin, end)}
              >
                Fetch
              </Button>
            </InputWorkArea>
            {naro !== null && (
              <div>
                <div>選択中: "{naro.title}"</div>
                <List>
                  {workList.map((work, i) => (
                    <li>
                      <div>
                        {work.no}:{trimTitle(work.title)}
                      </div>
                      <ul>
                        {work.wavs.map((wav, j) => (
                          <figure>
                            <audio controls src={`/${wav.wavpath}`}>
                              <a href={`/${wav.wavpath}`}>Download audio</a>
                            </audio>
                          </figure>
                        ))}
                      </ul>
                      <div>
                        <Button
                          variant="primary"
                          onClick={() => fetchNaroWorkWavs(work.id)}
                        >
                          generate wav files
                        </Button>
                      </div>
                    </li>
                  ))}
                </List>
              </div>
            )}
          </NaroWorkManageArea>
        )}
      </NaroMainArea>
    </PageLayout>
  );
}
