import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Prisma } from "@prisma/client";
const { setTimeout } = require("timers/promises");
const cheerio = require("cheerio");

const prisma = new PrismaClient();
const NARO_BASE_URL = "https://ncode.syosetu.com/";

import { createVoice } from "./voicevox";

async function getNaroInfo(url: string) {
  // リンクからHTML取得
  const resp = await fetch(url, { redirect: "manual" });
  const html = await resp.text();
  const $ = cheerio.load(html);
  let links = [];
  // 最初のページから各種話ページリンクを作成
}

// 合計話数取得APIURLを生成する関数
function generateNaroJsonApiUrl(of_str: string, ncode: string) {
  return `https://api.syosetu.com/novelapi/api/?of=${of_str}&ncode=${ncode}&out=json`;
}

// なろう作品の登録
export async function createNaro(ncode: string) {
  const url = generateNaroJsonApiUrl("ga-t", ncode);
  const resp = await fetch(url, { redirect: "manual" });
  const json = await resp.json();
  const { title, general_all_no: totalPage } = json[1];

  await prisma.naro.create({
    data: {
      title,
      ncode,
      totalPage,
    },
  });
}

// 既存情報が存在する場合、更新しない。
// 作品Wav登録
export async function createNaroWorks(ncode: string, begin: int, end: int) {
  // レコードを取得
  const naro = await prisma.naro.findFirst({
    where: {
      ncode,
    },
  });
  const naro_id = naro.id;
  if (naro === undefined) {
    throw new Error(`ncode(${ncode}) not found`);
    return;
  }
  // レコードから最大話数を取得
  const nums = Array.from(Array(naro.totalPage - 1), (v, k) => k + 1).filter(
    (v) => v <= end
  );
  // 話数範囲に一つもない場合
  if (nums.length <= 0) {
    console.log("debug", [[begin, end], naro]);
    throw new Error(`work <= ${end}`);
    return;
  }
  const already_recs = await prisma.naroWork.findMany({
    where: {
      naro_id,
    }
  })
  const already_nums = already_recs.map((rec) => rec.no);
  const naro_work_base_url = `${NARO_BASE_URL}${ncode}/`;
  // なろう小説作品URLからコンテンツを取得
  const data = await Promise.all(
    nums.map(async (no, i) => {
      // すでに存在する場合、処理しない
      if(already_nums.includes(no)) return;
      const res = await setTimeout(i * 1000, "wait:" + i);
      // URLからコンテンツ(text, html)を取得
      const url = `${naro_work_base_url}${no}/`;
      const resp = await fetch(url, { redirect: "manual" });
      const html = await resp.text();
      const $ = cheerio.load(html);
      // title
      const title = $("title").text();
      const contents = $("#novel_honbun").text();
      const data = {
        title,
        contents,
        html,
        no,
        naro_id: naro.id,
      };
      // DBにその情報を保存する
      await prisma.naroWork.create({
        data,
      });
    })
  );
}

function sliceByNumber(array, num) {
  const length = Math.ceil(array.length / num);
  return new Array(length)
    .fill()
    .map((_, i) => array.slice(i * num, (i + 1) * num));
}

// 既存情報については削除する
// NaroWorkに対応する複数のWavを生成する
export async function createNaroWorkWavs(naro_work_id: number) {
  // だるいのですべて削除してから再生性
  await prisma.naroWorkWav.deleteMany({
    where: {
      id: naro_work_id,
    },
  });
  const naroWork = await prisma.naroWork.findFirst({
    where: {
      id: naro_work_id,
    },
  });
  const contents = naroWork?.contents;
  const readContentsList = sliceByNumber(contents, 500);
  const total = readContentsList.length;
  for (let i = 0; i < total; i++) {
    console.log("info", `[${i + 1}/${total}] create wav file...`);
    const text = readContentsList[i];
    const wavpath = await createVoice(text);
    await prisma.naroWorkWav.create({
      data: {
        naro_work_id,
        seq_no: i,
        contents: text,
        wavpath,
      },
    });
  }
  console.log("info", "finished");
}
