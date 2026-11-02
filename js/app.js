/* =========================================================
   Live Threat & Traffic Visualizer
   File : js/app.js  → LOGIKA halaman (JavaScript murni)

   Daftar isi:
   1.  Konfigurasi & data dasar (mock data)
   2.  State (kondisi aplikasi saat ini)
   3.  Referensi elemen DOM
   4.  Fungsi bantu (utility)
   5.  Simulasi data serangan & traffic
   6.  Canvas: pengaturan ukuran
   7.  Canvas: Threat Map + animasi
   8.  Canvas: grafik traffic
   9.  Update DOM (statistik, top jenis, tabel log)
   10. Event handling (tombol, filter, slider, resize)
   11. Inisialisasi
   ========================================================= */

'use strict'; // mode ketat: membantu menangkap kesalahan penulisan kode


/* ===================== 1. KONFIGURASI & DATA DASAR ===================== */

// Angka-angka pengaturan dikumpulkan di sini agar mudah diubah
const CONFIG = {
  maxStoredLogs: 200,  // jumlah maksimal serangan yang disimpan di memori
  maxLogRows: 50,      // jumlah maksimal baris yang ditampilkan di tabel
  chartPoints: 60,     // jumlah titik di grafik traffic (= 60 detik)
  arcDuration: 1600,   // lama (ms) garis serangan bergerak dari asal ke target
  fadeDuration: 700,   // lama (ms) garis memudar setelah tiba
  pulseDuration: 900,  // lama (ms) efek gelombang di kota target
  blockRate: 0.72,     // peluang serangan berhasil diblokir (72%)
};

// Batas wilayah peta (geo-bounding box) Indonesia, dalam derajat.
// Lintang: 6° LU s.d. 11° LS  →  north = 6, south = -11 (LS ditulis negatif)
// Bujur  : 95° BT s.d. 141° BT →  west = 95, east = 141
const MAP_BOUNDS = { north: 6, south: -11, west: 95, east: 141 };

// 16 kota strategis Indonesia: koordinat lintang (lat) & bujur (lon).
// "province" = singkatan provinsi, ditampilkan di tabel log.
// "label"    = posisi nama kota terhadap titiknya (default: kanan).
// Posisi label dipilih lewat uji tumpang-tindih di lebar peta 600–1400 px,
// sehingga nama kota yang berdekatan (mis. Jakarta–Bandung) tidak bertumpuk.
const LOCATIONS = [
  // Sumatra
  { city: 'Pekanbaru',  province: 'RIAU',   lat: 0.51,   lon: 101.45, label: 'top' },
  { city: 'Padang',     province: 'SUMBAR', lat: -0.95,  lon: 100.35, label: 'bottom' },
  { city: 'Medan',      province: 'SUMUT',  lat: 3.59,   lon: 98.67 },
  { city: 'Palembang',  province: 'SUMSEL', lat: -2.98,  lon: 104.75, label: 'left' },
  // Jawa
  { city: 'Jakarta',    province: 'DKI',    lat: -6.21,  lon: 106.85, label: 'top' },
  { city: 'Bandung',    province: 'JABAR',  lat: -6.91,  lon: 107.61 },
  { city: 'Surabaya',   province: 'JATIM',  lat: -7.25,  lon: 112.75 },
  // Bali & Nusa Tenggara
  { city: 'Denpasar',   province: 'BALI',   lat: -8.65,  lon: 115.22 },
  { city: 'Kupang',     province: 'NTT',    lat: -10.18, lon: 123.61 },
  // Kalimantan
  { city: 'Pontianak',  province: 'KALBAR', lat: -0.03,  lon: 109.33 },
  { city: 'Balikpapan', province: 'KALTIM', lat: -1.27,  lon: 116.83 },
  // Sulawesi
  { city: 'Makassar',   province: 'SULSEL', lat: -5.15,  lon: 119.43 },
  { city: 'Manado',     province: 'SULUT',  lat: 1.47,   lon: 124.84, label: 'bottom' },
  // Maluku & Papua
  { city: 'Ambon',      province: 'MALUKU', lat: -3.70,  lon: 128.18 },
  { city: 'Sorong',     province: 'PBD',    lat: -0.88,  lon: 131.25, label: 'top' },
  { city: 'Jayapura',   province: 'PAPUA',  lat: -2.53,  lon: 140.72, label: 'left' },
];

