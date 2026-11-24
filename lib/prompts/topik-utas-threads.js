import "server-only";
import { buatDokumen } from "./dokumen";
import { adaBofu, arahFase, komposisiFase, porsiFase } from "./fase";
import { guardrailAngle, isiFunnel, ragamAngle } from "./ragam-angle";

// Penyusun prompt "topik-utas-threads". Hanya berjalan di server.
// Kode di dalam fungsi ini disalin apa adanya dari versi HTML (index_65aa0c.html);
// "document" diganti tiruan yang membaca isian form dari server.
export function susunTopikUtasThreads(input, keluaran) {
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
    // 5 hari × 4 ide, komposisi hari ke-1 sampai ke-5 mengikuti fase channel (lihat KOMPOSISI_FASE di lib/tools.js).
    var fase = v("fase");
    var komposisi = komposisiFase(fase, "UH", "{h}");
    var bofu = adaBofu(fase);
    var aturanProduk =
      "ATURAN PRODUK: TOFU dan MOFU DILARANG berisi nama produk, brand, harga, atau CTA (hanya membahas fakta unik/aneh, problem awareness, atau meme relate yang relevan). " +
      (bofu
        ? "Hanya BOFU yang boleh mengangkat angle-nya (fakta unik/aneh, problem awareness, atau meme relate), menjembatani ke masalah, lalu produk, lalu CTA (harga boleh)."
        : "Fase ini TANPA BOFU, jadi TIDAK ADA satu pun ide yang menyebut produk, brand, harga, atau CTA beli.");
    return [
      "<peran>",
      "Kamu menjalankan dua peran sekaligus:",
      "1. Threads Content Strategist: menyusun ide topik UTAS (thread tulisan berurutan) di Threads yang tertata per funnel TOFU, MOFU, BOFU, di mana SEMUA FUNNEL (TOFU, MOFU, maupun BOFU) memakai campuran 3 jenis angle (fakta unik/aneh, problem awareness, dan meme relate) yang menarik pembaca dan relevan dengan kategori produk.",
      "2. Viral Pattern Analyst: menjelaskan pola viral yang ditiru di tiap ide, supaya ide bisa dieksekusi dan tidak asal tren.",
      "Judul dan Alasan ditulis sebagai Strategist; Bukti ditulis sebagai Analyst.",
      "Fokusmu HANYA ide utas tulisan, bukan ide video.",
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
      "Arahan fase ini menentukan porsi dan nada tiap funnel; aturan ragam angle di <ragam_angle> tetap berlaku untuk semua ide.",
      "</fase_channel>",
      "",
      "<ragam_angle>",
      "Topik TIDAK hanya fakta unik. SEMUA funnel (TOFU, MOFU, maupun BOFU) memakai campuran angle di bawah ini.",
      ...ragamAngle("utas"),
      "</ragam_angle>",
      "",
      "<tugas>",
      "Susun rencana konten utas Threads TEPAT 5 HARI PENUH, 4 ide per hari, total TEPAT 20 ide. Komposisi mengikuti fase channel di <fase_channel>, sehingga tiap rencana 5 hari pas " + porsiFase(fase) + ".",
      "- Komposisi per hari ({h} = nomor hari, cth hari 5 = UH5; hari ke-1 sampai ke-5 = urutan hari dalam rencana ini: rencana baru hari ke-1 = UH1 sampai hari ke-5 = UH5, lanjutan setelah UH5 hari ke-1 = UH6 sampai hari ke-5 = UH10): " + komposisi + ".",
      "- Urutan wajib dalam tiap hari: TOFU dulu (UH{h}T1 dst.), lalu MOFU (UH{h}M1 dst.)" + (bofu ? ", lalu BOFU (UH{h}B1 dst.)." : ". Fase ini tanpa BOFU, jadi tidak ada kode B."),
      "- CETAK semua hari SEKALIGUS dalam satu jawaban, berurutan mulai dari hari awal sampai 5 hari penuh; jangan berhenti di tengah dan jangan bertanya.",
      "- CEK PERCAKAPAN SEBELUMNYA sebelum menulis: periksa riwayat percakapan ini, cari kode UH tertinggi yang sudah ada (mis. UH5, UH10). Saat membaca riwayat, ABAIKAN akhiran JL pada kode (cth UH30B2JL): angka hari tetap dibaca dari angka setelah UH, sehingga UH30B2JL dianggap UH30. Jika sudah ada kode UH, lanjutkan dari hari berikutnya (sudah ada UH5 wajib lanjut UH6 sampai UH10; sudah ada UH10 wajib lanjut UH11 sampai UH15) hingga 5 hari terisi penuh sejak hari kelanjutan. Jika belum ada kode UH sama sekali (percakapan masih baru), mulai dari UH1. Komposisi hari lanjutan tetap 4 ide per hari dan WAJIB mengikuti fase di <fase_channel> pada prompt ini, dengan hari ke-1 = hari kelanjutan pertama, walaupun ide di riwayat memakai komposisi, jumlah ide per hari, atau fase lain.",
      "- ATURAN UTAMA: SEMUA FUNNEL (TOFU, MOFU, dan BOFU) memakai campuran fakta unik/aneh, problem awareness, dan meme relate sesuai <ragam_angle>, disesuaikan ke sudut pandang funnel masing-masing.",
      "- Semua kode ditulis tanpa akhiran, sesuai <format_output>.",
      ...isiFunnel(bofu, { T: "TOFU", M: "MOFU", B: "BOFU" }),
      "</tugas>",
      "",
      "<format_output>",
      "Semua judul WAJIB diawali KODE UH: UH{hari}{T|M|B}{nomor} — UH = Utas Hari, angka = nomor hari (cth UH6 = hari 6), T = TOFU, M = MOFU, B = BOFU, nomor = urutan ide per jenis dalam hari itu dan WAJIB reset ke 1 setiap hari (lengkapnya lihat komposisi di <tugas>).",
      "Kode ditulis tanpa akhiran apa pun (contoh: UH2T2, UH5M1, UH4B1), juga untuk kode lanjutan UH6 dst. DILARANG menambahkan akhiran seperti JL di belakang kode.",
      "Tiap ide ditampilkan di dalam satu code block markdown sendiri, dengan pembuka ```markdown dan penutup ``` sendiri per ide. Di dalam code block itu, ide diawali persis kode UH lengkap + spasi + judul tulisan, lalu 2 baris di bawahnya. Pola persis per ide:",
      "```markdown",
      "UH1T1 Judul topik ide tulisan",
      "- Alasan: 1 kalimat",
      "- Bukti: 1 kalimat tentang pola viral yang ditiru",
      "```",
      "Untuk SEMUA funnel (TOFU, MOFU, BOFU), awali Alasan dengan tag angle yang sesuai dari <ragam_angle> (cth: [FAKTA-UNIK-SAINS], [PROBLEM-KEBIASAAN-SALAH], [MEME-POV]).",
      "Setiap nomor WAJIB punya Alasan dan Bukti, tidak boleh judul saja.",
      'DILARANG markdown lain, tabel, JSON, dan code block tambahan: di dalam code block per ide tanpa **bold**, ## heading, | tabel, atau > quote; satu-satunya code block adalah pembuka ```markdown dan penutup ``` tiap ide. DILARANG penomoran gaya "1." atau label [FUNNEL] tambahan selain kode UH di awal judul. Hanya pola di atas.',
      "DILARANG mengemas jawaban sebagai file .md, .docx, atau .pdf — seluruh hasil ditampilkan langsung di percakapan sesuai format di atas.",
      "</format_output>",
      "",
      "<guardrail>",
      "1. " + aturanProduk,
      "2. " + guardrailAngle(),
      "3. DILARANG menyebut kata video, reels, shorts, TikTok, atau YouTube Shorts. Semua ide harus berbentuk utas tulisan berurutan.",
      "4. DILARANG politik, SARA, gosip.",
      "5. Jangan mengarang angka, URL, atau nama akun di Bukti. Jika tidak ada di Hasil riset, jelaskan pola umumnya (hook, format, emosi) tanpa menyebut sumber spesifik.",
      "6. Tidak ada ide kembar: angle, sudut pandang, dan hook tiap ide harus berbeda.",
      "7. Jangan menanyakan apa pun kepadaku. Jika ada data kosong, simpulkan dari konteks.",
      "</guardrail>",
      "",
      "Cek mandiri sebelum menjawab: ai sudah memeriksa riwayat percakapan untuk menentukan hari awal (belum ada kode UH = mulai UH1; ada kode tertinggi = lanjut hari berikutnya, akhiran JL diabaikan saat membaca riwayat), mencetak rencana penuh 5 hari × 4 ide = 20 ide tanpa hari skip, komposisi tiap hari sesuai fase di <fase_channel> (" + komposisi + ") dengan urutan " + (bofu ? "TOFU-MOFU-BOFU" : "TOFU-MOFU") + ", porsi dan nada tiap funnel sesuai arahan fase, kode UH berurutan tanpa lompat/duplikat dan nomor reset tiap hari, SEMUA kode ditulis tanpa akhiran, setiap ide punya Alasan dan Bukti, tiap hari berisi campuran fakta unik/aneh, problem awareness, dan meme relate (ketiga jenis muncul tiap hari, tiap jenis minimal 6 ide dalam 5 hari, TOFU tidak hanya fakta unik, tidak ada 3 ide berurutan berjenis angle sama) dengan Alasan diawali tag angle-nya ([FAKTA-UNIK-...], [PROBLEM-...], atau [MEME-...]), meme relate menertawakan situasi bukan orang, problem awareness tidak menakut-nakuti atau mengklaim tanpa dasar, setiap ide terbungkus satu code block ```markdown``` sendiri, tidak ada markdown/code block lain selain pembuka ```markdown dan penutup ``` tiap ide, tidak ada kata video/reels/shorts, aturan nama produk/brand/harga/CTA terpenuhi, dan jawaban hanya tampil di chat, bukan file .md/.docx/.pdf.",
    ].join("\n");
  }

  const penyusun = { utama: build };
  return penyusun[keluaran]();
}
