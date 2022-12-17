export async function fetchRSS(rss_url) {
  const Parser = require("rss-parser");
  const parser = new Parser();
  const feed = await parser.parseURL(rss_url);

  return { items: feed.items, title: feed.title };
}

// バッチ処理とかで少しずつ消化していく
export async function updateRSSItemVoices(n: int){
  const not_dl_recs = await prisma.rSSItem.findMany({
    take: n,
    where: {
      voice_downloaded: false,
    },
    orderBy: {
      createdAt: "asc",
    },
  })
  // どちゃくそ遅そう
  Promise.All(not_dl_recs.map(async (rec) => {
    const text = rec.desc;
    const path = await createVoice(text);
    await prisma.rSSItem.update({
      where: {
        id: rec.id,
      },
      data: {
        voice_filepath: path,
        voice_downloaded: true,
      },
    })
  }));
}
