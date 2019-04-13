const { html } = require("./util");
const fetch = require("@zeit/fetch")(require("node-fetch"));

async function rpc(fnName, body = {}) {
  const res = await fetch(`https://www.notion.so/api/v3/${fnName}`, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (res.ok) {
    return res.json();
  } else {
    throw new Error(await getError(res));
  }
}

async function getError(res) {
  return `Notion API error (${res.status}) \n${getJSONHeaders(
    res
  )}\n ${await getBodyOrNull(res)}`;
}

function getJSONHeaders(res) {
  return JSON.stringify(res.headers.raw());
}

function getBodyOrNull(res) {
  try {
    return res.text();
  } catch (err) {
    return null;
  }
}

function loadPageChunk(body) {
  return rpc("loadPageChunk", body);
}

exports.loadPageChunk = ({
  pageId,
  limit = 100,
  cursor = { stack: [] },
  chunkNumber = 0,
  verticalColumns = false
}) => {
  return loadPageChunk({
    pageId,
    limit,
    cursor,
    chunkNumber,
    verticalColumns
  });
};

function flattenArray(arr) {
  return arr.reduce(function(accumulator, currentValue) {
    return accumulator.concat(currentValue);
  }, []);
}

exports.renderTitle = title => {
  return title.map(chunk => {
    console.log("chunk", chunk);
    if (chunk[1] !== undefined && chunk[1][0] === "b") {
      return html`
        <b>${chunk[0]}</b>
      `;
    } else {
      return html`
        <span>${chunk[0]}</span>
      `;
    }
  });
};

// TEST
// TODO: delete
exports
  .loadPageChunk({
    pageId: "1a86e7f6-d6a5-4537-a2e5-15650c1888b8"
  })
  .then(
    //data => console.log(JSON.stringify(data)),
    data => console.log(require("util").inspect(data, { depth: 10 })),
    console.error
  );
