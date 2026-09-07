import { rsEncode } from "./qrGf.js";

const SIZE = 37; // Version 5 (108 data bytes, 26 EC bytes)
const FMT = 0x77c4; // EC Level L, Mask 0 BCH format bits

function drawPatterns(m) {
  const drawFinder = (r, c) => {
    for (let i = -1; i <= 7; i++) {
      for (let j = -1; j <= 7; j++) {
        const nr = r + i; const nc = c + j;
        if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) continue;
        m[nr][nc] = (i >= 0 && i <= 6 && j >= 0 && j <= 6)
          ? (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4))
          : false;
      }
    }
  };
  drawFinder(0, 0); drawFinder(0, SIZE - 7); drawFinder(SIZE - 7, 0);
  for (let i = 8; i < SIZE - 8; i++) { m[6][i] = i % 2 === 0; m[i][6] = i % 2 === 0; }
  for (let i = -2; i <= 2; i++) {
    for (let j = -2; j <= 2; j++) m[30 + i][30 + j] = Math.max(Math.abs(i), Math.abs(j)) !== 1;
  }
  m[SIZE - 8][8] = true;
  const fb = Array.from({ length: 15 }, (_, i) => ((FMT >> (14 - i)) & 1) === 1);
  [0, 1, 2, 3, 4, 5].forEach((i) => { m[8][i] = fb[i]; });
  m[8][7] = fb[6]; m[8][8] = fb[7]; m[7][8] = fb[8];
  [5, 4, 3, 2, 1, 0].forEach((r, idx) => { m[r][8] = fb[9 + idx]; });
  for (let i = 0; i < 7; i++) m[SIZE - 1 - i][8] = fb[i];
  for (let i = 0; i < 8; i++) m[8][SIZE - 8 + i] = fb[7 + i];
}

function buildCodewords(text) {
  const raw = new TextEncoder().encode(text);
  const dataBits = [0, 1, 0, 0];
  for (let b = 7; b >= 0; b--) dataBits.push((raw.length >> b) & 1);
  for (const byte of raw) {
    for (let b = 7; b >= 0; b--) dataBits.push((byte >> b) & 1);
  }
  const term = Math.min(4, 108 * 8 - dataBits.length);
  for (let i = 0; i < term; i++) dataBits.push(0);
  while (dataBits.length % 8 !== 0) dataBits.push(0);
  const bytes = [];
  for (let i = 0; i < dataBits.length; i += 8) {
    let val = 0; for (let b = 0; b < 8; b++) val = (val << 1) | dataBits[i + b];
    bytes.push(val);
  }
  const pads = [0xEC, 0x11]; let p = 0;
  while (bytes.length < 108) bytes.push(pads[p++ % 2]);
  const ec = rsEncode(bytes, 26);
  const allBits = [];
  [...bytes, ...ec].forEach((byte) => {
    for (let b = 7; b >= 0; b--) allBits.push((byte >> b) & 1);
  });
  return allBits;
}

export function encodeQRMatrix(text) {
  const m = Array.from({ length: SIZE }, () => new Array(SIZE).fill(null));
  drawPatterns(m);
  const allBits = buildCodewords(text);
  let bitIdx = 0; let upwards = true;
  for (let right = SIZE - 1; right > 0; right -= 2) {
    if (right === 6) right--;
    const rows = upwards
      ? Array.from({ length: SIZE }, (_, i) => SIZE - 1 - i)
      : Array.from({ length: SIZE }, (_, i) => i);
    for (const r of rows) {
      for (const c of [right, right - 1]) {
        if (m[r][c] === null) {
          const bit = bitIdx < allBits.length ? allBits[bitIdx++] : 0;
          const mask = (r + c) % 2 === 0;
          m[r][c] = (bit ^ (mask ? 1 : 0)) === 1;
        }
      }
    }
    upwards = !upwards;
  }
  return m;
}
