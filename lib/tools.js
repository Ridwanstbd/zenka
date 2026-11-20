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
//   "info"               keterangan saja, tanpa isian; dengan poin: [...] tampil sebagai
//                        kotak panduan menonjol (label = judul, bantuan = teks pembuka)
// tampilJika: [{ kolom, nilai }] menyembunyikan kolom sampai semua syarat terpenuhi.
// "sorotan" = kotak peringatan menonjol di atas form; boleh juga memakai tampilJika.
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
  { id: "durasi", jenis: "select", label: "Durasi", setengah: true, opsi: pilihanTeks(["30 Detik", "60 Detik", "90 Detik"]), bawaan: "60 Detik" },
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
      { nilai: "dm", teks: "Pesan atau tanya dulu, DM aja ya!" },
      { nilai: "custom", teks: "Isi Sendiri" },
    ],
    bawaan: "dm",
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
  { id: "fondasi", judul: "Mulai dari sini", ringkas: "Siapkan riset dulu. Hasilnya jadi bahan untuk semua cabang konten." },
  { id: "video-pendek", judul: "Cabang video pendek", ringkas: "Dari ide topik sampai rencana visual untuk Reels, TikTok, dan Shorts." },
  { id: "karakter-ai", judul: "Cabang karakter AI", ringkas: "Bangun wajah karakter dan tampilan produk yang tetap untuk AI influencer, lalu pakai ulang di semua konten." },
  { id: "utas-threads", judul: "Cabang utas Threads", ringkas: "Dari ide utas, tulisan utas, sampai komentar di utas orang lain." },
  { id: "konversi", judul: "Cabang konversi", ringkas: "Ubah lead jadi pembeli lewat WhatsApp, lalu pancing testimoni dari pembeli." },
];

