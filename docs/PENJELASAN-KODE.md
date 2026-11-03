# Penjelasan Kode JavaScript untuk Pemula

Dokumen ini menjelaskan alur kode di folder `js/`. File kode sengaja ditulis **tanpa komentar**,
jadi gunakan dokumen ini sebagai "peta" saat membaca kodenya.

---

## 0. Gambaran Besar: Arsitektur Modular

### 0a. Peta file

```
js/
├── main.js                  → "dirigen": membuat semua modul & menghubungkannya
├── config/cities.js         → DATA: 16 kota + batas wilayah peta
├── utils/geo-converter.js   → RUMUS: latLngToCanvas()
└── modules/
    ├── radar-map.js         → peta canvas + animasi serangan
    ├── traffic-chart.js     → grafik canvas paket/detik
    ├── threat-logger.js     → pembuat data serangan + statistik + tabel log
    └── controls.js          → event tombol, filter, slider
```

Arah ketergantungan (panah = "meng-import"):

```
main.js ──► controls.js
        ──► threat-logger.js ──► config/cities.js
        ──► radar-map.js     ──► config/cities.js
                             ──► utils/geo-converter.js ──► config/cities.js
        ──► traffic-chart.js
```

Aturannya: **modul tidak saling memanggil**. Hanya `main.js` yang mengenal semua modul.
Jadi `controls.js` tidak tahu ada peta atau tabel — ia cukup melapor "tombol Pause ditekan"
ke `main.js`, lalu `main.js` yang meneruskan ke modul lain.

### 0b. ES6 Modules: `export` dan `import`

```js
export function latLngToCanvas(lat, lng, width, height) { ... }
```
`export` = "fungsi ini boleh dipakai file lain". Tanpa `export`, fungsi/variabel bersifat
**privat** di file itu saja (contoh: `randomIp()` di `threat-logger.js` tidak bisa dipanggil dari luar).

```js
import { latLngToCanvas } from '../utils/geo-converter.js';
```
`import` = "ambil fungsi itu dari file lain". Path diawali `./` (folder yang sama) atau `../`
(naik satu folder) dan **wajib** menyertakan `.js`.

Di HTML, modul diaktifkan dengan:

```html
<script type="module" src="js/main.js"></script>
```

- `type="module"` membuat browser membaca `import`/`export`.
- Script modul otomatis **ditunda** (*deferred*) sampai HTML selesai dibaca, jadi aman diletakkan di `<head>`.
- Modul **tidak bisa** dibuka lewat `file://` (klik dua kali `index.html`) karena aturan keamanan
  CORS browser. Wajib lewat server: `python3 -m http.server 8000`.

### 0c. Pola *factory function* + *closure*

Setiap modul utama berbentuk fungsi `createXxx()` yang **mengembalikan objek berisi fungsi**:

```js
export function createTrafficChart(canvas, valueElement) {
  const history = [];
  let running = true;

  function tick() { ... }
  function setRunning(value) { running = value; }

  return { start, resize, recordAttack, setRunning, setSpeed };
}
```

- Variabel seperti `history` dan `running` hanya bisa diubah lewat fungsi yang dikembalikan
  (misalnya `setRunning`). Ini disebut **closure**: fungsi "mengingat" variabel di sekitarnya.
- Hasilnya, setiap modul punya **data pribadi** yang tidak bisa dirusak modul lain.
- Di `main.js` dipakai seperti ini: `const chart = createTrafficChart(...); chart.setRunning(false);`

### 0d. Tiga "mesin" yang berjalan bersamaan

| Mesin | Alat JavaScript | Lokasi | Seberapa sering |
|---|---|---|---|
| **Pembuat serangan** | `setInterval(spawnAttack, ...)` | `main.js` → `restartAttackTimer()` | tiap 100–1180 ms (tergantung slider) |
| **Pengukur traffic** | `setInterval(tick, 1000)` | `traffic-chart.js` → `start()` | tiap 1 detik |
| **Pelukis animasi** | `requestAnimationFrame(frame)` | `radar-map.js` → `start()` | ±60 kali per detik |

---

## 1. Konversi Koordinat — `latLngToCanvas()`

File: `js/utils/geo-converter.js` · Data batas: `js/config/cities.js`

