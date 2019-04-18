const { html } = require("./util");
const { JSONPath: jp } = require("jsonpath-plus");
const fetch = require("@zeit/fetch")(require("node-fetch"));
const cms = require('tipe')();

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

exports.query = function jsonPathQuery(json, path) {
  return jp({ path, json });
};

exports.value = function jsonPathValue(json, path) {
  return exports.query(json, path)[0];
};