// Jenis serangan & port yang biasa diincar (port null = acak)
const ATTACK_TYPES = [
  { name: 'DDoS',            port: 80 },
  { name: 'SQL Injection',   port: 443 },
  { name: 'Brute Force SSH', port: 22 },
  { name: 'Port Scan',       port: null },
  { name: 'Malware C2',      port: 8080 },
  { name: 'Phishing',        port: 25 },
  { name: 'XSS',             port: 443 },
  { name: 'Ransomware',      port: 445 },
];

// Bobot peluang tiap severity. Total 100 → low muncul ±40% dari waktu
const SEVERITY_WEIGHTS = { low: 40, medium: 30, high: 20, critical: 10 };

// Gaya garis di canvas per severity (monokrom: dibedakan dari terang & pola garis)
// dash = pola putus-putus [panjang garis, panjang celah]; [] = garis penuh
const SEVERITY_STYLE = {
  critical: { color: '#ffffff', width: 2.5, dash: [] },
  high:     { color: '#c8c8c8', width: 1.8, dash: [] },
  medium:   { color: '#8c8c8c', width: 1.4, dash: [6, 4] },
  low:      { color: '#5a5a5a', width: 1.2, dash: [2, 4] },
};


/* ===================== 2. STATE ===================== */

// Semua data yang berubah-ubah disimpan dalam SATU objek.
// Prinsipnya: ubah state → lalu gambar ulang tampilan dari state.
const state = {
  running: true,                                   // true = LIVE, false = PAUSED
  speed: 5,                                        // nilai slider 1–10
  activeSeverities: new Set(Object.keys(SEVERITY_WEIGHTS)), // severity yang dicentang
  logs: [],            // daftar serangan (terbaru di indeks 0)
  arcs: [],            // garis serangan yang sedang dianimasikan di peta
  pulses: [],          // efek gelombang yang sedang dianimasikan
  totals: { attacks: 0, blocked: 0, critical: 0 },
  typeCounts: {},      // contoh: { 'DDoS': 12, 'XSS': 4 }
  traffic: [],         // riwayat paket/detik untuk grafik
  attacksThisSecond: 0,
  attackTimer: null,   // ID dari setInterval serangan (untuk dihentikan/diganti)
  lastFrameTime: 0,    // waktu frame animasi sebelumnya
};

// Ukuran canvas dalam piksel CSS (diisi oleh resizeCanvas)
const canvasSize = {
  map:   { w: 0, h: 0 },
  chart: { w: 0, h: 0 },
};


/* ===================== 3. REFERENSI ELEMEN DOM =====================
   Elemen dicari SEKALI di awal lalu disimpan, supaya tidak perlu
   memanggil getElementById berulang-ulang (lebih efisien).          */
const dom = {
  body:          document.body,
  btnToggle:     document.getElementById('btnToggle'),
  btnClear:      document.getElementById('btnClear'),
  speed:         document.getElementById('speed'),
  speedValue:    document.getElementById('speedValue'),
  sevFilters:    document.querySelectorAll('.sev-filter'),
  statusText:    document.getElementById('statusText'),
  clock:         document.getElementById('clock'),
  statTotal:     document.getElementById('statTotal'),
  statBlocked:   document.getElementById('statBlocked'),
  statBlockRate: document.getElementById('statBlockRate'),
  statPps:       document.getElementById('statPps'),
  statCritical:  document.getElementById('statCritical'),
  topTypes:      document.getElementById('topTypes'),
  logBody:       document.getElementById('logBody'),
  mapCanvas:     document.getElementById('threatMap'),
  chartCanvas:   document.getElementById('trafficChart'),
};

