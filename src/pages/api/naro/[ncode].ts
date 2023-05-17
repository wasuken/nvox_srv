import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Prisma } from "@prisma/client";
import { createNaroWorks } from "@/lib/naro";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { ncode: _ncode } = req.query;
    const ncode = _ncode as string;
    const { begin: sBegin, end: sEnd } = req.body;
    const begin = parseInt(sBegin);
    const end = parseInt(sEnd);
    await createNaroWorks(ncode, begin, end);
    res.status(200).json({ msg: "success" });
    return;
  } else if (req.method === "GET") {
    const { ncode: _ncode } = req.query;
    const ncode = _ncode as string;
    const result = await prisma.naro.findFirst({
      where: {
        ncode,
      },
      include: {
        works: {
          include: {
            wavs: true,
          },
        },
      },
    });
    if (result) {
      res.status(200).json(result.works);
      return;
    }
    return res.status(400);
    // 一覧
    return;
  }
  return;
}