### Masalahnya
Kota punya koordinat geografis:
- **Longitude / bujur (`lng`)** → posisi **kiri–kanan**. Indonesia: **95° BT s.d. 141° BT**.
- **Latitude / lintang (`lat`)** → posisi **atas–bawah**. Indonesia: **6° LU s.d. 11° LS**
  (LU ditulis positif, LS negatif: 6 sampai −11).

Canvas punya koordinat piksel:
- **x**: 0 (kiri) sampai lebar canvas (kanan)
- **y**: 0 (**atas**) sampai tinggi canvas (bawah) ← y di layar bertambah **ke bawah**

Batas wilayah (*geo-bounding box*) di `cities.js`:

```js
export const MAP_BOUNDS = Object.freeze({ north: 6, south: -11, west: 95, east: 141 });
```

`Object.freeze()` mengunci objek agar nilainya tidak bisa diubah secara tidak sengaja.

### Kodenya

```js
export function latLngToCanvas(lat, lng, width, height) {
  const lngRange = MAP_BOUNDS.east - MAP_BOUNDS.west;
  const latRange = MAP_BOUNDS.north - MAP_BOUNDS.south;

  const scale = Math.min(
    (width - CANVAS_PADDING * 2) / lngRange,
    (height - CANVAS_PADDING * 2) / latRange,
  );

  const offsetX = (width - lngRange * scale) / 2;
  const offsetY = (height - latRange * scale) / 2;

  return {
    x: offsetX + (lng - MAP_BOUNDS.west) * scale,
    y: offsetY + (MAP_BOUNDS.north - lat) * scale,
  };
}
```

Fungsi ini **murni** (*pure function*): hasilnya hanya bergantung pada 4 parameter, tidak
membaca atau mengubah data lain. Karena itu mudah diuji dengan kalkulator.

### Rumus langkah demi langkah

| Langkah | Rumus | Arti |
|---|---|---|
| 1. Ukur wilayah | `lngRange = 141 − 95 = 46`, `latRange = 6 − (−11) = 17` | Indonesia selebar 46° dan setinggi 17° |
| 2. Hitung skala | `scale = min(ruangX / 46, ruangY / 17)` | Piksel per **1 derajat**. Diambil yang **terkecil** agar seluruh Indonesia muat |
| 3. Hitung sisa ruang | `offset = (ukuran canvas − ukuran peta) / 2` | Sisa ruang dibagi dua → peta tepat di **tengah** |
| 4. Geser ke nol | `lng − 95` dan `6 − lat` | Derajat → "jarak dari pojok kiri-atas wilayah" |
| 5. Ubah ke piksel | `× scale` lalu `+ offset` | Derajat → piksel, lalu geser ke posisi peta |

### Kenapa skalanya sama untuk x dan y?
Jika x dan y diberi skala berbeda, peta akan **gepeng atau melar**. Dengan satu nilai `scale`,
1° bujur dan 1° lintang punya panjang piksel yang sama → sebaran kota tetap **proporsional**.

### Kenapa `north − lat`?
Karena **lintang besar (utara) harus di atas** (y kecil). Medan (3,59) → `6 − 3,59 = 2,41` → atas.
Kupang (−10,18) → `6 − (−10,18) = 16,18` → bawah. Inilah "pembalikan" sumbu y.

### Contoh hitungan: Jakarta (lat −6,21; lng 106,85), canvas 1000 × 500 px

```
CANVAS_PADDING = 40
scale   = min((1000 − 80) / 46,  (500 − 80) / 17) = min(20, 24,7) = 20 piksel/derajat
offsetX = (1000 − 46 × 20) / 2 = 40
offsetY = (500  − 17 × 20) / 2 = 80

x = 40 + (106,85 − 95) × 20 = 40 + 237   = 277   px dari kiri
y = 80 + (6 − (−6,21)) × 20 = 80 + 244,2 = 324,2 px dari atas
```

Teknik ini disebut **proyeksi equirectangular**: bujur & lintang diubah ke x & y secara
**linear**. Karena Indonesia dekat khatulistiwa, distorsinya sangat kecil.

