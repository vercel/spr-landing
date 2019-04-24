import fetch from "isomorphic-unfetch";

const PAGE_ID = "1a86e7f6-d6a5-4537-a2e5-15650c1888b8";

export default async function getNotionData() {
  const data = await loadPageChunk({ pageId: PAGE_ID });
  const blocks = values(data.recordMap.block);

  const sections = [];
  let currentSection = null;

  for (const block of blocks) {
    const value = block.value;

    if (
      value.type === "page" ||
      value.type === "header" ||
      value.type === "sub_header"
    ) {
      console.log("adding", value.properties.title);
      sections.push({ title: value.properties.title, children: [] });
      continue;
    }

    const section = sections[sections.length - 1];

    if (value.type === "image") {
      const child = {
        type: "image",
        src: `/image.js?url=${encodeURIComponent(value.format.display_source)}`
      };
      section.children.push(child);
    } else if (value.type === "text") {
      section.children.push({
        type: "text",
        value: value.properties.title
      });
    } else {
      console.log(value);
    }
  }

  console.log(sections);

  return sections;
}

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

function loadPageChunk({
  pageId,
  limit = 100,
  cursor = { stack: [] },
  chunkNumber = 0,
  verticalColumns = false
}) {
  return rpc("loadPageChunk", {
    pageId,
    limit,
    cursor,
    chunkNumber,
    verticalColumns
  });
}

function values(obj) {
  const vals = [];
  for (const key in obj) {
    vals.push(obj[key]);
  }
  return vals;
}
