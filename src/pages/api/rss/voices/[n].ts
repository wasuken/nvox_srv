import { NextApiRequest, NextApiResponse } from "next";
import { updateRSSItemVoices } from '@/lib/rss'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let { n } = req.query
  n = parseInt(n);
  if (req.method === "POST") {
    if(n > 10) {
      res.status(400).json({ msg: "invalid n, too many" });
      return;
    }
    await updateRSSItemVoices(n);
    // RSS登録
    res.status(200).json({ msg: "success" });
  }
  return;
}
