/**
 * Universal debounced and concurrency-safe async DOM renderer.
 * Coalesces microtask triggers, discards stale renders, and atomically updates the DOM.
 */
export function createDebouncedRenderer(container, asyncBuildFn) {
  let renderSeq = 0;
  let scheduled = false;

  return function triggerRender() {
    if (scheduled) return;
    scheduled = true;

    queueMicrotask(async () => {
      scheduled = false;
      const curSeq = ++renderSeq;
      try {
        const nodes = await asyncBuildFn();
        if (curSeq !== renderSeq || !container) return;
        if (nodes !== undefined && nodes !== null) {
          if (Array.isArray(nodes)) container.replaceChildren(...nodes);
          else if (nodes instanceof Node) container.replaceChildren(nodes);
        }
      } catch (err) {
        console.error("Render error:", err);
      }
    });
  };
}
