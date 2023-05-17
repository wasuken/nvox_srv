import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Prisma } from "@prisma/client";
import { createNaroWorkWavs } from "@/lib/naro";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // id: naro_work_id
    const { id: _id } = req.query;
    const sid = _id as string;
    const id = parseInt(sid);
    await createNaroWorkWavs(id);
    res.status(200).json({ msg: "success" });
  } else if (req.method === "GET") {
    const { id: _id } = req.query;
    const sid = _id as string;
    const naro_work_id = parseInt(sid);
    const result = await prisma.naroWork.findFirst({
      where: {
        id: naro_work_id,
      },
      include: {
        wavs: true,
      },
    });
    if (result) {
      res.status(200).json(result.wavs);
      return;
    }
    res.status(400);
    // 一覧
  }
  return;
}
