# 🛰️ Live Cyber Threat Visualizer

Dashboard visualisasi **ancaman siber dan lalu lintas jaringan secara real-time** dengan fokus pada
**16 kota strategis di Indonesia**. Seluruh data adalah **simulasi (mock data)** yang dibuat oleh
JavaScript — tanpa server, database, framework, maupun library eksternal.

> Proyek UTS & UAS mata kuliah **Pemrograman Web** — Shafwan Khairullah (2 TRK B)

---

## ✨ Fitur Utama

| Fitur | Keterangan |
|---|---|
| **HTML5 Canvas Radar** | Peta ancaman digambar dengan Canvas API 2D; garis serangan melengkung (kurva Bézier), efek gelombang saat tiba, dan sapuan radar berbasis CSS3 `@keyframes`. |
| **Visualisasi 16 Kota Indonesia** | Sumatra, Jawa, Bali & Nusa Tenggara, Kalimantan, Sulawesi, Maluku & Papua — diproyeksikan dari lintang/bujur asli (95°–141° BT, 6° LU–11° LS). |
| **Simulasi Log Serangan Real-time** | Tabel 50 serangan terbaru, kartu statistik, grafik paket/detik, dan Top 5 jenis serangan yang diperbarui otomatis. |
| **Kontrol Interaktif** | Pause/Play, filter severity (Critical/High/Medium/Low), slider kecepatan, dan Clear Log. |
| **Responsive Monokrom UI** | Tema hitam-putih bergaya *cyber minimalist*; tata letak menyesuaikan desktop, tablet, dan ponsel. |

## 🧰 Tech Stack

- **HTML5** — elemen semantik (`header`, `nav`, `main`, `section`, `article`, `figure`, `footer`), `<canvas>`, `<time>`, `<output>`
- **CSS3** — CSS Variables, Flexbox, CSS Grid, `@media` (Responsive), `@keyframes`, `conic-gradient`
- **Vanilla JavaScript (ES6 Modules)** — `import`/`export` native browser tanpa bundler, DOM manipulation, Canvas API 2D, `requestAnimationFrame`, `setInterval`, event handling

Tanpa framework (React/Vue), tanpa library grafik (Chart.js/D3.js), tanpa Bootstrap/Tailwind, tanpa backend.

## 🚀 Cara Menjalankan Secara Lokal

```bash
git clone https://github.com/shakaeru/live-threat-and-traffic-visualizer.git
cd live-threat-and-traffic-visualizer
python3 -m http.server 8000
```

Buka **http://localhost:8000** di browser. Hentikan server dengan `Ctrl + C`.

> **Penting:** proyek ini memakai ES6 Modules, sehingga **harus dijalankan lewat server lokal**.
> Membuka `index.html` langsung (klik dua kali / `file://`) akan diblokir browser karena aturan CORS.
> Alternatif server: ekstensi **Live Server** di VS Code.

## 📁 Struktur Folder

```
live-threat-and-traffic-visualizer/
├── index.html                      # Kerangka semantik HTML5
├── css/
│   ├── main.css                    # Entry point CSS (@import semua modul)
│   ├── base.css                    # CSS variables, reset, tipografi, tema monokrom
│   ├── layout.css                  # Grid dashboard, panel, control panel, footer
│   └── components/
│       ├── header.css              # Header & navbar
│       ├── radar-canvas.css        # Container peta & efek radar
│       ├── stats-panel.css         # Kartu statistik, grafik, diagram batang
│       └── threat-log.css          # Tabel log serangan
├── js/
│   ├── main.js                     # Entry point: merangkai semua modul
│   ├── config/
│   │   └── cities.js               # 16 kota Indonesia & batas wilayah peta
│   ├── utils/
│   │   └── geo-converter.js        # latLngToCanvas(): lintang/bujur → piksel
│   └── modules/
│       ├── radar-map.js            # Peta canvas: grid, kota, animasi serangan
│       ├── traffic-chart.js        # Grafik canvas paket/detik
│       ├── threat-logger.js        # Generator serangan, statistik, tabel log
│       └── controls.js             # Event tombol, filter, slider
├── docs/
│   ├── PRD.md                      # Product Requirement Document
│   ├── PENJELASAN-KODE.md          # Penjelasan alur kode untuk pemula
│   ├── PANDUAN-SCREENSHOT-UTS.md   # Panduan tangkapan layar laporan UTS
│   └── DAFTAR-PUSTAKA.md           # Referensi (APA 7)
└── README.md
```

## ⚠️ Disclaimer

Semua serangan, alamat IP, dan angka traffic pada dashboard ini **fiktif** dan dibuat secara acak
untuk keperluan pembelajaran. Tidak ada data jaringan sungguhan yang dikumpulkan atau ditampilkan.

## 👤 Pembuat

**Shafwan Khairullah** — Kelas 2 TRK B