// "Kuas" untuk menggambar di masing-masing canvas
const mapCtx = dom.mapCanvas.getContext('2d');
const chartCtx = dom.chartCanvas.getContext('2d');


/* ===================== 4. FUNGSI BANTU (UTILITY) ===================== */

// Bilangan bulat acak antara min dan max (termasuk keduanya)
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Ambil satu item acak dari sebuah array
function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// Pilih severity secara acak BERBOBOT (low lebih sering, critical lebih jarang).
// Cara kerja: bayangkan garis sepanjang 100, dibagi 40|30|20|10.
// Ambil titik acak, lalu cek titik itu jatuh di bagian mana.
function randomSeverity() {
  const entries = Object.entries(SEVERITY_WEIGHTS);
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
  let point = Math.random() * total;

  for (const [severity, weight] of entries) {
    if (point < weight) return severity;
    point -= weight;
  }
  return 'low';
}

// Membuat alamat IP palsu, contoh: "103.24.7.188"
function randomIP() {
  return `${randomInt(1, 223)}.${randomInt(0, 255)}.${randomInt(0, 255)}.${randomInt(1, 254)}`;
}

// Format jam "HH:MM:SS"
function formatTime(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

// Format angka dengan pemisah ribuan ala Indonesia: 12500 → "12.500"
function formatNumber(n) {
  return n.toLocaleString('id-ID');
}

// Mengubah koordinat lat/lon menjadi posisi x/y di canvas.
// Teknik ini disebut proyeksi "equirectangular": bujur → x, lintang → y.
// Hanya wilayah MAP_BOUNDS (Indonesia) yang dipetakan ke canvas.
function project(location) {
  const { w, h } = canvasSize.map;
  const pad = 40; // ruang di tepi canvas untuk nama kota

  // Lebar wilayah dalam derajat: bujur 46°, lintang 17°
  const lonRange = MAP_BOUNDS.east - MAP_BOUNDS.west;
  const latRange = MAP_BOUNDS.north - MAP_BOUNDS.south;

  // Skala = berapa piksel untuk 1 derajat. Dipakai skala yang SAMA untuk
  // x dan y (ambil yang terkecil) agar bentuk Indonesia tidak gepeng/melar.
  const scale = Math.min((w - pad * 2) / lonRange, (h - pad * 2) / latRange);

  // Sisa ruang kosong dibagi dua → peta berada tepat di tengah canvas
  const offsetX = (w - lonRange * scale) / 2;
  const offsetY = (h - latRange * scale) / 2;

  // Bujur: makin ke timur makin ke kanan.
  // Lintang: makin ke utara makin ke ATAS (y kecil) → north − lat.
  const x = offsetX + (location.lon - MAP_BOUNDS.west) * scale;
  const y = offsetY + (MAP_BOUNDS.north - location.lat) * scale;
  return { x, y };
}


/* ===================== 5. SIMULASI DATA ===================== */

// Membuat SATU data serangan palsu
function createAttack() {
  const source = randomItem(LOCATIONS);
  let target = randomItem(LOCATIONS);
  // Pastikan kota asal dan target berbeda
  while (target === source) {
    target = randomItem(LOCATIONS);
  }

  const type = randomItem(ATTACK_TYPES);

  return {
    time: new Date(),
    source,
    target,
    sourceIP: randomIP(),
    type: type.name,
    port: type.port ?? randomInt(1, 65535), // ?? = pakai nilai kanan jika kiri null
    severity: randomSeverity(),
    blocked: Math.random() < CONFIG.blockRate,
  };
}

// Dipanggil berulang oleh setInterval: membuat serangan baru lalu update tampilan
function spawnAttack() {
  if (!state.running) return; // jika di-pause, jangan buat data

  const attack = createAttack();

  // 1) Update statistik
  state.totals.attacks++;
  if (attack.blocked) state.totals.blocked++;
  if (attack.severity === 'critical') state.totals.critical++;
  state.typeCounts[attack.type] = (state.typeCounts[attack.type] || 0) + 1;
  state.attacksThisSecond++;

  // 2) Simpan ke log (unshift = tambah di depan → terbaru paling atas)
  state.logs.unshift(attack);
  if (state.logs.length > CONFIG.maxStoredLogs) {
    state.logs.pop(); // buang yang paling lama
  }

  // 3) Tambahkan garis animasi ke peta.
  //    Saat tab browser tidak terlihat, requestAnimationFrame berhenti tetapi
  //    setInterval tetap jalan. Tanpa pengecekan ini, ratusan garis akan
  //    menumpuk lalu digambar sekaligus saat tab dibuka lagi (lag).
  if (!document.hidden) {
    state.arcs.push({ attack, progress: 0, alpha: 1 });
  }

  // 4) Perbarui tampilan DOM
  updateStats();
  renderTopTypes();
  renderLog(true);
}

// Menjalankan (atau menjalankan ulang) timer serangan sesuai kecepatan.
// Kecepatan 1 → 1 serangan tiap 1180 ms; kecepatan 10 → tiap 100 ms.
function startAttackTimer() {
  clearInterval(state.attackTimer); // hentikan timer lama (jika ada)
  const delay = 1300 - state.speed * 120;
  state.attackTimer = setInterval(spawnAttack, delay);
}

// Menghitung nilai paket/detik baru. Dipanggil setiap 1 detik.
function trafficTick() {
  if (!state.running) return;

  const base = 800 + state.speed * 60;             // traffic normal
  const noise = randomInt(-150, 150);              // naik-turun acak
  const spike = state.attacksThisSecond * 90;      // lonjakan karena serangan
  const pps = Math.max(0, base + noise + spike);

  state.traffic.push(pps);
  if (state.traffic.length > CONFIG.chartPoints) {
    state.traffic.shift(); // buang data paling lama (paling kiri di grafik)
  }
  state.attacksThisSecond = 0;

  dom.statPps.textContent = formatNumber(pps);
  drawTrafficChart();
}

// Memperbarui jam digital di header. Tetap berjalan walau di-pause.
function updateClock() {
  const now = new Date();
  dom.clock.textContent = formatTime(now);
  dom.clock.dateTime = now.toISOString(); // atribut datetime pada <time>
}


/* ===================== 6. CANVAS: PENGATURAN UKURAN =====================
   Canvas punya 2 ukuran: ukuran tampilan (CSS) dan ukuran piksel asli.
   Agar gambar tajam di layar HD/Retina, ukuran piksel dikali
   devicePixelRatio, lalu "kuas" diperbesar dengan setTransform.         */
function resizeCanvas(canvas, ctx, size) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect(); // ukuran canvas di layar

  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  size.w = rect.width;
  size.h = rect.height;
}