export const TOOLS = [
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
        ],
      },
    ],
    centang: [
      { id: "tugasB", label: "Sertakan Tugas B", bantuan: "Deskripsi Level 3: 17 sudut manfaat + peta fase kehidupan", bawaan: true },
    ],
    keluaran: [{ id: "utama", tombol: "Salin prompt", wajib: ["produk", "deskripsi", "asetSuara"] }],
  },
  {
    slug: "whatsapp-series",
    cabang: "fondasi",
    judul: "WhatsApp series",
    ringkas: "Template follow-up WhatsApp yang dikirim manual untuk calon konsumen yang sudah teredukasi produk. Kolom kosong tampil sebagai [isi ...] agar mudah dilengkapi.",
    siap: true,
    simpan: "wa-series-prompt-v1",
    unduh: "prompt-wa-series.txt",
    kosongkan: true,
    alur: {
      kolom: "perlakuan",
      langkah: {
        aktif: ["Calon konsumen isi form", "Worker → bot Telegram", "Notifikasi ke chat_id", "Anda kirim WhatsApp manual"],
        pasif: ["Calon konsumen chat WhatsApp duluan", "Anda balas & tanya nama", "Gali kebutuhannya", "Lanjut series manual"],
      },
      gantiPertama: {
        syarat: [{ kolom: "perlakuan", nilai: "pasif" }, { kolom: "trigger", nilai: true }],
        teks: "Calon konsumen kirim pesan trigger tanya produk",
      },
    },
    isiCepat: {
      tombol: "Isi contoh",
      pesan: "Contoh terisi",
      isi: {
        nama: "Rina dari Studio Kata",
        niche: "kursus copywriting online",
        audiens: "Pemilik UMKM yang bingung membuat caption Instagram yang menarik pembeli",
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
        legenda: "Penawaran",
        kolom: [
          { id: "produk", jenis: "text", label: "Produk / penawaran", placeholder: "Kelas Caption Master, Rp299.000" },
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
              { nilai: "pasif", teks: "Nama belum diketahui pasif menerima pesan dari calon konsumen manual kemudian baru kirim pesan balasan" },
            ],
          },
          {
            id: "trigger",
            jenis: "checkbox",
            label: "Sertakan contoh pesan trigger (calon konsumen bertanya soal produk)",
            bawaan: true,
            tampilJika: [{ kolom: "perlakuan", nilai: "pasif" }],
          },
          {
            id: "kata",
            jenis: "text",
            label: "Kata kunci trigger",
            bantuan: "Opsional, kata yang diketik calon konsumen agar Anda tahu ia datang dari konten",
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
          { id: "qr", jenis: "checkbox", label: "Balasan cepat untuk 2–3 respons calon konsumen", bawaan: true },
          { id: "cabang", jenis: "checkbox", label: "Template percabangan (tertarik, menunda, tidak membalas)", bawaan: true },
          { id: "ops", jenis: "checkbox", label: "Tips operasional manual (Telegram → WhatsApp)", bawaan: true },
        ],
      },
    ],
    keluaran: [{ id: "utama", tombol: "Salin prompt", wajib: [] }],
  }
  ,
  {
    slug: "topik-video-pendek",
    cabang: "video-pendek",
    judul: "Topik video pendek",
    ringkas: "Rencana 2 hari, 4 ide per hari (tiap 5 hari pas 50% TOFU, 35% MOFU, 15% BOFU): VH berakhiran 1/3/5/6/8/0 = 2 TOFU, 1 MOFU, 1 BOFU; VH berakhiran 2/4/7/9 = 2 TOFU, 2 MOFU.",
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
        legenda: "Rencana 2 hari",
        kolom: [
          {
            id: "infoRencana",
            jenis: "info",
            label: "Komposisi tetap: 4 ide/hari, VH1 sampai VH2 (total 8 ide; tiap 5 hari pas 20 ide: 10 TOFU, 7 MOFU, 3 BOFU)",
            bantuan: "VH berakhiran 1, 3, 5, 6, 8, 0: 2 TOFU + 1 MOFU + 1 BOFU (VH{d}T1-T2, M1, B1). VH berakhiran 2, 4, 7, 9: 2 TOFU + 2 MOFU, tanpa BOFU (VH{d}T1-T2, M1-M2). Kode VH1T1 = Video Hari 1 Tofu 1 (T=Tofu, M=Mofu, B=Bofu). BOFU selalu menjual produk langsung. Bila riwayat chat sudah ada VH2, lanjut otomatis VH3 sampai VH4, dan seterusnya per 2 hari.",
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
    ringkas: "Naskah format H-F-B-E siap take, plus potongan bertimestamp untuk visual planner. Buat caption-nya dulu, karena naskah mengambil frasa fokus dari caption terbaru.",
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
    ringkas: "Tempel potongan naskah bertimestamp dari hasil naskah, pilih level. Tiap potongan jadi 1 klip dengan rencana visual, lalu ditutup konsep cover. Level TalkingHead juga menghasilkan bahan siap tempel untuk Influencer video builder.",
    siap: true,
    bagian: [
      {
        legenda: "Bahan",
        kolom: [
          {
            id: "naskah",
            jenis: "textarea",
            label: "Potongan naskah (wajib)",
            bantuan: "Salin isi code block POTONGAN NASKAH dari hasil prompt Naskah video pendek. Tiap baris adalah 1 klip tepat 8 detik (total 32/64/96 detik sesuai durasi).",
            placeholder: "00:00-00:08 Kamu pernah sadar nggak, ...\n00:08-00:16 ...",
          },
        ],
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
              { nilai: "TalkingHead", teks: "TalkingHead: karakter AI berbicara di depan kamera, lanjut ke Influencer video builder" },
            ],
            bawaan: "VO",
          },
        ],
      },
    ],
    keluaran: [{ id: "utama", tombol: "Salin prompt", wajib: ["naskah"], kosong: "Isi potongan naskah dulu. Prompt akan muncul di sini." }],
  },
  {
    slug: "base-character",
    cabang: "karakter-ai",
    judul: "Base character AI influencer",
    ringkas: "Prompt character sheet hiper-realistis 9 sudut pandang (5 seluruh badan: depan, 3/4, samping kiri, samping kanan, belakang; 4 close-up wajah) dari gambar referensi, supaya wajah karakter tetap sama di semua konten.",
    siap: true,
    sorotan: [
      {
        judul: "Wajib lampirkan gambar referensi",
        teks: "Saat menempel prompt ini ke ChatGPT, Gemini, atau Claude, lampirkan juga 1 foto referensi wajah atau gaya, misalnya dari Pinterest atau media sosial. Tanpa gambar, AI tidak akan menyusun prompt dan hanya meminta Anda melampirkannya.",
        poin: [
          "Pilih foto yang jelas: wajah menghadap kamera, cahaya terang, tanpa filter, resolusi tinggi.",
          "Memakai foto orang lain? Pilih Inspirasi supaya karakter Anda orisinal, bukan kembaran orang di foto.",
        ],
      },
    ],
    bagian: [
      {
        legenda: "Karakter",
        kolom: [
          {
            id: "deskripsi",
            nama: "deskripsi karakter",
            jenis: "textarea",
            label: "Deskripsi karakter (wajib)",
            bantuan: "Tulis singkat karakteristik yang Anda inginkan: jenis kelamin, usia, etnis, gaya, ekspresi.",
            placeholder: "cth pria muda Indonesia 25 tahun, gaya rapi, ekspresi ramah",
          },
          {
            id: "referensi",
            jenis: "pilihan",
            label: "Pemakaian gambar referensi",
            opsi: [
              { nilai: "inspirasi", teks: "Inspirasi: karakter fiksi baru yang mengambil gaya dari referensi" },
              { nilai: "sendiri", teks: "Wajah sendiri atau sudah ada izin: tiru wajah referensi semirip mungkin" },
            ],
            bawaan: "inspirasi",
          },
        ],
      },
    ],
    keluaran: [{ id: "utama", tombol: "Salin prompt", wajib: ["deskripsi"], kosong: "Isi deskripsi karakter dulu. Prompt akan muncul di sini." }],
  },
  {
    slug: "base-product",
    cabang: "karakter-ai",
    judul: "Base product",
    ringkas: "Prompt product sheet hiper-realistis 9 panel dari foto produk asli (tampak depan, 3/4, samping, belakang, atas, kondisi terbuka, dipegang, cara pakai, close-up isi), supaya produk tetap sama saat dipegang dan didemokan karakter.",
    siap: true,
    sorotan: [
      {
        judul: "Wajib lampirkan foto produk asli",
        teks: "Saat menempel prompt ini ke ChatGPT, Gemini, atau Claude, lampirkan 2-5 foto produk asli dari beberapa sisi. Tanpa foto, AI tidak akan menyusun prompt dan hanya meminta Anda melampirkannya.",
        poin: [
          "Minimal tampak depan dengan label terbaca. Tambahkan samping, belakang, kondisi tutup terbuka, dan isinya (kapsul, cairan, krim) kalau ada.",
          "Foto di tempat terang dengan latar polos, tanpa filter, label tidak silau atau terpotong.",
          "Saat membuat gambarnya di generator gambar, lampirkan lagi foto produk yang sama bersama PROMPT UTAMA supaya label dan warnanya tetap sesuai.",
          "Tulisan kecil di label (komposisi, aturan pakai) biasanya tidak terbaca rapi di hasil AI. Itu wajar: yang dijaga adalah bentuk, warna, logo, dan nama produk.",
        ],
      },
    ],
    bagian: [
      {
        legenda: "Produk",
        kolom: [
          {
            id: "jenis",
            jenis: "select",
            label: "Jenis produk",
            bantuan: "Menentukan isi panel kondisi terbuka, cara pakai, dan close-up isi.",
            opsi: [
              { nilai: "spray", teks: "Spray / semprot" },
              { nilai: "kapsul-botol", teks: "Kapsul / tablet dalam botol" },
              { nilai: "kapsul-strip", teks: "Kapsul / tablet dalam strip atau blister (dengan dus)" },
              { nilai: "cairan", teks: "Cairan dalam botol (sirup, minuman, madu, herbal cair)" },
              { nilai: "tetes", teks: "Tetes / serum dengan pipet" },
              { nilai: "tube", teks: "Krim / gel / salep dalam tube" },
              { nilai: "pot", teks: "Krim / balm dalam pot atau jar" },
              { nilai: "pump", teks: "Lotion / sabun dengan pump" },
              { nilai: "bubuk", teks: "Bubuk / serbuk dalam sachet atau pouch" },
              { nilai: "roll-on", teks: "Roll-on / minyak oles" },
              { nilai: "lainnya", teks: "Lainnya (jelaskan di catatan)" },
            ],
            bawaan: "kapsul-botol",
          },
          {
            id: "nama",
            jenis: "text",
            label: "Nama produk & merek",
            setengah: true,
            bantuan: "Opsional. Membantu AI membaca label dengan benar.",
            placeholder: "cth Zenka Herbal",
          },
          {
            id: "ukuran",
            jenis: "text",
            label: "Ukuran asli",
            setengah: true,
            bantuan: "Opsional, tapi penting supaya ukuran produk di tangan pas.",
            placeholder: "cth tinggi 12 cm, 60 ml",
          },
          {
            id: "isi",
            jenis: "text",
            label: "Isi / tekstur produk",
            bantuan: "Tampil di panel cara pakai dan close-up isi. Isi kalau isinya tidak terlihat di foto.",
            placeholder: "cth kapsul hijau tua ukuran 0, isi 60",
          },
          {
            id: "catatan",
            jenis: "textarea",
            label: "Catatan tambahan (opsional)",
            bantuan: "Detail yang tidak terlihat di foto. Kalau memilih Lainnya, jelaskan bentuk kemasan dan cara pakainya di sini.",
            placeholder: "cth tutup emas metalik, botol kaca bening, label belakang putih polos",
          },
        ],
      },
    ],
    keluaran: [{ id: "utama", tombol: "Salin prompt", wajib: [] }],
  },
  {
    slug: "character-matching",
    cabang: "karakter-ai",
    judul: "Character matching",
    ringkas: "Prompt untuk menempatkan base character ke pose, sudut kamera, dan studio podcast dari gambar referensi, dengan wajah yang tetap sama.",
    siap: true,
    sorotan: [
      {
        judul: "Wajib lampirkan Gambar 1: base character",
        teks: "Lampirkan gambar base character yang sudah jadi (hasil tool Base character) sebagai gambar PERTAMA. Gambar ini satu-satunya patokan wajah, rambut, dan ciri karakter.",
      },
      {
        judul: "Wajib lampirkan Gambar 2: image reference",
        teks: "Lampirkan foto pose atau latar studio podcast yang ingin ditiru sebagai gambar KEDUA. Yang ditiru hanya pose, sudut kamera, latar, dan cahayanya, bukan wajah orang di foto.",
        poin: [
          "Urutan penting: unggah base character dulu, baru image reference. Tanpa kedua gambar, AI hanya akan meminta Anda melampirkannya.",
          "Saat membuat gambarnya di generator gambar, lampirkan lagi kedua gambar dengan urutan yang sama bersama prompt hasil AI.",
        ],
      },
    ],
    bagian: [
      {
        legenda: "Pengaturan",
        kolom: [
          {
            id: "pakaian",
            jenis: "pilihan",
            label: "Pakaian",
            opsi: [
              { nilai: "image1", teks: "Tetap pakaian base character (Gambar 1)" },
              { nilai: "image2", teks: "Ikuti pakaian di image reference (Gambar 2)" },
            ],
            bawaan: "image1",
          },
          {
            id: "anchor",
            jenis: "textarea",
            label: "Anchor karakter (opsional)",
            bantuan: "Tempel isi ANCHOR KARAKTER dari hasil Base character supaya wajah makin konsisten.",
            placeholder: "cth A 25-year-old Indonesian man with ...",
          },
        ],
      },
    ],
    keluaran: [{ id: "utama", tombol: "Salin prompt", wajib: [] }],
  },
  {
    slug: "outfit-swap",
    cabang: "karakter-ai",
    judul: "Outfit swap",
    ringkas: "Prompt untuk mengganti pakaian karakter yang sudah berpose dengan pakaian dari gambar referensi, tanpa mengubah wajah, ekspresi, pose, dan latar.",
    siap: true,
    sorotan: [
      {
        judul: "Wajib lampirkan Gambar 1: karakter yang sudah berpose",
        teks: "Lampirkan gambar karakter Anda yang sudah berpose di studio podcast (hasil Character matching) sebagai gambar PERTAMA. Wajah, ekspresi, pose, dan latar di gambar ini dipertahankan apa adanya.",
      },
      {
        judul: "Wajib lampirkan Gambar 2: referensi pakaian",
        teks: "Lampirkan foto pakaian atau jaket yang ingin dikenakan sebagai gambar KEDUA. Yang diambil hanya pakaiannya, bukan wajah atau pose orang di foto.",
        poin: [
          "Pilih foto pakaian yang jelas: terlihat utuh, cahaya terang, warna asli. Foto produk atau flat lay paling baik.",
          "Urutan penting: unggah karakter dulu, baru pakaian. Tanpa kedua gambar, AI hanya akan meminta Anda melampirkannya.",
          "Saat membuat gambarnya di generator gambar, lampirkan lagi kedua gambar dengan urutan yang sama bersama prompt hasil AI.",
        ],
      },
    ],
    bagian: [
      {
        legenda: "Pengaturan",
        kolom: [
          {
            id: "kemiripan",
            jenis: "pilihan",
            label: "Kemiripan pakaian",
            opsi: [
              { nilai: "persis", teks: "Persis: warna, bahan, potongan, dan detail sama dengan Gambar 2" },
              { nilai: "gaya", teks: "Gaya saja: jenis dan gaya sama, detail kecil boleh berbeda" },
            ],
            bawaan: "persis",
          },
          {
            id: "anchor",
            jenis: "textarea",
            label: "Anchor karakter (opsional)",
            bantuan: "Tempel isi ANCHOR KARAKTER dari hasil Base character supaya wajah tidak berubah.",
            placeholder: "cth A 25-year-old Indonesian man with ...",
          },
        ],
      },
    ],
    keluaran: [{ id: "utama", tombol: "Salin prompt", wajib: [] }],
  },
  {
    slug: "pegang-produk",
    cabang: "karakter-ai",
    judul: "Pegang produk",
    ringkas: "Prompt untuk menaruh produk di tangan karakter yang sudah berpose, dengan ukuran, genggaman, dan label yang tepat, tanpa mengubah wajah, pakaian, dan latar. Hasilnya jadi gambar karakter final untuk video.",
    siap: true,
    sorotan: [
      {
        judul: "Wajib lampirkan Gambar 1: karakter final",
        teks: "Lampirkan gambar karakter yang pose dan pakaiannya sudah pas sebagai gambar PERTAMA: hasil Outfit swap, atau hasil Character matching kalau pakaiannya tidak diganti.",
      },
      {
        judul: "Wajib lampirkan Gambar 2: product sheet",
        teks: "Lampirkan product sheet hasil Base product sebagai gambar KEDUA. Dari sheet ini AI mengambil bentuk, warna, label, dan ukuran produk di tangan.",
        poin: [
          "Opsional: kalau label di sheet kurang rapi, lampirkan juga foto produk asli tampak depan sebagai gambar KETIGA. Foto asli jadi patokan label dan warna.",
          "Urutan penting: karakter, lalu product sheet, lalu foto asli. Tanpa 2 gambar pertama, AI hanya akan meminta Anda melampirkannya.",
          "Saat membuat gambarnya di generator gambar, lampirkan lagi semua gambar dengan urutan yang sama bersama prompt hasil AI.",
          "Hasilnya dipakai sebagai gambar karakter final di Influencer video builder (centang Pegang produk di sana).",
        ],
      },
    ],
    bagian: [
      {
        legenda: "Pengaturan",
        kolom: [
          {
            id: "cara",
            jenis: "pilihan",
            label: "Posisi produk",
            opsi: [
              { nilai: "satu", teks: "Satu tangan setinggi dada, label menghadap kamera" },
              { nilai: "dua", teks: "Dua tangan di depan dada, seperti sedang menunjukkan produk" },
              { nilai: "meja", teks: "Berdiri di meja depan karakter, nanti diangkat di awal video" },
            ],
            bawaan: "satu",
          },
          {
            id: "anchorProduk",
            jenis: "textarea",
            label: "Anchor produk (opsional)",
            bantuan: "Tempel isi ANCHOR PRODUK dari hasil Base product supaya produk tidak berubah.",
            placeholder: "cth A 60 ml amber glass spray bottle with ...",
          },
          {
            id: "anchor",
            jenis: "textarea",
            label: "Anchor karakter (opsional)",
            bantuan: "Tempel isi ANCHOR KARAKTER dari hasil Base character supaya wajah tidak berubah.",
            placeholder: "cth A 25-year-old Indonesian man with ...",
          },
        ],
      },
    ],
    keluaran: [{ id: "utama", tombol: "Salin prompt", wajib: [] }],
  },
  {
    slug: "influencer-video",
    cabang: "karakter-ai",
    judul: "Influencer video builder",
    ringkas: "Prompt video talking head untuk Seedance 2.5 atau Google Flow / Gemini (Veo). Naskah dipecah per klip, lengkap dengan gerak bibir, kedipan, gestur kepala, dan angle kamera.",
    siap: true,
    sorotan: [
      {
        judul: "Wajib lampirkan gambar karakter final",
        teks: "Lampirkan gambar karakter yang pose dan pakaiannya sudah pas (hasil Character matching, Outfit swap, atau Pegang produk) saat menempel prompt ini ke ChatGPT, Gemini, atau Claude. Tanpa gambar, AI hanya akan meminta Anda melampirkannya.",
        poin: [
          "Seedance: setiap klip mulai dari gambar karakter final ini (image-to-video), dengan durasi sesuai label klip.",
          "Flow/Gemini: hanya KLIP 1 yang mulai dari gambar karakter. KLIP 2 dan seterusnya wajib mulai dari frame terakhir hasil klip sebelumnya: pakai Extend di Flow, atau simpan frame terakhirnya lalu jadikan gambar awal (Frames to video).",
          "Flow/Gemini: setiap klip selalu 8 detik dan jangan dipotong, supaya sambungan antar klip mulus.",
        ],
      },
      {
        judul: "Lampirkan juga foto produk",
        teks: "Karena karakter memegang produk, lampirkan foto produk atau product sheet (hasil Base product) sebagai gambar KEDUA saat menempel prompt ini (gambar karakter tetap pertama). AI memakainya untuk menjelaskan bentuk, warna, kemasan, dan cara pakai produk dengan tepat.",
        poin: [
          "Paling akurat: gambar karakter final sudah memegang produk (hasil tool Pegang produk). Kalau belum, karakter akan mengangkat produk ke dalam frame di awal klip 1.",
          "Seedance: kalau generator bisa menerima gambar referensi tambahan, lampirkan juga foto produk di setiap klip. Flow/Gemini: produk ikut terbawa ke klip berikutnya lewat frame terakhir.",
        ],
        tampilJika: [{ kolom: "pegang", nilai: true }],
      },
    ],
    bagian: [
      {
        legenda: "Naskah dan kamera",
        kolom: [
          {
            id: "naskah",
            jenis: "textarea",
            label: "Naskah / skrip suara (wajib)",
            bantuan: "Kalimat yang diucapkan karakter. Boleh tempel naskah utuh, POTONGAN NASKAH dari Naskah video pendek, atau BAHAN INFLUENCER VIDEO BUILDER dari Visual planner (TalkingHead) yang sudah berisi arahan ekspresi, tangan, intonasi, dan produk.",
            placeholder: "cth Kamu pernah sadar nggak, ...",
          },
          {
            id: "generator",
            jenis: "select",
            label: "AI video generator",
            opsi: [
              { nilai: "seedance", teks: "Seedance 2.5 (klip maksimal 30 detik)" },
              { nilai: "flow", teks: "Google Flow / Gemini - Veo (klip 8 detik, bersambung dari frame terakhir)" },
            ],
            bawaan: "seedance",
          },
          {
            id: "angle",
            jenis: "select",
            label: "Angle kamera",
            opsi: [
              { nilai: "single", teks: "Single angle: satu kamera, tanpa pindah angle" },
              { nilai: "dual", teks: "Dual angle: dua kamera ala podcast, pindah angle di antara kalimat" },
            ],
            bawaan: "single",
          },
        ],
      },
      {
        legenda: "Durasi video",
        kolom: [
          {
            id: "durasi",
            jenis: "select",
            label: "Durasi",
            bantuan: "Samakan dengan durasi di Naskah video pendek. Jumlah klip mengikuti durasi dan generator.",
            opsi: pilihanTeks(["30 Detik", "60 Detik", "90 Detik"]),
            bawaan: "60 Detik",
          },
          {
            id: "jumlahKlipSeedance",
            jenis: "info",
            label: "Jumlah klip Seedance",
            bantuan: "30 detik = 2 klip, 60 detik = 4 klip, 90 detik = 6 klip (sekitar 15 detik per klip).",
            tampilJika: [{ kolom: "generator", nilai: "seedance" }],
          },
          {
            id: "jumlahKlipFlow",
            jenis: "info",
            label: "Jumlah klip Flow / Gemini",
            bantuan: "30 detik = 4 klip (32 detik), 60 detik = 8 klip (64 detik), 90 detik = 12 klip (96 detik). Tiap klip tepat 8 detik; selisih dari durasi pilihan adalah toleransi.",
            tampilJika: [{ kolom: "generator", nilai: "flow" }],
          },
        ],
      },
      {
        legenda: "Produk",
        kolom: [
          {
            id: "pegang",
            jenis: "checkbox",
            label: "Pegang produk",
            bantuan: "Karakter memegang produk sepanjang video. Cocok untuk naskah BOFU.",
          },
          {
            id: "produk",
            jenis: "text",
            label: "Nama / jenis produk",
            bantuan: "Opsional. Tempel ANCHOR PRODUK dari hasil Base product supaya produk konsisten, atau tulis nama dan jenis produk.",
            placeholder: "cth Kapsul herbal, botol putih isi 60",
            tampilJika: [{ kolom: "pegang", nilai: true }],
          },
          {
            id: "demo",
            jenis: "checkbox",
            label: "Demo produk",
            bantuan: "Untuk produk yang bisa didemokan: karakter memperagakan cara pakainya saat naskah membahasnya.",
            tampilJika: [{ kolom: "pegang", nilai: true }],
          },
        ],
      },
      {
        legenda: "Suara",
        kolom: [
          {
            id: "suara",
            jenis: "checkbox",
            label: "Pakai suara sendiri",
            bantuan: "Karakter bicara dengan suara Anda, bukan suara buatan AI. Langkah menyiapkan suara muncul di bawah setelah dicentang.",
          },
          {
            id: "ciriSuara",
            jenis: "text",
            label: "Ciri suara Anda",
            bantuan: "Opsional. Membantu AI menyamakan suara di video dengan suara Anda.",
            placeholder: "cth Pria, 30-an, suara agak berat, tempo sedang",
            isiSendiri: true,
            tampilJika: [{ kolom: "suara", nilai: true }],
          },
          {
            id: "panduanSuaraSeedance",
            jenis: "info",
            label: "Siapkan rekaman suara Anda",
            bantuan: "Seedance memakai rekaman Anda sebagai referensi audio di setiap klip, jadi rekam setelah naskah dibagi per klip.",
            poin: [
              "Tempel prompt ini ke ChatGPT, Gemini, atau Claude bersama gambar karakter. Hasilnya berupa daftar KLIP beserta dialognya.",
              "Rekam satu file per klip (mp3 atau wav) yang isinya persis dialog klip itu, tanpa tambahan atau kata yang terlewat. Boleh juga rekam seluruh naskah sekaligus, lalu potong di batas klip pakai CapCut atau Audacity.",
              "Rekam di ruangan senyap, HP sekitar 20 cm dari mulut, tanpa musik. Bicara santai seperti ngobrol, jangan seperti membaca. Potong jeda kosong di awal dan akhir, sisakan sekitar setengah detik.",
              "Di Seedance, pilih mode yang menerima gambar dan audio sekaligus (reference atau multimodal), lalu lampirkan gambar karakter dan rekaman klip itu. Durasi di label klip hanya perkiraan: atur durasi klip mengikuti panjang rekaman, dibulatkan ke atas.",
              "Suara hasil Seedance meniru rekaman Anda, bukan salinan persis. Coba satu klip dulu sebelum membuat semuanya.",
            ],
            tampilJika: [
              { kolom: "suara", nilai: true },
              { kolom: "generator", nilai: "seedance" },
            ],
          },
          {
            id: "panduanSuaraFlow",
            jenis: "info",
            label: "Siapkan suara Anda",
            bantuan: "Flow / Gemini tidak bisa menerima rekaman suara. Video tetap dibuat dengan suara AI, lalu suaranya diganti ke suara Anda dengan voice changer. Ritme ucapannya tidak berubah, jadi gerak bibir tetap sinkron.",
            poin: [
              "Sekali saja: buat clone suara Anda di layanan voice changer (speech-to-speech), misalnya ElevenLabs. Pakai rekaman bersih tanpa musik; makin panjang rekamannya, makin mirip hasilnya.",
              "Isi Ciri suara Anda di atas, supaya suara AI di video sudah mendekati suara Anda sebelum diganti.",
              "Setelah semua klip jadi dan digabung di editor (mis. CapCut), ekspor audionya, ubah dengan voice changer ke suara clone Anda, lalu ganti audio asli video dengan hasilnya.",
              "Jangan menempel rekaman suara Anda langsung ke video Flow: gerak bibirnya tidak akan cocok.",
            ],
            tampilJika: [
              { kolom: "suara", nilai: true },
              { kolom: "generator", nilai: "flow" },
            ],
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
              { nilai: "wa", teks: "Gabung Grup WA" },
              { nilai: "komentar", teks: "Interaksi & Diskusi (ajakan implisit)" },
              { nilai: "ikuti", teks: "Ikuti / Follow" },
              { nilai: "bio", teks: "Klik Link di Bio" },
              { nilai: "dm", teks: "Pesan atau tanya dulu, DM aja ya!" },
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
