import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Prisma } from "@prisma/client";
import { chat } from "@/lib/chat";
import { createVoice } from '@/lib/voicevox'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req.body;
  if(req.method === "POST"){
    const rst = await chat(query);
    const text = rst.data.choices[0].text;
    // 重い
    const path = await createVoice(text);
    res.status(200).json({ text, path });
  }
}
