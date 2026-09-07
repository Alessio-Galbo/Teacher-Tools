import { addSignalingListener, sendSignaling, MY_PEER_ID } from "./webrtcSignaling.js";
import { createChunkAssembler } from "./webrtcChunker.js";

const ICE = [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun.cloudflare.com:3478" }];
let activePc = null; let curOnOpen = null; let curOnMsg = null; let curPeer = null;
const pendingIce = [];

function bindDc(dc, assembler) {
  dc.onopen = () => { console.log("[WebRTC] DataChannel OPEN!"); curOnOpen?.(dc); };
  dc.onclose = () => curOnOpen?.(null);
  dc.onmessage = (ev) => assembler(ev.data);
}

function flushPendingIce(pc) {
  while (pendingIce.length > 0) {
    try { pc.addIceCandidate(new RTCIceCandidate(pendingIce.shift())); } catch (_) {}
  }
}

function createFreshPc(token, targetPeer) {
  if (activePc) { try { activePc.close(); } catch (_) {} }
  curPeer = targetPeer; pendingIce.length = 0;
  const pc = new RTCPeerConnection({ iceServers: ICE });
  activePc = pc;
  pc.onicecandidate = (e) => {
    if (e.candidate) {
      const c = e.candidate.toJSON ? e.candidate.toJSON() : { candidate: e.candidate.candidate, sdpMid: e.candidate.sdpMid, sdpMLineIndex: e.candidate.sdpMLineIndex };
      sendSignaling(token, { type: "RTC_CANDIDATE", from: MY_PEER_ID, to: targetPeer, candidate: c });
    }
  };
  pc.ondatachannel = (e) => bindDc(e.channel, createChunkAssembler(curOnMsg));
  pc.onconnectionstatechange = () => {
    if (["disconnected", "failed", "closed"].includes(pc.connectionState) && curOnOpen) curOnOpen(null);
  };
  return pc;
}

export async function createAndSendOffer(token, targetPeerId, onOpen, onMsg) {
  curOnOpen = onOpen; curOnMsg = onMsg;
  if (activePc?.connectionState === "connected" || activePc?.signalingState === "have-local-offer") return;
  const pc = createFreshPc(token, targetPeerId);
  const dc = pc.createDataChannel("tt_sync");
  bindDc(dc, createChunkAssembler(onMsg));
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  const sdp = { type: pc.localDescription.type, sdp: pc.localDescription.sdp };
  await sendSignaling(token, { type: "RTC_OFFER", from: MY_PEER_ID, to: targetPeerId, sdp });
}

export async function startWebRtcMesh(token, onOpen, onMsg) {
  curOnOpen = onOpen; curOnMsg = onMsg;
  createFreshPc(token, null);
  addSignalingListener(token, async (msg) => {
    if (msg.type === "RTC_OFFER" && (msg.to === MY_PEER_ID || !msg.to)) {
      if (activePc?.connectionState === "connected") return;
      const pc = createFreshPc(token, msg.from);
      await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
      flushPendingIce(pc);
      const ans = await pc.createAnswer();
      await pc.setLocalDescription(ans);
      const sdp = { type: pc.localDescription.type, sdp: pc.localDescription.sdp };
      await sendSignaling(token, { type: "RTC_ANSWER", from: MY_PEER_ID, to: msg.from, sdp });
    } else if (msg.type === "RTC_ANSWER" && (msg.to === MY_PEER_ID || !msg.to)) {
      if (activePc?.signalingState === "have-local-offer") {
        await activePc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
        flushPendingIce(activePc);
      }
    } else if (msg.type === "RTC_CANDIDATE" && (msg.to === MY_PEER_ID || !msg.to)) {
      if (activePc?.remoteDescription && msg.candidate) {
        try { activePc.addIceCandidate(new RTCIceCandidate(msg.candidate)); } catch (_) {}
      } else if (msg.candidate) pendingIce.push(msg.candidate);
    }
  });
  return activePc;
}
