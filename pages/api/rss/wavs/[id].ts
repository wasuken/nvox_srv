import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

const perPage = 20;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, page: req_page } = req.query
  const qid = parseInt(id);
  let page = parseInt(req_page ?? "0");
  const skip = page * perPage;
  const take = perPage;
  if (req.method === "GET") {
    const rss = await prisma.rSS.findMany({
      include: {
        rssItems: {
          orderBy: {
            createdAt: "desc"
          },
          skip,
          take,
        }
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
