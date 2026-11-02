# Penjelasan Kode `js/app.js` untuk Pemula

> Catatan nama fungsi: fungsi konversi koordinat di proyek ini bernama **`project()`**
> (singkatan dari *map projection* / proyeksi peta), **bukan** `latLngToCanvas`.
> Saat ujian, sebutkan `project()` dan tunjukkan di Bagian 4 `app.js`.

---

## 0. Gambaran Besar: 3 "Mesin" yang Berjalan Bersamaan

Bayangkan aplikasi ini punya tiga mesin yang bekerja terus-menerus:

| Mesin | Alat JavaScript | Seberapa sering | Tugasnya |
|---|---|---|---|
| **Pembuat data** | `setInterval(spawnAttack, delay)` | tiap 100–1180 ms (tergantung slider) | Membuat 1 serangan palsu, mengupdate tabel & statistik |
| **Pengukur traffic** | `setInterval(trafficTick, 1000)` | tiap 1 detik | Menghitung paket/detik & menggambar grafik |
| **Pelukis animasi** | `requestAnimationFrame(animate)` | ±60 kali per detik | Menggambar ulang peta & menggerakkan garis serangan |

Ketiganya berbagi satu "buku catatan" bernama **`state`** (Bagian 2). Pola kerjanya selalu:

```
1. Ubah data di state   →   2. Gambar ulang tampilan dari state
```

Pola ini membuat kode mudah dilacak: kalau tampilan salah, cek isi `state`.

---

## 1. Fungsi Konversi Koordinat — `project(location)`

### Masalahnya
Kota punya koordinat geografis:
- **Longitude (bujur)** → posisi **kiri–kanan**. Indonesia berada di **95° BT s.d. 141° BT**.
- **Latitude (lintang)** → posisi **atas–bawah**. Indonesia berada di **6° LU s.d. 11° LS**
  (di kode, LU ditulis positif dan LS ditulis negatif: 6 sampai −11).

Canvas punya koordinat piksel:
- **x**: 0 (kiri) sampai lebar canvas (kanan)
- **y**: 0 (**atas**) sampai tinggi canvas (bawah) ← perhatikan, y di layar bertambah **ke bawah**

Batas wilayah disimpan dalam satu objek (disebut *geo-bounding box*):

```js
const MAP_BOUNDS = { north: 6, south: -11, west: 95, east: 141 };
```

### Kodenya

```js
function project(location) {
  const { w, h } = canvasSize.map;
  const pad = 40;
  const lonRange = MAP_BOUNDS.east - MAP_BOUNDS.west;   // 141 − 95 = 46°
  const latRange = MAP_BOUNDS.north - MAP_BOUNDS.south; // 6 − (−11) = 17°
  const scale = Math.min((w - pad * 2) / lonRange, (h - pad * 2) / latRange);
  const offsetX = (w - lonRange * scale) / 2;
  const offsetY = (h - latRange * scale) / 2;
  const x = offsetX + (location.lon - MAP_BOUNDS.west) * scale;
  const y = offsetY + (MAP_BOUNDS.north - location.lat) * scale;
  return { x, y };
}
```

### Rumus langkah demi langkah

| Langkah | Rumus | Arti |
|---|---|---|
| 1. Ukur wilayah | `lonRange = 46`, `latRange = 17` | Indonesia selebar 46° dan setinggi 17° |
| 2. Hitung skala | `scale = min(ruangX / 46, ruangY / 17)` | Berapa piksel untuk **1 derajat**. Diambil yang **terkecil** agar seluruh Indonesia muat |
| 3. Hitung sisa ruang | `offset = (ukuran canvas − ukuran peta) / 2` | Sisa ruang dibagi dua → peta tepat di **tengah** canvas |
| 4. Geser ke nol | `lon − 95` dan `6 − lat` | Ubah derajat menjadi "jarak dari pojok kiri-atas wilayah" |
| 5. Ubah ke piksel | `× scale` lalu `+ offset` | Derajat → piksel, lalu geser ke posisi peta di canvas |

