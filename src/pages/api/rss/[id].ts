import { NextApiRequest, NextApiResponse } from "next";
import { saveRSSItemsFromId } from "@/lib/rss";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id: _id } = req.query;
  const sid = _id as string;
  const id = parseInt(sid);
  if (req.method === "PUT") {
    await saveRSSItemsFromId(id);
    // RSS登録
    res.status(200).json({ msg: "success" });
  }
  return;
}
