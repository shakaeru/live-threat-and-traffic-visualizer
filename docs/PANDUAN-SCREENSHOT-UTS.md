# Panduan Pengumpulan & Tangkapan Layar — UTS

Nama file dokumen: **`UTS_ShafwanKhairullah_2TRKB`** → `.docx` / `.pdf`
(ikuti persis format dari dosen: huruf besar/kecil, garis bawah, tanpa spasi).

---

## 0. Persiapan sebelum screenshot

1. Pastikan nama & kelas di footer `index.html` sudah benar.
2. Buka proyek di VS Code dari WSL:
   ```bash
   cd ~/projects/live-threat-and-traffic-visualizer && code .
   ```
3. Jalankan halaman **lewat server** (wajib, karena proyek memakai ES6 Modules — membuka
   `index.html` dengan klik dua kali akan gagal):
   ```bash
   python3 -m http.server 8000
   ```
   lalu buka `http://localhost:8000` di browser Windows.
   (Alternatif: ekstensi VS Code **Live Server** → klik kanan `index.html` → *Open with Live Server*.)
4. Tunggu ±20 detik agar tabel log & statistik sudah terisi sebelum screenshot.
5. Agar screenshot kode rapi: zoom VS Code secukupnya (Ctrl + / Ctrl −), sembunyikan sidebar (Ctrl+B),
   dan pastikan **nomor baris terlihat**.
6. Simpan semua gambar ke folder `screenshots/` dengan nama urut: `01-tampilan-desktop.png`, dst.

Alat screenshot di Windows: **Win + Shift + S** (pilih area).

---

## 1. Tangkapan Layar TAMPILAN (Output Web)

| No | Yang di-screenshot | Cara | Bukti untuk rubrik |
|---|---|---|---|
| T1 | Halaman penuh, mode desktop, status **LIVE** | Browser layar penuh, garis serangan sedang terlihat di peta | Hasil akhir keseluruhan |
| T2 | Header / Navbar | Area paling atas: logo, menu, titik LIVE, jam | HTML5 semantik, Flexbox |
| T3 | Threat Map | Saat ada beberapa garis & efek gelombang. Kalau perlu tekan **Pause** dulu agar momen bagus “membeku” | Canvas API, animasi |
| T4 | Traffic Statistics | Kartu angka + grafik + diagram batang | Canvas (grafik), CSS Grid, manipulasi DOM |
| T5 | Attack Log Table | Tabel terisi, terlihat badge severity berbeda-beda | Tabel HTML, DOM |
| T6 | Fitur **Pause** | Klik Pause → status berubah **PAUSED**, tombol jadi **▶ Play** | Event handling (click) |
| T7 | Fitur **Filter** | Hapus centang Low & Medium → tabel hanya berisi High/Critical | Event handling (change) |
| T8 | Slider kecepatan | Geser ke 10, tampak serangan jauh lebih ramai | Event handling (input), setInterval |
| T9 | Tampilan **Tablet** | F12 → ikon *Toggle device toolbar* (Ctrl+Shift+M) → pilih **iPad** | Responsive `@media (max-width:1024px)` |
| T10 | Tampilan **HP** | Pilih **iPhone 12 Pro** / lebar 390px. Kolom Port & Status hilang | Responsive `@media (max-width:600px)` |
| T11 | Console bersih | F12 → tab **Console** tanpa error merah | Bukti kode berjalan tanpa error |

Untuk halaman penuh (T1) di Chrome: F12 → Ctrl+Shift+P → ketik **“Capture full size screenshot”**.

---

## 2. Tangkapan Layar KODE PROGRAM

### A. `index.html` — HTML & HTML5

| No | Bagian kode | Yang ditunjukkan |
|---|---|---|
| K1 | `<!DOCTYPE html>` sampai `</head>` | Struktur dokumen HTML5, `meta charset`, `meta viewport`, `<link>` ke `css/main.css`, `<script type="module">` |
| K2 | Blok `<header class="site-header">` | `<header>`, `<nav>`, `<time>` |
| K3 | Blok **Control Panel** (`<section ... id="controls">`) | `<button>`, `<fieldset>`, checkbox, `type="range"`, `<output>` |
| K4 | Blok **Threat Map** (`<section ... id="map">`) | Elemen `<canvas>` |
| K5 | Blok **Traffic Statistics** | `<article>`, `<figure>`, `<figcaption>`, `<canvas>` kedua |
| K6 | Blok **Attack Log** + `<footer>` | `<table>`, `<thead>`, `<tbody>`, `<footer>` |

### B. Folder `css/` — CSS & CSS3