### Kenapa skalanya sama untuk x dan y?
Jika x dan y diberi skala berbeda, peta akan **gepeng atau melar** (misalnya Pulau Jawa jadi
terlalu tebal). Dengan satu nilai `scale`, 1° bujur dan 1° lintang punya panjang piksel yang
sama sehingga bentuk sebaran kota tetap **proporsional**.

### Kenapa `north − lat`, bukan `lat − south`?
Karena **lintang besar (utara) harus berada di atas** (y kecil). Medan (3,59° LU) → `6 − 3,59 = 2,41`
→ y kecil (atas). Kupang (10,18° LS = −10,18) → `6 − (−10,18) = 16,18` → y besar (bawah).
Inilah "pembalikan" sumbu y.

### Contoh hitungan: Jakarta (lat −6,21; lon 106,85), canvas 1000 × 500 px

```
lonRange = 46,  latRange = 17,  pad = 40
scale    = min((1000 − 80) / 46,  (500 − 80) / 17)
         = min(20,  24,7)  = 20 piksel per derajat
offsetX  = (1000 − 46 × 20) / 2 = (1000 − 920) / 2 = 40
offsetY  = (500  − 17 × 20) / 2 = (500  − 340) / 2 = 80

x = 40 + (106,85 − 95) × 20 = 40 + 11,85 × 20 = 40 + 237   = 277 px dari kiri
y = 80 + (6 − (−6,21)) × 20 = 80 + 12,21 × 20 = 80 + 244,2 = 324,2 px dari atas
```

Teknik ini disebut **proyeksi equirectangular** (proyeksi silinder sama jarak): bujur dan lintang
diubah ke x dan y secara **linear** (perbandingan lurus). Karena Indonesia berada di sekitar
khatulistiwa, distorsi proyeksi ini sangat kecil — cocok untuk wilayah kita.

**Kalimat untuk dosen:**
> "Fungsi `project()` memakai proyeksi equirectangular yang dibatasi ke wilayah Indonesia
> (95°–141° BT, 6° LU–11° LS). Skala piksel per derajat dibuat sama untuk x dan y agar bentuknya
> proporsional, lalu peta diletakkan di tengah canvas. Sumbu y dibalik karena di canvas y bertambah
> ke bawah, sedangkan lintang bertambah ke utara."

---

## 2. Menggambar Peta: Dot Grid & 16 Kota

### 2a. Dot grid — `drawMapBackground(ctx)`

```js
for (let x = 9; x < w; x += 18) {
  for (let y = 9; y < h; y += 18) {
    ctx.fillRect(x, y, 1, 1);
  }
}
```

- **Perulangan bersarang (nested loop)**: loop luar berjalan ke kanan tiap 18 px, loop dalam ke bawah tiap 18 px.
- Di setiap persilangan digambar kotak **1 × 1 px** (`fillRect`) → hasilnya titik-titik rapi.
- Warna `rgba(255,255,255,0.07)` = putih dengan transparansi 7% → sangat samar, cocok untuk tema monokrom.
- Setelah itu digambar garis bujur & lintang setiap 5° di dalam wilayah Indonesia memakai
  `moveTo` (angkat pena, pindah) dan `lineTo` (tarik garis), lalu `stroke()` (tinta garis).
- Garis khatulistiwa (lintang 0°) dibuat putus-putus (`setLineDash`), sedikit lebih terang,
  dan diberi label "EQUATOR 0°" sebagai patokan utara–selatan.

### 2b. 16 kota — `drawNodes(ctx)`

Data 16 kota strategis Indonesia (Sumatra, Jawa, Bali & Nusa Tenggara, Kalimantan, Sulawesi,
Maluku & Papua) disimpan di **array of objects** `LOCATIONS` (Bagian 1):

```js
{ city: 'Jakarta', province: 'DKI', lat: -6.21, lon: 106.85, label: 'top' }
```

`province` (singkatan provinsi) ditampilkan di tabel log, misalnya `Surabaya, JATIM`.

