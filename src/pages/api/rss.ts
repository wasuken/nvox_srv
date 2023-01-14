import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Prisma } from "@prisma/client";
import { saveRSSItems, cleanWavFiles } from "@/lib/rss";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const url = req.body.url;
    const rec = await prisma.rSS.findFirst({
      where: {
        url: url,
      },
    });
    if (rec !== null) {
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
  } else if (req.method === "DELETE") {
    await cleanWavFiles();
    res.status(200).json({ msg: "success" });
  }
  return;
}
