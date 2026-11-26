import "server-only";
import { buatDokumen } from "./dokumen";
import { adaBofu, arahFase, contohKode, komposisiFase, porsiFase } from "./fase";
import { guardrailAngle, isiFunnel, ragamAngle } from "./ragam-angle";

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
    // 5 hari × 4 ide, komposisi hari ke-1 sampai ke-5 mengikuti fase channel (lihat KOMPOSISI_FASE di lib/tools.js),
    // jadi tiap rencana 5 hari pas rata-rata fase itu.
    var fase = v("fase");
    var komposisi = komposisiFase(fase, "VH", "{d}");
    var bofu = adaBofu(fase);
    var aturanProduk =
      "ATURAN PRODUK: ide T (TOFU) dan M (MOFU) DILARANG berisi nama produk, brand, harga, atau CTA (hanya membahas jenis konten evergreen yang relevan dengan niche). " +
      (bofu
        ? "Hanya ide B (BOFU) yang boleh berangkat dari salah satu jenis konten, menjembatani ke masalah, lalu produk, lalu CTA (harga boleh)."
        : "Fase ini TANPA ide B (BOFU), jadi TIDAK ADA satu pun ide yang menyebut produk, brand, harga, atau CTA beli.");
    return [
      "<peran>",
      "Kamu menjalankan dua peran sekaligus:",
      "1. Short-Video Content Strategist: menyusun ide topik video pendek (Reels, TikTok, Shorts) yang tertata per funnel TOFU, MOFU, BOFU, berbasis 10 jenis konten evergreen yang menahan scroll dan relevan dengan kategori produk.",
      "2. Retention Analyst: menjelaskan pemicu yang membuat penonton berhenti scroll pada tiap ide, supaya ide bisa dieksekusi dan tetap relevan dalam jangka panjang.",
      "Judul dan Alasan ditulis sebagai Strategist; Bukti ditulis sebagai Analyst.",
      "</peran>",
      "",
      "<konteks>",
      "Produk: " + v("produk"),
      "Riset (audiens + strategi):\n" + v("riset"),
      "Hasil riset:\n" + (v("ground") || "-"),
      "</konteks>",
      "",
      "<fase_channel>",
      ...arahFase(fase),
      "Arahan fase ini menentukan porsi dan nada tiap funnel; aturan jenis konten di <fokus_konten> tetap berlaku untuk semua ide.",
      "</fase_channel>",
      "",
      "<fokus_konten>",
      "ATURAN UTAMA TOPIK: basis topik adalah konten evergreen yang menahan scroll, bukan tren atau viralitas. SEMUA tahap funnel (T/TOFU, M/MOFU, maupun B/BOFU) memakai jenis konten di bawah ini.",
      ...ragamAngle("video"),
      "PINTU MASUK IDE: tiap ide berangkat dari 1 pertanyaan, kebingungan, kebiasaan, atau keluhan yang terus berulang pada target audiens (hasil <riset_web>), lalu dikemas dengan salah satu jenis konten di atas.",
      "</fokus_konten>",
      "",
      "<riset_web>",
      "WAJIB riset web live (kerjakan PERTAMA, sebelum menulis ide apa pun). Tujuannya mencari kebutuhan yang BERULANG dari waktu ke waktu dan memeriksa fakta, BUKAN mencari tren. AKSES RISET (pakai yang tersedia): (1) jika bisa membuka tab browser (mis. Claude Cowork), buka sumber langsung; (2) jika tidak, pakai web search untuk SEMUA langkah riset dan buka halaman hasilnya jika bisa; (3) jika keduanya tidak tersedia, JANGAN tulis output apa pun: batalkan tugas, katakan tidak bisa memproses tanpa riset web, dan minta aku mengaktifkan web search. Ambil HANYA yang benar-benar terlihat di tab atau di hasil web search. DILARANG mengarang atau mengisi dari ingatan.",
      "LANGKAH 1 — Pertanyaan berulang: cari kategori produk dan masalah audiens lewat saran autocomplete dan pertanyaan terkait di https://www.google.com/search?q=[frasa] , https://www.youtube.com/results?search_query=[frasa] , dan https://www.tiktok.com/search?q=[frasa] . Pakai pola \"cara\", \"kenapa\", \"apakah\", \"ciri\", \"tanda\", \"bedanya\", \"mitos\", \"kesalahan\", dan \"dulu\".",
      "LANGKAH 2 — Keluhan dan kebiasaan nyata: baca ulasan produk sejenis di marketplace, kolom komentar, dan forum; catat keluhan, salah kaprah, keraguan, pilihan yang sering diperdebatkan, dan situasi sehari-hari, dalam bahasa yang dipakai audiens.",
      "LANGKAH 3 — Verifikasi fakta: untuk tiap fakta, mitos, penjelasan sebab, sejarah, tanda, atau langkah tutorial yang akan dipakai, buka sumber kredibel (situs institusi, jurnal, ensiklopedia, atau media tepercaya). Yang tidak bisa diverifikasi = buang.",
      "LANGKAH 4 — Saring evergreen: pakai bahan hanya jika (a) masih relevan 1 tahun lagi, (b) tidak bergantung pada berita, tokoh, atau momen tertentu, dan (c) ada tanda kebutuhannya berulang (muncul di autocomplete, ditanyakan berkali-kali, atau dibahas di konten dari waktu yang berbeda). Usia sumber BUKAN alasan membuang selama isinya masih benar.",
      "LANGKAH 5 — Tes jembatan: bisakah hubungan bahan itu dengan kategori produk dijelaskan dalam SATU kalimat dan masuk akal bagi target audiens (= audiens di Riset pada <konteks>)? Kalau tidak, lewati.",
      "LANGKAH 6 — Kumpulkan pool: minimal 20 bahan berbeda yang lolos Langkah 4-5, cukup untuk ke-10 jenis konten. Untuk tiap bahan catat: pertanyaan atau masalahnya, bahasa yang dipakai audiens, dasar faktanya, dan jenis konten yang paling cocok.",
      "PEMAKAIAN: tiap ide berangkat dari 1 bahan di pool (utamakan bahan berbeda; satu bahan paling banyak untuk 2 ide yang beda jenis, sudut pandang, dan hook). Judul memakai kata-kata sehari-hari yang diketik audiens saat mencari. Untuk ide lanjutan (VH6 dst.), tambah riset ke pertanyaan yang belum terpakai.",
      "ATURAN KETAT: jangan login, jangan isi form, jangan klik follow/like/komentar. Jangan berhenti setelah 2-3 pencarian; selesaikan sampai pool cukup.",
      "RISET INI KERJA INTERNAL: DILARANG menampilkan langkah, daftar pencarian, URL, atau pool di output. Output tetap PERSIS sesuai <format_output>; hasil riset hanya terlihat lewat judul, Alasan, dan Bukti.",
      "</riset_web>",
      "",
      "<kode_penamaan>",
      "Tiap ide wajib diberi kode VH{hari}T/M/B{nomor}: VH = Video Hari, angka = nomor hari, huruf = jenis funnel (T = Tofu, M = Mofu, B = Bofu), digit terakhir = urutan jenis itu pada hari tersebut, dan WAJIB reset ke 1 setiap hari.",
      "Contoh: VH1T1 = Video Hari 1 Tofu 1, VH1T2 = Video Hari 1 Tofu 2, VH1M1 = Video Hari 1 Mofu 1, VH1B1 = Video Hari 1 Bofu 1, VH5T3 = Video Hari 5 Tofu 3.",
      "Kode ditulis tanpa akhiran apa pun (contoh: VH1T1, VH1M1, VH4B1), juga untuk kode lanjutan VH6 dst.",
      "DILARANG menambahkan akhiran apa pun di belakang kode (termasuk JL, VO, atau TH).",
      "</kode_penamaan>",
      "",
      "<tugas>",
      "Tulis TEPAT 5 hari ide topik video pendek: VH1 sampai VH5, 4 ide per hari, total 20 ide. Komposisi mengikuti fase channel di <fase_channel>, sehingga tiap rencana 5 hari pas " + porsiFase(fase) + ":",
      "1. Komposisi per hari ({d} = nomor hari; hari ke-1 sampai ke-5 = urutan hari dalam rencana ini: rencana baru hari ke-1 = VH1 sampai hari ke-5 = VH5, lanjutan setelah VH5 hari ke-1 = VH6 sampai hari ke-5 = VH10): " + komposisi + ".",
      "2. Urutan wajib dalam tiap hari: TOFU dulu (VH{d}T1 dst.), lalu MOFU (VH{d}M1 dst.)" + (bofu ? ", lalu BOFU (VH{d}B1 dst.)." : ". Fase ini tanpa BOFU, jadi tidak ada kode B."),
      "3. Semua kode ditulis tanpa akhiran, sesuai <kode_penamaan>.",
      "4. CETAK semua 20 ide SEKALIGUS dalam satu jawaban; jangan berhenti di tengah dan jangan bertanya.",
      "Isi per jenis funnel (tiap funnel bisa memakai ketiga jenis angle di <fokus_konten>):",
      ...isiFunnel(bofu, { T: "T (TOFU)", M: "M (MOFU)", B: "B (BOFU)" }),
      "Sebelum menulis ide, WAJIB menjalankan <riset_web> di atas, lalu mengikuti <cek_lanjutan> di bawah.",
      "</tugas>",
      "",
      "<cek_lanjutan>",
      "WAJIB: sebelum menulis ide, telusuri seluruh percakapan sebelumnya di chat ini dan temukan kode VH dengan nomor hari terbesar yang pernah muncul (misal VH{last}).",
      "Saat membaca riwayat, ABAIKAN akhiran JL, VO, dan TH pada kode (cth VH2B1JL, VH3T2JLVO, VH12M1TH dari riwayat lama): angka hari tetap dibaca dari angka setelah VH, sehingga VH2B1JLTH dianggap VH2.",
      "1. Jika belum ada ide VH sama sekali di chat ini: tulis VH1 sampai VH5.",
      "2. Jika sudah ada VH{last} (nomor terbesar di riwayat): DILARANG memulai dari VH1 dan DILARANG mengulang nomor yang sudah ada — lanjutkan langsung 5 hari penuh berikutnya, yaitu VH{last+1} sampai VH{last+5}. Jika riwayat sudah ada VH5, berarti tulis VH6 sampai VH10; jika sudah ada VH10, tulis VH11 sampai VH15, dan begitu terus siklusnya.",
      "3. Komposisi hari lanjutan tetap 4 ide per hari dan WAJIB mengikuti fase di <fase_channel> pada prompt ini (" + komposisi + "), dengan hari ke-1 = VH{last+1} sampai hari ke-5 = VH{last+5}, walaupun ide di riwayat memakai komposisi, jumlah ide per hari, atau fase lain.",
      "4. Ide yang sudah ada di riwayat DILARANG diulang: sudut pandang dan hook harus baru.",
      "</cek_lanjutan>",
      "",
      "<format_output>",
      "Teks biasa (plain text). Tiap ide ditampilkan dalam TEPAT 2 bagian berurutan: bagian PERTAMA hanya berisi 1 baris kode VH lengkap + spasi + judul; bagian KEDUA berisi 2 baris Alasan dan Bukti. Pola persis per ide:",
      "VH1T1 Judul ide",
      "- Alasan: 1 kalimat",
      "- Bukti: 1 kalimat tentang pemicu yang menahan scroll beserta dasarnya (pertanyaan, keluhan, atau fakta yang ditemukan)",
      "Baris judul WAJIB diawali kode VH sesuai <kode_penamaan>, tanpa akhiran; DILARANG memakai pola lama TOFU#/MOFU#/BOFU#. Nomor di belakang huruf mengikuti komposisi hari itu di <tugas> (" + contohKode(fase, "VH") + ").",
      "Untuk SEMUA jenis kode (T, M, maupun B), awali Alasan dengan tag jenis konten dari <fokus_konten> (cth: [KESALAHAN-UMUM], [MITOS-FAKTA], [DAFTAR-CEK]).",
      "Setiap kode WAJIB punya Alasan dan Bukti, tidak boleh judul saja.",
      'Per ide hanya ada 2 bagian (judul, lalu Alasan + Bukti), DILARANG menggabungkan keduanya dan DILARANG bagian ketiga. DILARANG penomoran gaya "1." atau label [FUNNEL]. Hanya pola di atas.',
      "DILARANG membuat file (.md/.docx/.pdf); tampilkan hasil langsung di chat.",
      "</format_output>",
      "",
      "<guardrail>",
      "1. " + aturanProduk,
      "2. " + guardrailAngle(),
      "3. DILARANG SARA, politik, gosip (selebriti, figur publik, drama viral), berita, dan tren sesaat.",
      "4. Jangan mengarang angka, URL, atau nama akun di Bukti: semuanya hanya boleh dari halaman yang benar-benar dibuka di <riset_web> atau dari Hasil riset. Jika angka atau sumbernya tidak terlihat, tulis pemicu dan dasar yang ditemukan tanpa menyebut sumber spesifik. DILARANG memakai bahan dari ingatan.",
      "5. Jangan menanyakan apa pun kepadaku. Jika ada data kosong, simpulkan dari konteks.",
      "6. Tidak ada ide yang kembar: sudut pandang dan hook tiap ide harus berbeda, termasuk berbeda dari ide VH yang sudah pernah muncul di riwayat percakapan.",
      "</guardrail>",
      "",
      "Cek mandiri: riset web dijalankan (bukan ingatan); tiap ide berangkat dari kebutuhan berulang yang lolos saringan evergreen, faktanya terverifikasi, dengan jembatan satu kalimat ke produk, satu bahan maksimal 2 ide; tepat 5 hari × 4 = 20 ide dengan kode VH berurutan (lanjutan mulai VH{last+1}, tanpa mengulang riwayat) dan komposisi tiap hari sesuai fase (" + komposisi + ") berurutan T, M" + (bofu ? ", B" : "") + ", nomor reset ke 1 tiap hari, kode tanpa akhiran; 4 ide tiap hari memakai 4 jenis berbeda, ke-10 jenis masing-masing tepat 2 ide, tidak ada 2 berurutan sama, Alasan diawali tag jenis; semua judul menahan scroll tanpa clickbait menipu; setiap ide tampil dalam tepat 2 bagian (kode VH + judul, lalu Alasan + Bukti); tanpa politik, gosip, atau tren sesaat; semua aturan <guardrail> terpenuhi; jawaban hanya di chat.",
    ].join("\n");
  }

  const penyusun = { utama: build };
  return penyusun[keluaran]();
}
