const fetch = require("node-fetch");
const express = require('express')
const bodyParser = require('body-parser')

const { getError } = require("./utils");

const app = express()
module.exports = app

app.use(bodyParser.json())

app.post('*', async (req, res) => {
  if (req.body == null) {
    return res.status(400).send({ error: 'no JSON object in the request' })
  }

  const {
    body: {
      pageId,
      limit = 100,
      cursor = { stack: [] },
      chunkNumber = 0,
      verticalColumns = false
    }
  } = req;

  const body = {
    pageId,
    limit,
    cursor,
    chunkNumber,
    verticalColumns,
  };

  const r = await fetch(`https://www.notion.so/api/v3/loadPageChunk`, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (r.ok) {
    res.setHeader("content-type", r.headers.get("content-type"));
    res.setHeader("cache-control", "s-maxage=1, stale-while-revalidate");
    r.body.pipe(res);
  } else {
    throw new Error(await getError(r));
  }
})

app.all('*', (req, res) => {
  res.status(405).send({ error: 'only POST requests are accepted' })
})
