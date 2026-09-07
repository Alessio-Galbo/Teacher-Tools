const CHUNK_SIZE = 16000;

export function sendChunked(dc, text) {
  if (text.length <= CHUNK_SIZE) {
    dc.send(text);
    return;
  }
  const id = Math.random().toString(36).slice(2, 8);
  const total = Math.ceil(text.length / CHUNK_SIZE);
  for (let i = 0; i < total; i++) {
    const chunk = text.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
    dc.send(JSON.stringify({ __c: true, id, i, total, chunk }));
  }
}

export function createChunkAssembler(onMessage) {
  const buffers = new Map();
  return (rawOrObj) => {
    let p = rawOrObj;
    if (typeof p === "string") {
      if (!p.startsWith('{"__c":true')) { onMessage(p); return; }
      try { p = JSON.parse(p); } catch (_) { return; }
    }
    if (!p || !p.id) return;
    if (!buffers.has(p.id)) buffers.set(p.id, new Array(p.total));
    const parts = buffers.get(p.id);
    parts[p.i] = p.chunk;
    if (parts.filter(Boolean).length === p.total) {
      buffers.delete(p.id);
      onMessage(parts.join(""));
    }
  };
}
