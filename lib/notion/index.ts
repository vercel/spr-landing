import rpc, { values } from './rpc'
import queryCollection from './queryCollection'

export default async function getNotionData() {
  const data = await loadPageChunk({ pageId: process.env.PAGE_ID })
  const blocks = values(data.recordMap.block)

  const sections = []
  let meta = {}

  for (const block of blocks) {
    const value = block.value

    if (
      value.type === 'page' ||
      value.type === 'header' ||
      value.type === 'sub_header'
    ) {
      sections.push({ title: value.properties.title, children: [] })
      continue
    }

    const section = sections[sections.length - 1]
    let list = null

    if (value.type === 'image') {
      list = null
      const child = {
        type: 'image',
        src: `/api/asset?assetUrl=${encodeURIComponent(
          value.format.display_source as any
        )}&blockId=${value.id}`,
      }
      section.children.push(child)
    } else if (value.type === 'text') {
      list = null
      if (value.properties) {
        section.children.push({
          type: 'text',
          value: value.properties.title,
        })
      }
    } else if (value.type === 'bulleted_list') {
      if (list == null) {
        list = {
          type: 'list',
          children: [],
        }
        section.children.push(list)
      }
      list.children.push(value.properties.title)
    } else if (value.type === 'collection_view') {
      const col = await queryCollection({
        collectionId: value.collection_id,
        collectionViewId: value.view_ids[0],
      })
      const table = {}
      const entries = values(col.recordMap.block).filter(
        (block) => block.value && block.value.parent_id === value.collection_id
      )
      for (const entry of entries) {
        if (entry.value.properties) {
          const props = entry.value.properties

          // I wonder what `Agd&` is? it seems to be a fixed property
          // name that refers to the value
          table[
            props.title[0][0]
              .toLowerCase()
              .trim()
              .replace(/[ -_]+/, '_')
          ] = props['Agd&']
        }

        if (sections.length === 1) {
          meta = table
        } else {
          section.children.push({
            type: 'table',
            value: table,
          })
        }
      }
    } else {
      list = null
      console.log('UNHANDLED', value)
    }
  }

  return { sections, meta }
}

export function loadPageChunk({
  pageId,
  limit = 100,
  cursor = { stack: [] },
  chunkNumber = 0,
  verticalColumns = false,
}: any) {
  return rpc('loadPageChunk', {
    pageId,
    limit,
    cursor,
    chunkNumber,
    verticalColumns,
  })
}
