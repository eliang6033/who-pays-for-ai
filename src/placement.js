// Store normalized scene coordinates so placements survive responsive resizing.
export function scenePoint(x, y, rect) {
  if (!rect.width || !rect.height || x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) return null;
  return {x: Math.max(12, Math.min(88, (x-rect.left)/rect.width*100)), y: Math.max(18, Math.min(78, (y-rect.top)/rect.height*100))};
}
