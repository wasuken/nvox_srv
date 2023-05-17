import { PrismaClient, Prisma } from "@prisma/client";
import { createVoice } from "./voicevox";
const prisma = new PrismaClient();
const cheerio = require("cheerio");
import fs from "fs";
import fetch from "node-fetch";

async function parseUrlPageHtmlToTextAndImgUrl(url: string) {
  let text = "";
  let imgurl = "";
  try {
    const res = await fetch(url, { redirect: "manual" });
    const html = await res.text();
    const $ = cheerio.load(html);
    text = $("body")
      .html()
      .replace(/<script[^>]*>[^<]+/gi, "")
      .replace(/<style[^>]*>[^<]+/gi, "")
      .replace(/(<([^>]+)>)/gi, "");
    const imgpath = $("body img").attr("src") ?? "";
    imgurl = imgpath;
    if (!imgpath.startsWith("http") && !imgpath.startsWith("data:image")) {
      const baseurl = url.split("/").slice(0, 3).join("/");
      let imgpathh = imgpath;
      if (imgpathh.startsWith("./")) {
        // 'hoge/'スタイルへと調整する処理
        imgpathh = imgpathh.substr(2);
      }
      imgurl = `${baseurl}/${imgpathh}`;
    }
  } catch (e) {
    console.log("失敗", e);
  }
  return { text, imgurl };
}

interface RSSItem {
  link: string;
  title: string;
  "content:encodedSnippet": string;
}

export async function saveRSSItemsFromId(id: number) {
  const record = await prisma.rSS.findFirst({
    where: {
      id: id,
    },
  });
  if (!record) {
    return;
  }
  // ここで本文抽出〜テキスト生成
  const { items } = await fetchRSS(record.url);

  const rss_item_records = await Promise.all(
    items.map(async (rss_item: RSSItem) => {
      const contents = rss_item["content:encodedSnippet"];
      const { text, imgurl } = await parseUrlPageHtmlToTextAndImgUrl(
        rss_item.link
      );
      return {
        rss_id: id,
        link: rss_item.link,
        title: rss_item.title,
        imageurl: imgurl,
        shortdesc: contents,
        desc: text,
      };
    })
  );
  await prisma.rSSItem.createMany({
    data: rss_item_records,
    skipDuplicates: true,
  });
}

export async function saveRSSItems(url: string) {
  // ここで本文抽出〜テキスト生成
  const { items, title } = await fetchRSS(url);

  const rss_record = await prisma.rSS.create({
    data: {
      url: url,
      name: title,
    },
  });

  const rss_item_records = items.map((rss_item: RSSItem) => {
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
    skipDuplicates: true,
  });
}

// DBレコードから参照されてないWavファイルを削除する
export async function cleanWavFiles() {
  const records = await prisma.rSSItem.findMany({
    select: {
      wavpath: true,
    },
  });
  if (!records) {
    return;
  }
  const getWavId = (wavpath: string | null) => {
    if (!wavpath) return "";
    const sp = wavpath.split("/");
    const p = sp.pop();
    if (!p) return "";
    const psp = p.split(".");
    return psp.shift();
  };
  const idList = records
    .map((r) => getWavId(r.wavpath))
    .filter((r) => r && r.length > 0);
  fs.readdir(`data/wav/`, (err, files) => {
    if (err) {
      console.log("error", err);
      return;
    }
    files.forEach((file) => {
      const wavId = getWavId(file);
      if (!idList.includes(wavId)) {
        console.log("remove", file);
        // fs.unlinkSync(file);
      }
    });
  });
}

export async function fetchRSS(rss_url: string) {
  const Parser = require("rss-parser");
  const parser = new Parser();
  const feed = await parser.parseURL(rss_url);

  return { items: feed.items, title: feed.title };
}

// バッチ処理とかで少しずつ消化していく
export async function updateRSSItemVoices(n: number) {
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
      const text = rec.shortdesc;
      if (!text) return;
      const path = await createVoice(text);
      await prisma.rSSItem.update({
        where: {
          id: rec.id,
        },
        data: {
          wavpath: path,
          voice_downloaded: true,
        },
      });
    })
  );
  console.log("update", "finish");
}
