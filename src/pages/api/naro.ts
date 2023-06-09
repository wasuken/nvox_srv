import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { createNaroWorks, createNaro } from "@/lib/naro";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { ncode } = req.body;
    if (ncode.length <= 0) {
      res.status(400).json({ msg: "ncode empty." });
      return;
    }
    await createNaro(ncode);
    res.status(200).json({ msg: "success" });
    return;
  } else if (req.method === "GET") {
    const rst = await prisma.naro.findMany({
      select: {
        id: true,
        title: true,
        ncode: true,
        totalPage: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    // 一覧
    res.status(200).json(rst);
  }
  return;
}
