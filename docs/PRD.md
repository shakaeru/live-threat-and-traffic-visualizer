# PRD — Live Threat & Traffic Visualizer

> Product Requirement Document · Proyek UTS & UAS Pemrograman Web
> Teknologi: HTML5, CSS3, JavaScript murni (tanpa framework, tanpa library, tanpa backend)

---

## 1. Ringkasan Proyek & Tujuan

**Live Threat & Traffic Visualizer** adalah dashboard satu halaman yang menampilkan simulasi
serangan siber dan lalu lintas jaringan secara *real-time*. Semua data dibuat otomatis oleh
JavaScript (mock data), sehingga tidak butuh server, database, atau koneksi internet.

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
setInterval (spawnAttack) ──► buat data serangan acak ──► simpan ke state
                                                          │
          ┌───────────────────────────────┬───────────────┴──────────────┐
          ▼                               ▼                              ▼
  state.arcs (animasi peta)      state.logs (tabel log)        state.totals (statistik)
          │
requestAnimationFrame (animate) menggambar ulang peta ±60x per detik
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

| Kriteria | Implementasi | Lokasi di `style.css` |
|---|---|---|
| CSS Variables | Palet warna, font, jarak, radius di `:root` | Bagian 1 |
| Flexbox | Header, control panel, legenda, diagram batang | Bagian 3, 5, 6, 7 |
| CSS Grid | Tata letak dashboard (`grid-template-areas`), kartu statistik | Bagian 4, 7 |
| Responsive (`@media`) | 3 ukuran: desktop (>1024px), tablet (≤1024px), HP (≤600px) | Bagian 10 |
| Animasi `@keyframes` | `pulse` (titik LIVE), `radar-sweep` (radar berputar), `scanline` (garis scan layar), `row-flash` (baris log baru), `blink` | Bagian 9 |
| Fitur CSS3 lain | `conic-gradient`, `repeating-linear-gradient`, `transition`, `transform`, `aspect-ratio`, `position: sticky`, `appearance: none` (checkbox kustom), pseudo-element `::before/::after` | Tersebar |
| Aksesibilitas gerak | `@media (prefers-reduced-motion)` mematikan animasi | Bagian 10 |

### 3.3 JavaScript (Vanilla)

| Kriteria | Implementasi | Fungsi di `app.js` |
|---|---|---|
| Manipulasi DOM | Membuat baris tabel (`createElement`, `textContent`, `replaceChildren`), update angka statistik, ubah class/atribut | `renderLog()`, `updateStats()`, `renderTopTypes()`, `togglePause()` |
| Canvas API 2D | Menggambar grid peta, titik kota, busur kurva Bezier, *pulse*, grafik garis + gradien | `drawMap()`, `drawArc()`, `drawPulse()`, `drawTrafficChart()` |
| Simulasi data otomatis | `setInterval` untuk serangan, traffic, jam; `requestAnimationFrame` untuk animasi peta | `startAttackTimer()`, `trafficTick()`, `animate()` |
| Event handling | `click` (Pause/Play, Clear), `change` (filter checkbox), `input` (slider), `resize` (ukuran layar), `DOMContentLoaded` | Bagian 9 `app.js` |
| Logika & struktur data | Objek, array, `Set`, `filter`, `sort`, `map`, acak berbobot (*weighted random*) | `randomSeverity()`, `createAttack()` |

---

## 4. Kriteria Selesai (Checklist Uji)

- [ ] Halaman terbuka langsung dari browser tanpa error di Console (F12).
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
├── index.html                  ← struktur halaman (HTML5)
├── css/
│   └── style.css               ← seluruh tampilan (CSS3)
├── js/
│   └── app.js                  ← logika, simulasi, canvas (JavaScript)
├── docs/
│   ├── PRD.md                  ← dokumen ini
│   └── PANDUAN-SCREENSHOT-UTS.md
└── screenshots/                ← (buat sendiri) simpan hasil tangkapan layar
```

Pemisahan HTML (struktur), CSS (tampilan), dan JS (perilaku) adalah prinsip
*separation of concerns* — poin plus saat presentasi.
