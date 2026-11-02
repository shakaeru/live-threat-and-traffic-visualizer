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
- **Vanilla JavaScript (ES6+)** — DOM manipulation, Canvas API 2D, `requestAnimationFrame`, `setInterval`, event handling

Tanpa framework (React/Vue), tanpa library grafik (Chart.js/D3.js), tanpa Bootstrap/Tailwind, tanpa backend.

## 🚀 Cara Menjalankan Secara Lokal

```bash
git clone https://github.com/shakaeru/live-threat-and-traffic-visualizer.git
cd live-threat-and-traffic-visualizer
python3 -m http.server 8000
```

Buka **http://localhost:8000** di browser. Hentikan server dengan `Ctrl + C`.

> Alternatif: buka `index.html` langsung di browser, atau gunakan ekstensi **Live Server** di VS Code.

## 📁 Struktur Folder

```
live-threat-and-traffic-visualizer/
├── index.html                      # Struktur halaman (HTML5)
├── css/
│   └── style.css                   # Tampilan, animasi & responsive (CSS3)
├── js/
│   └── app.js                      # Simulasi data, Canvas & interaksi (JavaScript)
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
