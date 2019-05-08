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
      collectionId,
      collectionViewId,
      loader = {},
      query = {},
    }
  } = req;

  const {
    limit = 70,
    loadContentCover = true,
    type = "table",
    userLocale = "en",
    userTimeZone = "America/Los_Angeles"
  } = loader;

  const {
    aggregate = [
      {
        aggregation_type: "count",
        id: "count",
        property: "title",
        type: "title",
        view_type: "table"
      }
    ],
    filter = [],
    filter_operator = "and",
    sort = []
  } = query;

  const body = {
    collectionId,
    collectionViewId,
    loader: {
      limit,
      loadContentCover,
      type,
      userLocale,
      userTimeZone
    },
    query: {
      aggregate,
      filter,
      filter_operator,
      sort
    }
  };

  const r = await fetch(`https://www.notion.so/api/v3/queryCollection`, {
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
