import { sha256Hex, sha256Bytes } from "./sha256.js";

const WORDS = [
  "libro", "matita", "scuola", "classe", "penna", "foglio", "banco", "lavagna",
  "quaderno", "stella", "mappa", "orologio", "colore", "pagina", "regola", "zaino",
  "diario", "lezione", "maestro", "storia", "tempo", "gioco", "lettera", "numero",
];

export function generateToken256() {
  const bytes = new Uint8Array(32);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) crypto.getRandomValues(bytes);
  else for (let i = 0; i < 32; i++) bytes[i] = Math.floor(Math.random() * 256);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function sha256(str) {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const data = new TextEncoder().encode(str);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, "0")).join("");
  }
  return sha256Hex(str);
}

export async function computeChecksum(obj) { return sha256(JSON.stringify(obj)); }

export function generatePassphrase() {
  const bytes = new Uint8Array(4);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) crypto.getRandomValues(bytes);
  else for (let i = 0; i < 4; i++) bytes[i] = Math.floor(Math.random() * 256);
  const parts = Array.from(bytes).map((b) => WORDS[b % WORDS.length]);
  return `${parts.join("-")}-${Math.floor(10 + Math.random() * 90)}`;
}

function bytesToB64(bytes) {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return typeof btoa !== "undefined" ? btoa(bin) : Buffer.from(bytes).toString("base64");
}

function b64ToBytes(b64) {
  const bin = typeof atob !== "undefined" ? atob(b64) : Buffer.from(b64, "base64").toString("binary");
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function xorWithKeystream(bytes, token, iv) {
  const out = new Uint8Array(bytes.length);
  const enc = new TextEncoder();
  let blockIdx = 0;
  for (let i = 0; i < bytes.length; i += 32) {
    const ks = sha256Bytes(enc.encode(`${token}_${iv}_${blockIdx++}`));
    for (let j = 0; j < 32 && (i + j) < bytes.length; j++) {
      out[i + j] = bytes[i + j] ^ ks[j];
    }
  }
  return out;
}

import { compressBytes, decompressBytes } from "./payloadCompressor.js";

export async function encryptPayload(data, token) {
  const iv = generateToken256().slice(0, 24);
  const rawBytes = new TextEncoder().encode(JSON.stringify(data));
  const toSend = await compressBytes(rawBytes);
  const isGz = toSend !== rawBytes && toSend.length < rawBytes.length;
  const cipherBytes = xorWithKeystream(isGz ? toSend : rawBytes, token, iv);
  return { iv, data: `${isGz ? "gz:" : "b64:"}${bytesToB64(cipherBytes)}` };
}

export async function decryptPayload(packet, token) {
  const isGz = typeof packet.data === "string" && packet.data.startsWith("gz:");
  const isB64 = isGz || (typeof packet.data === "string" && packet.data.startsWith("b64:"));
  const cipherBytes = isB64
    ? b64ToBytes(packet.data.slice(isGz ? 3 : 4))
    : new Uint8Array(packet.data.match(/.{1,2}/g).map((b) => parseInt(b, 16)));
  const plainBytes = xorWithKeystream(cipherBytes, token, packet.iv);
  const decompressed = await decompressBytes(plainBytes, isGz);
  return JSON.parse(new TextDecoder().decode(decompressed));
}

