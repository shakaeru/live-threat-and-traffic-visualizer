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
| T12 | Tab **Network** (opsional) | F12 → tab **Network** → refresh (F5) → filter **JS** lalu **CSS** | Bukti semua modul CSS & JS termuat (status 200) |

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
4. **BAB 3 Implementasi Kode** — screenshot K1–K28 (Gambar 3.1–3.28). Judul & keterangan
   siap pakai ada di **Bagian 5** dokumen ini.
5. **BAB 4 Hasil Tampilan** — screenshot T1–T12 (Gambar 4.1–4.12). Judul & keterangan
   siap pakai ada di **Bagian 5.2**, sedangkan penjelasan rinci untuk isi pembahasan
   T2–T8 ada di **Bagian 5.3** dokumen ini.
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

---

## 5. Keterangan Gambar Siap Pakai

Setiap gambar di bawah berisi:
- **Judul** → tulis di bawah gambar (Word: klik kanan gambar → *Insert Caption*).
- **Lokasi** → file & nomor baris yang harus terlihat di screenshot.
- **Penerapan** → poin teknologi yang ditunjukkan, dikelompokkan per kategori rubrik.
- **Keterangan** → paragraf siap tempel di bawah judul gambar (boleh disesuaikan dengan bahasa sendiri).

### 5.0 Cara membedakan kategori

