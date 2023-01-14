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
    const { id: sid } = req.query;
    const id = parseInt(sid);
    await createNaroWorkWavs(id);
    res.status(200).json({ msg: "success" });
  } else if (req.method === "GET") {
    const { id: sid } = req.query;
    const naro_work_id = parseInt(sid);
    const result = await prisma.naroWork.findFirst({
      where: {
        naro_work_id,
      },
      include: {
        wavs: true,
      },
    });
    let wavs = [];
    if (result !== null && ncode !== undefined) wavs = result.wavs;
    // 一覧
    res.status(200).json(wavs);
  }
  return;
}
