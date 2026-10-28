# Sewa Mobil Murah Lampung

Situs statis untuk usaha sewa mobil di Bandar Lampung. Tanpa WordPress, tanpa
database, tanpa build tool. Cukup satu file CSS, satu file JS, dan beberapa
file HTML.

## Isi folder

```
sewamobil-lampung/
|-- index.html          Beranda
|-- armada.html         Katalog armada + tarif (pencarian, penyaring jenis dan merek)
|-- cara-sewa.html     Alur pemesanan, syarat, ketentuan, FAQ
|-- tentang.html        Profil usaha
|-- kontak.html         Form pesan, kontak, peta, jam operasional
|-- 404.html            Halaman tidak ditemukan
|-- robots.txt
|-- sitemap.xml
|-- .htaccess           Cache, kompresi, halaman error (Apache)
|-- README.md           File ini
`-- assets/
    |-- css/style.css
    |-- js/main.js
    `-- img/armada-mpv.svg, armada-suv.svg, armada-sedan.svg, armada-hatch.svg,
                armada-elf.svg, armada-bus.svg, armada-pickup.svg
```

## Alamat halaman

Semua halaman memakai URL bersih, tanpa `.html`:

| Alamat | Isi |
| --- | --- |
| `/` | Beranda |
| `/armada` | Daftar armada + tarif |
| `/cara-sewa` | Cara pemesanan |
| `/tentang` | Profil usaha |
| `/kontak` | Form pesan dan lokasi |
| `/kredit-foto` | Kredit dan lisensi foto armada |

File HTML-nya tetap bernama `.html` di server, `.htaccess` yang menerjemahkan.
Kalau ada orang membuka atau menyalin alamat lamanya (misal `/armada.html`),
otomatis dialihkan ke `/armada`. Jadi tidak ada dua alamat untuk satu halaman.

Kalau hosting ternyata tidak mendukung `mod_rewrite`, situs tetap bisa dibuka,
tapi alamatnya menjadi `/armada.html`. Tidak ada yang rusak.

## Cara melihat hasil secara lokal

Butuh PowerShell (sudah tersedia di Windows). Jalankan dari PowerShell:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File D:\opencode\_dev\serve.ps1 -Port 8000
```

Lalu buka `http://127.0.0.1:8000/`. Skrip ini meniru aturan `.htaccess`
(URL bersih, pengalihan `.html`, dan halaman 404) supaya pratinjau lokal
tampak sama dengan versi online. Tidak perlu PHP, Node, atau Python.

Kalau port 8000 sedang dipakai, ganti angkanya, misalnya `-Port 8080`.

## Foto armada

Katalog aktif berisi 13 model dan 13 foto referensi kendaraan. Brio, Xpander,
Fortuner, Avanza, Agya, dan Calya memakai foto depan serong pilihan pemilik. Sumber masing-masing
tercatat di halaman kredit. Foto aktif diseragamkan menjadi WebP 800 x 500: ruang kosong dipangkas,
bodi mobil tetap utuh, posisi bawah disejajarkan, dan lebar/tinggi tampak dibatasi
seragam. Sumber asli beserta metadata sebelum normalisasi disimpan di `_dev/`.
File gambar lama tetap
disimpan sebagai arsip, tetapi tidak tampil di katalog maupun halaman kredit.
Hak cipta foto tetap milik produsen; izin penggunaan belum diverifikasi.

Data utama ada di `D:\opencode\_dev\gen-armada.ps1`. Generator ini memperbarui
halaman armada dan kartu beranda sekaligus. Jalankan setelah mengubah data:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File D:\opencode\_dev\gen-armada.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File D:\opencode\_dev\sinkron-foto-katalog.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File D:\opencode\_dev\gen-kredit.ps1
```

Jangan gunakan skrip migrasi harga/katalog lama untuk katalog baru.
Cadangan sebelum perubahan disimpan di `_dev/backup-sebelum-katalog-8/`.

## Cara pasang di hosting

1. Masuk ke cPanel, buka **File Manager**, masuk ke folder `public_html`.
   Nyalakan **Settings > Show Hidden Files** supaya file `.htaccess` terlihat.
2. Hapus isi bawaan WordPress (file dan folder) karena situs ini menggantikannya.
3. Upload semua isi folder ini ke `public_html`. Struktur akhir harus seperti ini:

   ```
   public_html/
   |-- .htaccess
   |-- index.html
   |-- armada.html
   |-- kredit-foto.html
   |-- 404.html
   `-- assets/
   ```

