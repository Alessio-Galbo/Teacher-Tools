const enc = new TextEncoder();
const dec = new TextDecoder();

export function encodeLength(len) {
  const bytes = [];
  do {
    let b = len % 128;
    len = Math.floor(len / 128);
    if (len > 0) b |= 128;
    bytes.push(b);
  } while (len > 0);
  return bytes;
}

export function encodeConnect(clientId) {
  const cid = enc.encode(clientId);
  const vhdr = [0, 4, 77, 81, 84, 84, 4, 2, 0, 60, (cid.length >> 8) & 0xff, cid.length & 0xff, ...cid];
  return new Uint8Array([0x10, ...encodeLength(vhdr.length), ...vhdr]);
}

export function encodeSubscribe(topic, packetId = 1) {
  const top = enc.encode(topic);
  const vhdr = [(packetId >> 8) & 0xff, packetId & 0xff, (top.length >> 8) & 0xff, top.length & 0xff, ...top, 0];
  return new Uint8Array([0x82, ...encodeLength(vhdr.length), ...vhdr]);
}

export function encodePublish(topic, payload) {
  const top = enc.encode(topic);
  const pay = typeof payload === "string" ? enc.encode(payload) : payload;
  const lenBytes = encodeLength(2 + top.length + pay.length);
  const out = new Uint8Array(1 + lenBytes.length + 2 + top.length + pay.length);
  out[0] = 0x30;
  out.set(lenBytes, 1);
  let pos = 1 + lenBytes.length;
  out[pos++] = (top.length >> 8) & 0xff;
  out[pos++] = top.length & 0xff;
  out.set(top, pos);
  pos += top.length;
  out.set(pay, pos);
  return out;
}

export function parseMqttPublish(buf) {
  if ((buf[0] >> 4) !== 3) return null;
  let pos = 1; let mult = 1; let len = 0; let b = 0;
  do {
    b = buf[pos++];
    len += (b & 127) * mult;
    mult *= 128;
  } while ((b & 128) !== 0 && pos < buf.length);
  const topLen = (buf[pos] << 8) | buf[pos + 1];
  pos += 2;
  const topic = dec.decode(buf.subarray(pos, pos + topLen));
  pos += topLen;
  const payload = dec.decode(buf.subarray(pos));
  return { topic, payload };
}

export const PINGREQ = new Uint8Array([0xc0, 0x00]);