Untuk setiap kota (`LOCATIONS.forEach`):
1. Ubah koordinat → piksel dengan `project(loc)`.
2. Gambar lingkaran kecil: `ctx.arc(x, y, 2.5, 0, Math.PI * 2)` → jari-jari 2,5 px, sudut 0 sampai 2π (lingkaran penuh).
3. Tulis nama kota dengan `ctx.fillText()`.

### 2c. Agar nama kota tidak bertumpuk

Beberapa kota sangat berdekatan di peta: **Jakarta–Bandung** (hanya ±15 px), **Pekanbaru–Padang**,
dan Palembang yang berada di antara keduanya. Solusinya:
- Setiap kota boleh punya properti **`label`**: `'left'`, `'top'`, `'bottom'`, atau default kanan.
- `ctx.textAlign` menentukan **titik jangkar** teks:
  - `'left'` → teks mulai dari titik x (teks di kanan titik kota)
  - `'right'` → teks berakhir di titik x (teks di kiri titik kota)
  - `'center'` → teks di tengah titik x (untuk atas/bawah)
- Jika lebar peta < 600 px (layar HP), nama kota disembunyikan dan hanya titik yang tampil,
  karena di layar sekecil itu jarak antarkota hanya beberapa piksel.

### 2d. Optimasi: lapisan statis (offscreen canvas)

Latar dan titik kota **tidak pernah berubah**, jadi tidak perlu digambar ulang 60 kali per detik.
`buildStaticLayer()` menggambarnya **sekali** ke canvas tersembunyi, lalu setiap frame cukup:

```js
mapCtx.drawImage(staticLayer, 0, 0, canvasSize.map.w, canvasSize.map.h);
```

Ibarat memakai **stempel**: latar dicetak sekali, lalu tinggal "ditempel" tiap frame.
Lapisan ini dibuat ulang hanya saat ukuran jendela berubah (`resize`).

---

## 3. Logika Animasi Serangan

### 3a. `requestAnimationFrame` — jantung animasi

```js
function animate(timestamp) {
  const dt = state.lastFrameTime ? timestamp - state.lastFrameTime : 0;
  state.lastFrameTime = timestamp;
  if (state.running) updateAnimations(Math.min(dt, 100));
  drawMap();
  requestAnimationFrame(animate);
}
```

- `requestAnimationFrame(animate)` meminta browser memanggil `animate` **tepat sebelum layar di-refresh**
  (±60 kali per detik pada monitor 60 Hz). Fungsi ini memanggil dirinya sendiri lagi di akhir → loop tak berujung.
- **`dt` (delta time)** = selisih waktu antar-frame dalam milidetik (±16,7 ms pada 60 fps).
  Gerakan dihitung berdasarkan **waktu**, bukan jumlah frame, sehingga kecepatan animasi sama
  di monitor 60 Hz maupun 144 Hz.
- `Math.min(dt, 100)` membatasi lompatan: jika browser sempat macet, animasi tidak "meloncat".
- Mengapa bukan `setInterval` untuk animasi? `requestAnimationFrame` selaras dengan layar
  (lebih mulus) dan otomatis berhenti saat tab tidak terlihat (hemat baterai/CPU).

### 3b. Siklus hidup satu garis serangan

Setiap serangan menjadi objek `{ attack, progress, alpha }` di `state.arcs`:

```
progress: 0 ──────────────► 1          alpha: 1 ──────► 0
          (garis bergerak, 1,6 detik)         (memudar, 0,7 detik)  → dihapus
                                ▲
                    tiba di target → buat "pulse" (gelombang)
```

Di `updateAnimations(dt)`:
- `progress += dt / 1600` → dalam 1600 ms progress naik dari 0 ke 1.
  Pada 60 fps: 1600 ÷ 16,7 ≈ **96 frame** untuk sampai ke target.
- Saat `progress` tepat 1 → tambahkan objek *pulse* ke `state.pulses`.
- Setelah tiba, `alpha` dikurangi sampai 0 (memudar).
- `filter()` membuang garis yang `alpha ≤ 0` agar array tidak terus membengkak (mencegah lag).

### 3c. Garis lengkung — kurva Bézier kuadratik (`getArcPoint`)