4. Buka `https://sewamobilmurahlampung.com` untuk mengecek hasilnya.

Kalau hosting tidak memakai Apache, `.htaccess` diabaikan dan situs tetap
berjalan normal, hanya alamatnya jadi berakhiran `.html`.

## CloudPanel (nginx) — URL bersih tanpa `.html`

nginx **tidak pernah membaca `.htaccess`** (itu fitur Apache), jadi kalau
situs ini di-host di CloudPanel, halaman depan tampil tetapi `/armada`,
`/cara-sewa`, `/tentang`, `/kontak`, dan `/kredit-foto` balik **404 Not Found**.
Aturan yang sama harus dipasang di vhost CloudPanel.

File vhost lengkap sudah disiapkan: `_dev/vhost-sewamobilmurahlampung.conf`
(isi vhost bawaan CloudPanel + satu blok tambahan "URL bersih"). Langkahnya:

1. CloudPanel → **Sites** → situs ini → menu **Vhost** (Vhost Editor).
2. **Salin seluruh isi vhost ke catatan** sebagai cadangan.
3. Buka `_dev/vhost-sewamobilmurahlampung.conf`, salin **semua isinya**, lalu
   timpa seluruh isi editor vhost. Yang ditambahkan hanya blok "URL BERSIH"
   di server block utama:

   - `error_page 404 /404.html;` — halaman 404 sendiri
   - `location /` berisi `try_files ... $uri.html` — `/armada` dibuka dari
     `armada.html`
   - `location = /index.html` dan `location = /index` — `/index.html` dan
     `/index` diarahkan 301 ke `/`
   - pengalihan `.html` lama ke URL bersih (301) dan `/armada/` ke `/armada`
   - blokir `README.md`/log dan file `.htaccess`

4. **Save** — CloudPanel mengecek sintaks dulu dan menolak kalau salah (vhost
   lama tetap dipakai), lalu reload nginx otomatis.
5. Cek:

   ```bash
   curl -sI https://SEWA-DOMAIN/armada          # harus 200
   curl -sI https://SEWA-DOMAIN/armada.html      # harus 301 -> /armada
   curl -sI https://SEWA-DOMAIN/halaman-ngawur   # harus 404 (halaman 404 sendiri)
   curl -sI https://SEWA-DOMAIN/index.html       # harus 301 -> /
   ```

Kalau yang tampil di editor ternyata vhost versi lain (ada
`{{varnish_proxy_pass}}` atau blok `server { listen 8080; ... }`), jangan
ditimpa dulu — kabari, karena blok URL bersih harus dipasang di blok backend
8080.

Catatan:

- Blok tambahan sengaja **tidak** memasang header keamanan maupun gzip:
  keduanya sudah aktif global di CloudPanel (lewat
  `include /etc/nginx/global_settings;` dan `nginx.conf`). Menduplikasi justru
  menghasilkan header kembar di respons.
- Kalau Save melapor `duplicate location` pada blok `.htaccess`, hapus blok
  itu saja dari vhost — berarti sudah ada di `global_settings`.
- `.htaccess` tetap disertakan untuk hosting Apache; isinya memang dibuat
  sama persis dengan blok URL bersih di atas.
- Aset (`css`/`js`/`svg`) tetap ditangani blok bawaan CloudPanel
  (`expires max`), jadi jangan dihapus.
- Kalau memakai **Varnish Cache** CloudPanel, nonaktifkan dulu untuk situs
  HTML statis ini.

