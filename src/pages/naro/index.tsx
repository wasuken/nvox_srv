import styled from "styled-components";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const DEBUG = false;

function trimTitle(title: string) {
  const sepa = " - ";
  return title.split(sepa).slice(1).join(sepa);
}

interface Naro {
  ncode: string;
  title: string;
  totalPage: number;
}

interface NaroWork {
  title: string;
  wavs: NaroWorkWav[];
  id: number;
  no: number;
}

interface NaroWorkWav {
  wavpath: string;
  wav_web_path: string;
  voice_downloaded: boolean;
}

// naro/index.tsx
export default function Index() {
  const queryClient = useQueryClient();
  // 作品選択周り
  const [inputNcode, setInputNcode] = useState("");
  const [ncode, setNcode] = useState("");
  const [naro, setNaro] = useState<Naro | null>(null);
  async function fetchIdList() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/naro`);
    const json = await res.json();
    return json;
  }
  const { data: idList, status: fetchStatus } = useQuery<Naro[]>(
    "idList",
    fetchIdList
  );
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
      alert("登録完了しました");
    });
  }

  // 作品の話周り
  const [workFetchStatus, setWorkFetchStatus] = useState("success");
  const [workList, setWorkList] = useState<NaroWork[]>([]);
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
    if (!idList) {
      return;
    }
    const fncode = idList.find((x) => x.ncode === ncode);
    if (!idList || !fncode) {
      return;
    }
    setNcode(ncode);
    setNaro(fncode);
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
      alert("Fetch成功");
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
        {DEBUG && (
          <DebugArea>
            <h3>Debug Area</h3>
            <div>fetchStatus: {fetchStatus}</div>
            <div>workFetchStatus: {workFetchStatus}</div>
          </DebugArea>
        )}
        {naro && (
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
            {naro && (
              <div>
                <NaroTitle>{naro.title}</NaroTitle>
                <List>
                  {workList.map((work, i) => (
                    <ListItem>
                      <div>
                        {work.no}:{trimTitle(work.title)}
                      </div>
                      <WavArea>
                        {work.wavs.map((wav, j) =>
                          wav.voice_downloaded ? (
                            <figure key={j}>
                              <audio controls src={`${wav.wav_web_path}`}>
                                <a href={`${wav.wav_web_path}`}>
                                  Download audio
                                </a>
                              </audio>
                            </figure>
                          ) : (
                            <div>waiting download...</div>
                          )
                        )}
                      </WavArea>
                      <div>
                        <Button
                          variant="primary"
                          onClick={() => fetchNaroWorkWavs(work.id)}
                        >
                          {work.wavs.length > 0 && "regenerate wav files"}
                          {work.wavs.length <= 0 && "generate wav files"}
                        </Button>
                      </div>
                    </ListItem>
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

const NaroTitle = styled.h3`
  margin: 10px;
`;

const InputWorkItem = styled.div`
  margin: auto;
  width: 150px;
`;
const InputWorkArea = styled.div`
  display: flex;
  justify-content: space-between;
  width: 500px;
  @media screen and (max-width: 767px) {
    flex-flow: column;
    width: 50vw;
  }
`;

const WavArea = styled.div`
  margin: 10px;
`;

const List = styled.div`
  padding: 5px 10px 20px 10px;
`;

const ListItem = styled.div`
  list-style-type: none;
  cursor: pointer;
  border-bottom: 1px solid gray;
  margin-bottom: 10px;
  padding: 10px;
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
  @media screen and (max-width: 767px) {
    flex-flow: column;
    gap: 10px;
  }
`;

const WavSideBar = styled.div`
  width: 20vw;
  border: 1px solid gray;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 5px 5px 5px gray;
  margin-left: 5px;
  overflow: scroll;
  @media screen and (max-width: 767px) {
    width: 90vw;
  }
`;

const NaroMainArea = styled.div`
  width: 75vw;
  border: 1px solid gray;
  border-radius: 10px;
  margin-left: 10px;
  box-shadow: 5px 5px 5px gray;
  overflow: scroll;
  @media screen and (max-width: 767px) {
    width: 90vw;
    display: flex;
    flex-flow: column;
    gap: 20px;
    height: 100vh;
  }
`;
const NaroInputArea = styled.div`
  padding: 10px;
  border: 2px solid #88112255;
  border-radius: 15px;
  margin: 10px;
`;
