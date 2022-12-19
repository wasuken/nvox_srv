import styled from "styled-components";

const WavArea = styled.div`
  display: flex;
  margin: auto;
  flex-wrap: wrap;
  width: 93vw;
`;
const WavItem = styled.div`
  border: 1px solid gray;
  border-radius: 15px;
  padding: 10px;
  height: 40vh;
  margin: 5px;
  width: 30vw;
  @media screen and (max-width: 700px) {
    width: 80vw;
    height: 30vh;
  }
`;
const WavHeader = styled.div`
  word-wrap: break-word;
  text-overflow: ellipsis;
  overflow: hidden;
  height: 40px;
`;
const WavFooter = styled.div`
  margin-top: 20px;
  height: auto;
  color: gray;
  text-overflow: ellipsis;
  overflow: hidden;
  height: 140px;
  @media screen and (max-width: 700px) {
    margin-top: 10px;
    height: 100px;
  }
`;
const WavLink = styled.a``;

export default function WavList(props) {
  return (
    <WavArea>
      {props.list.map((item, i) => (
        <WavItem key={i}>
          <WavHeader>
            <h3>{item.title}</h3>
          </WavHeader>
          <WavFooter>
          {item.voice_downloaded ? (
            <figure>
              <audio controls src={`/${item.voice_filepath}`}>
                <a href={`/${item.voice_filepath}`}>Download audio</a>
              </audio>
            </figure>
          ): (
          ""
          )}
            <WavLink target="_blank" href={item.link}>
              {item.desc}
            </WavLink>
          </WavFooter>
        </WavItem>
      ))}
    </WavArea>
  );
}