function handleResize() {
  resizeCanvas(dom.mapCanvas, mapCtx, canvasSize.map);
  resizeCanvas(dom.chartCanvas, chartCtx, canvasSize.chart);
  buildStaticLayer(); // ukuran berubah → latar peta disiapkan ulang
  drawTrafficChart(); // peta digambar ulang otomatis oleh animate()
}


/* ===================== 7. CANVAS: THREAT MAP ===================== */

// Latar peta: titik-titik grid + garis lintang/bujur tipis
function drawMapBackground(ctx) {
  const { w, h } = canvasSize.map;

  ctx.fillStyle = '#070707';
  ctx.fillRect(0, 0, w, h);

  // Titik-titik grid setiap 18 piksel
  ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
  for (let x = 9; x < w; x += 18) {
    for (let y = 9; y < h; y += 18) {
      ctx.fillRect(x, y, 1, 1);
    }
  }

  const { north, south, west, east } = MAP_BOUNDS;

  // Garis bujur (vertikal) & lintang (horizontal) setiap 5° di dalam wilayah Indonesia
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let lon = 95; lon <= east; lon += 5) {
    const top = project({ lat: north, lon });
    const bottom = project({ lat: south, lon });
    ctx.moveTo(top.x, top.y);
    ctx.lineTo(bottom.x, bottom.y);
  }
  for (let lat = 5; lat >= south; lat -= 5) {
    const left = project({ lat, lon: west });
    const right = project({ lat, lon: east });
    ctx.moveTo(left.x, left.y);
    ctx.lineTo(right.x, right.y);
  }
  ctx.stroke();

  // Garis khatulistiwa (lintang 0°) dibuat sedikit lebih terang + diberi label
  const eqLeft = project({ lat: 0, lon: west });
  const eqRight = project({ lat: 0, lon: east });
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.setLineDash([4, 6]);
  ctx.beginPath();
  ctx.moveTo(eqLeft.x, eqLeft.y);
  ctx.lineTo(eqRight.x, eqRight.y);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.font = '9px Consolas, monospace';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.fillText('EQUATOR 0°', eqRight.x, eqLeft.y - 3);
}

