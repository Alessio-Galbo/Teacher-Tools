import { createEl } from "../../utils/dom.js";

export function createTreeNode(options = {}) {
  const { icon = "📁", title = "", badges = [], actions = [], children = [], isCollapsible = true, isExpanded = true } = options;

  let expanded = isExpanded;
  const nodeEl = createEl("div", { className: "tree-node" });
  const childrenEl = createEl("div", { className: `tree-children ${expanded ? "" : "collapsed"}` });

  const hasChildren = isCollapsible && children.length > 0;
  const toggleEl = hasChildren
    ? createEl("span", { className: "tree-toggle" }, expanded ? "▼" : "▶")
    : null;

  const titleEl = createEl("span", { className: "card-title" }, `${icon} ${title}`);
  const badgesRow = badges.length > 0 ? createEl("div", { className: "tree-badges-row" }, badges) : null;
  const labelGroup = createEl("div", { className: "tree-label-group" }, [titleEl, badgesRow].filter(Boolean));
  const contentEl = createEl("div", { className: "tree-row-content" }, [toggleEl, labelGroup].filter(Boolean));

  if (hasChildren) {
    contentEl.onclick = () => {
      expanded = !expanded;
      toggleEl.textContent = expanded ? "▼" : "▶";
      childrenEl.classList.toggle("collapsed", !expanded);
    };
  }

  const actionsEl = createEl("div", { className: "tree-actions" }, actions);
  const rowEl = createEl("div", { className: "tree-row" }, [contentEl, actionsEl]);

  nodeEl.appendChild(rowEl);
  if (children.length > 0) {
    children.forEach((c) => childrenEl.appendChild(c));
    nodeEl.appendChild(childrenEl);
  }

  return nodeEl;
}
