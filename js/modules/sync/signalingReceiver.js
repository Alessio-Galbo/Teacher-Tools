import { decryptPayload } from "./cryptoUtils.js";

export async function handleMqttMessage(rawPayload, token, myPeerId, seen, listeners) {
  try {
    const item = JSON.parse(rawPayload);
    if (item && item.sender !== myPeerId && item.payload) {
      if (seen.has(item.payload)) return;
      seen.add(item.payload);
      if (seen.size > 200) seen.clear();
      const dec = await decryptPayload(item.payload, token);
      listeners.forEach((fn) => { try { fn(dec); } catch (_) {} });
    }
  } catch (_) {}
}