| No | File & bagian kode | Yang ditunjukkan |
|---|---|---|
| K7 | `css/main.css` (seluruh isi) | CSS modular dengan `@import` |
| K8 | `css/base.css` → `:root { ... }` | CSS Variables (palet monokrom, font, jarak) |
| K9 | `css/components/header.css` → `.site-header`, `.brand`, `.status` | Flexbox, `position: sticky` |
| K10 | `css/layout.css` → `.dashboard` + `.panel--*` | CSS Grid + `grid-template-areas` |
| K11 | `css/layout.css` → `.filter__item input` & `:checked` | Checkbox kustom `appearance: none` |
| K12 | `css/components/radar-canvas.css` → `.radar`, `.is-paused .radar`, `@keyframes radar-sweep` | `conic-gradient`, animasi CSS3, `animation-play-state` |
| K13 | `css/components/stats-panel.css` → `.stat-grid`, `.bars__item` | CSS Grid & Flexbox pada kartu statistik |
| K14 | `css/components/threat-log.css` → `.log-table th`, `.badge--*`, `@keyframes row-flash` | Tabel sticky header, animasi baris baru |
| K15 | Blok `@media` di `layout.css` + `stats-panel.css` (atau file lain) | Responsive Web Design (1024px & 600px) |

### C. Folder `js/` — JavaScript (ES6 Modules)

| No | File & bagian kode | Yang ditunjukkan |
|---|---|---|
| K16 | Panel **Explorer** VS Code dengan folder `css/` dan `js/` terbuka | Arsitektur modular (banyak file per komponen) |
| K17 | `js/main.js` → 4 baris `import` teratas | ES6 Modules: `import` / `export` |
| K18 | `js/config/cities.js` (seluruh isi) | Array of objects, `Object.freeze`, data 16 kota |
| K19 | `js/utils/geo-converter.js` (seluruh isi) | Fungsi `latLngToCanvas()` — proyeksi koordinat |
| K20 | `js/modules/threat-logger.js` → `randomSeverity()` + `generateAttack()` | Simulasi data acak berbobot |
| K21 | `js/main.js` → `spawnAttack()` + `restartAttackTimer()` | Simulasi otomatis dengan `setInterval` |
| K22 | `js/modules/radar-map.js` → `pointOnArc()` + `drawArc()` | Canvas API 2D: `beginPath`, `lineTo`, `stroke`, `arc`, kurva Bézier |
| K23 | `js/modules/radar-map.js` → `update()` + `render()` + `frame()` | `requestAnimationFrame` & delta time |
| K24 | `js/modules/radar-map.js` → `LABEL_PLACEMENT` + `drawCities()` | Penempatan label kota agar tidak bertumpuk |
| K25 | `js/modules/traffic-chart.js` → `draw()` | Grafik garis manual + `createLinearGradient` |
| K26 | `js/modules/threat-logger.js` → `createRow()` + `renderTable()` | Manipulasi DOM: `createElement`, `textContent`, `classList`, `replaceChildren` |
| K27 | `js/modules/controls.js` (seluruh isi) | Event handling: `click`, `input`, `change` + callback |
| K28 | `js/main.js` → `initControls(...)` sampai akhir file | Integrasi modul, event `resize`, urutan start aplikasi |

Tips: jika satu bagian terlalu panjang untuk satu layar, pecah jadi 2 gambar (mis. K22a, K22b).
Penjelasan setiap bagian kode ada di `docs/PENJELASAN-KODE.md`.

---

## 3. Susunan Dokumen Word/PDF yang Disarankan

1. **Halaman Sampul** — judul proyek, nama, NIM, kelas, mata kuliah, dosen, logo kampus.
2. **BAB 1 Pendahuluan** — ringkasan & tujuan (ambil dari `docs/PRD.md` bagian 1).
3. **BAB 2 Rancangan** — daftar komponen, struktur folder, tabel pemetaan rubrik (PRD bagian 2, 3, 5).
4. **BAB 3 Implementasi Kode** — screenshot K1–K28, masing-masing diberi:
   - judul gambar, contoh: *Gambar 3.7 CSS Variables pada `:root`*
   - 2–3 kalimat penjelasan dengan bahasa sendiri.
5. **BAB 4 Hasil Tampilan** — screenshot T1–T11 + penjelasan singkat setiap fitur.
6. **BAB 5 Penutup** — kesimpulan, kendala yang dihadapi, rencana pengembangan untuk UAS.
7. **Lampiran** — link repository GitHub (jika diminta).

Simpan dari Word sebagai PDF: **File → Save As → PDF**, beri nama `UTS_ShafwanKhairullah_2TRKB.pdf`.

---

## 4. Checklist Akhir

- [ ] Nama & kelas di footer sudah benar.
- [ ] Halaman dibuka lewat `http://localhost:8000`, bukan klik dua kali `index.html`.
- [ ] Semua screenshot kode menampilkan nomor baris dan nama file (tab di VS Code).
- [ ] Setiap gambar punya nomor + keterangan.
- [ ] Console browser tanpa error merah (T11).
- [ ] Nama file sesuai format `UTS_ShafwanKhairullah_2TRKB`.
