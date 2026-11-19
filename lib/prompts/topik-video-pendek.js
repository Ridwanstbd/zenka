import "server-only";
import { buatDokumen } from "./dokumen";

// Penyusun prompt "topik-video-pendek". Hanya berjalan di server.
// Kode di dalam fungsi ini disalin apa adanya dari versi HTML (index_97b4d2.html);
// "document" diganti tiruan yang membaca isian form dari server.
export function susunTopikVideoPendek(input, keluaran) {
  const document = buatDokumen(input);

  var S = "Sesuai hasil chat kita pertama kali";
  function g(id) {
    return document.getElementById(id);
  }
  function v(id) {
    return g(id).value.trim();
  }
  function say(m) {
    var s = g("st");
    s.textContent = m;
    setTimeout(function () {
      s.textContent = "";
    }, 2500);
  }
  function ready() {
    return v("produk") && v("riset");
  }
  function build() {
    // 10 ide per hari. Ganjil 5-3-2 dan genap 5-4-1, jadi tiap 2 hari pas
    // 10 TOFU (50%), 7 MOFU (35%), 3 BOFU (15%).
    var komposisi =
      "hari GANJIL (cth VH1, VH3) = 5 TOFU (VH{d}T1 sampai VH{d}T5), 3 MOFU (VH{d}M1 sampai VH{d}M3), 2 BOFU (VH{d}B1 sampai VH{d}B2); hari GENAP (cth VH2, VH4) = 5 TOFU (VH{d}T1 sampai VH{d}T5), 4 MOFU (VH{d}M1 sampai VH{d}M4), 1 BOFU (VH{d}B1)";
    var aturanProduk =
      "ATURAN PRODUK: ide T (TOFU) dan M (MOFU) DILARANG berisi nama produk, brand, harga, atau CTA (hanya membahas fakta unik/aneh yang relevan). Hanya ide B (BOFU) yang boleh mengangkat fakta unik/aneh, menjembatani ke masalah, lalu produk, lalu CTA (harga boleh).";
    return [
      "<peran>",
      "Kamu menjalankan dua peran sekaligus:",
      "1. Short-Video Content Strategist: menyusun ide topik video pendek (Reels, TikTok, Shorts) yang tertata per funnel TOFU, MOFU, BOFU, di mana SEMUA FUNNEL (TOFU, MOFU, maupun BOFU) WAJIB membahas topik fakta unik/aneh yang menarik penonton dan relevan dengan kategori produk.",
      "2. Viral Pattern Analyst: menjelaskan pola viral yang ditiru di tiap ide, supaya ide bisa dieksekusi dan tidak asal tren.",
      "Judul dan Alasan ditulis sebagai Strategist; Bukti ditulis sebagai Analyst.",
      "</peran>",
      "",
      "<konteks>",
      "Produk: " + v("produk"),
      "Riset (audiens + strategi):\n" + v("riset"),
      "Hasil riset:\n" + (v("ground") || "-"),
      "</konteks>",
      "",
      "<fokus_konten>",
      "ATURAN UTAMA TOPIK: SEMUA tahap funnel (T/TOFU, M/MOFU, maupun B/BOFU) WAJIB membahas topik berupa FAKTA UNIK ATAU ANEH yang menarik perhatian pembaca/penonton, yang dikaitkan secara relevan dengan niche/produk pada konteks.",
      "PINTU MASUK IDE: angle tiap ide berangkat dari frasa tren acak yang lolos saringan 2 hari, jumlah postingan menengah, dan tes jembatan di <riset_web>, lalu dijembatani ke fakta unik/aneh kategori produk.",
      "</fokus_konten>",
      "",
      "<riset_web>",
      "WAJIB riset web live (kerjakan PERTAMA, sebelum menulis ide apa pun). TIDAK WAJIB Claude Cowork — yang penting bisa search web. AKSES RISET (pakai yang tersedia): (1) jika kamu Claude Cowork atau AI lain yang bisa membuka tab browser, buka platform langsung di tab (pakai tab TikTok, Instagram, YouTube, Facebook, Google di grup ini jika ada); (2) jika Claude Cowork atau tab browser TIDAK tersedia (misalnya Claude paket gratis atau AI lain), lanjutkan dengan fitur pencarian web (web search) untuk SEMUA langkah riset: cari URL dan kata kunci di langkah-langkah di bawah lewat web search, lalu buka halaman hasilnya jika bisa; (3) HANYA jika tab browser DAN web search sama-sama tidak tersedia, JANGAN tulis output apa pun — batalkan tugas dan katakan kamu tidak bisa memproses tanpa riset web, lalu minta aku mengaktifkan fitur web search. Ambil HANYA yang benar-benar terlihat di tab atau di hasil web search. DILARANG mengarang atau mengisi dari ingatan.",
      "LANGKAH 1 — Frasa tren acak: cari frasa/topik yang SEDANG TREN secara acak, BOLEH di luar niche (film/series, musik, olahraga, kejadian, politik, gosip/selebriti, meme, istilah viral; tetap di luar SARA; tren politik dan gosip wajib mengikuti aturan NETRAL di guardrail 3). Buka https://trends.google.com/trending?geo=ID (jika bisa dibuka), https://www.tiktok.com/search?q=[frasa] , https://www.instagram.com/explore/tags/[tag]/ , https://www.youtube.com/results?search_query=[frasa]+shorts , dan https://www.google.com/search?q=[frasa] . Catat jumlah postingan/video yang terlihat.",
      "LANGKAH 2 — Saring 2 hari: pakai hanya tren yang ramai dalam 2 hari terakhir (mayoritas konten teratas diunggah ≤ 2 hari). Lebih lama dari itu = buang.",
      "LANGKAH 3 — Jumlah postingan MENENGAH: pakai hanya tren yang jumlah postingannya masuk ukuran menengah (sudah dicari orang, tapi belum jenuh dan belum didominasi akun raksasa). Patokan: Instagram 10rb – 500rb posts; TikTok 1rb – 100rb posts (jika yang tampil views: 100rb – 500rb views, batas atas 1 juta); YouTube Shorts 100rb – 5 juta videos. Di bawah itu = terlalu kecil, di atas itu = terlalu besar; keduanya dibuang. Jika angka tidak terlihat di platform mana pun (sering terjadi saat hanya memakai web search, mis. Instagram perlu login), nilai ukurannya dari sinyal yang terlihat: banyaknya hasil dan konten baru, apakah hasil teratas didominasi akun/media raksasa, dan apakah sudah jadi topik utama nasional (= terlalu besar) atau baru 1-2 hasil (= terlalu kecil). Jika sinyalnya juga tidak cukup, buang tren itu. DILARANG menuliskan angka yang tidak terlihat.",
      "LANGKAH 4 — Tes jembatan (satu tes): bisakah jembatan dari tren itu ke kategori produk dijelaskan dalam SATU kalimat dan masih masuk akal bagi target audiens (= audiens di Riset pada <konteks>)? Kalau bisa, pakai. Kalau tidak, lewati.",
      "LANGKAH 5 — Kumpulkan pool: kumpulkan minimal 10 tren berbeda yang lolos Langkah 2-4. Untuk tiap tren catat: frasa tren, kalimat jembatan, jumlah postingan yang terlihat, hook pembuka konten teratas, dan emosi yang dipancing.",
      "PEMAKAIAN: tiap ide berangkat dari 1 tren di pool (utamakan tren berbeda untuk tiap ide; satu tren dipakai paling banyak untuk 2 ide, dan keduanya wajib beda sudut pandang dan hook), lalu lewat kalimat jembatannya dibawa ke fakta unik/aneh kategori produk (aturan <fokus_konten> tetap berlaku). Judul memuat frasa tren + frasa kategori produk. Bukti tiap ide WAJIB menyebut tren yang dipakai dan pola viral nyatanya (boleh menyebut platform dan jumlah postingan/views jika memang terlihat). Untuk ide lanjutan (VH3 dst.), lakukan riset ulang agar tren masih dalam 2 hari terakhir.",
      "ATURAN KETAT: jangan login, jangan isi form, jangan klik follow/like/komentar. Jangan berhenti setelah 2-3 pencarian; selesaikan semua kata kunci.",
      "RISET INI KERJA INTERNAL: DILARANG menampilkan langkah, daftar pencarian, URL, atau pool di output. Output tetap PERSIS sesuai <format_output>; hasil riset hanya terlihat lewat judul dan Bukti.",
      "</riset_web>",
      "",
      "<kode_penamaan>",
      "Tiap ide wajib diberi kode VH{hari}T/M/B{nomor}: VH = Video Hari, angka = nomor hari, huruf = jenis funnel (T = Tofu, M = Mofu, B = Bofu), digit terakhir = urutan jenis itu pada hari tersebut, dan WAJIB reset ke 1 setiap hari.",
      "Contoh: VH1T1 = Video Hari 1 Tofu 1, VH1T5 = Video Hari 1 Tofu 5, VH1M3 = Video Hari 1 Mofu 3, VH2M4 = Video Hari 2 Mofu 4, VH2B1 = Video Hari 2 Bofu 1.",
      "Kode ditulis tanpa akhiran apa pun (contoh: VH1T1, VH1M1, VH2B1), juga untuk kode lanjutan VH3 dst.",
      "DILARANG menambahkan akhiran apa pun di belakang kode (termasuk JL, VO, atau TH).",
      "</kode_penamaan>",
      "",
      "<tugas>",
      "Tulis TEPAT 2 hari ide topik video pendek (supaya tren yang dipakai belum lewat masanya): VH1 sampai VH2, 10 ide per hari, total 20 ide. Tiap 2 hari komposisinya 50% TOFU, 35% MOFU, 15% BOFU (10 T + 7 M + 3 B), dibagi per hari mengikuti paritas nomor VH:",
      "1. Komposisi tiap hari ({d} = nomor hari): " + komposisi + ".",
      "2. Urutan wajib dalam tiap hari: TOFU dulu (VH{d}T1 dst.), lalu MOFU (VH{d}M1 dst.), lalu BOFU (VH{d}B1 dst.).",
      "3. Semua kode ditulis tanpa akhiran, sesuai <kode_penamaan>.",
      "4. CETAK semua 20 ide SEKALIGUS dalam satu jawaban; jangan berhenti di tengah dan jangan bertanya.",
      "Isi per jenis:",
      "- T (TOFU): murni fakta unik/aneh, sejarah aneh, atau mitos absurd yang dikemas untuk memancing rasa penasaran massal.",
      "- M (MOFU): fakta unik/aneh seputar akar masalah, kebiasaan nyeleneh, atau penyebab tersembunyi yang sering salah dipahami audiens, dikaitkan dengan masalah/edukasi produk.",
      "- B (BOFU): fakta unik/aneh yang mengejutkan terkait dampak buruk pembiaran masalah, lalu ditarik menuju solusi produk langsung.",
      "Sebelum menulis ide, WAJIB menjalankan <riset_web> di atas, lalu mengikuti <cek_lanjutan> di bawah.",
      "</tugas>",
      "",
      "<cek_lanjutan>",
      "WAJIB: sebelum menulis ide, telusuri seluruh percakapan sebelumnya di chat ini dan temukan kode VH dengan nomor hari terbesar yang pernah muncul (misal VH{last}).",
      "Saat membaca riwayat, ABAIKAN akhiran JL, VO, dan TH pada kode (cth VH2B1JL, VH3T2JLVO, VH12M1TH dari riwayat lama): angka hari tetap dibaca dari angka setelah VH, sehingga VH2B1JLTH dianggap VH2.",
      "1. Jika belum ada ide VH sama sekali di chat ini: tulis VH1 sampai VH2.",
      "2. Jika sudah ada VH{last} (nomor terbesar di riwayat): DILARANG memulai dari VH1 dan DILARANG mengulang nomor yang sudah ada — lanjutkan langsung 2 hari penuh berikutnya, yaitu VH{last+1} sampai VH{last+2}. Jika riwayat sudah ada VH2, berarti tulis VH3 sampai VH4; jika sudah ada VH4, tulis VH5 sampai VH6, dan begitu terus siklusnya.",
      "3. Paritas tetap ikut nomor VH: nomor ganjil pakai pola 5 TOFU + 3 MOFU + 2 BOFU, nomor genap pakai pola 5 TOFU + 4 MOFU + 1 BOFU.",
      "4. Ide yang sudah ada di riwayat DILARANG diulang: sudut pandang dan hook harus baru.",
      "</cek_lanjutan>",
      "",
      "<format_output>",
      "Teks biasa (plain text). Tiap ide ditampilkan dalam TEPAT 2 code block markdown berurutan, masing-masing dengan pembuka ```markdown dan penutup ``` sendiri: code block PERTAMA hanya berisi 1 baris kode VH lengkap + spasi + judul; code block KEDUA berisi 2 baris Alasan dan Bukti. Pola persis per ide:",
      "```markdown",
      "VH1T1 Judul ide",
      "```",
      "```markdown",
      "- Alasan: 1 kalimat",
      "- Bukti: 1 kalimat tentang pola viral yang ditiru",
      "```",
      "Code block judul WAJIB diawali kode VH sesuai <kode_penamaan>, tanpa akhiran; DILARANG memakai pola lama TOFU#/MOFU#/BOFU#. Nomor di belakang huruf mengikuti komposisi hari itu di <tugas> (contoh hari ganjil: VH1T1 sampai VH1T5, VH1M1 sampai VH1M3, VH1B1 sampai VH1B2).",
      "Untuk SEMUA jenis kode (T, M, maupun B), awali Alasan dengan tag sub-tipe fakta unik yang sesuai (cth: [FAKTA-UNIK-SEJARAH], [FAKTA-UNIK-SAINS], [FAKTA-UNIK-MITOS], [FAKTA-UNIK-KEBIASAAN]).",
      "Setiap kode WAJIB punya Alasan dan Bukti, tidak boleh judul saja.",
      'DILARANG markdown lain, tabel, JSON, dan code block tambahan: di dalam code block tanpa **bold**, ## heading, | tabel, atau > quote; per ide hanya ada 2 code block (judul, lalu Alasan + Bukti), DILARANG menggabungkan keduanya dalam 1 code block dan DILARANG code block ketiga. DILARANG penomoran gaya "1." atau label [FUNNEL]. Hanya pola di atas.',
      "DILARANG mengemas jawaban sebagai file .md, .docx, atau .pdf — seluruh hasil ditampilkan langsung di percakapan sesuai format di atas.",
      "</format_output>",
      "",
      "<guardrail>",
      "1. " + aturanProduk,
      "2. Pastikan SEMUA jenis funnel (T/TOFU, M/MOFU, B/BOFU) konsisten mengusung sudut pandang fakta unik/aneh yang menarik penonton.",
      "3. DILARANG SARA. Tren POLITIK dan GOSIP (selebriti, figur publik, drama viral) BOLEH dipakai sebagai pintu masuk ide, dengan aturan NETRAL yang WAJIB berlaku di judul, Alasan, dan Bukti: (a) tidak memihak atau membela siapa pun — partai, tokoh, kandidat, pemerintah, oposisi, selebriti, maupun pihak yang berseteru; (b) DILARANG ujaran kebencian, hinaan, ejekan, julukan merendahkan, body shaming, atau serangan kepada pihak mana pun; (c) DILARANG menilai siapa benar atau salah, DILARANG ajakan memilih, menolak, atau memboikot pihak tertentu; (d) DILARANG hoaks, rumor yang belum terkonfirmasi, tuduhan, info pribadi (alamat, nomor, keluarga yang tidak terlibat), atau klaim yang tidak terlihat di sumber yang dibuka; (e) HANYA berkomentar dari sudut pandang frasa produk/kategori produk: ambil sisi peristiwa yang netral dan faktual (kejadian, istilah, momen yang ramai dibicarakan), lalu bahas apa hubungannya dengan fakta unik kategori produk, bukan mengomentari orangnya atau pilihan politiknya. Jika sebuah tren politik atau gosip tidak bisa dibahas tanpa memihak, menyerang, atau mengomentari pribadi orang, lewati tren itu.",
      "4. Jangan mengarang angka, URL, atau nama akun di Bukti: semuanya hanya boleh dari halaman yang benar-benar dibuka di <riset_web> atau dari Hasil riset. Jika angka atau sumbernya tidak terlihat, tulis pola viral nyata yang ditemukan (hook, format, emosi) tanpa menyebut sumber spesifik. DILARANG memakai pola dari ingatan.",
      "5. Jangan menanyakan apa pun kepadaku. Jika ada data kosong, simpulkan dari konteks.",
      "6. Tidak ada ide yang kembar: sudut pandang dan hook tiap ide harus berbeda, termasuk berbeda dari ide VH yang sudah pernah muncul di riwayat percakapan.",
      "</guardrail>",
      "",
      "Cek mandiri sebelum menjawab: riset web sudah dijalankan lewat tab browser atau web search (bukan ingatan); tiap ide berangkat dari tren yang ramai dalam 2 hari terakhir, jumlah postingannya menengah (bukan terlalu kecil, bukan terlalu besar), dan jembatannya ke kategori produk bisa dijelaskan dalam satu kalimat yang masuk akal bagi target audiens; Bukti tiap ide menyebut tren dan pola viral nyata dari pool <riset_web>; ide yang berangkat dari tren politik atau gosip netral (tidak memihak, tanpa ujaran kebencian, tanpa ajakan memilih/menolak/memboikot, tanpa hoaks atau rumor) dan hanya berkomentar dari sudut pandang frasa produk di judul, Alasan, maupun Bukti; satu tren dipakai paling banyak untuk 2 ide; jumlah tepat 2 hari × 10 = 20 ide (10 TOFU, 7 MOFU, 3 BOFU) dengan kode VH berurutan tanpa melompat; bila lanjutan, nomor mulai VH{last+1} dan tidak ada nomor dari riwayat yang diulang; paritas hari benar (ganjil: 5 TOFU + 3 MOFU + 2 BOFU, genap: 5 TOFU + 4 MOFU + 1 BOFU) dengan urutan per hari T, lalu M, lalu B, dan nomor tiap jenis reset ke 1 setiap hari; SEMUA ide di T, M, dan B membahas fakta unik/aneh dengan tag sub-tipe masing-masing; code block judul tiap ide diawali kode VH sesuai pola, bukan TOFU#/MOFU#/BOFU#; SEMUA kode ditulis tanpa akhiran (tidak ada JL, VO, atau TH); setiap ide punya Alasan dan Bukti, setiap ide tampil dalam tepat 2 code block ```markdown``` (pertama kode VH + judul, kedua Alasan + Bukti), tidak ada markdown/code block lain selain 2 code block itu per ide, aturan nama produk/brand/harga/CTA terpenuhi sesuai ATURAN PRODUK di guardrail, dan jawaban hanya tampil di chat, bukan file .md/.docx/.pdf.",
    ].join("\n");
  }

  const penyusun = { utama: build };
  return penyusun[keluaran]();
}
