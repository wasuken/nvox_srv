import { NextApiRequest, NextApiResponse } from "next";
import { fetchRSS, updateRSSItemVoices } from "../../lib/rss";

import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const crypto = require("crypto");

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
