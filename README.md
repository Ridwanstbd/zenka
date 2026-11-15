# Zenka

Semua tool Zenka dalam satu proyek Next.js. Pengguna cukup memasukkan kode akses sekali,
dan semua prompt disusun di server.

## Menjalankan di komputer sendiri
1. `npm install`
2. Salin `.env.example` menjadi `.env.local`, isi kode akses.
3. `npm run dev`, lalu buka http://localhost:3000

## Deploy ke Vercel
1. Upload folder ini ke GitHub, lalu import repo-nya di Vercel.
2. Settings → Environment Variables: isi `ZENKA_CODES` (kode dipisah koma) dan `ZENKA_BELI` (link pembelian).
3. Deploy. Setiap kali `ZENKA_CODES` diubah, lakukan Redeploy.

## Struktur penting
- `lib/tools.js`      : daftar CABANG, daftar dan URUTAN tool, beserta kolom form-nya
- `lib/prompts/`      : template prompt, hanya berjalan di server
- `proxy.js`          : penjaga kode akses
- `components/FormAlat.jsx` : form umum yang dipakai semua tool

## Menambahkan tool berikutnya
1. Buat `lib/prompts/nama-tool.js` dengan pola yang sama seperti file lain di folder itu:
   salin isi `<script>` dari HTML lama, mulai dari awal sampai sebelum `function upd()`,
   ke dalam fungsi `susunNamaTool(input, keluaran)`. Baris `const document = buatDokumen(input);`
   membuat kode lama berjalan tanpa diubah.
2. Daftarkan fungsinya di `lib/prompts/index.js`.
3. Di `lib/tools.js`, isi `cabang`, `bagian` (kolom form), `keluaran`, lalu ubah `siap` menjadi `true`.
   ID kolom harus sama persis dengan id elemen di HTML lama.

## Penyimpanan di browser
- Setiap tool mengingat pilihan (dropdown, radio, centang) dan kolom "Isi Sendiri" di localStorage
  dengan kunci `zenka-<slug>-pilihan`. Kolom teks lain tidak disimpan.
- Tool dengan properti `simpan` (Testimoni, WhatsApp series) menyimpan seluruh isian.
- Halaman utama mengingat cabang accordion yang terbuka (`zenka-cabang-terbuka`).
- Tandai kolom teks lain dengan `isiSendiri: true` di `lib/tools.js` bila ingin ikut disimpan.
