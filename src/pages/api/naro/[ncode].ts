import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Prisma } from "@prisma/client";
import { createNaroWorks, updateNaro } from "@/lib/naro";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { ncode: _ncode } = req.query;
  const ncode = _ncode as string;
  if (req.method === "POST") {
    const { begin: sBegin, end: sEnd } = req.body;
    const begin = parseInt(sBegin);
    const end = parseInt(sEnd);
    await updateNaro(ncode);
    await createNaroWorks(ncode, begin, end);
    res.status(200).json({ msg: "success" });
    return;
  } else if (req.method === "GET") {
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
    res.status(200).json({ msg: "empty." });
    // 一覧
    return;
  } else if (req.method === "PUT") {
    const { sBegin, sEnd } = req.body;
    const begin = parseInt(sBegin);
    const end = parseInt(sEnd);
    await createNaroWorks(ncode, begin, end);
    res.status(200).json({ msg: "success" });
    return;
  } else if (req.method === "DELETE") {
    await prisma.naro.deleteMany({
      where: {
        ncode,
      },
    });
    res.status(200).json({ msg: "success" });
    return;
  }
  return;
}
