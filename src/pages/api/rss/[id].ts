import { NextApiRequest, NextApiResponse } from "next";
import { saveRSSItemsFromId } from '@/lib/rss'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let { id } = req.query
  id = parseInt(id);
  if (req.method === "PUT") {
    await saveRSSItemsFromId(id);
    // RSS登録
    res.status(200).json({ msg: "success" });
  }
  return;
}