// Titik kota + nama kota
function drawNodes(ctx) {
  // Di peta yang sempit (HP) kota terlalu rapat → nama disembunyikan, titik tetap tampil
  const showLabels = canvasSize.map.w >= 600;
  ctx.font = '10px Consolas, monospace';
  ctx.textBaseline = 'middle';

  LOCATIONS.forEach((loc) => {
    const p = project(loc);

    // Lingkaran kecil
    ctx.fillStyle = '#bdbdbd';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
    ctx.fill();

    if (!showLabels) return;

    // Nama kota: textAlign menentukan titik jangkar teks (kiri/kanan/tengah)
    const name = loc.city.toUpperCase();
    ctx.fillStyle = '#5f5f5f';
    if (loc.label === 'left') {
      ctx.textAlign = 'right';             // teks berakhir 6px di kiri titik
      ctx.fillText(name, p.x - 6, p.y);
    } else if (loc.label === 'top') {
      ctx.textAlign = 'center';            // teks di tengah, 9px di atas titik
      ctx.fillText(name, p.x, p.y - 9);
    } else if (loc.label === 'bottom') {
      ctx.textAlign = 'center';            // teks di tengah, 9px di bawah titik
      ctx.fillText(name, p.x, p.y + 9);
    } else {
      ctx.textAlign = 'left';              // default: teks mulai 6px di kanan titik
      ctx.fillText(name, p.x + 6, p.y);
    }
  });
}

// Latar peta & titik kota TIDAK berubah setiap frame, jadi cukup digambar
// SEKALI ke canvas tersembunyi (offscreen). Setiap frame kita hanya
// menyalinnya dengan drawImage → jauh lebih ringan daripada menggambar
// ulang ±1.500 titik grid 60 kali per detik.
const staticLayer = document.createElement('canvas');
const staticCtx = staticLayer.getContext('2d');

function buildStaticLayer() {
  const dpr = window.devicePixelRatio || 1;
  staticLayer.width = dom.mapCanvas.width;   // ukuran piksel sama dengan peta
  staticLayer.height = dom.mapCanvas.height;
  staticCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawMapBackground(staticCtx);
  drawNodes(staticCtx);
}

// Menghitung satu titik pada kurva Bezier kuadratik.
// t = 0 → titik asal, t = 1 → titik target, t = 0.5 → tengah kurva.
// Titik kontrol (cx, cy) diletakkan di atas garis lurus agar kurva melengkung.
function getArcPoint(p0, p1, t) {
  const cx = (p0.x + p1.x) / 2;
  const cy = Math.min(p0.y, p1.y) - Math.abs(p1.x - p0.x) * 0.25 - 20;
  const u = 1 - t;
  return {
    x: u * u * p0.x + 2 * u * t * cx + t * t * p1.x,
    y: u * u * p0.y + 2 * u * t * cy + t * t * p1.y,
  };
}

