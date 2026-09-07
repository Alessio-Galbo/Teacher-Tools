import { generateToken256 } from "./cryptoUtils.js";
import { getMyDeviceDisplay } from "./deviceInfo.js";

import { recordPairingToken } from "./pairingHistory.js";

const KEY_CLUSTER_ID = "tt_cluster_mesh_token";

export function getMeshClusterToken() {
  let token = localStorage.getItem(KEY_CLUSTER_ID);
  if (!token) {
    token = generateToken256();
    localStorage.setItem(KEY_CLUSTER_ID, token);
    recordPairingToken(token);
  }
  return token;
}

export function setMeshClusterToken(token) {
  localStorage.setItem(KEY_CLUSTER_ID, token);
  recordPairingToken(token);
}

export function getDefaultDeviceName() {
  return getMyDeviceDisplay();
}

export {
  getPairedDevices,
  savePairedDevice,
  updatePairedDeviceName,
  removePairedDevice,
  clearPairedDevices,
  leaveMeshCluster,
} from "./deviceMeshDB.js";

export { checkIncomingPairHash } from "./deviceMeshHash.js";
