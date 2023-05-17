import styled from "styled-components";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import WavList from "../components/WavList";

const admin = false;

const Top = styled.div``;
const Middle = styled.div``;
const MyCont = styled.div`
  width: 50%;
  padding: 15px 0 15px;
`;

interface RSS {
  id: number;
  name: string;
}

export default function Index() {
  const { data: rssList, status } = useQuery<RSS[]>("rsslist", fetchRSSList);
  const [wavList, setWavList] = useState([]);
  const [rssUrl, setRSSUrl] = useState("");
  const [selectedRSSId, setSelectedRSSId] = useState(0);
  const [wavLoading, setWavLoading] = useState(false);

  function PostRSSClick() {
    setWavLoading(true);
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
        setWavLoading(false);
      });
  }
  async function fetchRSSList() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/rss`);
    const json = await res.json();
    // setRSSList(json)
    return json;
  }
  async function fetchWavList(id: number) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/rss/wavs/${id}`
    );
    const json = await res.json();
    return json;
  }
  function RSSSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const id = parseInt(e.target.value);
    setWavLoading(true);
    new Promise(async (_res, _rej) => {
      const list = await fetchWavList(id);
      setWavList(list[0].rssItems);
      setSelectedRSSId(id);
      setWavLoading(false);
    });
  }
  async function ReacquireRSSClick() {
    setWavLoading(true);
    new Promise(async (_resp, _res) => {
      await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/rss/${selectedRSSId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: selectedRSSId }),
        }
      );
      const list = await fetchWavList(selectedRSSId);
      setWavList(list[0].rssItems);
      setWavLoading(false);
    });
  }
  function togglePaginate() {}
  useEffect(() => {
    window.addEventListener("scroll", togglePaginate);
    return () => window.removeEventListener("scroll", togglePaginate);
  }, []);
  return (
    <div>
      <Top>
        {admin && (
          <div>
            <MyCont>
              <Form.Control
                type="url"
                placeholder="rss url"
                value={rssUrl}
                onChange={(e) => setRSSUrl(e.target.value)}
              />
              <Button variant="primary" onClick={PostRSSClick}>
                RSS登録
              </Button>
            </MyCont>
          </div>
        )}
        <MyCont>
          {status === "loading" && <p>Loading...</p>}
          {status === "success" && (
            <Form.Select onChange={RSSSelectChange} value={selectedRSSId}>
              <option>No Selected</option>
              {rssList.map((rss, i) => (
                <option key={i} value={rss.id}>
                  {rss.name}
                </option>
              ))}
            </Form.Select>
          )}
        </MyCont>
        {selectedRSSId !== 0 && (
          <div>
            {admin && (
              <Button variant="primary" onClick={ReacquireRSSClick}>
                再取得
              </Button>
            )}
          </div>
        )}
      </Top>
      <Middle>
        {wavLoading ? <p>Loading...</p> : <WavList list={wavList} />}
      </Middle>
    </div>
  );
}
