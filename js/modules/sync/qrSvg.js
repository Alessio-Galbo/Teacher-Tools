export function renderQrSvg(matrix, size = 220) {
  const n = matrix.length;
  const pad = 4;
  const vbSize = n + pad * 2;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${vbSize} ${vbSize}`);
  svg.setAttribute("width", size);
  svg.setAttribute("height", size);
  svg.setAttribute("class", "pairing-qr-svg");

  const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  bg.setAttribute("width", vbSize);
  bg.setAttribute("height", vbSize);
  bg.setAttribute("fill", "#ffffff");
  svg.appendChild(bg);

  let pathD = "";
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (matrix[r][c]) {
        const x = c + pad;
        const y = r + pad;
        pathD += `M${x},${y}h1v1h-1z `;
      }
    }
  }

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", pathD);
  path.setAttribute("fill", "#0f172a");
  svg.appendChild(path);
  return svg;
}
