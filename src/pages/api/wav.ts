import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { createVoice } from "@/lib/voicevox";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    console.log("info", "check not downloaded records.");
    const wavRecords = await prisma.naroWorkWav.findMany({
      where: {
        voice_downloaded: false,
      },
    });
    console.log("info", `not downloaded records: ${wavRecords.length}.`);
    for (let i = 0; i < wavRecords.length; i++) {
      const record = wavRecords[i];
      console.log(
        "info",
        `[${i + 1}/${wavRecords.length}] id: ${record.id}. create voice...`
      );
      const wavpath = await createVoice(record.contents);
      if (wavpath === null) {
        console.log("error", "  wavpath not generated, skip voice");
        continue;
      }
      const wav_web_path = wavpath.replace(
        new RegExp(`^${process.env.PROJECT_BASE_PATH}`),
        ""
      );
      await prisma.naroWorkWav.update({
        where: {
          id: record.id,
        },
        data: {
          wavpath,
          wav_web_path,
          voice_downloaded: true,
        },
      });
      console.log("info", "  finish voice next.");
    }

    if (wavRecords.length > 0) {
      res.status(200).json({ msg: `create ${wavRecords.length} wavs` });
    } else {
      res.status(200).json({ msg: `not found wavs` });
    }
    return;
  } else if (req.method === "DELETE") {
    const wavPath = `${process.env.PROJECT_BASE_PATH}/data/wav/`;
    // 参照されてないファイルを削除する
    // TODO RSSItem, LearnItemも使う場合、その削除処理も作る

    const wavRecords = await prisma.naroWorkWav.findMany();
    const wavPathList = wavRecords.map((w) => path.basename(w.wavpath ?? ""));

    fs.readdirSync(wavPath)
      .filter((fname) => !wavPathList.includes(fname))
      .forEach((fname) => {
        const fpath = `${wavPath}${fname}`;
        fs.unlink(fpath, (err) => {
          if (err) {
            console.error("error failed in file removing", err);
            return;
          }
          console.log(`${fpath} deleted.`);
        });
      });
    res.status(200).json({
      msg: `removed.`,
    });
    return;
  }
  res.status(400).json({ msg: "not support." });
  return;
}
