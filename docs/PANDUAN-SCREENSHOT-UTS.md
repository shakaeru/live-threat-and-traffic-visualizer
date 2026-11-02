# Panduan Pengumpulan & Tangkapan Layar — UTS

Nama file dokumen: **`UTS_NAMA_KELAS`** → contoh: `UTS_BUDI_TI2A.docx` / `.pdf`
(ikuti persis format dari dosen: huruf besar/kecil, garis bawah, tanpa spasi).

---

## 0. Persiapan sebelum screenshot

1. Ganti `NAMA_ANDA (KELAS)` di footer `index.html` dengan nama & kelas Anda.
2. Buka proyek di VS Code dari WSL:
   ```bash
   cd ~/projects/live-threat-and-traffic-visualizer && code .
   ```
3. Jalankan halaman. Cara paling mudah — server statis bawaan Python:
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
| K1 | `<!DOCTYPE html>` sampai `</head>` | Struktur dokumen HTML5, `meta charset`, `meta viewport`, link CSS |
| K2 | Blok `<header class="site-header">` | `<header>`, `<nav>`, `<time>` |
| K3 | Blok **Control Panel** (`<section ... id="controls">`) | `<button>`, `<fieldset>`, checkbox, `type="range"`, `<output>` |
| K4 | Blok **Threat Map** (`<section ... id="map">`) | Elemen `<canvas>` |
| K5 | Blok **Traffic Statistics** | `<article>`, `<figure>`, `<figcaption>`, `<canvas>` kedua |
| K6 | Blok **Attack Log** + `<footer>` + `<script>` | `<table>`, `<thead>`, `<tbody>`, `<footer>` |

### B. `css/style.css` — CSS & CSS3

| No | Bagian kode | Yang ditunjukkan |
|---|---|---|
| K7 | Bagian **1. CSS VARIABLES** (`:root { ... }`) | CSS Variables |
| K8 | Bagian **3. HEADER** (`.site-header`, `.brand`) | Flexbox, `position: sticky` |
| K9 | Bagian **4. LAYOUT DASHBOARD** (`.dashboard`) | CSS Grid + `grid-template-areas` |
| K10 | Bagian **5**: `.filter__item input` & `:checked` | Checkbox kustom `appearance: none` |
| K11 | Bagian **6**: `.radar` + `.is-paused .radar` | `conic-gradient`, `animation-play-state` |
| K12 | Bagian **9. ANIMASI** (semua `@keyframes`) | Animasi CSS3: pulse, radar, scanline, row-flash, blink |
| K13 | Bagian **10. RESPONSIVE** (semua `@media`) | Responsive Web Design |

### C. `js/app.js` — JavaScript

| No | Bagian kode | Yang ditunjukkan |
|---|---|---|
| K14 | Bagian **1** (`CONFIG`, `LOCATIONS`, `ATTACK_TYPES`) + **2** (`state`) | Struktur data: objek, array, `Set` |
| K15 | Bagian **3** (`const dom = {...}`) | Seleksi DOM: `getElementById`, `querySelectorAll` |
| K16 | Bagian **5**: `createAttack()`, `spawnAttack()`, `startAttackTimer()` | Simulasi data otomatis dengan `setInterval` |
| K17 | Bagian **7**: `getArcPoint()` + `drawArc()` | Canvas API 2D: `beginPath`, `lineTo`, `stroke`, `arc`, kurva Bezier |
| K18 | Bagian **7**: `updateAnimations()` + `animate()` | `requestAnimationFrame` |
| K19 | Bagian **8**: `drawTrafficChart()` | Grafik garis manual + `createLinearGradient` |
| K20 | Bagian **9**: `renderLog()` | Manipulasi DOM: `createElement`, `textContent`, `classList`, `replaceChildren` |
| K21 | Bagian **10**: `togglePause()` … `bindEvents()` | Event handling: `click`, `change`, `input`, `resize` |
| K22 | Bagian **11**: `init()` + `DOMContentLoaded` | Alur program dimulai |

Tips: jika satu bagian terlalu panjang untuk satu layar, pecah jadi 2 gambar (mis. K12a, K12b).

---

## 3. Susunan Dokumen Word/PDF yang Disarankan

1. **Halaman Sampul** — judul proyek, nama, NIM, kelas, mata kuliah, dosen, logo kampus.
2. **BAB 1 Pendahuluan** — ringkasan & tujuan (ambil dari `docs/PRD.md` bagian 1).
3. **BAB 2 Rancangan** — daftar komponen, struktur folder, tabel pemetaan rubrik (PRD bagian 2, 3, 5).
4. **BAB 3 Implementasi Kode** — screenshot K1–K22, masing-masing diberi:
   - judul gambar, contoh: *Gambar 3.7 CSS Variables pada `:root`*
   - 2–3 kalimat penjelasan dengan bahasa sendiri.
5. **BAB 4 Hasil Tampilan** — screenshot T1–T11 + penjelasan singkat setiap fitur.
6. **BAB 5 Penutup** — kesimpulan, kendala yang dihadapi, rencana pengembangan untuk UAS.
7. **Lampiran** — link repository GitHub (jika diminta).

Simpan dari Word sebagai PDF: **File → Save As → PDF**, beri nama `UTS_NAMA_KELAS.pdf`.

---

## 4. Checklist Akhir

- [ ] Nama & kelas di footer sudah diganti.
- [ ] Semua screenshot kode menampilkan nomor baris.
- [ ] Setiap gambar punya nomor + keterangan.
- [ ] Console browser tanpa error (T11).
- [ ] Nama file sesuai format `UTS_NAMA_KELAS`.
