import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();
import fs from "fs";
import fetch from "node-fetch";

export async function fetchRSS(rss_url) {
  const Parser = require("rss-parser");
  const parser = new Parser();
  const feed = await parser.parseURL(rss_url);

  return { items: feed.items, title: feed.title };
}

function genUUID() {
  return "xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx".replace(/[xy]/g, function (a) {
    let r = (new Date().getTime() + Math.random() * 16) % 16 | 0,
      v = a == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

async function createVoice(text) {
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
  const path = `data/wav/${voice_id}.wav`;
  const dest = fs.createWriteStream(path);
  sound_row.body.pipe(dest);
  return path;
}

// バッチ処理とかで少しずつ消化していく
export async function updateRSSItemVoices(n: int) {
  const not_dl_recs = await prisma.rSSItem.findMany({
    take: n,
    where: {
      voice_downloaded: false,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  console.log("count", not_dl_recs.length);
  // どちゃくそ遅そう
  await Promise.all(
    not_dl_recs.map(async (rec) => {
      const text = rec.desc;
      const path = await createVoice(text);
      await prisma.rSSItem.update({
        where: {
          id: rec.id,
        },
        data: {
          voice_filepath: path,
          voice_downloaded: true,
        },
      });
    })
  );
  console.log("update", "finish");
}
