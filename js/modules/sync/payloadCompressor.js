export async function compressBytes(bytes) {
  if (typeof CompressionStream === "undefined" || bytes.length < 150) return bytes;
  try {
    const cs = new CompressionStream("gzip");
    const w = cs.writable.getWriter(); w.write(bytes); w.close();
    const chunks = []; const r = cs.readable.getReader(); let res;
    while (!(res = await r.read()).done) chunks.push(res.value);
    const out = new Uint8Array(chunks.reduce((a, c) => a + c.length, 0));
    let o = 0; for (const c of chunks) { out.set(c, o); o += c.length; }
    return out;
  } catch (_) { return bytes; }
}

export async function decompressBytes(bytes, isCompressed = false) {
  if (!isCompressed || typeof DecompressionStream === "undefined") return bytes;
  try {
    const ds = new DecompressionStream("gzip");
    const w = ds.writable.getWriter(); w.write(bytes); w.close();
    const chunks = []; const r = ds.readable.getReader(); let res;
    while (!(res = await r.read()).done) chunks.push(res.value);
    const out = new Uint8Array(chunks.reduce((a, c) => a + c.length, 0));
    let o = 0; for (const c of chunks) { out.set(c, o); o += c.length; }
    return out;
  } catch (_) { return bytes; }
}
