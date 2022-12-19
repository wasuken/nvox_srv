import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();
import fs from "fs";
import fetch from "node-fetch";

export async function saveRSSItems(url) {
  // ここで本文抽出〜テキスト生成
  const { items, title } = await fetchRSS(url);

  const rss_record = await prisma.rSS.create({
    data: {
      url: url,
      name: title,
    },
  });

  const rss_item_records = items.map((rss_item) => {
    const contents = rss_item["content:encodedSnippet"];
    const text = rss_item.title + "\n" + contents;
    return {
      rss_id: rss_record.id,
      link: rss_item.link,
      title: rss_item.title,
      desc: text,
    };
  });
  await prisma.rSSItem.createMany({
    data: rss_item_records,
  });
}

// DBレコードから参照されてないWavファイルを削除する
export async function cleanWavFiles() {
  const records = await prisma.rSSItem.findMany({
    select: {
      voice_filepath: true,
    },
  });
  const idList = records.map((r) =>
    r.voice_filepath.split("/").pop().split(".").shift()
  );
  fs.readdir(`data/wav/`, (err, files) => {
    if (err) {
      console.log("error", err);
      return;
    }
    files.forEach((file) => {
      const wavId = file.split("/").pop().split(".").shift();
      if (!idList.includes(wavId)) {
        console.log("remove", file);
        // fs.unlinkSync(file);
      }
    });
  });
}

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
