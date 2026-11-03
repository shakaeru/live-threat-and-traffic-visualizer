# PRD — Live Threat & Traffic Visualizer

> Product Requirement Document · Proyek UTS & UAS Pemrograman Web
> Teknologi: HTML5, CSS3 modular (`@import`), JavaScript murni dengan ES6 Modules
> (tanpa framework, tanpa library, tanpa bundler, tanpa backend)

---

## 1. Ringkasan Proyek & Tujuan

**Live Threat & Traffic Visualizer** adalah dashboard satu halaman yang menampilkan simulasi
serangan siber dan lalu lintas jaringan secara *real-time*. Semua data dibuat otomatis oleh
JavaScript (mock data), sehingga tidak butuh backend, database, atau koneksi internet.
Cukup server statis lokal (`python3 -m http.server 8000`), karena browser hanya mengizinkan
ES6 Modules dimuat lewat `http://`, bukan `file://`.

**Tujuan:**

1. Menampilkan serangan siber (asal → target) sebagai animasi garis pada peta berbasis `<canvas>`.
2. Menampilkan statistik lalu lintas (total serangan, diblokir, paket/detik, kritis) yang terus diperbarui.
3. Mencatat setiap serangan dalam tabel log *real-time*.
4. Memberi kontrol kepada pengguna: jeda/lanjut, filter tingkat bahaya (*severity*), kecepatan simulasi.
5. Menjadi bukti penguasaan HTML5, CSS3, dan JavaScript vanilla sesuai rubrik UTS/UAS.

**Tema desain:** monokrom (hitam, putih, abu-abu), gaya *cyber/tech minimalist*, font monospace.
Karena tidak ada warna, tingkat bahaya dibedakan lewat **kecerahan** dan **gaya garis**:

| Severity | Warna garis | Gaya garis |
|---|---|---|
| Critical | Putih terang | Tebal, solid |
| High | Abu-abu terang | Solid |
| Medium | Abu-abu | Putus-putus |
| Low | Abu-abu gelap | Titik-titik |

**Di luar cakupan:** login, data serangan sungguhan, penyimpanan ke database, backend PHP/MySQL.

---

## 2. Daftar Halaman / Komponen Utama

Aplikasi berupa **satu halaman** (`index.html`) dengan 6 komponen:

| No | Komponen | Elemen HTML | Fungsi |
|---|---|---|---|
| 1 | **Header / Navbar** | `<header>`, `<nav>`, `<time>` | Judul, menu lompat ke bagian (Peta, Statistik, Log), indikator LIVE/PAUSED, jam digital. |
| 2 | **Filter / Control Panel** | `<section>`, `<button>`, `<fieldset>`, `<input type="checkbox">`, `<input type="range">`, `<output>` | Tombol Pause/Play, Clear Log, filter severity, slider kecepatan. |
| 3 | **Threat Map (Canvas Visualizer)** | `<section>`, `<canvas>` | Peta titik 16 kota strategis Indonesia (Sumatra s.d. Papua); serangan digambar sebagai busur animasi dari kota asal ke kota target, lalu efek gelombang (*pulse*) saat tiba. Ada efek radar berputar (CSS). |
| 4 | **Traffic Statistics Panel** | `<section>`, `<article>`, `<figure>`, `<canvas>`, `<ul>` | 4 kartu angka, grafik garis paket/detik 60 detik terakhir (digambar manual dengan Canvas), dan diagram batang 5 jenis serangan terbanyak. |
| 5 | **Real-time Attack Log Table** | `<section>`, `<table>`, `<thead>`, `<tbody>` | Tabel 50 serangan terbaru: waktu, IP sumber, target, jenis, port, severity, status. Baris baru berkedip. |
| 6 | **Footer** | `<footer>` | Identitas pembuat dan keterangan bahwa data adalah simulasi. |

**Alur data (sederhana):**

```
main.js: setInterval(spawnAttack)
            │
            ▼
threat-logger.js: generateAttack() ──► 1 objek serangan acak
            │
   ┌────────┼──────────────────────────┬───────────────────────────────┐
   ▼                                   ▼                               ▼
threat-logger.js: record()      radar-map.js: launch()        traffic-chart.js: recordAttack()
(statistik + tabel log)         (garis animasi peta)          (lonjakan grafik traffic)
                                       │
                         requestAnimationFrame(frame)
                         menggambar ulang peta ±60x per detik

controls.js ──(callback onToggle / onFilterChange / onSpeedChange)──► main.js ──► semua modul
```

---

## 3. Pemetaan Fitur ke Rubrik Penilaian

### 3.1 HTML & HTML5

| Kriteria | Implementasi | Lokasi |
|---|---|---|
| Struktur dokumen HTML5 | `<!DOCTYPE html>`, `lang="id"`, `meta charset`, `meta viewport` | `index.html` bagian `<head>` |
| Elemen semantik | `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<figure>`, `<figcaption>`, `<footer>` | Seluruh `index.html` |
| Elemen HTML5 khusus | `<canvas>` (2 buah), `<time>`, `<output>` | Threat Map, grafik traffic, jam, slider |
| Form & input | `<button>`, `<fieldset>`/`<legend>`, `<label>`, checkbox, `type="range"` | Control Panel |
| Tabel data | `<table>`, `<caption>`, `<thead>`, `<tbody>`, `<th scope="col">` | Attack Log |
| Aksesibilitas | `aria-label`, `aria-labelledby`, `aria-pressed`, `aria-live`, `aria-hidden` | Navbar, tombol, tabel |

