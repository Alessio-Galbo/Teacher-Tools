import { peiDim1 } from "./peiDim1.js";
import { peiDim2 } from "./peiDim2.js";
import { peiDim3 } from "./peiDim3.js";
import { peiDim4 } from "./peiDim4.js";

export const peiDimensions = [peiDim1, peiDim2, peiDim3, peiDim4];

export function getDimensionById(id) {
  return peiDimensions.find((d) => d.id === id) || peiDimensions[0];
}
