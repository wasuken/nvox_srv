import { NextApiRequest, NextApiResponse } from "next";
import { fetchRSS, updateRSSItemVoices } from "../../lib/rss";
import fetch from "node-fetch";
import fs from "fs";

import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

const crypto = require("crypto");

function genUUID() {
  return "xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx".replace(/[xy]/g, function (a) {
    let r = (new Date().getTime() + Math.random() * 16) % 16 | 0,
      v = a == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

async function createVoice(text) {
  const res = await fetch(
    `http://localhost:50021/audio_query?text=${text}&speaker=0`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const query = await res.json();

  const sound_row = await fetch(
    `http://localhost:50021/synthesis?speaker=0&enable_interrogative_upspeak=true`,
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



async function saveRSSItems(url) {
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
    data: rss_item_records
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const url = req.body.url;
    const rec = await prisma.rSS.findFirst({
      where: {
        url: url,
      }
    })
    if(rec !== null){
      res.status(400).json({ msg: "already exists" });
      return;
    }
    await saveRSSItems(url);
    // RSS登録
    res.status(200).json({ msg: "success" });
  } else if (req.method === "GET") {
    const rssList = await prisma.rSS.findMany();
    // 一覧
    res.status(200).json(rssList);
  }
  return;
}