### 3.2 CSS & CSS3

| Kriteria | Implementasi | Lokasi |
|---|---|---|
| CSS modular | `main.css` menggabungkan 6 file lewat `@import` | `css/main.css` |
| CSS Variables | Palet warna, warna severity, font, jarak, radius di `:root` | `css/base.css` |
| Flexbox | Header, control panel, legenda, diagram batang | `components/header.css`, `layout.css`, `components/radar-canvas.css`, `components/stats-panel.css` |
| CSS Grid | Tata letak dashboard (`grid-template-areas`), kartu statistik, baris diagram batang | `layout.css`, `components/stats-panel.css` |
| Responsive (`@media`) | 3 ukuran: desktop (>1024px), tablet (≤1024px), HP (≤600px); setiap file komponen memuat aturan responsifnya sendiri | `layout.css`, `components/*.css` |
| Animasi `@keyframes` | `scanline` (garis scan layar), `pulse`, `pulse-ring`, `blink` (header), `radar-sweep` (radar), `row-flash` (baris log baru) | `base.css`, `components/header.css`, `components/radar-canvas.css`, `components/threat-log.css` |
| Fitur CSS3 lain | `conic-gradient`, `repeating-linear-gradient`, `transition`, `transform`, `aspect-ratio`, `position: sticky`, `appearance: none` (checkbox kustom), pseudo-element `::before/::after` | Tersebar |
| Aksesibilitas gerak | `@media (prefers-reduced-motion)` mematikan animasi | `css/base.css` |

### 3.3 JavaScript (Vanilla, ES6 Modules)

| Kriteria | Implementasi | Lokasi |
|---|---|---|
| ES6 Modules | `export` / `import` antar 7 file, `<script type="module">` | `index.html`, semua file `js/` |
| Manipulasi DOM | Membuat baris tabel (`createElement`, `textContent`, `replaceChildren`), update angka statistik, ubah class/atribut | `threat-logger.js` → `renderTable()`, `renderStats()`, `renderTopTypes()`; `controls.js` → `renderRunningState()` |
| Canvas API 2D | Grid peta, titik & label kota, busur kurva Bézier, *pulse*, lapisan statis offscreen, grafik garis + gradien | `radar-map.js` → `drawBackground()`, `drawCities()`, `drawArc()`, `drawPulse()`; `traffic-chart.js` → `draw()` |
| Konversi koordinat | Proyeksi equirectangular lintang/bujur → piksel | `utils/geo-converter.js` → `latLngToCanvas()` |
| Simulasi data otomatis | `setInterval` untuk serangan, traffic, jam; `requestAnimationFrame` untuk animasi peta | `main.js` → `restartAttackTimer()`; `traffic-chart.js` → `tick()`; `radar-map.js` → `frame()` |
| Event handling | `click` (Pause/Play, Clear), `change` (filter checkbox), `input` (slider), `resize` (ukuran layar) | `controls.js` → `initControls()`; `main.js` |
| Logika & struktur data | Objek, array, `Set`, `Map`, `Object.freeze`, `filter`, `sort`, `map`, acak berbobot (*weighted random*), factory function & closure | `config/cities.js`, `threat-logger.js` → `randomSeverity()`, `generateAttack()` |

---

## 4. Kriteria Selesai (Checklist Uji)

- [ ] Halaman terbuka lewat `http://localhost:8000` tanpa error di Console (F12).
- [ ] Garis serangan muncul terus-menerus di peta dan diakhiri efek *pulse*.
- [ ] Angka statistik & grafik traffic bertambah setiap detik.
- [ ] Tabel log bertambah dari atas, maksimal 50 baris.
- [ ] Tombol **Pause** menghentikan semua animasi & data; **Play** melanjutkan.
- [ ] Mencentang/menghapus centang severity menyaring peta & tabel.
- [ ] Slider kecepatan mengubah frekuensi serangan.
- [ ] Tampilan rapi di lebar desktop, tablet, dan HP (cek dengan DevTools → Toggle Device).

---

## 5. Struktur Folder

```
~/projects/live-threat-and-traffic-visualizer/
├── index.html                      ← kerangka semantik HTML5
├── css/
│   ├── main.css                    ← entry point, @import semua modul CSS
│   ├── base.css                    ← variabel, reset, tipografi, tema monokrom
│   ├── layout.css                  ← grid dashboard, panel, control panel, footer
│   └── components/
│       ├── header.css
│       ├── radar-canvas.css
│       ├── stats-panel.css
│       └── threat-log.css
├── js/
│   ├── main.js                     ← entry point, merangkai semua modul
│   ├── config/cities.js            ← 16 kota Indonesia + batas peta
│   ├── utils/geo-converter.js      ← latLngToCanvas()
│   └── modules/
│       ├── radar-map.js            ← peta & animasi serangan
│       ├── traffic-chart.js        ← grafik paket/detik
│       ├── threat-logger.js        ← data serangan, statistik, tabel log
│       └── controls.js             ← event tombol, filter, slider
├── docs/
│   ├── PRD.md                      ← dokumen ini
│   ├── PENJELASAN-KODE.md
│   ├── PANDUAN-SCREENSHOT-UTS.md
│   └── DAFTAR-PUSTAKA.md
├── README.md
└── screenshots/                    ← (buat sendiri) simpan hasil tangkapan layar
```

Pemisahan HTML (struktur), CSS (tampilan), dan JS (perilaku) — ditambah pemecahan CSS & JS
per komponen — adalah prinsip *separation of concerns*, poin plus saat presentasi.
