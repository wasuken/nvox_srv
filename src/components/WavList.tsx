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
  margin: 5px;
  width: 300px;
  @media screen and (max-width: 700px) {
    width: 80vw;
    height: 350px;
  }
`;
const WavHeader = styled.div`
  word-wrap: break-word;
  text-overflow: ellipsis;
  overflow: hidden;
  height: 40px;
  white-space: nowrap;
  @media screen and (max-width: 700px) {
    height: auto;
  }
`;
const WavMain = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: center;
`;
const WavImg = styled.img`
  background-size: cover;
  border-radius: 4px;
  display: block;
  height: 20vh;
  width: 250px;
`;
const WavFooter = styled.div`
  margin-top: 20px;
  height: auto;
  color: gray;
  font-size: 10px;
  text-overflow: ellipsis;
  overflow: hidden;
  @media screen and (max-width: 700px) {
    margin-top: 10px;
    height: 90px;
  }
`;
const WavDesc = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
`;
const WavLink = styled.a``;

export default function WavList(props) {
  return (
    <WavArea>
      {props.list.map((item, i) => (
        <WavLink target="_blank" href={item.link}>
          <WavItem key={i}>
            <WavHeader>
              <WavLink target="_blank" href={item.link}>
                <h4>{item.title}</h4>
              </WavLink>
            </WavHeader>
            <WavMain>
              <WavImg src={item.imageurl}></WavImg>
            </WavMain>
            <WavFooter>
              {item.voice_downloaded ? (
                <figure>
                  <audio controls src={`/${item.wavpath}`}>
                    <a href={`/${item.wavpath}`}>Download audio</a>
                  </audio>
                </figure>
              ) : (
                ""
              )}
              <WavDesc>
                {(item.shortdesc.length > 0 ? item.shortdesc : item.desc).slice(
                  0,
                  250
                )}
              </WavDesc>
            </WavFooter>
          </WavItem>
        </WavLink>
      ))}
    </WavArea>
  );
}
