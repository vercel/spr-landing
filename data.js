const fetch = require("@zeit/fetch")(require("node-fetch"));

async function rpc(fnName, body = {}) {
  const res = await fetch(`https://www.notion.so/api/v3/${fnName}`, {
    method: "POST",
    headers: {
      "Content-Type": "applicationn/json"
    },
    body: JSON.stringify(body)
  });

  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Notion API error: " + res.status);
  }
}

function loadPageChunk(body) {
  return rpc("loadPageChunk", body);
}

loadPageChunk({});
