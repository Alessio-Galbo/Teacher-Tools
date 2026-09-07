import { sha256, encryptPayload } from "./cryptoUtils.js";
import { encodeConnect, encodeSubscribe, encodePublish, parseMqttPublish, PINGREQ } from "./mqttEncoder.js";
import { handleMqttMessage } from "./signalingReceiver.js";

const SENDER = `dev_${Math.random().toString(36).slice(2, 8)}`;
const BROKERS = ["wss://broker.emqx.io:8084/mqtt", "wss://broker.hivemq.com:8884/mqtt"];
let ws = null; let brokerIdx = 0; let activeTopic = null; let currentToken = null;
let isReady = false; let pingTimer = null; let reconnectTimer = null; let failCount = 0;
const listeners = new Set(); const seen = new Set(); const outQueue = [];
export const MY_PEER_ID = SENDER;

export async function getTopic(token) {
  const hash = await sha256(token);
  return `tt_mesh_${hash.slice(0, 24)}`;
}

function flushQueue() {
  while (outQueue.length > 0 && ws && isReady) {
    const item = outQueue.shift();
    try { ws.send(encodePublish(item.topic, item.body)); } catch (_) {}
  }
}

function connectWs(topic) {
  if (ws) { try { ws.close(); } catch (_) {} ws = null; }
  clearTimeout(reconnectTimer); clearInterval(pingTimer);
  isReady = false;
  try {
    const socket = new WebSocket(BROKERS[brokerIdx], ["mqtt"]);
    socket.binaryType = "arraybuffer";
    socket.onopen = () => socket.send(encodeConnect(SENDER));
    socket.onmessage = (e) => {
      const buf = new Uint8Array(e.data);
      if (buf[0] === 0x20) socket.send(encodeSubscribe(topic));
      else if (buf[0] === 0x90) {
        isReady = true; failCount = 0; flushQueue();
        pingTimer = setInterval(() => { if (socket.readyState === 1) socket.send(PINGREQ); }, 30000);
      } else if (buf[0] >> 4 === 3) {
        const pub = parseMqttPublish(buf);
        if (pub && currentToken) handleMqttMessage(pub.payload, currentToken, SENDER, seen, listeners);
      }
    };
    socket.onclose = socket.onerror = () => {
      isReady = false; clearInterval(pingTimer);
      if (listeners.size > 0 && activeTopic === topic) {
        if (++failCount >= 3) { brokerIdx = (brokerIdx + 1) % BROKERS.length; failCount = 0; }
        reconnectTimer = setTimeout(() => connectWs(topic), 1000);
      }
    };
    ws = socket;
  } catch (_) {}
}

export async function addSignalingListener(token, onMsg) {
  listeners.add(onMsg); currentToken = token;
  const topic = await getTopic(token);
  if (activeTopic !== topic || !ws || ws.readyState > 1) { activeTopic = topic; connectWs(topic); }
  return () => { listeners.delete(onMsg); if (listeners.size === 0) closeSignaling(); };
}

export async function sendSignaling(token, data) {
  const topic = await getTopic(token);
  const payload = await encryptPayload(data, token);
  const body = JSON.stringify({ sender: SENDER, payload });
  if (ws && isReady && ws.readyState === 1) {
    try { ws.send(encodePublish(topic, body)); } catch (_) { outQueue.push({ topic, body }); }
  } else {
    outQueue.push({ topic, body });
    if (!ws || ws.readyState > 1) connectWs(topic);
  }
}

export function closeSignaling() {
  clearTimeout(reconnectTimer); clearInterval(pingTimer);
  if (ws) { try { ws.close(); } catch (_) {} ws = null; }
  activeTopic = null; currentToken = null; isReady = false;
  listeners.clear(); outQueue.length = 0;
}

if (typeof window !== "undefined") {
  const wake = () => { if (activeTopic && (!ws || ws.readyState > 1)) connectWs(activeTopic); };
  window.addEventListener("focus", wake);
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") wake(); });
}