## Data yang perlu diganti

Seluruh data bisnis sengaja dibuat mencolok supaya mudah dicari. Dari Notepad
atau VS Code, gunakan **Find and Replace** (Ctrl+H).

| Data | Teks yang dicari | Contoh saat ini |
| --- | --- | --- |
| Nomor WhatsApp | `6281379990068` | `6281379990068` |
| Nomor telepon | `0813-7999-0068` | `0813-7999-0068` |
| Telepon format internasional | `+6281379990068` | `+6281379990068` |
| Alamat | `Jl. R Imba Kusuma, GG Melati, Kemiling` | sama |
| Kota | `Bandar Lampung` | `Bandar Lampung` |
| Jam operasional | `Setiap hari, 24 jam` | `24 jam` |

Ganti di **semua file HTML sekaligus**. Di VS Code: Ctrl+Shift+H, isi kolom
find dan replace, lalu `Replace All` untuk seluruh folder.

Nomor WhatsApp muncul di dua bentuk:

- `6281379990068` untuk semua tautan `wa.me` dan atribut `data-wa` di `<body>`.
- `0813-7999-0068` untuk teks yang dilihat pembaca.

Ulasan pelanggan di bagian `Kata pelanggan` juga masih berisi data contoh;
cara menggantinya dibahas di bagian [Kata pelanggan (ulasan)](#kata-pelanggan-ulasan).

## Katalog dan harga aktif (27 Oktober 2026)

Katalog aktif berisi 8 model dari gambar daftar harga CV. JB Trans Lampung,
ditambah Toyota Agya, Toyota Calya, Toyota Rush, Honda Brio, dan Mitsubishi
Xpander sesuai instruksi pemilik.
Harga mobil + sopir dalam kota adalah patokan pemilik dan disimpan eksplisit, bukan hasil
perhitungan tarif lepas kunci. Kapasitas, transmisi, dan jenis BBM mengikuti
gambar. Tahun dan trim tidak dicantumkan karena tidak disebutkan pada gambar.

| Model | Mobil + sopir dalam kota / hari | Lepas kunci / hari | Mobil + sopir luar kota / hari |
| --- | --- | --- | --- |
| Toyota Avanza | Rp 500.000 | Rp 300.000 | Rp 600.000 |
| Daihatsu Xenia | Rp 500.000 | Rp 300.000 | Rp 600.000 |
| Daihatsu Terios | Rp 600.000 | Rp 400.000 | Rp 700.000 |
| Toyota Rush | Rp 600.000 | Rp 400.000 | Rp 700.000 |
| Honda Brio | Rp 550.000 | Rp 350.000 | Rp 650.000 |
| Mitsubishi Xpander | Rp 600.000 | Rp 400.000 | Rp 700.000 |
| Toyota Kijang Innova Reborn | Rp 800.000 | Rp 600.000 | Rp 900.000 |
| Toyota Fortuner | Rp 1.500.000 | Rp 1.300.000 | Rp 1.600.000 |
| Mitsubishi Pajero Sport | Rp 1.500.000 | Rp 1.300.000 | Rp 1.600.000 |
| Toyota Hiace Commuter | Rp 1.500.000 | Rp 1.300.000 | Rp 1.600.000 |
| Toyota Alphard | Rp 3.500.000 | Rp 3.300.000 | Rp 3.600.000 |
| Toyota Agya | Rp 500.000 | Rp 300.000 | Rp 600.000 |
| Toyota Calya | Rp 500.000 | Rp 300.000 | Rp 600.000 |

Semua harga belum termasuk BBM dan tol. Untuk seluruh model, lepas kunci
satu harga tanpa pembagian area: harga mobil + sopir dalam kota dikurangi
Rp 200.000. Mobil + sopir luar kota adalah harga lepas kunci ditambah
Rp 300.000. Kedua formulir mengirim area
pemakaian bersama skema sewa ke WhatsApp.
Hiace Commuter berkapasitas 16 orang; tujuh model lain di gambar 7 orang.
Agya berkapasitas 5 orang dan Calya 7 orang. Kartu hanya menampilkan nama,
kategori, kapasitas, dan tarif. BBM serta transmisi tidak ditampilkan karena
spesifikasi unit yang tersedia perlu dikonfirmasi saat pemesanan.

### Mengubah katalog

Edit `$data` pada `_dev/gen-armada.ps1`, kemudian jalankan tiga generator
di bagian Foto armada. Beranda dan katalog dibuat dari sumber data yang sama.
Jika model berubah, perbarui pilihan formulir beranda/kontak, ringkasan di
halaman tentang, metadata, serta dokumentasi ini. Foto dapat diganti melalui
`_dev/foto-armada.json`; jangan mengedit kartu HTML langsung.

### Ketentuan sewa yang tetap berlaku

- Dengan sopir: 10 atau 12 jam sesuai pilihan, kelebihan Rp 25.000/jam,
  maksimal 3 jam.
- Lepas kunci: KTP dan KK, tanpa uang jaminan maupun DP.
- Operasional: setiap hari 24 jam.

### Kata pelanggan (ulasan)

Ulasan saat ini masih data contoh, bukan ulasan pelanggan terverifikasi.
Generator `_dev/gen-ulasan.ps1` tidak menampilkan contoh yang menyebut model
di luar katalog. Ganti dengan ulasan asli sebelum publikasi; jangan membuat
ulasan baru dengan mengganti nama kendaraan pada cerita lama.

## Form kontak

Form di `index.html` dan `kontak.html` sengaja tidak mengirim ke server. Saat
ditekan, isian dirangkai menjadi pesan dan dibuka di WhatsApp. Ini pilihan yang
paling murah untuk usaha kecil: tidak ada backend yang bisa diretas atau
membocorkan nomor.

Kalau nanti butuh form yang benar-benar terkirim ke email, ganti `action` pada
`<form>` dan hapus atribut `data-wa-form`. Alternatif gratis: Formspree,
Web3Forms, atau Google Forms.

## Favicon (opsional)

Situs ini sengaja dikirim tanpa favicon agar tetap ringan. Kalau ingin
menambahkan, buat file `favicon.ico` (32x32) dan simpan di root folder, atau
pakai favicon modern dengan menambahkan satu baris di bagian `<head>` setiap
file:

```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
```

## Mengaktifkan HTTPS

Domain Anda dilayani lewat Cloudflare. Setelah sertifikat SSL aktif:

1. Buka blok HTTPS dan WWW di `.htaccess`.
2. Hapus tanda pagar `#` pada blok tersebut.
3. Pilih salah satu: arahkan ke `www` atau tanpa `www`, lalu konsistenkan juga
   di Google Search Console.

Blok `mod_rewrite` di bagian atas `.htaccess` (untuk URL bersih) tidak perlu
disentuh, biarkan saja aktif.

## Setelah situs hidup

1. Kirim `https://sewamobilmurahlampung.com/sitemap.xml` ke Google Search
   Console.
2. Daftarkan juga di Bing Webmaster Tools.
3. Buat tautan Google Business Profile dengan alamat dan nomor yang sama.
4. Ganti `https://wa.me/6281379990068` di `kontak.html` dan `index.html`
   dengan tautan Reservation Code WhatsApp Business kalau sudah punya, supaya
   tidak bisa diblokir.

## Ukuran dan performa

- Katalog dan beranda masing-masing menampilkan 13 kartu armada.
- Foto dimuat dengan lazy loading; tidak ada build tool atau pustaka eksternal.
- Satu file CSS dan satu file JavaScript untuk semua halaman.

## Tampilan di HP

Sudah ada menu drawer untuk layar kecil, tombol telepon dan WhatsApp yang
menempel di bawah, serta tabel yang berubah jadi satu kolom. Silakan cek
melalui DevTools dengan menyetel device ke mode mobile.