**Kalimat untuk dosen:**
> "Fungsi `latLngToCanvas()` memakai proyeksi equirectangular yang dibatasi ke wilayah Indonesia
> (95°–141° BT, 6° LU–11° LS). Skala piksel per derajat dibuat sama untuk x dan y agar
> proporsional, lalu peta diletakkan di tengah canvas. Sumbu y dibalik karena di canvas y
> bertambah ke bawah, sedangkan lintang bertambah ke utara."

---

## 2. Menggambar Peta: Dot Grid & 16 Kota

File: `js/modules/radar-map.js`

### 2a. Data kota — `CITIES` (`js/config/cities.js`)

```js
{ name: 'Jakarta', province: 'DKI', lat: -6.21, lng: 106.85, label: 'top' }
```

**Array of objects** berisi 16 kota: Sumatra (4), Jawa (3), Bali & Nusa Tenggara (2),
Kalimantan (2), Sulawesi (2), Maluku & Papua (3). `province` tampil di tabel log
(contoh `Surabaya, JATIM`); `label` menentukan posisi nama kota di peta.

### 2b. Dot grid & garis koordinat — `drawBackground(target)`

```js
for (let x = GRID_STEP / 2; x < size.width; x += GRID_STEP) {
  for (let y = GRID_STEP / 2; y < size.height; y += GRID_STEP) {
    target.fillRect(x, y, 1, 1);
  }
}
```

- **Perulangan bersarang**: loop luar ke kanan, loop dalam ke bawah, setiap `GRID_STEP` (18 px).
- Setiap persilangan digambar kotak **1 × 1 px** → titik-titik grid.
- Lalu garis bujur & lintang setiap 5° (`GRID_LINE_STEP`) dengan `moveTo` (pindah pena) →
  `lineTo` (tarik garis) → `stroke()` (beri tinta). Posisinya dihitung dengan `latLngToCanvas`.
- Garis khatulistiwa dibuat putus-putus (`setLineDash([4, 6])`) dan diberi label "EQUATOR 0°".
- Semua warna diambil dari objek `COLORS` di bagian atas file.

### 2c. Titik kota & nama — `drawCities(target)`

Untuk setiap kota (`for (const city of CITIES)`):
1. `cityPoint(city)` → memanggil `latLngToCanvas(city.lat, city.lng, ...)`.
2. `target.arc(x, y, NODE_RADIUS, 0, Math.PI * 2)` → lingkaran penuh berjari-jari 2,5 px.
3. Nama kota ditulis dengan `fillText()` sesuai tabel `LABEL_PLACEMENT`:

```js
const LABEL_PLACEMENT = Object.freeze({
  right:  { align: 'left',   dx: LABEL_GAP,  dy: 0 },
  left:   { align: 'right',  dx: -LABEL_GAP, dy: 0 },
  top:    { align: 'center', dx: 0,          dy: -LABEL_VERTICAL_GAP },
  bottom: { align: 'center', dx: 0,          dy: LABEL_VERTICAL_GAP },
});
```

- `align` → nilai `textAlign` (titik jangkar teks): `'left'` = teks mulai di titik itu,
  `'right'` = teks berakhir di titik itu, `'center'` = teks di tengah.
- `dx`, `dy` → geseran dari titik kota.
- Ini mengganti rangkaian `if / else if` dengan **tabel data** (*lookup table*): menambah posisi
  baru cukup menambah satu baris.

**Agar tidak bertumpuk**: kota yang berdekatan (Jakarta–Bandung ±15 px, Pekanbaru–Padang–Palembang)
diberi `label` berbeda. Posisinya dipilih lewat simulasi tumpang-tindih di lebar peta 600–1400 px.
Jika lebar peta < `LABEL_MIN_WIDTH` (600 px, layar HP), nama kota tidak digambar.

### 2d. Lapisan statis (offscreen canvas)

Latar dan kota **tidak pernah berubah**, jadi digambar **sekali** ke canvas tersembunyi:

```js
const staticLayer = document.createElement('canvas');
```

Di `resize()`, `drawBackground(staticCtx)` dan `drawCities(staticCtx)` mengisi lapisan ini.
Setiap frame, `render()` cukup menempelkannya:

```js
ctx.drawImage(staticLayer, 0, 0, size.width, size.height);
```

