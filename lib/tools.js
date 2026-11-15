// DAFTAR TOOL ZENKA
// Urutan di array TOOLS = urutan tampil di halaman utama.
// Untuk mengubah urutan, cukup pindahkan blok { ... } ke atas atau ke bawah.
//
// File ini aman dibaca browser: isinya hanya label dan kolom form.
// Template prompt yang berharga ada di lib/prompts/ dan hanya berjalan di server.
//
// Jenis kolom:
//   "text", "textarea"   isian bebas
//   "select"             daftar pilihan (opsi: [{ nilai, teks }])
//   "pilihan"            tombol radio bertumpuk (opsi: [{ nilai, teks }])
//   "angka"              angka (min, max)
//   "checkbox"           satu kotak centang di dalam form
//   "centang-grup"       beberapa kotak centang, nilainya daftar (opsi: [{ nilai, teks }])
//   "info"               keterangan saja, tanpa isian
// tampilJika: [{ kolom, nilai }] menyembunyikan kolom sampai semua syarat terpenuhi.
// isiSendiri: true menandai kolom "Isi Sendiri" yang nilainya ikut disimpan di browser.
//
// PENYIMPANAN DI BROWSER (localStorage)
// Semua tool otomatis menyimpan pilihan (select, radio, centang) dan kolom isiSendiri.
// Tool dengan "simpan" menyimpan SELURUH isian, memakai kunci yang ditulis di sana.
// Kolom dengan setengah: true yang berurutan tampil berdampingan.
// "centang" = kotak centang yang tampil di atas kotak hasil.
// "keluaran" = kotak prompt yang dihasilkan, masing-masing dengan kolom wajibnya.

const GAYA = [
  "Santai & relatable - kayak ngobrol sama teman",
  "Humor & nyelekit - sarkastik tapi cerdas",
  "Inspiratif & berbobot - humble tapi otoritatif",
  "Campuran - santai di keseharian, serius saat edukasi",
].map((t) => ({ nilai: t, teks: t }));

const pilihanTeks = (daftar) => daftar.map((t) => ({ nilai: t, teks: t }));

const KOLOM_GAYA_CTA = [
  { id: "durasi", jenis: "select", label: "Durasi", setengah: true, opsi: pilihanTeks(["30 Detik", "45 Detik", "60 Detik"]), bawaan: "60 Detik" },
  { id: "sapaan", jenis: "select", label: "Sapaan", setengah: true, opsi: pilihanTeks(["aku/kamu", "saya/anda", "saya/kalian", "saya/kita"]) },
  { id: "gaya", jenis: "select", label: "Gaya", opsi: GAYA },
  {
    id: "ajakan",
    jenis: "select",
    label: "Ajakan (CTA)",
    opsi: [
      { nilai: "komentar", teks: "Komentar & Diskusi" },
      { nilai: "ikuti", teks: "Ikuti Akun (Follow)" },
      { nilai: "bio", teks: "Klik Link di Bio" },
      { nilai: "pdfbio", teks: "Dapatkan PDF lead magnet, klik link di bio" },
      { nilai: "custom", teks: "Isi Sendiri" },
    ],
    bawaan: "pdfbio",
  },
  { id: "ajakanCustom", jenis: "text", isiSendiri: true, label: "Ajakan custom", bantuan: "Dipakai jika memilih Isi Sendiri." },
];

const FUNNEL = pilihanTeks(["TOFU", "MOFU", "BOFU"]);

const PERAN = [
  { nilai: "lawan", teks: "Peran Lawan (Salmon Effect) - sudut pandang yang melawan pemikiran umum" },
  { nilai: "kawan", teks: "Peran Kawan - cerita yang sangat relatable sesuai topik" },
  { nilai: "korban", teks: "Peran Korban - pengalaman pribadi saat pernah gagal" },
];

