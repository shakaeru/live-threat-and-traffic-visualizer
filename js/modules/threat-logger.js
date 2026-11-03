import { CITIES } from '../config/cities.js';

const MAX_STORED_LOGS = 200;
const MAX_VISIBLE_ROWS = 50;
const TOP_TYPES_LIMIT = 5;
const BLOCK_RATE = 0.72;
const TABLE_COLUMNS = 7;

const ATTACK_TYPES = Object.freeze([
  { name: 'DDoS',            port: 80 },
  { name: 'SQL Injection',   port: 443 },
  { name: 'Brute Force SSH', port: 22 },
  { name: 'Port Scan',       port: null },
  { name: 'Malware C2',      port: 8080 },
  { name: 'Phishing',        port: 25 },
  { name: 'XSS',             port: 443 },
  { name: 'Ransomware',      port: 445 },
]);

const SEVERITY_WEIGHTS = Object.freeze({
  low: 40,
  medium: 30,
  high: 20,
  critical: 10,
});

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function randomSeverity() {
  const entries = Object.entries(SEVERITY_WEIGHTS);
  const totalWeight = entries.reduce((sum, [, weight]) => sum + weight, 0);
  let point = Math.random() * totalWeight;

  for (const [severity, weight] of entries) {
    if (point < weight) return severity;
    point -= weight;
  }
  return 'low';
}

function randomIp() {
  return [randomInt(1, 223), randomInt(0, 255), randomInt(0, 255), randomInt(1, 254)].join('.');
}

function formatTime(date) {
  return [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map((part) => String(part).padStart(2, '0'))
    .join(':');
}

function formatNumber(value) {
  return value.toLocaleString('id-ID');
}

function createCell(text, className = '') {
  const cell = document.createElement('td');
  cell.textContent = text;
  if (className) cell.className = className;
  return cell;
}

function createSeverityCell(severity) {
  const badge = document.createElement('span');
  badge.className = `badge badge--${severity}`;
  badge.textContent = severity.toUpperCase();

  const cell = document.createElement('td');
  cell.appendChild(badge);
  return cell;
}

function createRow(attack) {
  const row = document.createElement('tr');
  const statusText = attack.blocked ? 'BLOCKED' : 'ALLOWED';
  const statusClass = attack.blocked ? 'status-blocked' : 'status-allowed';

  row.append(
    createCell(formatTime(attack.time)),
    createCell(`${attack.sourceIp} (${attack.source.province})`),
    createCell(`${attack.target.name}, ${attack.target.province}`),
    createCell(attack.type),
    createCell(attack.port, 'col-optional'),
    createSeverityCell(attack.severity),
    createCell(statusText, `col-optional ${statusClass}`),
  );

  return row;
}

function createEmptyRow() {
  const row = document.createElement('tr');
  const cell = createCell('Belum ada data yang cocok dengan filter.', 'empty');
  cell.colSpan = TABLE_COLUMNS;
  row.appendChild(cell);
  return row;
}

const SEVERITIES = Object.freeze(Object.keys(SEVERITY_WEIGHTS));

export function generateAttack() {
  const source = randomItem(CITIES);
  let target = randomItem(CITIES);
  while (target === source) {
    target = randomItem(CITIES);
  }

  const type = randomItem(ATTACK_TYPES);

  return {
    time: new Date(),
    source,
    target,
    sourceIp: randomIp(),
    type: type.name,
    port: type.port ?? randomInt(1, 65535),
    severity: randomSeverity(),
    blocked: Math.random() < BLOCK_RATE,
  };
}

export function createThreatLogger(elements) {
  const totals = { attacks: 0, blocked: 0, critical: 0 };
  const typeCounts = new Map();

  let logs = [];
  let visibleSeverities = new Set(SEVERITIES);

  function renderStats() {
    const blockRate = totals.attacks ? Math.round((totals.blocked / totals.attacks) * 100) : 0;

    elements.total.textContent = formatNumber(totals.attacks);
    elements.blocked.textContent = formatNumber(totals.blocked);
    elements.blockRate.textContent = `${blockRate}% dari total`;
    elements.critical.textContent = formatNumber(totals.critical);
  }

  function renderTopTypes() {
    const ranking = [...typeCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, TOP_TYPES_LIMIT);

    if (ranking.length === 0) {
      const empty = document.createElement('li');
      empty.className = 'bars__empty';
      empty.textContent = 'Menunggu data…';
      elements.topTypes.replaceChildren(empty);
      return;
    }

    const highest = ranking[0][1];
    const items = ranking.map(([name, count]) => {
      const item = document.createElement('li');
      item.className = 'bars__item';

      const label = document.createElement('span');
      label.className = 'bars__label';
      label.textContent = name;

      const track = document.createElement('div');
      track.className = 'bars__track';

      const fill = document.createElement('div');
      fill.className = 'bars__fill';
      fill.style.width = `${(count / highest) * 100}%`;
      track.appendChild(fill);

      const total = document.createElement('span');
      total.className = 'bars__count';
      total.textContent = count;

      item.append(label, track, total);
      return item;
    });

    elements.topTypes.replaceChildren(...items);
  }

  function renderTable(highlightNewest = false) {
    const visibleLogs = logs
      .filter((attack) => visibleSeverities.has(attack.severity))
      .slice(0, MAX_VISIBLE_ROWS);

    if (visibleLogs.length === 0) {
      elements.tableBody.replaceChildren(createEmptyRow());
      return;
    }

    const rows = visibleLogs.map(createRow);
    if (highlightNewest && visibleLogs[0] === logs[0]) {
      rows[0].classList.add('row--new');
    }

    elements.tableBody.replaceChildren(...rows);
  }

  function record(attack) {
    totals.attacks++;
    if (attack.blocked) totals.blocked++;
    if (attack.severity === 'critical') totals.critical++;
    typeCounts.set(attack.type, (typeCounts.get(attack.type) ?? 0) + 1);

    logs.unshift(attack);
    if (logs.length > MAX_STORED_LOGS) {
      logs.pop();
    }

    renderStats();
    renderTopTypes();
    renderTable(true);
  }

  function clear() {
    logs = [];
    renderTable();
  }

  function setVisibleSeverities(severities) {
    visibleSeverities = new Set(severities);
    renderTable();
  }

  function init() {
    renderStats();
    renderTopTypes();
    renderTable();
  }

  return { init, record, clear, setVisibleSeverities };
}