Ibarat **stempel**: dicetak sekali, ditempel berkali-kali. Itulah sebabnya `drawBackground` dan
`drawCities` menerima parameter `target` — keduanya bisa menggambar ke canvas mana saja.

### 2e. Canvas tajam di layar HD — `resize()`

```js
const ratio = window.devicePixelRatio || 1;
target.width = Math.round(rect.width * ratio);
ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
```

Layar HD punya 2–3 piksel fisik per piksel CSS. Ukuran canvas dikali `devicePixelRatio`, lalu
`setTransform` memperbesar "kuas" agar kode tetap memakai satuan piksel CSS.

---

## 3. Logika Animasi Serangan

File: `js/modules/radar-map.js`

### 3a. `requestAnimationFrame` — jantung animasi

```js
function frame(timestamp) {
  const delta = lastFrameTime ? timestamp - lastFrameTime : 0;
  lastFrameTime = timestamp;

  if (running) {
    update(Math.min(delta, MAX_FRAME_DELTA));
  }

  render();
  requestAnimationFrame(frame);
}
```

- Browser memanggil `frame` **tepat sebelum layar di-refresh** (±60×/detik). Di akhir, fungsi
  meminta frame berikutnya → loop tanpa akhir.
- **`delta`** = selisih waktu antar-frame (±16,7 ms pada 60 fps). Gerakan dihitung berdasarkan
  **waktu**, bukan jumlah frame → kecepatan sama di monitor 60 Hz maupun 144 Hz.
- `MAX_FRAME_DELTA` (100 ms) mencegah animasi "meloncat" setelah browser sempat macet.
- Saat Pause, `update()` dilewati tetapi `render()` tetap jalan → gambar membeku di tempat.

### 3b. Siklus hidup satu garis serangan

`launch(attack)` menambahkan `{ attack, progress: 0, alpha: 1 }` ke array `arcs`
(dilewati jika tab tidak terlihat — `document.hidden` — agar garis tidak menumpuk).

```
progress: 0 ──────────────► 1          alpha: 1 ──────► 0
       (bergerak, ARC_DURATION 1600 ms)    (memudar, FADE_DURATION 700 ms) → dibuang
                              ▲
                  tiba di target → buat pulse (gelombang)
```

Di `update(delta)`:
- `progress += delta / ARC_DURATION` → pada 60 fps butuh ±96 frame sampai target.
- Saat `progress === 1` → `pulses.push(...)`.
- Setelah tiba, `alpha` dikurangi sampai 0.
- `filter()` membuang garis & pulse yang selesai → array tidak membengkak (mencegah lag).

### 3c. Garis lengkung — kurva Bézier kuadratik (`pointOnArc`)

Kurva ditentukan 3 titik: **from** (asal), **to** (target), **control** (titik kontrol).

```
B(t) = u² · from  +  2·u·t · control  +  t² · to        dengan u = 1 − t
```

- t = 0 → titik asal · t = 1 → titik target · t = 0,5 → puncak lengkungan
- Titik kontrol diletakkan di **atas** garis lurus:

```js
const controlX = (from.x + to.x) / 2;
const controlY = Math.min(from.y, to.y) - Math.abs(to.x - from.x) * 0.25 - 20;
```

Makin jauh dua kota, makin tinggi lengkungannya — mirip lintasan pesawat. Garis terpanjang
(Medan → Jayapura) sudah dicek tetap berada di dalam canvas.

**Efek garis tumbuh** di `drawArc()`: kurva dipecah menjadi `ARC_SEGMENTS` (32) garis lurus,
tetapi hanya digambar dari t = 0 sampai **t = progress**. "Kepala" garis = lingkaran kecil
bercahaya (`shadowBlur`) di `pointOnArc(from, to, progress)`.

**Monokrom**: severity dibedakan lewat `SEVERITY_STYLE` — kecerahan (`#ffffff` → `#5a5a5a`),
ketebalan (`width`), dan pola garis (`dash: [6, 4]` = 6 px garis, 4 px celah).

### 3d. Efek gelombang — `drawPulse()`

```js
const progress = pulse.age / PULSE_DURATION;
ctx.globalAlpha = 1 - progress;
ctx.arc(point.x, point.y, 4 + progress * 22, 0, Math.PI * 2);
```