| Kategori | Ciri-ciri di proyek ini |
|---|---|
| **HTML** | Elemen dasar yang sudah ada sejak HTML 4: `<a>`, `<ul>/<li>`, `<h1>–<h3>`, `<p>`, `<span>`, `<div>`, `<button>`, `<label>`, `<input type="checkbox">`, `<fieldset>/<legend>`, `<table>/<thead>/<tbody>/<th>/<td>/<caption>`, `<link>`, `<title>` |
| **HTML5** | `<!DOCTYPE html>` versi pendek, `<meta charset="UTF-8">`, elemen semantik (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<figure>`, `<figcaption>`, `<footer>`), `<canvas>`, `<time datetime>`, `<output>`, `<input type="range">`, `<script type="module">` |
| **CSS** | Selector class/elemen, warna, `font-*`, `padding`, `margin`, `border`, `text-transform`, `letter-spacing`, `:hover`, `float`, `overflow`, `z-index`, `@import` |
| **CSS3** | CSS Variables (`--nama`, `var()`), Flexbox, Grid, `@media`, `@keyframes`/`animation`, `transition`, `transform`, `rgba()`, gradien (`linear-`, `conic-`, `repeating-linear-gradient`), `border-radius`, `box-shadow`, `aspect-ratio`, `position: sticky`, `appearance`, `:checked`, `:nth-child()`, `:focus-visible`, `::before/::after`, `accent-color`, `text-overflow`, `inset`, `prefers-reduced-motion` |
| **JavaScript** | DOM (`getElementById`, `createElement`, `textContent`, `classList`, `replaceChildren`), event (`addEventListener`), timer (`setInterval`, `requestAnimationFrame`), Canvas API 2D |
| **ES6+ (JavaScript modern)** | `import`/`export`, `const`/`let`, arrow function `=>`, template literal `` `${}` ``, destructuring, spread `...`, default parameter, `for...of`, `Map`/`Set`, shorthand property, `??` (ES2020) |
| **Fitur lain** | Aksesibilitas WAI-ARIA (`aria-*`, `role`), proyeksi peta, kurva Bézier, *factory function* & *closure*, *separation of concerns* |

---

### 5.1 BAB 3 — Implementasi Kode

#### Gambar 3.1 — Struktur dokumen HTML5 dan pemanggilan CSS/JS modular (K1)
- **Lokasi:** `index.html` baris 1–12
- **Penerapan:**
  - **HTML5:** `<!DOCTYPE html>`, `<meta charset="UTF-8">`, `<script type="module">`
  - **HTML:** `<html lang="id">`, `<head>`, `<title>`, `<link rel="stylesheet">`
  - **Responsive:** `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
  - **Fitur lain:** `<meta name="description">` untuk SEO
- **Keterangan:** Bagian `<head>` diawali deklarasi `<!DOCTYPE html>` khas HTML5 dan atribut `lang="id"` sebagai penanda bahasa halaman. Meta `viewport` membuat lebar halaman mengikuti lebar layar perangkat sebagai dasar Responsive Web Design. Seluruh tampilan dimuat melalui satu file `css/main.css`, sedangkan seluruh logika dimuat melalui `<script type="module">` yang mengaktifkan ES6 Modules sehingga `main.js` dapat meng-import modul lain.

#### Gambar 3.2 — Header dan navigasi semantik (K2)
- **Lokasi:** `index.html` baris 17–39
- **Penerapan:**
  - **HTML5:** `<header>`, `<nav>`, `<time datetime="">`
  - **HTML:** `<h1>`, `<p>`, `<ul>/<li>`, `<a href="#map">` (link jangkar ke bagian halaman), `<span>`
  - **Fitur lain:** `aria-label="Navigasi utama"`, `aria-hidden="true"` pada elemen dekoratif
- **Keterangan:** Header disusun dengan elemen semantik HTML5 `<header>` dan `<nav>` sehingga struktur halaman mudah dipahami browser maupun pembaca layar. Menu navigasi memakai link jangkar (`#map`, `#stats`, `#log`) untuk melompat ke setiap panel. Jam digital memakai elemen HTML5 `<time>` yang isi dan atribut `datetime`-nya diperbarui oleh JavaScript setiap detik.

#### Gambar 3.3 — Control Panel dengan elemen form (K3)
- **Lokasi:** `index.html` baris 42–63
- **Penerapan:**
  - **HTML5:** `<section>`, `<input type="range" min max value>`, `<output for="speed">`
  - **HTML:** `<button type="button">`, `<fieldset>`, `<legend>`, `<label>`, `<input type="checkbox" checked>`
  - **Fitur lain:** `aria-labelledby`, `aria-pressed` (status tombol on/off)
- **Keterangan:** Control Panel ditempatkan dalam `<section>` dan berisi tombol Pause/Play, Clear Log, empat checkbox filter severity yang dikelompokkan dengan `<fieldset>` dan `<legend>`, serta slider kecepatan. Slider memakai input HTML5 `type="range"` dengan batas 1–10, dan nilainya ditampilkan melalui elemen HTML5 `<output>`. Atribut `aria-pressed` memberi tahu teknologi bantu bahwa tombol Pause/Play adalah tombol beralih (toggle).

#### Gambar 3.4 — Area Threat Map berbasis Canvas (K4)
- **Lokasi:** `index.html` baris 65–79
- **Penerapan:**
  - **HTML5:** `<section>`, `<canvas id="threatMap">`
  - **HTML:** `<h2>`, `<div class="radar">`, `<ul>/<li>` untuk legenda
  - **Fitur lain:** `role="img"` + `aria-label` agar canvas punya deskripsi teks
- **Keterangan:** Peta ancaman menggunakan elemen HTML5 `<canvas>` sebagai bidang gambar yang seluruh isinya digambar oleh JavaScript melalui Canvas API 2D. Elemen `<div class="radar">` di atas canvas menjadi lapisan efek radar yang dianimasikan murni dengan CSS3. Legenda di bawah peta menjelaskan perbedaan gaya garis untuk setiap tingkat severity.

#### Gambar 3.5 — Panel statistik dengan article dan figure (K5)
- **Lokasi:** `index.html` baris 81–111
- **Penerapan:**
  - **HTML5:** `<section>`, `<article>` (4 kartu statistik), `<figure>`, `<figcaption>`, `<canvas id="trafficChart">`
  - **HTML:** `<h3>`, `<p>`, `<ul id="topTypes">` (diisi oleh JavaScript)
- **Keterangan:** Setiap kartu statistik ditulis sebagai `<article>` karena merupakan konten mandiri yang dapat berdiri sendiri. Grafik traffic dibungkus `<figure>` dan diberi keterangan dengan `<figcaption>` sesuai kaidah semantik HTML5. Elemen `<ul id="topTypes">` sengaja dibiarkan kosong karena isinya dibangun secara dinamis oleh JavaScript.

#### Gambar 3.6 — Tabel log serangan dan footer (K6)
- **Lokasi:** `index.html` baris 113–139
- **Penerapan:**
  - **HTML:** `<table>`, `<caption>`, `<thead>`, `<tbody>`, `<tr>`, `<th scope="col">`, entitas `&copy;`
  - **HTML5:** `<section>`, `<main>` (penutup), `<footer>`
  - **Fitur lain:** `aria-live="polite"` pada `<tbody>`, class `col-optional` untuk kolom yang disembunyikan di HP
- **Keterangan:** Log serangan disajikan dalam tabel dengan `<thead>` untuk judul kolom dan `<tbody>` yang barisnya diisi otomatis oleh JavaScript. Atribut `scope="col"` dan `<caption>` membuat tabel lebih mudah dipahami pembaca layar, sedangkan `aria-live="polite"` mengumumkan pembaruan isi tabel. Halaman ditutup dengan elemen semantik HTML5 `<footer>` yang memuat identitas pembuat.

#### Gambar 3.7 — CSS modular dengan @import (K7)
- **Lokasi:** `css/main.css` baris 1–6
- **Penerapan:**
  - **CSS:** at-rule `@import url(...)`
  - **Fitur lain:** arsitektur CSS modular, urutan *cascade* (base → layout → komponen)
- **Keterangan:** File `main.css` menjadi pintu masuk tunggal yang menggabungkan enam file CSS menggunakan `@import`. Urutan impor sengaja disusun dari yang paling umum (variabel dan reset di `base.css`), lalu tata letak (`layout.css`), kemudian gaya tiap komponen, sehingga aturan yang lebih spesifik dapat menimpa aturan umum sesuai prinsip *cascade*.

#### Gambar 3.8 — CSS Variables untuk tema monokrom (K8)
- **Lokasi:** `css/base.css` baris 1–26
- **Penerapan:**
  - **CSS3:** Custom Properties (`--c-bg`, `--sev-critical`, `--gap`, dll.) pada selector `:root`
  - **CSS:** warna heksadesimal, *font stack* monospace, satuan `rem` dan `px`
- **Keterangan:** Seluruh palet warna monokrom, warna tiap severity, ukuran huruf, jarak, dan durasi transisi disimpan sebagai CSS Variables di `:root`. Nilai tersebut dipakai di semua file CSS melalui fungsi `var()`, sehingga perubahan tema cukup dilakukan di satu tempat. Karena tema tidak memakai warna, tingkat bahaya dibedakan dengan gradasi abu-abu dari `#ffffff` hingga `#5a5a5a`.

#### Gambar 3.9 — Header dengan Flexbox, sticky, dan animasi (K9)
- **Lokasi:** `css/components/header.css` baris 1–36 dan 78–123
- **Penerapan:**
  - **CSS3:** `display: flex`, `flex-wrap`, `justify-content: space-between`, `gap`, `position: sticky`, `rgba()`, `border-radius: 50%`, pseudo-element `::after`, `inset`, `@keyframes pulse`, `pulse-ring` (animasi `box-shadow`), `blink` dengan `steps(1)`, `font-variant-numeric: tabular-nums`
  - **CSS:** `z-index`, `text-transform`, `letter-spacing`
  - **Interaksi dengan JS:** selector `.is-paused` yang ditambahkan JavaScript saat Pause
- **Keterangan:** Header disusun dengan Flexbox sehingga logo, menu, dan status otomatis berjajar dan membungkus ke baris baru di layar sempit. `position: sticky` membuat header tetap terlihat saat halaman digulir. Titik indikator LIVE berdenyut dengan animasi `@keyframes pulse-ring`; ketika JavaScript menambahkan class `is-paused` pada `<body>`, animasi berhenti dan teks PAUSED berkedip dengan `@keyframes blink`.

#### Gambar 3.10 — Tata letak dashboard dengan CSS Grid (K10)
- **Lokasi:** `css/layout.css` baris 1–17
- **Penerapan:**
  - **CSS3:** `display: grid`, `grid-template-columns: minmax(0, 2fr) minmax(0, 1fr)`, satuan `fr`, `grid-template-areas`, `grid-area`, `gap`
  - **CSS:** `max-width`, `margin: 0 auto` (posisi tengah)
- **Keterangan:** Tata letak utama dashboard dibuat dengan CSS Grid. Properti `grid-template-areas` "menggambar" susunan panel secara visual: Control Panel di atas, Threat Map dan Statistik berdampingan dengan perbandingan lebar 2 : 1, lalu tabel log di bawah. Setiap panel cukup diberi `grid-area` sesuai namanya.

#### Gambar 3.11 — Checkbox kustom dan elemen kontrol (K11)
- **Lokasi:** `css/layout.css` baris 101–164
- **Penerapan:**
  - **CSS3:** `appearance: none`, pseudo-class `:checked`, `box-shadow: inset`, `transition`, `accent-color`, Flexbox
  - **CSS:** `float` pada `<legend>`, `cursor: pointer`, `user-select: none`
- **Keterangan:** Tampilan bawaan checkbox dihapus dengan `appearance: none`, lalu diganti kotak bergaris yang terisi putih ketika dicentang melalui pseudo-class CSS3 `:checked`. Efek `box-shadow: inset` membuat tampilan "kotak di dalam kotak" yang sesuai tema monokrom. Warna slider bawaan browser disesuaikan menjadi putih dengan `accent-color`.

#### Gambar 3.12 — Container peta dan efek radar (K12)
- **Lokasi:** `css/components/radar-canvas.css` baris 1–36 dan 64–67
- **Penerapan:**
  - **CSS3:** `aspect-ratio: 2 / 1`, `conic-gradient()`, `transform: translate() rotate()`, `border-radius: 50%`, `@keyframes radar-sweep`, `animation: ... linear infinite`, `animation-play-state: paused`
  - **CSS:** `position: relative/absolute`, `overflow: hidden`, `pointer-events: none`
- **Keterangan:** Container peta menjaga perbandingan 2 : 1 dengan `aspect-ratio`, dan canvas di dalamnya mengisi seluruh area. Efek radar dibuat dari lingkaran ber-`conic-gradient` yang diputar 360° terus-menerus oleh `@keyframes radar-sweep`. Saat aplikasi di-pause, `animation-play-state: paused` menghentikan putaran radar tanpa menghapus animasinya.

#### Gambar 3.13 — Kartu statistik dan diagram batang (K13)
- **Lokasi:** `css/components/stats-panel.css` baris 1–48 dan 77–118
- **Penerapan:**
  - **CSS3:** `grid-template-columns: repeat(2, 1fr)`, `transition`, `transform: translateY()` saat `:hover`, Flexbox `flex-direction: column`, `text-overflow: ellipsis`, `font-variant-numeric: tabular-nums`
  - **CSS:** class modifier `.stat-card--alert` (warna terbalik)
- **Keterangan:** Empat kartu statistik disusun dengan CSS Grid dua kolom, dan setiap kartu sedikit terangkat ketika disorot berkat `transform` dan `transition`. Kartu "Kritis" memakai warna terbalik (latar putih) agar paling menonjol. Diagram batang Top 5 memakai Grid tiga kolom (label, batang, angka), sedangkan panjang batangnya diatur oleh JavaScript melalui `style.width`.

#### Gambar 3.14 — Tabel log, badge severity, dan animasi baris baru (K14)
- **Lokasi:** `css/components/threat-log.css` baris 1–79
- **Penerapan:**
  - **CSS3:** `position: sticky` pada `<th>`, pseudo-class `:nth-child(even)`, `rgba()`, `border-radius`, `@keyframes row-flash`
  - **CSS:** `border-collapse`, `overflow: auto`, `max-height`, `white-space: nowrap`, `border-style: dashed/dotted`
- **Keterangan:** Tabel log dapat digulir di dalam kotaknya, sementara judul kolom tetap menempel di atas berkat `position: sticky`. Baris genap diberi latar sedikit lebih terang dengan `:nth-child(even)` (efek zebra). Label severity berbentuk *badge* dibedakan dari gaya garis tepinya, dan baris terbaru berkedip sekali melalui animasi `@keyframes row-flash`.

#### Gambar 3.15 — Responsive Web Design dengan media query (K15)
- **Lokasi:** `css/layout.css` baris 179–200 dan `css/components/stats-panel.css` baris 120–134 (tambahan opsional: `header.css` 125–135, `radar-canvas.css` 69–73, `threat-log.css` 81–85, `base.css` 103–114)
- **Penerapan:**
  - **CSS3:** `@media (max-width: 1024px)`, `@media (max-width: 600px)`, `@media (prefers-reduced-motion: reduce)`
- **Keterangan:** Tampilan menyesuaikan tiga ukuran layar. Pada lebar ≤ 1024 px (tablet), grid dashboard berubah menjadi satu kolom dan kartu statistik berjajar empat. Pada lebar ≤ 600 px (ponsel), header dan kontrol tersusun vertikal, peta menjadi 4 : 3, kartu kembali dua kolom, serta kolom Port dan Status disembunyikan. Setiap file komponen menyimpan aturan responsifnya sendiri, dan pengguna yang mengaktifkan opsi "kurangi gerakan" di sistem operasinya otomatis mendapat tampilan tanpa animasi.

#### Gambar 3.16 — Struktur folder proyek modular (K16)
- **Lokasi:** panel **Explorer** VS Code (folder `css/`, `css/components/`, `js/`, `js/config/`, `js/utils/`, `js/modules/` dibuka semua)
- **Penerapan:**
  - **Fitur lain:** *separation of concerns*, arsitektur modular tanpa bundler
- **Keterangan:** Kode program dipisahkan menjadi file-file kecil berdasarkan tanggung jawabnya: tujuh file CSS (dasar, tata letak, dan empat komponen) serta tujuh modul JavaScript (entry point, data kota, utilitas konversi koordinat, dan empat modul fitur). Pemisahan ini memudahkan pencarian, pemahaman, dan pengembangan setiap bagian tanpa memengaruhi bagian lain.

#### Gambar 3.17 — Entry point JavaScript dan import modul (K17)
- **Lokasi:** `js/main.js` baris 1–27
- **Penerapan:**
  - **ES6+:** `import { ... } from './modules/...js'`, `const`/`let`, arrow function (`byId`)
  - **JavaScript:** `document.getElementById`
  - **Fitur lain:** *factory function* (`createRadarMap`, `createTrafficChart`, `createThreatLogger`)
- **Keterangan:** File `main.js` adalah titik awal program yang meng-import empat modul menggunakan sintaks ES6 Modules. Fungsi panah `byId` menyingkat pemanggilan `document.getElementById`. Setiap modul dibuat melalui *factory function* yang menerima elemen HTML tujuannya, lalu variabel `running`, `speed`, dan `attackTimer` menyimpan kondisi simulasi.

#### Gambar 3.18 — Data 16 kota Indonesia (K18)
- **Lokasi:** `js/config/cities.js` baris 1–30
- **Penerapan:**
  - **ES6+:** `export const`
  - **JavaScript:** array of objects, `Object.freeze()`
- **Keterangan:** Data peta disimpan terpisah dari logika. `MAP_BOUNDS` menyimpan batas wilayah Indonesia (6° LU–11° LS, 95°–141° BT), sedangkan `CITIES` berisi 16 kota strategis dari Sumatra hingga Papua beserta provinsi, lintang, bujur, dan posisi label. `Object.freeze()` mengunci data agar tidak dapat diubah secara tidak sengaja oleh modul lain.

#### Gambar 3.19 — Fungsi konversi koordinat latLngToCanvas (K19)
- **Lokasi:** `js/utils/geo-converter.js` baris 1–21
- **Penerapan:**
  - **ES6+:** `import`, `export function`, object literal pada `return`
  - **JavaScript:** `Math.min()`, operasi aritmetika
  - **Fitur lain:** proyeksi equirectangular, *pure function*
- **Keterangan:** Fungsi `latLngToCanvas()` mengubah koordinat geografis menjadi posisi piksel pada canvas dengan proyeksi equirectangular. Skala piksel per derajat dihitung sama untuk sumbu x dan y agar sebaran kota tetap proporsional, lalu peta diletakkan di tengah canvas. Sumbu y dihitung dari `north − lat` karena lintang bertambah ke utara, sedangkan koordinat y canvas bertambah ke bawah.

#### Gambar 3.20 — Pembuatan data serangan acak berbobot (K20)
- **Lokasi:** `js/modules/threat-logger.js` baris 20–45 dan 106–125
- **Penerapan:**
  - **ES6+:** `Object.entries()`, destructuring `[, weight]`, `for...of`, shorthand property (`source, target`), operator `??`
  - **JavaScript:** `Math.random()`, `Array.reduce()`, perulangan `while`, `new Date()`
- **Keterangan:** Fungsi `randomSeverity()` memilih tingkat bahaya secara acak berbobot (low 40%, medium 30%, high 20%, critical 10%) sehingga serangan kritis lebih jarang muncul, seperti di dunia nyata. Fungsi `generateAttack()` menyusun satu objek serangan berisi waktu, kota asal dan target yang dipastikan berbeda, IP acak, jenis serangan, port, severity, serta status diblokir. Operator `??` memberi port acak bila jenis serangan tidak memiliki port tetap.

#### Gambar 3.21 — Simulasi real-time dengan setInterval (K21)
- **Lokasi:** `js/main.js` baris 29–47
- **Penerapan:**
  - **JavaScript:** `setInterval()`, `clearInterval()`, `toLocaleTimeString()`, `toISOString()`, properti `dateTime`
- **Keterangan:** Fungsi `spawnAttack()` dijalankan berulang oleh `setInterval` dan mengirim satu data serangan ke tiga modul sekaligus: tabel log, peta, dan grafik traffic. Fungsi `restartAttackTimer()` selalu menghentikan timer lama dengan `clearInterval` sebelum membuat timer baru, sehingga jeda serangan (1300 − kecepatan × 120 ms) dapat diubah lewat slider tanpa timer bertumpuk. Fungsi `updateClock()` memperbarui jam di header.

#### Gambar 3.22 — Kurva Bézier dan penggambaran garis serangan (K22)
- **Lokasi:** `js/modules/radar-map.js` baris 146–190
- **Penerapan:**
  - **JavaScript – Canvas API 2D:** `save()`, `restore()`, `globalAlpha`, `strokeStyle`, `lineWidth`, `setLineDash()`, `beginPath()`, `moveTo()`, `lineTo()`, `stroke()`, `arc()`, `fill()`, `shadowColor`, `shadowBlur`
  - **Fitur lain:** rumus kurva Bézier kuadratik
- **Keterangan:** Fungsi `pointOnArc()` menghitung titik pada kurva Bézier kuadratik dengan titik kontrol di atas garis asal–target, sehingga lintasan serangan melengkung seperti jalur pesawat. Fungsi `drawArc()` menggambar kurva itu sebagai 32 potongan garis hanya sampai nilai `progress`, sehingga garis tampak tumbuh dari kota asal menuju target. Gaya garis (warna, tebal, dan pola putus-putus) mengikuti severity, dan kepala garis diberi efek cahaya `shadowBlur`.

#### Gambar 3.23 — Loop animasi requestAnimationFrame (K23)
- **Lokasi:** `js/modules/radar-map.js` baris 206–247
- **Penerapan:**
  - **JavaScript:** `requestAnimationFrame()`, `Array.filter()`, `Array.push()`, `Math.min()`, `drawImage()`
  - **ES6+:** `for...of`, arrow function
  - **Fitur lain:** *delta time*, *offscreen canvas*
- **Keterangan:** Fungsi `frame()` dipanggil browser sekitar 60 kali per detik melalui `requestAnimationFrame`. Selisih waktu antar-frame (*delta time*) dipakai `update()` untuk memajukan garis dan efek gelombang sehingga kecepatan animasi sama di semua monitor. Animasi yang selesai dibuang dengan `filter()` agar memori tidak membengkak, dan `render()` menempelkan lapisan latar yang sudah digambar sebelumnya dengan `drawImage()` agar animasi tetap ringan.

#### Gambar 3.24 — Penempatan label 16 kota (K24)
- **Lokasi:** `js/modules/radar-map.js` baris 33–38 dan 123–144
- **Penerapan:**
  - **JavaScript – Canvas API 2D:** `arc()`, `fillText()`, `textAlign`, `textBaseline`, `font`
  - **ES6+:** `for...of`, operator `??`, `continue`
  - **Fitur lain:** *lookup table* (`LABEL_PLACEMENT`)
- **Keterangan:** Setiap kota digambar sebagai titik kecil, lalu namanya ditulis sesuai posisi label (kanan, kiri, atas, atau bawah) yang diambil dari tabel `LABEL_PLACEMENT`. Kota yang berdekatan, seperti Jakarta–Bandung serta Pekanbaru–Padang, diberi posisi berbeda agar namanya tidak bertumpuk. Pada peta yang lebarnya kurang dari 600 px, nama kota disembunyikan dan hanya titiknya yang ditampilkan.

#### Gambar 3.25 — Grafik traffic dengan Canvas (K25)
- **Lokasi:** `js/modules/traffic-chart.js` baris 42–103
- **Penerapan:**
  - **JavaScript – Canvas API 2D:** `clearRect()`, `fillText()`, `beginPath()`, `moveTo()`, `lineTo()`, `stroke()`, `closePath()`, `createLinearGradient()`, `addColorStop()`, `fill()`, `arc()`
  - **ES6+:** spread `Math.max(...history)`, arrow function (`toX`, `toY`), destructuring
- **Keterangan:** Grafik paket per detik digambar manual tanpa library. Fungsi `toX` dan `toY` mengubah indeks dan nilai data menjadi koordinat piksel, lalu garis bantu horizontal beserta label angka digambar di sisi kiri. Garis data berwarna putih dan area di bawahnya diisi gradien putih-ke-transparan menggunakan `createLinearGradient`, serta titik terakhir menandai nilai terbaru.

#### Gambar 3.26 — Manipulasi DOM pada tabel log (K26)
- **Lokasi:** `js/modules/threat-logger.js` baris 61–102 dan 184–200
- **Penerapan:**
  - **JavaScript – DOM:** `document.createElement()`, `textContent`, `className`, `classList.add()`, `appendChild()`, `append()`, `replaceChildren()`, `colSpan`
  - **ES6+:** default parameter, template literal, spread `...rows`, arrow function, operator ternary
  - **JavaScript:** `Array.filter()`, `slice()`, `map()`
- **Keterangan:** Setiap baris tabel dibangun dengan `createElement` dan diisi memakai `textContent`, yang lebih aman daripada `innerHTML` karena teks tidak dijalankan sebagai HTML. Fungsi `renderTable()` menyaring log sesuai filter severity, mengambil maksimal 50 data, lalu mengganti seluruh isi `<tbody>` sekaligus dengan `replaceChildren()`. Baris terbaru diberi class `row--new` agar animasi kedip CSS berjalan.

#### Gambar 3.27 — Event handling pada Control Panel (K27)
- **Lokasi:** `js/modules/controls.js` baris 1–61
- **Penerapan:**
  - **JavaScript – Event:** `addEventListener('click' | 'input' | 'change')`
  - **JavaScript – DOM:** `classList.toggle(nama, kondisi)`, `setAttribute('aria-pressed')`, `textContent`
  - **ES6+:** destructuring parameter, spread NodeList `[...severityInputs]`, arrow function
  - **Fitur lain:** pola *callback* (`handlers.onToggle`, dst.)
- **Keterangan:** Modul `controls.js` memasang event listener pada tombol Pause/Play dan Clear Log (`click`), slider kecepatan (`input`), serta checkbox severity (`change`). Saat tombol Pause ditekan, class `is-paused` ditambahkan ke `<body>`, teks tombol dan status diubah, lalu fungsi *callback* dari `main.js` dipanggil. Dengan pola ini, modul kontrol tidak perlu mengenal modul peta, grafik, maupun tabel.

#### Gambar 3.28 — Integrasi modul dan urutan menjalankan aplikasi (K28)
- **Lokasi:** `js/main.js` baris 49–94
- **Penerapan:**
  - **ES6+:** method shorthand pada objek `handlers` (`onToggle(isRunning) { ... }`)
  - **JavaScript – Event:** `window.addEventListener('resize', ...)`
  - **JavaScript:** `setInterval()` untuk jam
- **Keterangan:** Bagian akhir `main.js` menghubungkan seluruh modul. Fungsi `initControls()` menerima objek berisi elemen HTML dan objek *handlers* yang meneruskan setiap aksi pengguna ke modul terkait, misalnya filter severity yang diteruskan ke peta dan tabel. Event `resize` menyesuaikan ulang ukuran kedua canvas, lalu aplikasi dijalankan berurutan: tabel log, peta, grafik, jam, dan timer serangan.

---

### 5.2 BAB 4 — Hasil Tampilan

#### Gambar 4.1 — Tampilan utama dashboard (T1)
- **Penerapan:** HTML5 semantik, CSS Grid, CSS Variables (tema monokrom), Canvas API, simulasi `setInterval` & `requestAnimationFrame`
- **Keterangan:** Tampilan utama Live Threat & Traffic Visualizer pada layar desktop dengan status LIVE. Dashboard terdiri atas Control Panel, peta ancaman 16 kota Indonesia, panel statistik traffic, dan tabel log serangan yang tersusun dengan CSS Grid. Seluruh data dibuat secara simulasi oleh JavaScript dan diperbarui secara otomatis tanpa memuat ulang halaman.

#### Gambar 4.2 — Header dan navigasi (T2)
- **Penerapan:** `<header>`, `<nav>`, `<time>` (HTML5), Flexbox, `position: sticky`, `@keyframes pulse-ring` (CSS3), `setInterval` (JS)
- **Keterangan:** Header menampilkan logo, judul aplikasi, menu navigasi ke setiap panel, indikator LIVE berdenyut, dan jam digital yang diperbarui setiap detik oleh JavaScript. Header tetap menempel di bagian atas saat halaman digulir.

#### Gambar 4.3 — Peta ancaman siber Indonesia (T3)
- **Penerapan:** `<canvas>` (HTML5), Canvas API 2D, `latLngToCanvas()`, kurva Bézier, `requestAnimationFrame` (JS), `conic-gradient` & `@keyframes radar-sweep` (CSS3)
- **Keterangan:** Peta menampilkan grid titik, garis koordinat setiap 5°, garis khatulistiwa, dan 16 kota strategis Indonesia yang diposisikan dari koordinat lintang–bujur aslinya. Setiap serangan digambar sebagai garis lengkung yang bergerak dari kota asal ke kota target dan diakhiri efek gelombang; gaya garisnya menunjukkan tingkat severity. Efek sapuan radar di atas peta dianimasikan dengan CSS3.

#### Gambar 4.4 — Panel statistik traffic (T4)
- **Penerapan:** `<article>`, `<figure>` (HTML5), CSS Grid, Canvas (grafik garis + gradien), manipulasi DOM (angka & diagram batang)
- **Keterangan:** Panel statistik menampilkan total serangan, jumlah dan persentase serangan yang diblokir, paket per detik, serta jumlah serangan kritis. Grafik garis menunjukkan lalu lintas 60 detik terakhir dan diagram batang menampilkan lima jenis serangan terbanyak; semuanya diperbarui otomatis oleh JavaScript.

#### Gambar 4.5 — Tabel log serangan real-time (T5)
- **Penerapan:** `<table>` (HTML), `position: sticky`, `:nth-child`, `@keyframes row-flash` (CSS3), `createElement` & `replaceChildren` (JS)
- **Keterangan:** Tabel log menampilkan 50 serangan terbaru dengan serangan terbaru di baris paling atas, lengkap dengan waktu, IP sumber, kota target, jenis serangan, port, severity, dan status. Baris terbaru berkedip sesaat, sedangkan badge severity dibedakan dari kecerahan dan gaya garis tepinya.

#### Gambar 4.6 — Fitur Pause / Play (T6)
- **Penerapan:** event `click`, `classList.toggle()`, `aria-pressed` (JS), `animation-play-state` & `@keyframes blink` (CSS3)
- **Keterangan:** Setelah tombol Pause ditekan, status berubah menjadi PAUSED dan berkedip, tombol berubah menjadi Play, serta seluruh animasi peta, radar, grafik, dan pembuatan data berhenti. Menekan Play melanjutkan simulasi dari kondisi terakhir.

#### Gambar 4.7 — Fitur filter severity (T7)
- **Penerapan:** `<input type="checkbox">` (HTML), event `change`, `Set`, `Array.filter()` (JS), checkbox kustom `appearance: none` & `:checked` (CSS3)
- **Keterangan:** Dengan menghapus centang Low dan Medium, tabel log dan peta hanya menampilkan serangan berseverity High dan Critical. Statistik total tetap menghitung semua serangan karena filter hanya memengaruhi tampilan.

#### Gambar 4.8 — Fitur slider kecepatan (T8)
- **Penerapan:** `<input type="range">`, `<output>` (HTML5), event `input`, `clearInterval` & `setInterval` (JS)
- **Keterangan:** Slider kecepatan digeser ke nilai 10 sehingga jeda antarserangan menjadi 100 ms dan peta dipenuhi lebih banyak garis serangan. Nilai kecepatan ditampilkan langsung melalui elemen `<output>`, dan grafik traffic ikut meningkat.

#### Gambar 4.9 — Tampilan tablet (T9)
- **Penerapan:** `@media (max-width: 1024px)` (CSS3), `<meta name="viewport">` (HTML5)
- **Keterangan:** Pada lebar layar tablet, media query mengubah grid dashboard menjadi satu kolom sehingga peta, statistik, dan tabel tersusun dari atas ke bawah, sedangkan kartu statistik berjajar empat dalam satu baris.

#### Gambar 4.10 — Tampilan ponsel (T10)
- **Penerapan:** `@media (max-width: 600px)` (CSS3), penyembunyian label kota oleh JavaScript (peta < 600 px)
- **Keterangan:** Pada layar ponsel, header dan kontrol tersusun vertikal, peta berubah menjadi rasio 4 : 3, kolom Port dan Status disembunyikan agar tabel muat, dan nama kota di peta disembunyikan karena jarak antarkota terlalu rapat.

#### Gambar 4.11 — Console browser tanpa error (T11)
- **Penerapan:** ES6 Modules, Developer Tools browser
- **Keterangan:** Tab Console pada Developer Tools tidak menampilkan pesan error, menandakan seluruh modul JavaScript berhasil dimuat dan dijalankan dengan benar.

#### Gambar 4.12 — Pemuatan file modular di tab Network (T12, opsional)
- **Penerapan:** CSS `@import`, ES6 Modules, server lokal `python3 -m http.server`
- **Keterangan:** Tab Network memperlihatkan seluruh file CSS dan modul JavaScript dimuat satu per satu dengan status 200 (berhasil). Hal ini membuktikan bahwa arsitektur modular berjalan langsung di browser tanpa bundler.

---

### 5.3 Penjelasan Rinci Hasil Tampilan T2–T8

Bagian 5.2 berisi keterangan singkat di bawah gambar. Bagian ini berisi **pembahasan lengkap**
untuk teks BAB 4: apa saja yang terlihat, apa yang terjadi di balik layar, cara mengambil
screenshot yang baik, dan paragraf penjelasan siap pakai.

> Tips: beri **nomor/panah anotasi** pada screenshot (Word: *Insert → Shapes*) sesuai nomor
> di daftar "Yang terlihat di layar", lalu jelaskan nomor tersebut di paragraf laporan.

---

#### Gambar 4.2 — Header dan navigasi (T2)

**Yang terlihat di layar**
1. **Logo** — lingkaran bergaris putih dengan titik tengah yang membesar-mengecil.
2. **Judul & subjudul** — "LIVE THREAT & TRAFFIC VISUALIZER" dan "Simulasi Pemantauan Keamanan Jaringan".
3. **Menu navigasi** — PETA, STATISTIK, LOG.
4. **Indikator status** — titik putih berpendar dan teks **LIVE**.
5. **Jam digital** — format 24 jam `HH:MM:SS`.

**Yang terjadi di balik layar**

| Bagian | Cara kerja | Lokasi kode |
|---|---|---|
| Struktur | `<header>`, `<nav>`, `<ul>`, `<a href="#...">`, `<time>` | `index.html` 17–39 |
| Tata letak | Flexbox `justify-content: space-between` memisahkan logo, menu, dan status ke kiri–tengah–kanan; `flex-wrap` memindahkan elemen ke baris baru bila sempit | `header.css` 1–20 |
| Header menempel | `position: sticky; top: 0` membuat header tetap di atas saat halaman digulir | `header.css` 1–14 |
| Logo berdenyut | `::after` membentuk titik tengah, dianimasikan `@keyframes pulse` (skala 1 → 0,6 → 1) | `header.css` 29–36, 111–114 |
| Titik LIVE | `@keyframes pulse-ring` memancarkan cincin `box-shadow` yang memudar | `header.css` 86–92, 116–119 |
| Menu | Klik menu melompat ke `id` panel (`#map`, `#stats`, `#log`); gerakannya halus karena `scroll-behavior: smooth`; hover memunculkan garis tepi | `index.html` 25–31, `base.css` 36–38, `header.css` 61–76 |
| Jam | `updateClock()` dipanggil `setInterval` setiap 1000 ms, mengisi `textContent` dan atribut `dateTime` elemen `<time>` | `main.js` 43–47, 93 |

**Cara mengambil screenshot**
- Potong hanya area header (Win + Shift + S).
- Arahkan kursor ke salah satu menu agar efek hover (garis tepi) ikut terlihat.

**Paragraf penjelasan untuk laporan**
> Gambar 4.2 menunjukkan bagian header aplikasi yang disusun dengan elemen semantik HTML5 `<header>` dan `<nav>`. Header memuat logo, judul aplikasi, menu navigasi, indikator status, dan jam digital. Ketiga kelompok elemen tersebut diatur dengan Flexbox sehingga logo berada di kiri, menu di tengah, dan status di kanan, serta otomatis turun ke baris baru pada layar sempit. Properti `position: sticky` membuat header tetap terlihat ketika pengguna menggulir halaman.
>
> Menu navigasi berupa link jangkar yang mengarah ke `id` setiap panel, dengan efek gulir halus dari `scroll-behavior: smooth`. Titik indikator LIVE dan logo dianimasikan menggunakan `@keyframes` CSS3 untuk memberi kesan sistem sedang aktif memantau. Jam digital menggunakan elemen HTML5 `<time>` yang isinya diperbarui setiap detik oleh fungsi `updateClock()` melalui `setInterval`.

*Gambar kode terkait: 3.2, 3.9, 3.21.*

---

#### Gambar 4.3 — Peta ancaman siber Indonesia (T3)

**Yang terlihat di layar**
1. **Grid titik** — titik-titik samar di seluruh latar peta.
2. **Garis koordinat** — garis bujur & lintang setiap 5°, serta garis khatulistiwa putus-putus berlabel **EQUATOR 0°**.
3. **16 titik kota** dengan nama kota (MEDAN, JAKARTA, …, JAYAPURA).
4. **Garis serangan melengkung** — bergerak dari kota asal ke kota target, dengan "kepala" bercahaya.
5. **Efek gelombang** — lingkaran yang membesar dan memudar di kota target.
6. **Sapuan radar** — bayangan terang yang berputar di atas peta.
7. **Legenda** — contoh gaya garis Critical, High, Medium, Low.

**Yang terjadi di balik layar**

| Bagian | Cara kerja | Lokasi kode |
|---|---|---|
| Posisi kota | `latLngToCanvas()` mengubah lintang/bujur asli menjadi piksel (proyeksi equirectangular) | `geo-converter.js` 5–20 |
| Latar statis | Grid, garis koordinat, dan kota digambar **sekali** ke canvas tersembunyi, lalu disalin tiap frame dengan `drawImage()` | `radar-map.js` 56–73, 226–230 |
| Grid & koordinat | Perulangan bersarang `fillRect` + garis `moveTo`/`lineTo`; khatulistiwa memakai `setLineDash` | `radar-map.js` 75–121 |
| Label kota | Posisi kanan/kiri/atas/bawah dari `LABEL_PLACEMENT` agar tidak bertumpuk | `radar-map.js` 33–38, 123–144 |
| Garis serangan | Kurva Bézier kuadratik (`pointOnArc`), digambar sampai nilai `progress` | `radar-map.js` 146–190 |
| Gerakan | `requestAnimationFrame` ±60×/detik; `progress` naik `delta / 1600` → tiba dalam 1,6 detik, lalu memudar 0,7 detik | `radar-map.js` 206–247 |
| Gelombang | Radius 4 → 26 px dan transparansi naik selama 0,9 detik | `radar-map.js` 192–204 |
| Gaya severity | `SEVERITY_STYLE`: Critical putih tebal, High abu terang, Medium putus-putus, Low titik-titik | `radar-map.js` 26–31 |
| Radar | `conic-gradient` diputar `@keyframes radar-sweep` (CSS3, bukan JavaScript) | `radar-canvas.css` 15–35, 64–67 |

**Cara mengambil screenshot**
- Kecepatan 5 hanya menghasilkan ±3 garis sekaligus. Geser slider ke **7–8** agar lebih ramai.
- Tunggu sampai ada beberapa garis dengan gaya berbeda dan satu efek gelombang, lalu tekan **Pause** agar momen itu "membeku", baru screenshot.
- Sertakan legenda di bawah peta.

**Paragraf penjelasan untuk laporan**
> Gambar 4.3 menampilkan peta ancaman siber yang digambar pada elemen HTML5 `<canvas>` menggunakan Canvas API 2D. Latar peta terdiri atas grid titik, garis koordinat setiap 5°, dan garis khatulistiwa. Enam belas kota strategis Indonesia dari Sumatra hingga Papua diposisikan berdasarkan koordinat lintang dan bujur aslinya melalui fungsi `latLngToCanvas()` dengan proyeksi equirectangular. Nama kota yang berdekatan, seperti Jakarta dan Bandung, diletakkan pada sisi berbeda agar tidak bertumpuk.
>
> Setiap serangan divisualisasikan sebagai garis lengkung berbentuk kurva Bézier kuadratik yang bergerak dari kota asal menuju kota target dalam 1,6 detik, kemudian diakhiri efek gelombang di kota target. Animasi dijalankan oleh `requestAnimationFrame` sekitar 60 kali per detik. Karena tema bersifat monokrom, tingkat bahaya dibedakan melalui kecerahan, ketebalan, dan pola garis sesuai legenda. Efek sapuan radar di atas peta dibuat terpisah dengan `conic-gradient` dan animasi `@keyframes` CSS3.

*Gambar kode terkait: 3.4, 3.12, 3.18, 3.19, 3.22, 3.23, 3.24.*

---

#### Gambar 4.4 — Panel statistik traffic (T4)

**Yang terlihat di layar**
1. **Total Serangan** — jumlah semua serangan sejak halaman dibuka.
2. **Diblokir** — jumlah serangan yang diblokir dan persentasenya ("…% dari total").
3. **Paket / Detik** — nilai lalu lintas terbaru.
4. **Kritis** — jumlah serangan Critical (kartu berlatar putih).
5. **Grafik garis** — paket/detik selama 60 detik terakhir, nilai terbaru di ujung kanan.
6. **Top 5 Jenis Serangan** — diagram batang horizontal beserta jumlahnya.

**Yang terjadi di balik layar**

| Bagian | Cara kerja | Lokasi kode |
|---|---|---|
| Kartu angka | Setiap serangan menambah `totals`, lalu `renderStats()` menulis ulang angka dengan `textContent`; angka diberi pemisah ribuan (`toLocaleString('id-ID')` → 1.250) | `threat-logger.js` 134–141, 202–216 |
| Persentase diblokir | `Math.round(diblokir / total × 100)`; peluang diblokir diatur `BLOCK_RATE = 0.72` sehingga nilainya berkisar ±72% | `threat-logger.js` 6, 135 |
| Paket/detik | Setiap 1 detik: `800 + kecepatan × 60 + acak(−150…150) + serangan detik itu × 90` | `traffic-chart.js` 28–35, 105–116 |
| Grafik | Array `history` maksimal 60 data; data lama dibuang `shift()` sehingga grafik bergeser ke kiri; digambar manual dengan Canvas + gradien | `traffic-chart.js` 42–116 |
| Top 5 | Jumlah per jenis disimpan di `Map`, diurutkan `sort()`, diambil 5 teratas; panjang batang = jumlah ÷ jumlah tertinggi × 100% | `threat-logger.js` 143–182 |
| Tata letak | CSS Grid 2 kolom untuk kartu; kartu terangkat saat disorot | `stats-panel.css` 1–48 |

**Cara mengambil screenshot**
- Tunggu minimal **30 detik** agar angka, grafik, dan Top 5 sudah terisi bervariasi.
- Sorot salah satu kartu dengan kursor agar efek terangkat ikut terlihat (opsional).

**Paragraf penjelasan untuk laporan**
> Gambar 4.4 memperlihatkan panel statistik traffic yang terdiri atas empat kartu angka, grafik lalu lintas, dan diagram Top 5 jenis serangan. Kartu angka disusun dengan CSS Grid dua kolom, dan kartu "Kritis" diberi warna terbalik agar paling menonjol. Setiap kali serangan baru dibuat, fungsi `renderStats()` memperbarui total serangan, jumlah dan persentase serangan yang diblokir, serta jumlah serangan kritis melalui manipulasi DOM.
>
> Nilai paket per detik dihitung setiap detik dari traffic dasar, fluktuasi acak, dan lonjakan akibat serangan, kemudian disimpan dalam riwayat 60 data terakhir. Riwayat ini digambar sebagai grafik garis bergradien menggunakan Canvas API tanpa library grafik. Diagram Top 5 dibangun dengan elemen DOM biasa, dengan panjang setiap batang dihitung relatif terhadap jenis serangan terbanyak.

*Gambar kode terkait: 3.5, 3.13, 3.25.*

---

#### Gambar 4.5 — Tabel log serangan real-time (T5)

**Yang terlihat di layar**
1. **Judul kolom** — Waktu, IP Sumber, Target, Jenis Serangan, Port, Severity, Status.
2. **Baris data** — serangan terbaru di paling atas; baris genap sedikit lebih terang (zebra).
3. **IP Sumber** — IP acak diikuti provinsi asal, misalnya `103.24.7.188 (SUMUT)`.
4. **Target** — kota dan provinsi tujuan, misalnya `Surabaya, JATIM`.
5. **Badge severity** — CRITICAL (latar putih), HIGH (garis putih), MEDIUM (garis putus-putus), LOW (garis titik-titik).
6. **Status** — BLOCKED (abu-abu) atau ALLOWED (putih tebal).
7. **Baris baru berkedip** sesaat ketika muncul.

**Yang terjadi di balik layar**

| Bagian | Cara kerja | Lokasi kode |
|---|---|---|
| Data serangan | `generateAttack()` membuat waktu, kota asal & target (selalu berbeda), IP acak, jenis, port, severity berbobot, dan status | `threat-logger.js` 106–125 |
| Urutan terbaru di atas | `logs.unshift(attack)` menaruh data baru di indeks 0; disimpan maksimal 200 data | `threat-logger.js` 202–212 |
| Membangun tabel | `renderTable()` menyaring sesuai filter, mengambil 50 data, membuat `<tr>`/`<td>` dengan `createElement` + `textContent`, lalu `replaceChildren()` | `threat-logger.js` 61–102, 184–200 |
| Kedip baris baru | Baris pertama diberi class `row--new` → `@keyframes row-flash` | `threat-logger.js` 195–197, `threat-log.css` 52–54, 76–79 |
| Judul kolom menempel | `position: sticky` pada `<th>` saat tabel digulir | `threat-log.css` 14–26 |
| Zebra & hover | `tr:nth-child(even)` dan `tr:hover` | `threat-log.css` 34–44 |

**Cara mengambil screenshot**
- Tunggu sampai tabel terisi ±15 baris dengan severity yang beragam.
- Gulir **di dalam** kotak tabel sedikit ke bawah agar terlihat judul kolom tetap menempel.
- Sorot satu baris dengan kursor agar efek hover (teks putih) ikut terlihat.

**Paragraf penjelasan untuk laporan**
> Gambar 4.5 menampilkan tabel log serangan real-time yang memuat 50 serangan terbaru, dengan serangan terbaru selalu berada di baris paling atas. Setiap baris berisi waktu, IP sumber beserta provinsi asal, kota target, jenis serangan, port, tingkat severity, dan status penanganan. Data dihasilkan oleh fungsi `generateAttack()` dan ditambahkan ke awal array log menggunakan `unshift()`.
>
> Baris tabel dibangun secara dinamis dengan `createElement` dan diisi menggunakan `textContent` agar aman dari penyisipan kode HTML. Pada sisi tampilan, judul kolom tetap menempel di atas saat tabel digulir berkat `position: sticky`, baris genap diberi warna zebra dengan `:nth-child(even)`, dan baris terbaru berkedip sesaat melalui animasi `@keyframes row-flash`. Label severity dibedakan dari kecerahan dan gaya garis tepi sesuai tema monokrom.

*Gambar kode terkait: 3.6, 3.14, 3.20, 3.26.*

---

#### Gambar 4.6 — Fitur Pause / Play (T6)

**Yang terlihat di layar**
1. **Tombol** berubah dari `❚❚ PAUSE` menjadi `▶ PLAY`.
2. **Status** berubah dari LIVE menjadi **PAUSED** dan berkedip.
3. **Titik indikator** menjadi abu-abu dan berhenti berpendar.
4. **Peta, radar, dan grafik** membeku pada posisi terakhir.
5. **Tabel & angka statistik** tidak bertambah lagi.

**Yang terjadi di balik layar** — alur satu kali klik:

```
klik tombol (controls.js 33–37)
 ├─ running = !running
 ├─ renderRunningState()              (controls.js 26–31)
 │    ├─ <body> diberi class "is-paused"
 │    ├─ teks tombol → "▶ Play", aria-pressed → "true"
 │    └─ teks status → "PAUSED"
 └─ handlers.onToggle(false)          (main.js 59–63)
      ├─ main.js     : running = false   → spawnAttack() langsung berhenti (return)
      ├─ radar-map   : setRunning(false) → update() dilewati, render() tetap jalan (gambar membeku)
      └─ traffic-chart: setRunning(false) → tick() langsung berhenti (return)

CSS bereaksi terhadap class "is-paused":
 ├─ .is-paused .radar        → animation-play-state: paused   (radar-canvas.css 33–35)
 ├─ .is-paused .status__dot  → abu-abu, animasi dimatikan      (header.css 101–104)
 └─ .is-paused .status__text → berkedip @keyframes blink       (header.css 106–109)
```

Yang **tetap berjalan** saat Pause: jam digital, denyut logo, dan garis scan layar.
Ketiganya sengaja tidak dihentikan karena bukan bagian dari simulasi data.

**Cara mengambil screenshot**
- Ambil dua gambar berdampingan: **sebelum** (LIVE, tombol Pause) dan **sesudah** (PAUSED, tombol Play).
- Potong area Control Panel + header agar tombol dan status terlihat dalam satu gambar.
  Karena teks PAUSED berkedip, ulangi screenshot bila teksnya sedang tidak tampak.

**Paragraf penjelasan untuk laporan**
> Gambar 4.6 memperlihatkan perubahan tampilan setelah tombol Pause ditekan. Event `click` pada tombol ditangani modul `controls.js`, yang membalik status simulasi, menambahkan class `is-paused` pada elemen `<body>`, mengganti teks tombol menjadi "Play", mengubah status menjadi PAUSED, dan memperbarui atribut `aria-pressed` untuk aksesibilitas. Selanjutnya, fungsi *callback* `onToggle` di `main.js` meneruskan status tersebut ke modul peta dan grafik.
>
> Selama di-pause, pembuatan serangan baru dan perhitungan traffic dihentikan, sedangkan animasi peta tidak lagi diperbarui sehingga gambar membeku pada posisi terakhir. Pada sisi CSS, class `is-paused` menghentikan putaran radar melalui `animation-play-state: paused`, mengubah titik indikator menjadi abu-abu, dan membuat teks PAUSED berkedip. Menekan tombol Play mengembalikan seluruh proses dari kondisi terakhir.

*Gambar kode terkait: 3.3, 3.9, 3.12, 3.27, 3.28.*

---

#### Gambar 4.7 — Fitur filter severity (T7)

**Yang terlihat di layar**
1. **Checkbox** Low dan Medium kosong; Critical dan High terisi putih.
2. **Tabel log** hanya berisi badge HIGH dan CRITICAL.
3. **Peta** hanya menampilkan garis tebal/terang (High & Critical).
4. **Kartu statistik** tetap menghitung semua serangan.

**Yang terjadi di balik layar**

```
centang berubah (controls.js 49–53, event "change")
 └─ selectedSeverities()   → ['critical', 'high']   (controls.js 20–24)
     └─ handlers.onFilterChange([...])               (main.js 72–75)
          ├─ radar.setVisibleSeverities()  → render() hanya menggambar garis & gelombang
          │                                  yang severity-nya ada di Set (radar-map.js 226–230)
          └─ logger.setVisibleSeverities() → renderTable() langsung dipanggil ulang
                                             dengan filter() (threat-logger.js 184–200, 223–226)
```

- Daftar severity disimpan dalam `Set`, sehingga pengecekan cukup dengan `.has(severity)`.
- Filter **hanya memengaruhi tampilan**. Data tetap dibuat dan dihitung, sehingga Total, Diblokir, Kritis, dan Top 5 tidak berubah.
- Karena log menyimpan hingga 200 data, tabel tetap terisi oleh serangan High/Critical yang lebih lama.
- Jika semua checkbox dikosongkan, tabel menampilkan pesan "Belum ada data yang cocok dengan filter."
- Tampilan checkbox adalah kotak kustom: `appearance: none` + `:checked` (`layout.css` 127–141).

**Cara mengambil screenshot**
- Hapus centang **Low** dan **Medium**, tunggu ±5 detik, lalu screenshot Control Panel, peta, dan tabel.
- Agar perbedaannya jelas, sertakan juga screenshot sebelum filter (semua tercentang) sebagai pembanding.

**Paragraf penjelasan untuk laporan**
> Gambar 4.7 menunjukkan fitur filter severity setelah centang Low dan Medium dihapus. Setiap perubahan checkbox memicu event `change` yang ditangani modul `controls.js`. Modul ini mengumpulkan nilai checkbox yang masih tercentang, lalu mengirimkannya ke modul peta dan modul log melalui *callback* `onFilterChange`. Kedua modul menyimpan daftar tersebut dalam struktur data `Set`.
>
> Tabel log langsung dibangun ulang menggunakan method `filter()` sehingga hanya menampilkan serangan High dan Critical, sementara peta hanya menggambar garis serangan dengan severity yang sama. Filter hanya memengaruhi tampilan; angka statistik tetap menghitung seluruh serangan agar ringkasan keamanan tetap akurat. Checkbox ditampilkan sebagai kotak kustom monokrom dengan `appearance: none` dan pseudo-class `:checked`.

*Gambar kode terkait: 3.3, 3.11, 3.26, 3.27, 3.28.*

---

#### Gambar 4.8 — Fitur slider kecepatan (T8)

**Yang terlihat di layar**
1. **Slider** di posisi paling kanan dengan angka **10** di sebelahnya.
2. **Peta** penuh dengan garis serangan (±10 serangan baru per detik).
3. **Tabel log** bergerak sangat cepat.
4. **Grafik traffic** naik tajam di bagian kanan.

**Yang terjadi di balik layar**

```
slider digeser (controls.js 43–47, event "input")
 ├─ <output> menampilkan angka baru
 └─ handlers.onSpeedChange(10)            (main.js 67–71)
      ├─ speed = 10
      ├─ chart.setSpeed(10)               → traffic dasar ikut naik
      └─ restartAttackTimer()             (main.js 38–41)
           ├─ clearInterval(timer lama)
           └─ setInterval(spawnAttack, 1300 − 10 × 120 = 100 ms)
```

| Kecepatan | Jeda serangan | Serangan/detik | Perkiraan paket/detik |
|---|---|---|---|
| 1 | 1180 ms | ±0,8 | ±710–1.100 |
| 5 (awal) | 700 ms | ±1,4 | ±1.040–1.430 |
| 10 | 100 ms | ±10 | ±2.060–2.540 |

Perkiraan paket/detik dihitung dari rumus `800 + kecepatan × 60 + acak(−150…150) + serangan/detik × 90`.

- Event `input` (bukan `change`) dipakai agar angka berubah **seketika** saat slider digeser, tanpa menunggu tombol mouse dilepas.
- `clearInterval` wajib dipanggil. Tanpa itu, timer lama tetap hidup dan serangan menjadi berlipat ganda.

**Cara mengambil screenshot**
- Geser slider ke **10**, lalu tunggu **±15–20 detik** agar lonjakan di grafik terlihat jelas.
- Sertakan Control Panel (slider + angka 10), peta, dan panel statistik dalam satu gambar,
  atau buat dua gambar: kecepatan 1 dan kecepatan 10 sebagai pembanding.

**Paragraf penjelasan untuk laporan**
> Gambar 4.8 memperlihatkan hasil menggeser slider kecepatan ke nilai maksimum 10. Slider menggunakan input HTML5 `type="range"` dengan rentang 1–10, dan nilainya ditampilkan langsung melalui elemen `<output>`. Event `input` memastikan perubahan terjadi seketika selama slider digeser, lalu fungsi *callback* `onSpeedChange` di `main.js` memperbarui kecepatan simulasi.
>
> Fungsi `restartAttackTimer()` menghentikan timer lama dengan `clearInterval` dan membuat timer baru dengan `setInterval` berjeda `1300 − kecepatan × 120` milidetik. Pada kecepatan 10, jeda menjadi 100 ms sehingga sekitar sepuluh serangan baru muncul setiap detik. Akibatnya, peta dipenuhi garis serangan, tabel log bergerak cepat, dan grafik paket per detik meningkat tajam karena traffic dasar serta lonjakan akibat serangan ikut bertambah.

*Gambar kode terkait: 3.3, 3.21, 3.25, 3.27, 3.28.*
