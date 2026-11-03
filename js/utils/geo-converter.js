import { MAP_BOUNDS } from '../config/cities.js';

const CANVAS_PADDING = 40;

export function latLngToCanvas(lat, lng, width, height) {
  const lngRange = MAP_BOUNDS.east - MAP_BOUNDS.west;
  const latRange = MAP_BOUNDS.north - MAP_BOUNDS.south;

  const scale = Math.min(
    (width - CANVAS_PADDING * 2) / lngRange,
    (height - CANVAS_PADDING * 2) / latRange,
  );

  const offsetX = (width - lngRange * scale) / 2;
  const offsetY = (height - latRange * scale) / 2;

  return {
    x: offsetX + (lng - MAP_BOUNDS.west) * scale,
    y: offsetY + (MAP_BOUNDS.north - lat) * scale,
  };
}