Kurva Bézier kuadratik ditentukan 3 titik: **P0** (asal), **P1** (target), dan **C** (titik kontrol).
Kurva "ditarik" ke arah C, tetapi tidak melewatinya.

Rumus posisi pada kurva untuk nilai **t** (0 sampai 1), dengan u = 1 − t:

```
B(t) = u² · P0  +  2·u·t · C  +  t² · P1
```

- t = 0 → hasil = P0 (titik asal)
- t = 1 → hasil = P1 (titik target)
- t = 0,5 → hasil = 0,25·P0 + 0,5·C + 0,25·P1 (puncak lengkungan)

Titik kontrol C diletakkan **di atas** garis lurus asal–target:

```js
const cx = (p0.x + p1.x) / 2;                                   // tengah secara horizontal
const cy = Math.min(p0.y, p1.y) - Math.abs(p1.x - p0.x) * 0.25 - 20; // naik ke atas
```

Semakin jauh jarak dua kota, semakin tinggi lengkungannya (`× 0.25`) — mirip lintasan pesawat.

**Efek "garis yang tumbuh"** di `drawArc()`: kurva dipotong menjadi 32 garis lurus kecil,
tetapi hanya digambar dari t = 0 sampai **t = progress**. Karena progress naik setiap frame,
garis tampak memanjang dari asal ke target. "Kepala" garis adalah lingkaran kecil di titik
`getArcPoint(p0, p1, progress)` dengan efek cahaya `shadowBlur`.

**Monokrom**: karena tidak ada warna, severity dibedakan lewat objek `SEVERITY_STYLE`:
kecerahan (`#ffffff` → `#5a5a5a`), ketebalan (`lineWidth`), dan pola garis (`setLineDash([6, 4])`
= 6 px garis, 4 px celah).

### 3d. Efek gelombang (pulse) — `drawPulse()`

```js
const t = pulse.age / CONFIG.pulseDuration;   // 0 → 1
ctx.globalAlpha = 1 - t;                       // makin pudar
ctx.arc(p.x, p.y, 4 + t * 22, 0, Math.PI * 2); // makin besar (4 px → 26 px)
```

Satu nilai `t` mengatur dua hal sekaligus: radius membesar **dan** transparansi naik → efek riak air.

### 3e. Efek radar — dikerjakan CSS, bukan JavaScript

Sapuan radar di atas peta adalah elemen `<div class="radar">` dengan `conic-gradient`
yang diputar oleh `@keyframes radar-sweep` (lihat `style.css` Bagian 6 & 9).
JavaScript hanya menambahkan class `is-paused` pada `<body>` saat tombol Pause ditekan,
dan CSS merespons dengan `animation-play-state: paused`. Ini contoh **pembagian tugas**:
animasi dekoratif → CSS (lebih ringan), animasi berbasis data → Canvas + JS.

---

## 4. Simulasi Data Real-Time dengan `setInterval`

### 4a. Timer serangan — `startAttackTimer()`

```js
function startAttackTimer() {
  clearInterval(state.attackTimer);
  const delay = 1300 - state.speed * 120;
  state.attackTimer = setInterval(spawnAttack, delay);
}
```

| Slider | Rumus | Jeda | Serangan per detik |
|---|---|---|---|
| 1 | 1300 − 120 | 1180 ms | ±0,8 |
| 5 | 1300 − 600 | 700 ms | ±1,4 |
| 10 | 1300 − 1200 | 100 ms | 10 |

- `setInterval` mengembalikan **ID timer**; disimpan di `state.attackTimer`.
- Saat slider digeser, `clearInterval` menghentikan timer lama dulu, lalu timer baru dibuat.
  Tanpa `clearInterval`, timer akan **bertumpuk** dan serangan makin cepat tak terkendali.

### 4b. Apa yang terjadi setiap kali `spawnAttack()` dipanggil