// Menggambar satu garis serangan beserta "kepala" yang bergerak
function drawArc(arc) {
  const ctx = mapCtx;
  const style = SEVERITY_STYLE[arc.attack.severity];
  const p0 = project(arc.attack.source);
  const p1 = project(arc.attack.target);
  const steps = 32; // kurva digambar sebagai 32 potongan garis lurus

  ctx.save(); // simpan pengaturan kuas, nanti dikembalikan dengan restore()
  ctx.globalAlpha = Math.max(0, arc.alpha);
  ctx.strokeStyle = style.color;
  ctx.lineWidth = style.width;
  ctx.setLineDash(style.dash);

  // Ekor garis: dari asal (t=0) sampai posisi sekarang (t=progress)
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const p = getArcPoint(p0, p1, (arc.progress * i) / steps);
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();

  // Kepala garis (lingkaran bercahaya) selama belum sampai
  if (arc.progress < 1) {
    const head = getArcPoint(p0, p1, arc.progress);
    ctx.fillStyle = style.color;
    ctx.shadowColor = style.color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(head.x, head.y, style.width + 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// Efek gelombang melingkar saat serangan tiba di target
function drawPulse(pulse) {
  const ctx = mapCtx;
  const t = pulse.age / CONFIG.pulseDuration; // 0 → 1
  const p = project(pulse.attack.target);
  const style = SEVERITY_STYLE[pulse.attack.severity];

  ctx.save();
  ctx.globalAlpha = 1 - t;           // makin lama makin transparan
  ctx.strokeStyle = style.color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(p.x, p.y, 4 + t * 22, 0, Math.PI * 2); // makin lama makin besar
  ctx.stroke();
  ctx.restore();
}

// Memajukan semua animasi sesuai waktu yang berlalu (dt, milidetik)
function updateAnimations(dt) {
  state.arcs.forEach((arc) => {
    if (arc.progress < 1) {
      arc.progress = Math.min(1, arc.progress + dt / CONFIG.arcDuration);
      // Tepat saat tiba di target → munculkan efek gelombang
      if (arc.progress === 1) {
        state.pulses.push({ attack: arc.attack, age: 0 });
      }
    } else {
      arc.alpha -= dt / CONFIG.fadeDuration; // sudah tiba → memudar
    }
  });

  state.pulses.forEach((pulse) => {
    pulse.age += dt;
  });

  // Buang animasi yang sudah selesai agar array tidak membengkak
  state.arcs = state.arcs.filter((arc) => arc.alpha > 0);
  state.pulses = state.pulses.filter((pulse) => pulse.age < CONFIG.pulseDuration);
}

// Menggambar seluruh peta (dipanggil setiap frame)
function drawMap() {
  // Salin lapisan statis (latar + kota) yang sudah disiapkan buildStaticLayer()
  mapCtx.drawImage(staticLayer, 0, 0, canvasSize.map.w, canvasSize.map.h);

  // Hanya gambar severity yang dicentang di filter
  const isVisible = (item) => state.activeSeverities.has(item.attack.severity);
  state.arcs.filter(isVisible).forEach(drawArc);
  state.pulses.filter(isVisible).forEach(drawPulse);
}

// Loop animasi utama. requestAnimationFrame memanggil fungsi ini
// ±60 kali per detik, selaras dengan refresh layar.
function animate(timestamp) {
  const dt = state.lastFrameTime ? timestamp - state.lastFrameTime : 0;
  state.lastFrameTime = timestamp;

  // dt dibatasi 100 ms: jika tab sempat ditinggal, animasi tidak "loncat"
  if (state.running) {
    updateAnimations(Math.min(dt, 100));
  }

  drawMap();
  requestAnimationFrame(animate); // minta frame berikutnya
}


/* ===================== 8. CANVAS: GRAFIK TRAFFIC ===================== */
function drawTrafficChart() {
  const ctx = chartCtx;
  const { w, h } = canvasSize.chart;
  const data = state.traffic;
  const pad = { top: 12, right: 10, bottom: 10, left: 40 };
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;

  ctx.clearRect(0, 0, w, h);
  if (data.length < 2) return;

  const maxValue = Math.max(...data) * 1.15; // beri ruang 15% di atas

  // Fungsi kecil untuk mengubah indeks & nilai data → koordinat canvas.
  // Data terbaru selalu di ujung kanan.
  const offset = CONFIG.chartPoints - data.length;
  const toX = (i) => pad.left + ((i + offset) / (CONFIG.chartPoints - 1)) * plotW;
  const toY = (v) => pad.top + plotH - (v / maxValue) * plotH;

  // Garis bantu horizontal + label angka di kiri
  ctx.font = '9px Consolas, monospace';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const value = (maxValue / 4) * i;
    const y = toY(value);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(w - pad.right, y);
    ctx.stroke();
    ctx.fillStyle = '#5f5f5f';
    ctx.fillText(Math.round(value), pad.left - 6, y);
  }

  // Bentuk jalur (path) garis grafik
  ctx.beginPath();
  data.forEach((value, i) => {
    if (i === 0) ctx.moveTo(toX(i), toY(value));
    else ctx.lineTo(toX(i), toY(value));
  });

  // Garis putih
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Area di bawah garis diisi gradien putih → transparan
  ctx.lineTo(toX(data.length - 1), pad.top + plotH);
  ctx.lineTo(toX(0), pad.top + plotH);
  ctx.closePath();
  const gradient = ctx.createLinearGradient(0, pad.top, 0, pad.top + plotH);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = gradient;
  ctx.fill();

  // Titik penanda nilai terbaru
  const lastX = toX(data.length - 1);
  const lastY = toY(data[data.length - 1]);
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(lastX, lastY, 3, 0, Math.PI * 2);
  ctx.fill();
}


/* ===================== 9. UPDATE DOM ===================== */

// Memperbarui angka-angka pada kartu statistik
function updateStats() {
  const { attacks, blocked, critical } = state.totals;
  const rate = attacks ? Math.round((blocked / attacks) * 100) : 0;

  dom.statTotal.textContent = formatNumber(attacks);
  dom.statBlocked.textContent = formatNumber(blocked);
  dom.statBlockRate.textContent = `${rate}% dari total`;
  dom.statCritical.textContent = formatNumber(critical);
}

// Membuat diagram batang "Top 5 Jenis Serangan" dengan elemen DOM biasa
function renderTopTypes() {
  const top = Object.entries(state.typeCounts)
    .sort((a, b) => b[1] - a[1]) // urutkan dari jumlah terbesar
    .slice(0, 5);                // ambil 5 teratas

  if (top.length === 0) {
    dom.topTypes.innerHTML = '<li class="bars__empty">Menunggu data…</li>';
    return;
  }

  const maxCount = top[0][1];
  const fragment = document.createDocumentFragment();

  top.forEach(([name, count]) => {
    const item = document.createElement('li');
    item.className = 'bars__item';

    const label = document.createElement('span');
    label.className = 'bars__label';
    label.textContent = name;

    const track = document.createElement('div');
    track.className = 'bars__track';
    const fill = document.createElement('div');
    fill.className = 'bars__fill';
    fill.style.width = `${(count / maxCount) * 100}%`; // panjang batang relatif
    track.appendChild(fill);

    const total = document.createElement('span');
    total.className = 'bars__count';
    total.textContent = count;

    item.append(label, track, total);
    fragment.appendChild(item);
  });

  dom.topTypes.replaceChildren(fragment); // ganti isi lama dengan yang baru
}

// Membuat satu sel <td> berisi teks
function createCell(text, className) {
  const td = document.createElement('td');
  td.textContent = text; // textContent (bukan innerHTML) → aman dari kode berbahaya
  if (className) td.className = className;
  return td;
}

// Membangun ulang isi tabel log sesuai filter severity.
// highlightNewest = true → baris paling atas diberi animasi kedip.
function renderLog(highlightNewest = false) {
  const visibleLogs = state.logs
    .filter((attack) => state.activeSeverities.has(attack.severity))
    .slice(0, CONFIG.maxLogRows);

  // Tabel kosong → tampilkan pesan
  if (visibleLogs.length === 0) {
    const row = document.createElement('tr');
    const cell = createCell('Belum ada data yang cocok dengan filter.', 'empty');
    cell.colSpan = 7;
    row.appendChild(cell);
    dom.logBody.replaceChildren(row);
    return;
  }

  // DocumentFragment = "wadah sementara" agar DOM hanya di-update sekali
  const fragment = document.createDocumentFragment();

  visibleLogs.forEach((attack, index) => {
    const row = document.createElement('tr');

    // Kedipkan baris hanya jika ia memang serangan yang baru saja masuk
    if (highlightNewest && index === 0 && attack === state.logs[0]) {
      row.classList.add('row--new');
    }

    // Label severity berbentuk badge
    const badge = document.createElement('span');
    badge.className = `badge badge--${attack.severity}`;
    badge.textContent = attack.severity.toUpperCase();
    const severityCell = document.createElement('td');
    severityCell.appendChild(badge);

    const statusText = attack.blocked ? 'BLOCKED' : 'ALLOWED';
    const statusClass = attack.blocked ? 'status-blocked' : 'status-allowed';

    row.append(
      createCell(formatTime(attack.time)),
      createCell(`${attack.sourceIP} (${attack.source.province})`),
      createCell(`${attack.target.city}, ${attack.target.province}`),
      createCell(attack.type),
      createCell(attack.port, 'col-optional'),
      severityCell,
      createCell(statusText, `col-optional ${statusClass}`),
    );

    fragment.appendChild(row);
  });

  dom.logBody.replaceChildren(fragment);
}


/* ===================== 10. EVENT HANDLING ===================== */

// Tombol Pause / Play
function togglePause() {
  state.running = !state.running;

  // classList.toggle(nama, kondisi): tambah class jika kondisi true, hapus jika false
  dom.body.classList.toggle('is-paused', !state.running);
  dom.btnToggle.textContent = state.running ? '❚❚ Pause' : '▶ Play';
  dom.btnToggle.setAttribute('aria-pressed', String(!state.running));
  dom.statusText.textContent = state.running ? 'LIVE' : 'PAUSED';
}

// Tombol Clear Log: hanya mengosongkan tabel, statistik tetap
function clearLog() {
  state.logs = [];
  renderLog();
}

// Slider kecepatan berubah
function changeSpeed(event) {
  state.speed = Number(event.target.value);
  dom.speedValue.textContent = state.speed;
  startAttackTimer(); // jalankan ulang timer dengan jeda baru
}

// Checkbox filter severity berubah
function changeFilter() {
  state.activeSeverities.clear();
  dom.sevFilters.forEach((checkbox) => {
    if (checkbox.checked) state.activeSeverities.add(checkbox.value);
  });
  renderLog(); // peta otomatis ikut tersaring di frame berikutnya
}

// Menghubungkan event ke fungsi (event listener)
function bindEvents() {
  dom.btnToggle.addEventListener('click', togglePause);
  dom.btnClear.addEventListener('click', clearLog);
  dom.speed.addEventListener('input', changeSpeed); // 'input' = saat slider digeser
  dom.sevFilters.forEach((checkbox) => {
    checkbox.addEventListener('change', changeFilter);
  });
  window.addEventListener('resize', handleResize);
}


/* ===================== 11. INISIALISASI ===================== */
function init() {
  // Isi grafik dengan data awal agar tidak kosong saat halaman dibuka
  for (let i = 0; i < CONFIG.chartPoints; i++) {
    state.traffic.push(800 + state.speed * 60 + randomInt(-150, 150));
  }
  dom.statPps.textContent = formatNumber(state.traffic[state.traffic.length - 1]);

  handleResize();
  bindEvents();
  updateStats();
  renderTopTypes();
  renderLog();
  updateClock();

  // Timer-timer simulasi
  setInterval(updateClock, 1000);
  setInterval(trafficTick, 1000);
  startAttackTimer();

  // Mulai loop animasi peta
  requestAnimationFrame(animate);
}

// Jalankan init() setelah seluruh HTML selesai dibaca browser
document.addEventListener('DOMContentLoaded', init);
