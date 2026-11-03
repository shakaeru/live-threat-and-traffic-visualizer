const HISTORY_LENGTH = 60;
const TICK_INTERVAL = 1000;
const BASE_TRAFFIC = 800;
const TRAFFIC_PER_SPEED = 60;
const NOISE_RANGE = 150;
const TRAFFIC_PER_ATTACK = 90;
const HEADROOM = 1.15;
const GRID_ROWS = 4;
const PADDING = Object.freeze({ top: 12, right: 10, bottom: 10, left: 40 });

const COLORS = Object.freeze({
  grid: 'rgba(255, 255, 255, 0.06)',
  axisLabel: '#5f5f5f',
  line: '#ffffff',
  fillTop: 'rgba(255, 255, 255, 0.25)',
  fillBottom: 'rgba(255, 255, 255, 0)',
});

export function createTrafficChart(canvas, valueElement) {
  const ctx = canvas.getContext('2d');
  const size = { width: 0, height: 0 };
  const history = [];

  let attacksThisTick = 0;
  let running = true;
  let speed = 5;

  function randomNoise() {
    return Math.floor(Math.random() * (NOISE_RANGE * 2 + 1)) - NOISE_RANGE;
  }

  function nextValue(attackCount) {
    const baseline = BASE_TRAFFIC + speed * TRAFFIC_PER_SPEED;
    return Math.max(0, baseline + randomNoise() + attackCount * TRAFFIC_PER_ATTACK);
  }

  function showLatest() {
    const latest = history[history.length - 1] ?? 0;
    valueElement.textContent = latest.toLocaleString('id-ID');
  }

  function draw() {
    const { width, height } = size;
    const plotWidth = width - PADDING.left - PADDING.right;
    const plotHeight = height - PADDING.top - PADDING.bottom;

    ctx.clearRect(0, 0, width, height);
    if (history.length < 2) return;

    const maxValue = Math.max(...history) * HEADROOM;
    const offset = HISTORY_LENGTH - history.length;
    const toX = (index) => PADDING.left + ((index + offset) / (HISTORY_LENGTH - 1)) * plotWidth;
    const toY = (value) => PADDING.top + plotHeight - (value / maxValue) * plotHeight;

    ctx.font = '9px Consolas, monospace';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 1;

    for (let row = 0; row <= GRID_ROWS; row++) {
      const value = (maxValue / GRID_ROWS) * row;
      const y = toY(value);

      ctx.strokeStyle = COLORS.grid;
      ctx.beginPath();
      ctx.moveTo(PADDING.left, y);
      ctx.lineTo(width - PADDING.right, y);
      ctx.stroke();

      ctx.fillStyle = COLORS.axisLabel;
      ctx.fillText(Math.round(value), PADDING.left - 6, y);
    }

    ctx.beginPath();
    history.forEach((value, index) => {
      if (index === 0) {
        ctx.moveTo(toX(index), toY(value));
      } else {
        ctx.lineTo(toX(index), toY(value));
      }
    });

    ctx.strokeStyle = COLORS.line;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    const baseY = PADDING.top + plotHeight;
    ctx.lineTo(toX(history.length - 1), baseY);
    ctx.lineTo(toX(0), baseY);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(0, PADDING.top, 0, baseY);
    gradient.addColorStop(0, COLORS.fillTop);
    gradient.addColorStop(1, COLORS.fillBottom);
    ctx.fillStyle = gradient;
    ctx.fill();

    const lastIndex = history.length - 1;
    ctx.fillStyle = COLORS.line;
    ctx.beginPath();
    ctx.arc(toX(lastIndex), toY(history[lastIndex]), 3, 0, Math.PI * 2);
    ctx.fill();
  }

  function tick() {
    if (!running) return;

    history.push(nextValue(attacksThisTick));
    if (history.length > HISTORY_LENGTH) {
      history.shift();
    }
    attacksThisTick = 0;

    showLatest();
    draw();
  }

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    size.width = rect.width;
    size.height = rect.height;
    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    draw();
  }

  function start() {
    for (let i = 0; i < HISTORY_LENGTH; i++) {
      history.push(nextValue(0));
    }
    showLatest();
    resize();
    setInterval(tick, TICK_INTERVAL);
  }

  function recordAttack() {
    attacksThisTick++;
  }

  function setRunning(value) {
    running = value;
  }

  function setSpeed(value) {
    speed = value;
  }

  return { start, resize, recordAttack, setRunning, setSpeed };
}
