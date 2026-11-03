import { CITIES, MAP_BOUNDS } from '../config/cities.js';
import { latLngToCanvas } from '../utils/geo-converter.js';

const ARC_DURATION = 1600;
const FADE_DURATION = 700;
const PULSE_DURATION = 900;
const MAX_FRAME_DELTA = 100;
const ARC_SEGMENTS = 32;
const GRID_STEP = 18;
const GRID_LINE_STEP = 5;
const LABEL_MIN_WIDTH = 600;
const LABEL_GAP = 6;
const LABEL_VERTICAL_GAP = 9;
const NODE_RADIUS = 2.5;

const COLORS = Object.freeze({
  background: '#070707',
  gridDot: 'rgba(255, 255, 255, 0.07)',
  gridLine: 'rgba(255, 255, 255, 0.05)',
  equator: 'rgba(255, 255, 255, 0.12)',
  equatorLabel: 'rgba(255, 255, 255, 0.25)',
  node: '#bdbdbd',
  label: '#5f5f5f',
});

const SEVERITY_STYLE = Object.freeze({
  critical: { color: '#ffffff', width: 2.5, dash: [] },
  high:     { color: '#c8c8c8', width: 1.8, dash: [] },
  medium:   { color: '#8c8c8c', width: 1.4, dash: [6, 4] },
  low:      { color: '#5a5a5a', width: 1.2, dash: [2, 4] },
});

const LABEL_PLACEMENT = Object.freeze({
  right:  { align: 'left',   dx: LABEL_GAP,  dy: 0 },
  left:   { align: 'right',  dx: -LABEL_GAP, dy: 0 },
  top:    { align: 'center', dx: 0,          dy: -LABEL_VERTICAL_GAP },
  bottom: { align: 'center', dx: 0,          dy: LABEL_VERTICAL_GAP },
});