// CABANG: pengelompokan tool di halaman utama, tampil sesuai urutan di sini.
// Setiap tool memilih cabangnya lewat properti "cabang".
// Urutan tool di dalam cabang mengikuti urutan di array TOOLS.
export const CABANG = [
  { id: "fondasi", judul: "Mulai dari sini", ringkas: "Siapkan lead magnet dan riset dulu. Hasilnya jadi bahan untuk semua cabang konten." },
  { id: "video-pendek", judul: "Cabang video pendek", ringkas: "Dari ide topik sampai rencana visual untuk Reels, TikTok, dan Shorts." },
  { id: "utas-threads", judul: "Cabang utas Threads", ringkas: "Dari ide utas, tulisan utas, sampai komentar di utas orang lain." },
  { id: "konversi", judul: "Cabang konversi", ringkas: "Ubah lead jadi pembeli lewat WhatsApp, lalu pancing testimoni dari pembeli." },
];

export const TOOLS = [
  {
    slug: "lead-magnet",
    cabang: "fondasi",
    judul: "Lead magnet: konsep dan draf",
    ringkas: "Minta AI mencarikan 5 ide lead magnet, pilih satu, lalu bangun drafnya per bagian.",
    siap: true,
    bagian: [
      {
        legenda: "Konteks",
        kolom: [
          { id: "produk", jenis: "text", label: "Produk (wajib)", placeholder: "cth Sepatu Kulit Lokal" },
          { id: "harga", jenis: "text", label: "Harga Produk (wajib)", placeholder: "cth Rp 299.000" },
          {
            id: "deskripsi",
            jenis: "textarea",
            label: "Deskripsi (wajib)",
            bantuan: "Jenis produk, target audiens, dan masalah yang diselesaikan.",
            placeholder: "cth Sepatu kulit buatan tangan untuk pekerja kantoran yang butuh sepatu kokoh tapi nyaman dipakai setiap hari",
          },
        ],
      },
      {
        legenda: "Bahan draf",
        kolom: [
          { id: "b-judul", jenis: "text", label: "Judul lead magnet (wajib untuk prompt draf)", bantuan: "Judul pilihan kamu dari 5 ide di hasil Prompt Konsep.", placeholder: "cth 7 Hari Lancar BAB Tanpa Begah" },
          { id: "b-struktur", jenis: "textarea", label: "Struktur kerangka (wajib untuk prompt draf)", bantuan: "Tempel isi blok Struktur Kerangka dari ide terpilih di hasil Prompt Konsep, urut dari bagian pertama sampai terakhir." },
        ],
      },
    ],
    keluaran: [
      { id: "konsep", tombol: "Salin prompt konsep", wajib: ["produk", "harga", "deskripsi"], kosong: "Isi produk, harga, dan deskripsi dulu. Prompt akan muncul di sini." },
      { id: "bangun", tombol: "Salin prompt draf", wajib: ["produk", "b-judul", "b-struktur"], kosong: "Tempel judul dan struktur kerangka dari ide terpilih di Prompt Konsep dulu. Prompt akan muncul di sini." },
    ],
  },
  {
    slug: "riset",
    cabang: "fondasi",
    kosongkan: true,
    judul: "Riset audiens dan strategi funnel",
    ringkas: "Kenali calon pembeli, lalu susun arah konten TOFU, MOFU, dan BOFU.",
    siap: true,
    bagian: [
      {
        legenda: "Input",
        kolom: [
          { id: "produk", nama: "produk", jenis: "text", label: "Produk atau jasa (wajib)", placeholder: "cth Sepatu Kulit Lokal" },
          { id: "deskripsi", nama: "deskripsi", jenis: "textarea", label: "Deskripsi dan nilai jual (wajib)", placeholder: "Bahan, keunggulan, harga, target pembeli..." },
          { id: "asetSuara", nama: "aset suara", jenis: "text", label: "Aset Suara (wajib)", placeholder: "Suara Kreator Laki-Laki" },
          {
            id: "leadMagnet",
            jenis: "textarea",
            label: "Lead magnet yang sudah jadi (Opsional)",
            bantuan: "Tempel judul/isi singkat lead magnet final jika ada. Jika kosong, BOFU akan menjual/menawarkan produk secara langsung, dan bio akun mengajak klik link produk.",
            placeholder: "cth\nPanduan perawatan sepatu kulit\nChecklist padanan ukuran",
          },
        ],
      },
    ],
    centang: [
      { id: "tugasB", label: "Sertakan Tugas B", bantuan: "Deskripsi Level 3: 17 sudut manfaat + peta fase kehidupan", bawaan: true },
    ],
    keluaran: [{ id: "utama", tombol: "Salin prompt", wajib: ["produk", "deskripsi", "asetSuara"] }],
  },
  {
    slug: "topik-video-pendek",
    cabang: "video-pendek",
    judul: "Topik video pendek",
    ringkas: "Rencana 2 hari, 2 ide per hari: hari ganjil 1 TOFU dan 1 MOFU, hari genap 1 TOFU dan 1 BOFU.",
    siap: true,
    bagian: [
      {
        legenda: "Konteks",
        kolom: [
          { id: "produk", jenis: "text", label: "Produk (wajib)", placeholder: "cth Kapsul Barusen Hills Tanpa Begah" },
          { id: "riset", jenis: "textarea", label: "Audiens + strategi (wajib)", placeholder: "Tempel audiens, masalah utama, dan strategi T/M/B" },
          { id: "ground", jenis: "textarea", label: "Hasil riset", bantuan: "Opsional. Ketik manual, dipakai apa adanya." },
        ],
      },
      {
        legenda: "Lead magnet",
        kolom: [
          {
            id: "lm",
            jenis: "text",
            label: "Lead magnet terpilih",
            bantuan: "Opsional. Jika dikosongkan, BOFU menjual produk langsung tanpa lead magnet dan semua kode ide diberi akhiran JL (cth VH2T1JL).",
            placeholder: "cth Checklist 7 Hari Lancar BAB Tanpa Begah",
          },
        ],
      },
      {
        legenda: "Rencana 2 hari",
        kolom: [
          {
            id: "infoRencana",
            jenis: "info",
            label: "Komposisi tetap: 2 ide/hari, VH1 sampai VH2 (total 4 ide)",
            bantuan: "Hari ganjil: 1 TOFU + 1 MOFU (VH{d}T1, VH{d}M1). Hari genap: 1 TOFU + 1 BOFU (VH{d}T1, VH{d}B1). Kode VH1T1 = Video Hari 1 Tofu 1 (T=Tofu, M=Mofu, B=Bofu). Lead magnet kosong = semua kode berakhiran JL (cth VH2T1JL). Bila riwayat chat sudah ada VH2, lanjut otomatis VH3 sampai VH4, dan seterusnya per 2 hari.",
          },
        ],
      },
    ],
    isiCepat: {
      tombol: "Sesuai riset sebelumnya",
      nilai: "Sesuai hasil chat kita pertama kali",
      kolom: ["produk", "riset", "ground"],
      pesan: "Terisi dari riset sebelumnya",
    },
    keluaran: [
      {
        id: "utama",
        tombol: "Salin prompt",
        wajib: ["produk", "riset"],
        kosong: "Isi produk dan audiens + strategi dulu. Prompt akan muncul di sini.",
        catatan: { kolom: "lm", terisi: "Mode lead magnet", kosong: "Mode jual langsung" },
      },
    ],
  },
  {
    slug: "caption-video-pendek",
    cabang: "video-pendek",
    judul: "Caption video pendek",
    ringkas: "Caption untuk TikTok, Reels, Threads, dan YouTube Shorts, dengan hashtag dari riset angka asli tiap platform.",
    siap: true,
    bagian: [
      {
        legenda: "Topik",
        kolom: [
          { id: "judul", jenis: "text", label: "Judul topik", placeholder: "Judul ide" },
          { id: "funnel", jenis: "select", label: "Mode funnel / CTA", opsi: FUNNEL },
        ],
      },
      { legenda: "Gaya dan CTA", kolom: KOLOM_GAYA_CTA },
    ],
    keluaran: [{ id: "utama", tombol: "Salin prompt", wajib: ["judul"], kosong: "Isi judul topik dulu. Prompt akan muncul di sini." }],
  },
  {
    slug: "naskah-video-pendek",
    cabang: "video-pendek",
    judul: "Naskah video pendek",
    ringkas: "Naskah format H-F-B-E siap take. Buat caption-nya dulu, karena naskah mengambil frasa fokus dari caption terbaru.",
    siap: true,
    bagian: [
      {
        legenda: "Topik",
        kolom: [
          { id: "judul", nama: "judul topik", jenis: "text", label: "Judul topik (wajib)" },
          { id: "alasan", nama: "Alasan + Bukti", jenis: "textarea", label: "Alasan + Bukti (wajib)" },
          { id: "funnel", jenis: "select", label: "Funnel", setengah: true, opsi: FUNNEL },
        ],
      },
      { legenda: "Gaya dan CTA", kolom: KOLOM_GAYA_CTA },
    ],
    keluaran: [{ id: "utama", tombol: "Salin prompt", wajib: ["judul", "alasan"] }],
  },
  {
    slug: "visual-planner-video-pendek",
    cabang: "video-pendek",
    judul: "Visual planner video pendek",
    ringkas: "Tempel naskah, pilih level. Naskah dipotong jadi klip, tiap klip dapat rencana visual, lalu ditutup konsep cover.",
    siap: true,
    bagian: [
      {
        legenda: "Bahan",
        kolom: [{ id: "naskah", jenis: "textarea", label: "Naskah (wajib)", placeholder: "Tempel naskah mentah, belum dipotong" }],
      },
      {
        legenda: "Level",
        kolom: [
          {
            id: "level",
            jenis: "pilihan",
            label: "Level",
            opsi: [
              { nilai: "VO", teks: "VO (tanpa wajah)" },
              { nilai: "TalkingHead", teks: "Berbicara di depan kamera (TalkingHead)" },
            ],
            bawaan: "VO",
          },
        ],
      },
    ],
    keluaran: [{ id: "utama", tombol: "Salin prompt", wajib: ["naskah"], kosong: "Isi naskah dulu. Prompt akan muncul di sini." }],
  },
  {
    slug: "topik-utas-threads",
    cabang: "utas-threads",
    judul: "Ide utas Threads: 30 hari funnel",
    ringkas: "Khusus ide utas tulisan, bukan video. 30 hari, 10 ide per hari: hari ganjil 5 TOFU, 3 MOFU, 2 BOFU; hari genap 5 TOFU, 4 MOFU, 1 BOFU.",
    siap: true,
    bagian: [
      {
        legenda: "Konteks",
        kolom: [
          { id: "produk", jenis: "text", label: "Produk (wajib)" },
          { id: "riset", jenis: "textarea", label: "Audiens + strategi (wajib)", placeholder: "Tempel audiens, masalah utama, dan strategi T/M/B" },
          { id: "ground", jenis: "textarea", label: "Hasil riset", bantuan: "Opsional. Ketik manual, dipakai apa adanya." },
        ],
      },
      {
        legenda: "Lead magnet",
        kolom: [
          {
            id: "lm",
            jenis: "text",
            label: "Lead magnet terpilih",
            bantuan: "Opsional. Jika dikosongkan, BOFU menjual produk langsung tanpa lead magnet dan semua kode ide diberi akhiran JL (cth UH2T2JL).",
            placeholder: "cth Checklist 7 Hari Lancar BAB Tanpa Begah",
          },
        ],
      },
    ],
    isiCepat: {
      tombol: "Sesuai riset sebelumnya",
      nilai: "Sesuai hasil chat kita pertama kali",
      kolom: ["produk", "riset", "ground"],
      pesan: "Terisi dari riset sebelumnya",
    },
    keluaran: [
      {
        id: "utama",
        tombol: "Salin prompt",
        wajib: ["produk", "riset"],
        kosong: "Isi produk dan audiens + strategi dulu. Prompt akan muncul di sini.",
        catatan: { kolom: "lm", terisi: "Mode lead magnet", kosong: "Mode jual langsung" },
      },
    ],
  },
  {
    slug: "utas-threads",
    cabang: "utas-threads",
    judul: "Utas Threads",
    ringkas: "Utas atau post tunggal dengan formula PASTOR. Pilih jumlah, peran penulisan, dan ajakan.",
    siap: true,
    bagian: [
      {
        legenda: "Topik",
        kolom: [
          { id: "judul", jenis: "text", label: "Topik pilihan (wajib)", placeholder: "Judul ide" },
          { id: "alasan", nama: "Alasan + Bukti", jenis: "textarea", label: "Alasan + Bukti (wajib)" },
          { id: "funnel", jenis: "select", label: "Funnel", opsi: FUNNEL },
        ],
      },
      {
        legenda: "Gaya dan ajakan",
        kolom: [
          {
            id: "jumlah",
            jenis: "select",
            label: "Jumlah utas",
            opsi: [
              { nilai: "1", teks: "1 post" },
              { nilai: "3-5", teks: "3-5 utas" },
              { nilai: "7-9", teks: "7-9 utas" },
            ],
            bawaan: "1",
          },
          { id: "peran", jenis: "select", label: "Peran penulisan (role playing)", opsi: PERAN },
          {
            id: "ajakan",
            jenis: "select",
            label: "Pilihan ajakan",
            opsi: [
              { nilai: "wa", teks: "Gabung Grup WA (PDF dikirim di grup)" },
              { nilai: "komentar", teks: "Interaksi & Diskusi (ajakan implisit)" },
              { nilai: "ikuti", teks: "Ikuti / Follow" },
              { nilai: "bio", teks: "Klik Link di Bio" },
              { nilai: "pdfbio", teks: "Dapatkan PDF lead magnet, klik link di bio" },
              { nilai: "custom", teks: "Isi Sendiri" },
            ],
            bawaan: "komentar",
          },
          { id: "ajakanCustom", jenis: "text", isiSendiri: true, label: "Ajakan custom", bantuan: "Dipakai jika memilih Isi Sendiri.", bawaan: "Klik link ini, isi nama dan nomor WA" },
        ],
      },
    ],
    keluaran: [{ id: "utama", tombol: "Salin prompt", wajib: ["judul", "alasan"] }],
  },
  {
    slug: "komen-threads",
    cabang: "utas-threads",
    judul: "Komen ide utas Threads",
    ringkas: "Komentar untuk utas Threads orang lain, sesuai knowledge awal chat dan peran yang dipilih.",
    siap: true,
    bagian: [
      {
        legenda: "Utas dan riset",
        kolom: [
          { id: "utasTarget", jenis: "textarea", label: "Utas target (wajib)", placeholder: "Tulis topik atau ide utas Threads yang akan dikomentari" },
        ],
      },
      {
        legenda: "Peran",
        kolom: [{ id: "peran", jenis: "select", label: "Pilih peran", opsi: PERAN }],
      },
    ],
    keluaran: [{ id: "utama", tombol: "Salin prompt", wajib: ["utasTarget"] }],
  },
  {
    slug: "pesan-pemicu-testimoni",
    cabang: "konversi",
    judul: "Pesan pemicu testimoni",
    ringkas: "Pesan terima kasih pasca-pembelian yang memancing testimoni natural dan jujur. Kolom kosong tampil sebagai [placeholder] agar mudah dilengkapi.",
    siap: true,
    simpan: "prompt-testimoni-v1",
    unduh: "prompt-testimoni.txt",
    kosongkan: true,
    peringatan: {
      kolom: "jenis",
      nilai: ["kosmetik", "suplemen", "alat kesehatan", "sensitif-pribadi"],
      teks: 'Jenis produk "{nilai}" termasuk teratur. Aturan tambahan anti-klaim khasiat otomatis dimasukkan ke prompt.',
    },
    bagian: [
      {
        legenda: "Data input",
        kolom: [
          { id: "toko", jenis: "text", label: "Nama toko", setengah: true, placeholder: "mis. Toko Sehat Jaya" },
          { id: "produk", jenis: "text", label: "Nama produk / kategori", setengah: true, placeholder: "mis. spray pembersih pria" },
          {
            id: "jenis",
            jenis: "select",
            label: "Jenis produk",
            setengah: true,
            opsi: [
              { nilai: "biasa", teks: "Biasa" },
              { nilai: "makanan-minuman", teks: "Makanan / minuman" },
              { nilai: "kosmetik", teks: "Kosmetik" },
              { nilai: "suplemen", teks: "Suplemen" },
              { nilai: "alat kesehatan", teks: "Alat kesehatan" },
              { nilai: "sensitif-pribadi", teks: "Sensitif / pribadi" },
            ],
          },
          { id: "pembeli", jenis: "text", label: "Nama pembeli (opsional)", setengah: true, placeholder: "mis. Andi" },
          {
            id: "status",
            jenis: "select",
            label: "Status pesanan saat pesan dikirim",
            setengah: true,
            opsi: pilihanTeks(["baru dibayar", "sudah dikirim", "sudah sampai", "sudah beberapa hari dipakai"]),
            bawaan: "sudah sampai",
          },
          { id: "gaya", jenis: "select", label: "Gaya bahasa", setengah: true, opsi: pilihanTeks(["santai", "ramah", "sopan", "formal"]), bawaan: "ramah" },
          { id: "panggilan", jenis: "select", label: "Panggilan ke pembeli", setengah: true, opsi: pilihanTeks(["kak", "bang", "mas", "mbak", "pak", "bu"]) },
          { id: "media", jenis: "select", label: "Media", setengah: true, opsi: pilihanTeks(["WhatsApp", "DM Instagram", "DM TikTok", "chat marketplace"]) },
          {
            id: "topik",
            jenis: "centang-grup",
            label: "Hal yang ingin diketahui toko",
            opsi: [
              { nilai: "kesan pertama saat paket sampai", teks: "Kesan pertama" },
              { nilai: "kemasan", teks: "Kemasan" },
              { nilai: "pengiriman", teks: "Pengiriman" },
              { nilai: "kemudahan pakai", teks: "Kemudahan pakai" },
              { nilai: "kenyamanan", teks: "Kenyamanan" },
              { nilai: "kecocokan dengan kebutuhan", teks: "Kecocokan" },
              { nilai: "layanan admin", teks: "Layanan admin" },
              { nilai: "kepuasan umum", teks: "Kepuasan umum" },
            ],
            bawaan: ["kesan pertama saat paket sampai", "kemasan", "pengiriman"],
          },
          { id: "jumlah", jenis: "angka", label: "Jumlah variasi pesan", setengah: true, min: 1, max: 10, bawaan: "5" },
          { id: "maxk", jenis: "angka", label: "Maks. kalimat per pesan", setengah: true, min: 1, max: 6, bawaan: "3" },
          { id: "catatan", jenis: "textarea", label: "Catatan tambahan (opsional)", placeholder: "mis. toko kami kirim paket polos; admin bernama Sari" },
        ],
      },
    ],
    keluaran: [{ id: "utama", tombol: "Salin prompt", wajib: [] }],
  },
  {
    slug: "whatsapp-series",
    cabang: "konversi",
    judul: "WhatsApp series",
    ringkas: "Template follow-up WhatsApp yang dikirim manual untuk lead dari lead magnet. Kolom kosong tampil sebagai [isi ...] agar mudah dilengkapi.",
    siap: true,
    simpan: "wa-series-prompt-v1",
    unduh: "prompt-wa-series.txt",
    kosongkan: true,
    alur: {
      kolom: "perlakuan",
      langkah: {
        aktif: ["Lead isi form", "Worker → bot Telegram", "Notifikasi ke chat_id", "Anda kirim WhatsApp manual"],
        pasif: ["Lead chat WhatsApp duluan", "Anda balas & tanya nama", "Kirim freebie", "Lanjut series manual"],
      },
      gantiPertama: {
        syarat: [{ kolom: "perlakuan", nilai: "pasif" }, { kolom: "trigger", nilai: true }],
        teks: "Lead kirim pesan trigger minta freebie",
      },
    },
    isiCepat: {
      tombol: "Isi contoh",
      pesan: "Contoh terisi",
      isi: {
        nama: "Rina dari Studio Kata",
        niche: "kursus copywriting online",
        audiens: "Pemilik UMKM yang bingung membuat caption Instagram yang menarik pembeli",
        freebie: "Ebook 10 Template Caption IG (PDF)",
        manfaat: "Bisa menulis caption jualan dalam 5 menit tanpa buntu ide",
        produk: "Kelas Caption Master, Rp299.000",
        urgensi: "Diskon 20% untuk 10 pendaftar pertama",
        testi: "Dewi, pemilik toko hijab, mengaku lebih mudah membuat konten setelah ikut kelas",
        keberatan: "Harga, waktu belajar, ragu hasilnya",
        kata: "CAPTION",
      },
    },
    bagian: [
      {
        legenda: "Bisnis Anda",
        kolom: [
          { id: "nama", jenis: "text", label: "Nama / brand", setengah: true, placeholder: "Contoh: Rina dari Studio Kata" },
          { id: "niche", jenis: "text", label: "Niche / bisnis", setengah: true, placeholder: "Contoh: kursus copywriting online" },
          { id: "audiens", jenis: "textarea", label: "Target audiens dan masalah utamanya", placeholder: "Contoh: pemilik UMKM yang bingung membuat caption Instagram" },
        ],
      },
      {
        legenda: "Freebie dan penawaran",
        kolom: [
          { id: "freebie", jenis: "text", label: "Freebie yang diunduh", bantuan: "Judul dan format", placeholder: "Ebook 10 Template Caption IG (PDF)" },
          { id: "manfaat", jenis: "textarea", label: "Manfaat utama freebie", placeholder: "Contoh: bisa membuat caption dalam 5 menit" },
          { id: "produk", jenis: "text", label: "Produk / penawaran lanjutan", placeholder: "Kelas Caption Master, Rp299.000" },
          {
            id: "jenis",
            jenis: "select",
            label: "Jenis produk",
            setengah: true,
            opsi: [
              { nilai: "fisik", teks: "Produk fisik" },
              { nilai: "digital", teks: "Produk digital" },
            ],
          },
          { id: "urgensi", jenis: "text", label: "Bonus / urgensi nyata", setengah: true, bantuan: "Kosongkan bila tidak ada", placeholder: "Diskon 20% sampai 30 November" },
        ],
      },
      {
        legenda: "Gaya komunikasi",
        kolom: [
          { id: "gaya", jenis: "select", label: "Gaya bahasa", setengah: true, opsi: pilihanTeks(["santai-sopan", "semi-formal", "formal"]) },
          { id: "sapaan", jenis: "select", label: "Sapaan", setengah: true, opsi: pilihanTeks(["Kak", "Bapak/Ibu", "nama saja", "Mas/Mbak"]) },
          { id: "testi", jenis: "textarea", label: "Testimoni / bukti sosial", bantuan: "Opsional, hanya yang benar-benar ada", placeholder: "Contoh: 120 peserta, rata-rata engagement naik 2x" },
          { id: "keberatan", jenis: "text", label: "Keberatan umum calon pembeli", placeholder: "Harga, waktu, ragu hasilnya" },
        ],
      },
      {
        legenda: "Struktur series",
        kolom: [
          {
            id: "perlakuan",
            jenis: "select",
            label: "Perlakuan",
            opsi: [
              { nilai: "aktif", teks: "Nama dan Data Sudah Disimpan dulu lalu otomatis aktif mengirim pesan duluan" },
              { nilai: "pasif", teks: "Nama belum diketahui pasif menerima pesan dari lead manual kemudian baru kirim pesan balasan" },
            ],
          },
          {
            id: "trigger",
            jenis: "checkbox",
            label: "Pakai lead magnet (sertakan contoh pesan trigger untuk memintanya)",
            bawaan: true,
            tampilJika: [{ kolom: "perlakuan", nilai: "pasif" }],
          },
          {
            id: "kata",
            jenis: "text",
            label: "Kata kunci trigger",
            bantuan: "Opsional, kata yang diketik lead agar Anda tahu ia datang dari lead magnet",
            placeholder: "Contoh: CAPTION",
            tampilJika: [{ kolom: "perlakuan", nilai: "pasif" }, { kolom: "trigger", nilai: true }],
          },
          {
            id: "jumlah",
            jenis: "select",
            label: "Jumlah pesan",
            opsi: [
              { nilai: "3", teks: "3 pesan (ringkas, 5 hari)" },
              { nilai: "5", teks: "5 pesan (standar, 7 hari)" },
              { nilai: "7", teks: "7 pesan (panjang, 14 hari)" },
            ],
            bawaan: "5",
          },
          { id: "ab", jenis: "checkbox", label: "Variasi A dan B untuk tiap pesan", bawaan: true },
          { id: "qr", jenis: "checkbox", label: "Balasan cepat untuk 2–3 respons lead", bawaan: true },
          { id: "cabang", jenis: "checkbox", label: "Template percabangan (tertarik, menunda, tidak membalas)", bawaan: true },
          { id: "ops", jenis: "checkbox", label: "Tips operasional manual (Telegram → WhatsApp)", bawaan: true },
        ],
      },
    ],
    keluaran: [{ id: "utama", tombol: "Salin prompt", wajib: [] }],
  },
];

