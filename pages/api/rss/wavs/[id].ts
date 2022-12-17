import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query
  if (req.method === "GET") {
    const rss = await prisma.rSS.findMany({
      include: {
        rssItems: true
      }
    });
    // 一覧
    res.status(200).json(rss);
  }
  return;
}