```
spawnAttack()
 ├─ cek state.running → jika PAUSED, berhenti (return)
 ├─ createAttack()        → buat objek serangan acak (kota, IP, jenis, severity)
 ├─ update state.totals   → total, diblokir, kritis bertambah
 ├─ state.logs.unshift()  → masukkan ke awal array (terbaru di atas)
 ├─ state.arcs.push()     → tambahkan garis animasi (hanya jika tab terlihat)
 ├─ updateStats()         → tulis angka baru ke kartu statistik (textContent)
 ├─ renderTopTypes()      → bangun ulang diagram batang top 5
 └─ renderLog(true)       → bangun ulang tabel, baris teratas berkedip
```

**Acak berbobot (`randomSeverity`)** — agar Critical jarang muncul seperti di dunia nyata:
bobot `low 40, medium 30, high 20, critical 10`. Ambil angka acak 0–100:
0–40 → low, 40–70 → medium, 70–90 → high, 90–100 → critical.

### 4c. Bagaimana tabel log diperbarui — `renderLog()`

1. `filter()` → ambil hanya serangan yang severity-nya dicentang.
2. `slice(0, 50)` → maksimal 50 baris.
3. Untuk tiap serangan: `document.createElement('tr')` dan sel `<td>` dengan `textContent`.
   (`textContent` lebih aman daripada `innerHTML` karena teks tidak dijalankan sebagai HTML.)
4. Semua baris dimasukkan ke **DocumentFragment** (wadah sementara di memori), lalu
   `replaceChildren(fragment)` mengganti isi `<tbody>` **sekaligus** → browser cukup
   menghitung ulang tata letak satu kali, bukan 50 kali.
5. Baris teratas diberi class `row--new` → CSS `@keyframes row-flash` membuatnya berkedip.

### 4d. Timer traffic — `trafficTick()` (setiap 1 detik)

```
pps = 800 + speed×60        (traffic dasar)
    + acak(−150 … 150)      (fluktuasi alami)
    + seranganDetikIni×90   (lonjakan akibat serangan)
```

Nilai dimasukkan ke array `state.traffic` (maksimal 60 data = 60 detik). Jika lebih,
`shift()` membuang data paling lama → grafik tampak "bergeser" ke kiri seperti monitor sungguhan.

### 4e. Pause / Play

`togglePause()` hanya membalik `state.running` (true ↔ false). Semua fungsi pembuat data
memeriksa `if (!state.running) return;`, dan `animate()` berhenti memanggil `updateAnimations()`.
Timer tetap hidup, tetapi tidak melakukan apa-apa → saat Play, semuanya langsung lanjut.

---

## 5. Antisipasi Pertanyaan Dosen

| Pertanyaan | Jawaban singkat |
|---|---|
| Kenapa pakai Canvas, bukan elemen `<div>` untuk tiap garis? | Ratusan garis bergerak 60×/detik terlalu berat jika tiap garis adalah elemen DOM. Canvas menggambar piksel langsung tanpa membuat elemen. |
| Apa beda `setInterval` dan `requestAnimationFrame`? | `setInterval` berjalan tiap jeda tetap (cocok untuk data). `requestAnimationFrame` selaras dengan refresh layar (cocok untuk animasi) dan berhenti saat tab tersembunyi. |
| Kenapa gambar canvas tajam di laptop layar HD? | `resizeCanvas()` mengalikan ukuran piksel dengan `devicePixelRatio`, lalu `setTransform` menyesuaikan skala gambar. |
| Kenapa data bisa berubah tanpa reload halaman? | JavaScript mengubah DOM langsung (`textContent`, `createElement`), browser memperbarui tampilan secara otomatis. |
| Bagaimana mencegah memori penuh? | Array dibatasi: log maks 200, grafik maks 60, dan garis/pulse yang selesai dibuang dengan `filter()`. |
| Apa itu `state`? | Satu objek pusat yang menyimpan semua kondisi aplikasi; tampilan selalu digambar berdasarkan isinya. |
| Bagaimana filter severity bekerja? | Checkbox yang dicentang disimpan dalam `Set`. Peta dan tabel hanya menampilkan serangan yang severity-nya ada di `Set` tersebut (`state.activeSeverities.has(...)`). |
