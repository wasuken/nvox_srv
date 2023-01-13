import fs from "fs";
import fetch from "node-fetch";

function genUUID() {
  return "xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx".replace(/[xy]/g, function (a) {
    let r = (new Date().getTime() + Math.random() * 16) % 16 | 0,
      v = a == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function createVoice(text) {
  const res = await fetch(
    `http://voicevox_engine:50021/audio_query?text=${text}&speaker=0`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const query = await res.json();

  const sound_row = await fetch(
    `http://voicevox_engine:50021/synthesis?speaker=0&enable_interrogative_upspeak=true`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "audio/wav",
        responseType: "stream",
      },
      body: JSON.stringify(query),
    }
  );

  const voice_id = genUUID();
  const filepath = `/app/data/wav/${voice_id}.wav`;
  const dest = fs.createWriteStream(filepath);
  sound_row.body.pipe(dest);
  return filepath;
}