Satu nilai `progress` mengatur radius (membesar 4 → 26 px) **dan** transparansi → efek riak air.

### 3e. Efek radar — dikerjakan CSS

Sapuan radar adalah `<div class="radar">` dengan `conic-gradient` yang diputar
`@keyframes radar-sweep` di `css/components/radar-canvas.css`. JavaScript (`controls.js`) hanya
menambah class `is-paused` pada `<body>`, dan CSS merespons dengan `animation-play-state: paused`.
Animasi dekoratif → CSS; animasi berbasis data → Canvas + JS.

---

## 4. Simulasi Data Real-Time

### 4a. Timer serangan — `restartAttackTimer()` di `main.js`

```js
function restartAttackTimer() {
  clearInterval(attackTimer);
  attackTimer = setInterval(spawnAttack, MAX_ATTACK_DELAY - speed * DELAY_PER_SPEED);
}
```

| Slider | Rumus `1300 − speed × 120` | Jeda | Serangan per detik |
|---|---|---|---|
| 1 | 1300 − 120 | 1180 ms | ±0,8 |
| 5 | 1300 − 600 | 700 ms | ±1,4 |
| 10 | 1300 − 1200 | 100 ms | 10 |

`setInterval` mengembalikan **ID timer**. Saat slider digeser, `clearInterval` menghentikan timer
lama dulu — tanpa itu, timer **bertumpuk** dan serangan makin cepat tak terkendali.

### 4b. Satu siklus `spawnAttack()` di `main.js`

```js
function spawnAttack() {
  if (!running) return;

  const attack = generateAttack();
  logger.record(attack);
  radar.launch(attack);
  chart.recordAttack();
}
```

```
spawnAttack()                       (main.js)
 ├─ generateAttack()                (threat-logger.js) → objek serangan acak
 ├─ logger.record(attack)           (threat-logger.js)
 │    ├─ totals & typeCounts bertambah
 │    ├─ logs.unshift(attack)       → terbaru di indeks 0, maks 200 data
 │    ├─ renderStats()              → kartu Total, Diblokir, Kritis
 │    ├─ renderTopTypes()           → diagram batang Top 5
 │    └─ renderTable(true)          → tabel log, baris teratas berkedip
 ├─ radar.launch(attack)            (radar-map.js) → garis animasi
 └─ chart.recordAttack()            (traffic-chart.js) → hitung lonjakan traffic
```

Satu objek `attack` dikirim ke tiga modul — masing-masing mengambil bagian yang ia perlukan.

### 4c. Membuat data acak — `generateAttack()`

```js
return {
  time: new Date(),
  source, target,
  sourceIp: randomIp(),
  type: type.name,
  port: type.port ?? randomInt(1, 65535),
  severity: randomSeverity(),
  blocked: Math.random() < BLOCK_RATE,
};
```

- `while (target === source)` → kota asal dan target pasti berbeda.
- `??` (*nullish coalescing*) → jika `type.port` bernilai `null` (Port Scan), pakai port acak.
- `Math.random() < 0.72` → 72% serangan diblokir.
- **Acak berbobot** (`randomSeverity`) dengan `SEVERITY_WEIGHTS` `low 40, medium 30, high 20, critical 10`:
  ambil angka acak 0–100 → 0–40 low, 40–70 medium, 70–90 high, 90–100 critical.

### 4d. Tabel log — `renderTable()`

1. `filter()` → hanya severity yang dicentang (`visibleSeverities.has(...)`).
2. `slice(0, MAX_VISIBLE_ROWS)` → maksimal 50 baris.
3. `map(createRow)` → setiap serangan dijadikan `<tr>`. `createRow` memakai `createCell()` dan
   `createSeverityCell()` yang membuat `<td>` dengan **`textContent`** (lebih aman dari `innerHTML`
   karena teks tidak dijalankan sebagai HTML).
4. `tableBody.replaceChildren(...rows)` → isi `<tbody>` diganti **sekaligus** dalam satu operasi.
   `...rows` (*spread operator*) membuka array menjadi daftar argumen.
5. Baris teratas diberi class `row--new` → `@keyframes row-flash` di `threat-log.css`.

