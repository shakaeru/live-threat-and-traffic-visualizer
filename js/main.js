import { createRadarMap } from './modules/radar-map.js';
import { createTrafficChart } from './modules/traffic-chart.js';
import { createThreatLogger, generateAttack } from './modules/threat-logger.js';
import { initControls } from './modules/controls.js';

const CLOCK_INTERVAL = 1000;
const MAX_ATTACK_DELAY = 1300;
const DELAY_PER_SPEED = 120;

const byId = (id) => document.getElementById(id);

const radar = createRadarMap(byId('threatMap'));
const chart = createTrafficChart(byId('trafficChart'), byId('statPps'));
const logger = createThreatLogger({
  tableBody: byId('logBody'),
  total: byId('statTotal'),
  blocked: byId('statBlocked'),
  blockRate: byId('statBlockRate'),
  critical: byId('statCritical'),
  topTypes: byId('topTypes'),
});

const clock = byId('clock');

let running = true;
let speed = 5;
let attackTimer = null;

function spawnAttack() {
  if (!running) return;

  const attack = generateAttack();
  logger.record(attack);
  radar.launch(attack);
  chart.recordAttack();
}

function restartAttackTimer() {
  clearInterval(attackTimer);
  attackTimer = setInterval(spawnAttack, MAX_ATTACK_DELAY - speed * DELAY_PER_SPEED);
}

function updateClock() {
  const now = new Date();
  clock.textContent = now.toLocaleTimeString('en-GB', { hour12: false });
  clock.dateTime = now.toISOString();
}

const initialControls = initControls(
  {
    toggleButton: byId('btnToggle'),
    clearButton: byId('btnClear'),
    speedInput: byId('speed'),
    speedOutput: byId('speedValue'),
    severityInputs: document.querySelectorAll('.sev-filter'),
    statusText: byId('statusText'),
  },
  {
    onToggle(isRunning) {
      running = isRunning;
      radar.setRunning(isRunning);
      chart.setRunning(isRunning);
    },
    onClear() {
      logger.clear();
    },
    onSpeedChange(value) {
      speed = value;
      chart.setSpeed(value);
      restartAttackTimer();
    },
    onFilterChange(severities) {
      radar.setVisibleSeverities(severities);
      logger.setVisibleSeverities(severities);
    },
  },
);

speed = initialControls.speed;
chart.setSpeed(speed);
radar.setVisibleSeverities(initialControls.severities);
logger.setVisibleSeverities(initialControls.severities);

window.addEventListener('resize', () => {
  radar.resize();
  chart.resize();
});

logger.init();
radar.start();
chart.start();
updateClock();
setInterval(updateClock, CLOCK_INTERVAL);
restartAttackTimer();
