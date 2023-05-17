import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Prisma } from "@prisma/client";
import { createVoice } from "@/lib/voicevox";
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const list = await prisma.learn.findMany();
    res.status(200).json(list);
  } else if (req.method === "POST") {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ msg: "name is empty" });

    await prisma.learn.create({
      data: {
        name,
        description,
      },
    });
    res.status(200).json({ msg: "success" });
  }
}