export function createRadarMap(canvas) {
  const ctx = canvas.getContext('2d');
  const staticLayer = document.createElement('canvas');
  const staticCtx = staticLayer.getContext('2d');
  const size = { width: 0, height: 0 };

  let arcs = [];
  let pulses = [];
  let visibleSeverities = new Set(Object.keys(SEVERITY_STYLE));
  let running = true;
  let lastFrameTime = 0;

  const toCanvas = (lat, lng) => latLngToCanvas(lat, lng, size.width, size.height);
  const cityPoint = (city) => toCanvas(city.lat, city.lng);
  const isVisible = (item) => visibleSeverities.has(item.attack.severity);

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    size.width = rect.width;
    size.height = rect.height;

    for (const target of [canvas, staticLayer]) {
      target.width = Math.round(rect.width * ratio);
      target.height = Math.round(rect.height * ratio);
    }

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    staticCtx.setTransform(ratio, 0, 0, ratio, 0, 0);

    drawBackground(staticCtx);
    drawCities(staticCtx);
  }

  function drawBackground(target) {
    const { north, south, west, east } = MAP_BOUNDS;

    target.fillStyle = COLORS.background;
    target.fillRect(0, 0, size.width, size.height);

    target.fillStyle = COLORS.gridDot;
    for (let x = GRID_STEP / 2; x < size.width; x += GRID_STEP) {
      for (let y = GRID_STEP / 2; y < size.height; y += GRID_STEP) {
        target.fillRect(x, y, 1, 1);
      }
    }

    target.strokeStyle = COLORS.gridLine;
    target.lineWidth = 1;
    target.beginPath();
    for (let lng = west; lng <= east; lng += GRID_LINE_STEP) {
      const top = toCanvas(north, lng);
      const bottom = toCanvas(south, lng);
      target.moveTo(top.x, top.y);
      target.lineTo(bottom.x, bottom.y);
    }
    for (let lat = GRID_LINE_STEP; lat >= south; lat -= GRID_LINE_STEP) {
      const left = toCanvas(lat, west);
      const right = toCanvas(lat, east);
      target.moveTo(left.x, left.y);
      target.lineTo(right.x, right.y);
    }
    target.stroke();

    const equatorStart = toCanvas(0, west);
    const equatorEnd = toCanvas(0, east);

    target.strokeStyle = COLORS.equator;
    target.setLineDash([4, 6]);
    target.beginPath();
    target.moveTo(equatorStart.x, equatorStart.y);
    target.lineTo(equatorEnd.x, equatorEnd.y);
    target.stroke();
    target.setLineDash([]);

    target.fillStyle = COLORS.equatorLabel;
    target.font = '9px Consolas, monospace';
    target.textAlign = 'right';
    target.textBaseline = 'bottom';
    target.fillText('EQUATOR 0°', equatorEnd.x, equatorEnd.y - 3);
  }

  function drawCities(target) {
    const showLabels = size.width >= LABEL_MIN_WIDTH;

    target.font = '10px Consolas, monospace';
    target.textBaseline = 'middle';

    for (const city of CITIES) {
      const point = cityPoint(city);

      target.fillStyle = COLORS.node;
      target.beginPath();
      target.arc(point.x, point.y, NODE_RADIUS, 0, Math.PI * 2);
      target.fill();

      if (!showLabels) continue;

      const placement = LABEL_PLACEMENT[city.label] ?? LABEL_PLACEMENT.right;
      target.fillStyle = COLORS.label;
      target.textAlign = placement.align;
      target.fillText(city.name.toUpperCase(), point.x + placement.dx, point.y + placement.dy);
    }
  }

  function pointOnArc(from, to, t) {
    const controlX = (from.x + to.x) / 2;
    const controlY = Math.min(from.y, to.y) - Math.abs(to.x - from.x) * 0.25 - 20;
    const u = 1 - t;

    return {
      x: u * u * from.x + 2 * u * t * controlX + t * t * to.x,
      y: u * u * from.y + 2 * u * t * controlY + t * t * to.y,
    };
  }

  function drawArc(arc) {
    const style = SEVERITY_STYLE[arc.attack.severity];
    const from = cityPoint(arc.attack.source);
    const to = cityPoint(arc.attack.target);

    ctx.save();
    ctx.globalAlpha = Math.max(0, arc.alpha);
    ctx.strokeStyle = style.color;
    ctx.lineWidth = style.width;
    ctx.setLineDash(style.dash);

    ctx.beginPath();
    for (let i = 0; i <= ARC_SEGMENTS; i++) {
      const point = pointOnArc(from, to, (arc.progress * i) / ARC_SEGMENTS);
      if (i === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    }
    ctx.stroke();

    if (arc.progress < 1) {
      const head = pointOnArc(from, to, arc.progress);
      ctx.fillStyle = style.color;
      ctx.shadowColor = style.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(head.x, head.y, style.width + 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawPulse(pulse) {
    const progress = pulse.age / PULSE_DURATION;
    const point = cityPoint(pulse.attack.target);

    ctx.save();
    ctx.globalAlpha = 1 - progress;
    ctx.strokeStyle = SEVERITY_STYLE[pulse.attack.severity].color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 4 + progress * 22, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function update(delta) {
    for (const arc of arcs) {
      if (arc.progress < 1) {
        arc.progress = Math.min(1, arc.progress + delta / ARC_DURATION);
        if (arc.progress === 1) {
          pulses.push({ attack: arc.attack, age: 0 });
        }
      } else {
        arc.alpha -= delta / FADE_DURATION;
      }
    }

    for (const pulse of pulses) {
      pulse.age += delta;
    }

    arcs = arcs.filter((arc) => arc.alpha > 0);
    pulses = pulses.filter((pulse) => pulse.age < PULSE_DURATION);
  }

  function render() {
    ctx.drawImage(staticLayer, 0, 0, size.width, size.height);
    arcs.filter(isVisible).forEach(drawArc);
    pulses.filter(isVisible).forEach(drawPulse);
  }

  function frame(timestamp) {
    const delta = lastFrameTime ? timestamp - lastFrameTime : 0;
    lastFrameTime = timestamp;

    if (running) {
      update(Math.min(delta, MAX_FRAME_DELTA));
    }

    render();
    requestAnimationFrame(frame);
  }

  function start() {
    resize();
    requestAnimationFrame(frame);
  }

  function launch(attack) {
    if (document.hidden) return;
    arcs.push({ attack, progress: 0, alpha: 1 });
  }

  function setRunning(value) {
    running = value;
  }

  function setVisibleSeverities(severities) {
    visibleSeverities = new Set(severities);
  }

  return { start, resize, launch, setRunning, setVisibleSeverities };
}