Statistik kartu memakai `Map` untuk `typeCounts` — mirip objek, tetapi punya method `get`/`set`
dan mudah diubah ke array dengan `[...typeCounts.entries()]` untuk diurutkan (`sort`).

### 4e. Grafik traffic — `traffic-chart.js`

Setiap 1 detik `tick()` memanggil `nextValue()`:

```
nilai = BASE_TRAFFIC (800) + speed × 60      (traffic dasar)
      + acak(−150 … 150)                     (fluktuasi alami)
      + seranganDetikIni × 90                (lonjakan akibat serangan)
```

Nilai masuk ke array `history` (maks `HISTORY_LENGTH` = 60). Jika lebih, `shift()` membuang data
terlama → grafik "bergeser" ke kiri. `draw()` menggambar garis bantu, garis putih, area bergradien
(`createLinearGradient`), dan titik nilai terbaru.

### 4f. Kontrol — `controls.js` → `main.js`

`initControls(elements, handlers)` menerima dua objek:
- `elements` → elemen HTML (tombol, slider, checkbox).
- `handlers` → fungsi yang dipanggil saat terjadi event: `onToggle`, `onClear`, `onSpeedChange`,
  `onFilterChange`.

| Event | Elemen | Yang terjadi |
|---|---|---|
| `click` | Pause/Play | `renderRunningState()` ubah teks tombol, status, class `is-paused` → `handlers.onToggle(running)` |
| `click` | Clear Log | `handlers.onClear()` → `logger.clear()` |
| `input` | Slider | Tampilkan angka di `<output>` → `handlers.onSpeedChange(speed)` → timer di-restart |
| `change` | Checkbox | `selectedSeverities()` kumpulkan nilai yang dicentang → `handlers.onFilterChange(...)` |
| `resize` | `window` (di `main.js`) | `radar.resize()` & `chart.resize()` |

Pola ini disebut **callback**: `controls.js` tidak perlu tahu apa yang terjadi setelah tombol
ditekan — ia hanya memanggil fungsi yang diberikan `main.js`.

---

## 5. Antisipasi Pertanyaan Dosen

| Pertanyaan | Jawaban singkat |
|---|---|
| Kenapa kode dipecah jadi banyak file? | Setiap file punya satu tanggung jawab (*separation of concerns*). Lebih mudah dibaca, dicari, diuji, dan dikembangkan tanpa merusak bagian lain. |
| Apa beda `export` dan `import`? | `export` membuka fungsi/variabel agar bisa dipakai file lain; `import` mengambilnya. Yang tidak di-export bersifat privat. |
| Kenapa harus pakai server lokal? | Browser memblokir ES Modules dari `file://` karena aturan keamanan CORS. |
| Apa itu factory function & closure? | Fungsi yang membuat dan mengembalikan objek. Variabel di dalamnya hanya bisa diakses lewat fungsi yang dikembalikan, sehingga data tiap modul terlindungi. |
| Kenapa Canvas, bukan `<div>` untuk tiap garis? | Ratusan garis bergerak 60×/detik terlalu berat jika tiap garis adalah elemen DOM. Canvas menggambar piksel langsung. |
| Beda `setInterval` dan `requestAnimationFrame`? | `setInterval` berjalan tiap jeda tetap (cocok untuk data). `requestAnimationFrame` selaras dengan refresh layar (cocok untuk animasi) dan berhenti saat tab tersembunyi. |
| Kenapa memakai `Object.freeze`? | Mengunci data konfigurasi (kota, warna, batas peta) agar tidak berubah secara tidak sengaja. |
| Bagaimana mencegah memori penuh? | Array dibatasi: log maks 200, grafik maks 60, garis & pulse yang selesai dibuang dengan `filter()`. |
| Bagaimana filter severity bekerja? | `controls.js` mengumpulkan checkbox yang dicentang → `main.js` mengirimnya ke peta & logger → keduanya menyimpan dalam `Set` dan hanya menampilkan severity yang ada di `Set`. |
| Kenapa kode tanpa komentar? | Nama variabel, fungsi, dan konstanta dibuat deskriptif (mis. `ARC_DURATION`, `restartAttackTimer`) sehingga kode menjelaskan dirinya sendiri (*self-documenting code*). Penjelasan rinci ada di dokumen ini. |
