import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

const perPage = 20;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id: _id, page: _page } = req.query;
  const sid = _id as string;
  const qid = parseInt(sid);
  const spage = _page as string;
  let page = parseInt(spage);
  const skip = page * perPage;
  const take = perPage;
  if (req.method === "GET") {
    const rss = await prisma.rSS.findMany({
      include: {
        rssItems: {
          orderBy: {
            createdAt: "desc",
          },
          skip,
          take,
        },
      },
      where: {
        id: qid,
      },
    });
    // 一覧
    res.status(200).json(rss);
  }
  return;
}