// Apakah semua syarat tampilJika terpenuhi oleh nilai form saat ini.
export function syaratTerpenuhi(syarat, nilai) {
  return (syarat || []).every((x) => nilai[x.kolom] === x.nilai);
}

// Kolom yang disimpan di browser untuk sebuah tool.
const JENIS_PILIHAN = ["select", "pilihan", "checkbox", "centang-grup"];
export function kolomDisimpan(tool) {
  const semua = semuaKolom(tool);
  return tool.simpan ? semua : semua.filter((k) => JENIS_PILIHAN.includes(k.jenis) || k.isiSendiri);
}

export function kunciSimpan(tool) {
  return tool.simpan || `zenka-${tool.slug}-pilihan`;
}

export function cariCabang(id) {
  return CABANG.find((c) => c.id === id);
}

export function cariTool(slug) {
  return TOOLS.find((t) => t.slug === slug);
}

// Semua kolom yang punya nilai (tanpa "info"), termasuk kotak centang.
export function semuaKolom(tool) {
  const kolom = (tool.bagian || []).flatMap((b) => b.kolom).filter((k) => k.jenis !== "info");
  const centang = (tool.centang || []).map((k) => ({ ...k, jenis: "checkbox" }));
  return [...kolom, ...centang];
}

export function nilaiAwal(tool) {
  const awal = {};
  for (const k of semuaKolom(tool)) {
    if (k.jenis === "checkbox") awal[k.id] = Boolean(k.bawaan);
    else if (k.jenis === "select" || k.jenis === "pilihan") awal[k.id] = k.bawaan ?? k.opsi[0].nilai;
    else if (k.jenis === "centang-grup") awal[k.id] = [...(k.bawaan || [])];
    else awal[k.id] = k.bawaan ?? "";
  }
  return awal;
}

// Nama pendek kolom untuk pesan "Isi ... dulu".
export function namaKolom(tool, id) {
  const k = semuaKolom(tool).find((x) => x.id === id);
  return k?.nama || k?.label.replace(/\s*\(.*\)\s*$/, "").toLowerCase() || id;
}
