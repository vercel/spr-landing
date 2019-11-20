const fetch = require("node-fetch");
const { parse } = require("url");

module.exports = async (req, res) => {
  const {
    query: { url }
  } = parse(req.url, true);
  if (!url.startsWith('https://s3-us-west-2.amazonaws.com/secure.notion-static.com')) {
    // we don't want this to act as a general-purpose proxy – we only want to proxy known
    // images from notion
    res.writeHead(404, {
      'content-type': 'application/json'
    });
    res.end(JSON.stringify({
      error: {
        code: 'not_found',
        message: 'Image not found'
      }
    }))
    return;
  }
  const r = await fetch(
    `https://www.notion.so/image/${encodeURIComponent(url)}`
  );
  res.setHeader("content-type", r.headers.get("content-type"));
  res.setHeader("cache-control", "s-maxage=1, stale-while-revalidate");
  r.body.pipe(res);
};
