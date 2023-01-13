import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Prisma } from "@prisma/client";
import { createNaroWorks } from "../../../lib/naro";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { ncode } = req.query;
    const { begin: sBegin, end: sEnd } = req.body;
    const begin = parseInt(sBegin);
    const end = parseInt(sEnd);
    await createNaroWorks(ncode, begin, end);
    res.status(200).json({ msg: "success" });
  } else if (req.method === "GET") {
    const { ncode } = req.query;
    const result = await prisma.naro.findFirst({
      where: {
        ncode,
      },
      include: {
        works: {
          include: {
            wavs: true
          }
        },
      },
    });
    let works = [];
    if (result !== null && ncode !== undefined) works = result.works;
    // 一覧
    res.status(200).json(works);
  }
  return;
}
