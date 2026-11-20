import "server-only";
import { buatDokumen } from "./dokumen";

// Penyusun prompt "visual-planner-video-pendek". Hanya berjalan di server.
// Kode di dalam fungsi ini disalin apa adanya dari versi HTML (index_84ffc9.html);
// "document" diganti tiruan yang membaca isian form dari server.
export function susunVisualPlannerVideoPendek(input, keluaran) {
  const document = buatDokumen(input);

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
  function lvl() {
    var r = document.querySelector('input[name="level"]:checked');
    return r ? r.value : "VO";
  }
  function problem() {
    return !v("naskah") ? "Isi potongan naskah" : "";
  }

  function build() {
    var L = lvl(),
      th = L === "TalkingHead";
    var aturanProduk =
      "ATURAN PRODUK SESUAI FUNNEL: Jika funnel TOFU, DILARANG menampilkan produk, kemasan, logo, brand, atau demo produk di klip mana pun. Jika funnel MOFU atau BOFU, BOLEH menyertakan Shot Produk (produk asli milikku: kemasan, tekstur, detail, produk di tangan/di tempat pakai) dan Demo Produk (cara pakai, proses pemakaian, sebelum-sesudah pemakaian yang wajar) pada klip yang relevan — terutama saat naskah membahas solusi, cara pakai, bukti, atau penawaran. Tidak wajib di semua klip; klip lain tetap memakai sumber visual biasa. Klip Shot/Demo Produk direkam sendiri dari produk asli: tidak perlu <riset_footage>, DILARANG Prompt AI yang menggambarkan produk (AI tidak bisa meniru produk asli dengan akurat), dan baris Prompt AI diisi persis: Tidak Perlu AI, Rekam Sendiri Produk Asli. Kata Kunci Pencarian Footage tetap diisi sebagai referensi gaya pengambilan gambar produk sejenis.";
    var fmt = [
      "1. {Rentang Timestamp} {Potongan Naskah}",
      th ? "- Sumber Visual :" : null,
      th ? "...." : null,
      "- Yang Wajib Tampil :",
      "....",
      "- Kata Kunci Pencarian Footage (wajib di dalam satu code block ```markdown``` sendiri, berisi 3 baris bahasa):",
      "```markdown",
      "ID Indonesia: ...",
      "EN Inggris: ...",
      "CN China: ...",
      "```",
      "- Teks di Layar (On Screen Text) (wajib di dalam satu code block ```markdown``` sendiri; jika tidak perlu, tulis tanda - polos tanpa code block):",
      "```markdown",
      "....",
      "```",
      "- Prompt AI atau Tidak Perlu AI (jika perlu AI: prompt Inggris di dalam satu code block ```markdown``` sendiri; jika cukup footage: tulis persis Tidak Perlu AI, Cari Footage di Internet dengan Kata Kunci tanpa code block):",
      "```markdown",
      "....",
      "```",
    ];
    if (th)
      fmt = fmt.concat([
        "- Pembawaan Gerak Tangan :",
        "....",
        "- Intonasi Bicara :",
        "....",
        "- Ekspresi Wajah :",
        "....",
        "- Momen Produk :",
        "....",
      ]);
    fmt = fmt.filter(function (x) {
      return x !== null;
    });
    fmt.push("2. {Rentang Timestamp} {Potongan Naskah}", "dst.");
    if (th)
      fmt.push(
        "",
        "COVER",
        "....",
        "",
        "BAHAN INFLUENCER VIDEO BUILDER",
        "```markdown",
        "00:00-00:08 {Potongan Naskah 1} [Ekspresi: ... | Tangan: ... | Intonasi: ... | Produk: ...]",
        "00:08-00:16 {Potongan Naskah 2} [Ekspresi: ... | Tangan: ... | Intonasi: ... | Produk: ...]",
        "dst. sampai potongan terakhir",
        "```",
        "(Angka timestamp di pola hanya contoh bentuk; pakai rentang timestamp asli tiap potongan.)",
      );
    var a = [
      "<konteks_dasar>",
      "KONTEKS DASAR (WAJIB DITAATI): Semua konteks utama ada di knowledge yang saya tempel di awal chat ini — hasil Zenka Riset (audiens, strategi TOFU/MOFU/BOFU, ide TOFU#/MOFU#/BOFU# beserta Alasan/Bukti dan Referensi verbatim). Strategi funnel dan gaya bahasa mengikuti knowledge itu.",
      "</konteks_dasar>",
      "",
      "<peran>",
      "Kamu menjalankan " + (th ? "tiga" : "dua") + " peran berurutan:",
      "1. Video Storyboard Planner: memakai potongan naskah yang sudah jadi sebagai klip, lalu menentukan apa yang harus tampil serta teks di layar untuk tiap klip.",
      "2. Footage Researcher dan AI Visual Prompt Engineer: MENCARI footage nyata di internet untuk tiap klip (browser tab / web search), menyusun kata kunci pencarian footage tiga bahasa yang terbukti menghasilkan video, menulis prompt gambar AI HANYA jika footage nyata benar-benar tidak ditemukan (buntu), dan merancang konsep cover.",
      th
        ? "3. AI Presenter Director: mengarahkan ekspresi wajah, gerak tangan, intonasi, dan momen produk karakter AI influencer (videonya dibuat di Zenka Influencer video builder) sesuai emosi tiap kalimat, lalu menyusun bahan siap tempel untuk Influencer video builder."
        : null,
      "</peran>",
      "",
      "<konteks>",
      "Level: " +
        (th
          ? "TalkingHead dengan karakter AI influencer: karakter duduk di studio podcast dan berbicara ke kamera. Video karakter (A-Roll) dibuat di Zenka Influencer video builder untuk SELURUH naskah, jadi suaranya berjalan terus dari awal sampai akhir. Klip yang sumber visualnya bukan Karakter Tampil berarti visual itu MENIMPA video karakter saat editing, sementara suaranya tetap dari video karakter."
          : "VO (voice over, tanpa wajah)"),
      "FUNNEL (tentukan sendiri, jangan tanya aku): cocokkan naskah dengan ide TOFU#/MOFU#/BOFU# dan strategi funnel di knowledge Zenka Riset. TOFU = menarik perhatian audiens baru lewat masalah/edukasi umum tanpa jualan; MOFU = membangun kepercayaan lewat solusi, cara, bukti, atau perbandingan; BOFU = mendorong keputusan lewat penawaran, testimoni, atau ajakan membeli. Jika tidak jelas, anggap TOFU. Funnel ini menentukan ATURAN PRODUK SESUAI FUNNEL di <aturan_isi> 1.",
      "DEFINISI FRASA FOKUS & TEKS OVERLAY (tentukan sendiri dari naskah, jangan tanya aku): FRASA FOKUS = 3-6 kata inti dari kalimat pertama (hook) di potongan pertama yang menjadi kata kunci utama video. TEKS OVERLAY = teks penegas singkat 3-6 kata untuk klip 1 dan cover, diambil dari frasa fokus atau inti hook, tanpa mengarang fakta atau angka.",
      "Potongan naskah (sudah dipotong di Zenka Naskah menjadi klip tepat 8 detik; 1 baris = 1 klip, diawali rentang timestamp dalam langkah 8 detik; total 4/8/12 klip = 32/64/96 detik):\n" + v("naskah"),
      "</konteks>",
      "",
      "<langkah>",
      "LANGKAH 1, sebagai Storyboard Planner, PAKAI POTONGAN APA ADANYA: tiap baris potongan di <konteks> = 1 klip tepat 8 detik = 1 nomor. Salin rentang timestamp dan isi potongan verbatim, urutan sama persis. DILARANG memotong ulang, menggabungkan, memecah, mengubah teks, atau mengubah timestamp. Total durasi video sudah dibulatkan ke kelipatan 8 (32/64/96 detik); selisih dari durasi pilihan adalah toleransi dan bukan alasan untuk mengubah klip. Tiap potongan adalah KONTEKS KLIP VIDEO.",
      "",
      "LANGKAH 2, sebagai Storyboard Planner" +
        (th
          ? ", Footage Researcher, dan Presenter Coach"
          : " dan Footage Researcher") +
        ", ISI DAFTAR: untuk SETIAP potongan, isi semua sub-baris berdasarkan konteks klip itu saja (jangan generik, jangan campur konteks potongan lain). Untuk setiap klip, tentukan dulu Yang Wajib Tampil, lalu JALANKAN <riset_footage> untuk klip itu SEBELUM mengisi Kata Kunci Pencarian Footage dan Prompt AI atau Tidak Perlu AI.",
      "",
      'LANGKAH 3, sebagai AI Visual Prompt Engineer, COVER: setelah daftar selesai, tulis bagian COVER berisi konsep cover final 9:16, teks overlay (sama persis dengan Teks di Layar klip 1), dan keputusan prompt AI image-to-image berdasarkan aset klip aktual. Utamakan frame dari footage nyata yang ditemukan di <riset_footage>' +
        (th ? " atau frame dari video karakter" : "") +
        '. Jika perlu gambar AI, tulis prompt Inggris detail dan sebut gambar klip dasarnya. Jika footage cukup, tulis "Tidak Perlu AI".',
      th ? "" : null,
      th
        ? "LANGKAH 4, sebagai AI Presenter Director, BAHAN INFLUENCER VIDEO BUILDER: setelah COVER, susun SEMUA potongan (termasuk klip yang nanti ditimpa visual lain, karena suaranya tetap dari video karakter) menjadi satu code block, 1 baris per potongan, urutan sama: rentang timestamp dan potongan naskah verbatim, lalu arahan dalam kurung siku [Ekspresi: ... | Tangan: ... | Intonasi: ... | Produk: ...]. Isi arahan diringkas dari sub-baris Ekspresi Wajah, Pembawaan Gerak Tangan, Intonasi Bicara, dan Momen Produk klip itu, masing-masing maksimal 8 kata, konkret, tanpa tanda | atau ] di dalamnya."
        : null,
      "</langkah>",
      "",
      "<riset_footage>",
      "PRINSIP: UTAMAKAN VIDEO NYATA YANG SUDAH ADA. Prompt AI untuk generate video/gambar adalah JALAN TERAKHIR, hanya dipakai jika pencarian footage nyata sudah buntu.",
      "WAJIB riset web live. TIDAK WAJIB Claude Cowork — yang penting bisa search web. AKSES RISET (pakai yang tersedia): (1) jika kamu Claude Cowork atau AI lain yang bisa membuka tab browser, buka platform langsung di tab (pakai tab TikTok, Instagram, YouTube, Facebook, Google di grup ini jika ada); (2) jika Claude Cowork atau tab browser TIDAK tersedia (misalnya Claude paket gratis atau AI lain), lanjutkan dengan fitur pencarian web (web search) untuk SEMUA pencarian footage: cari URL dan kata kunci di langkah-langkah di bawah lewat web search (cth \"[kata kunci EN] stock video pexels\"), lalu buka halaman hasilnya jika bisa; (3) HANYA jika tab browser DAN web search sama-sama tidak tersedia, JANGAN tulis output apa pun — batalkan tugas dan katakan kamu tidak bisa memproses tanpa riset web, lalu minta aku mengaktifkan fitur web search. DILARANG memutuskan ada/tidaknya footage dari ingatan atau perkiraan: keputusan hanya dari yang terlihat di tab atau di hasil web search.",
      "Untuk SETIAP klip (kecuali klip yang sumber visualnya " +
        (th ? "Karakter Tampil/A-Roll atau " : "") +
        "Shot/Demo Produk saat funnel MOFU/BOFU), cari footage yang menampilkan isi Yang Wajib Tampil:",
      "1. Susun kata kunci awal ID, EN, CN (2-4 kata, konkret: subjek + aksi/benda + tempat).",
      "2. Cari dengan kata kunci itu di sumber berikut (buka halamannya, lihat hasilnya):",
      "- Stok gratis: https://www.pexels.com/search/videos/[kata-kunci-EN]/ | https://pixabay.com/videos/search/[kata-kunci-EN]/ | https://mixkit.co/free-stock-video/[kata-kunci-EN]/ | https://coverr.co/s?q=[kata-kunci-EN]",
      "- Platform: https://www.youtube.com/results?search_query=[kata-kunci] | https://www.tiktok.com/search?q=[kata-kunci] | Google Video: https://www.google.com/search?q=[kata-kunci]&tbm=vid",
      "- Kata kunci CN: https://search.bilibili.com/all?keyword=[kata-kunci-CN] | https://www.douyin.com/search/[kata-kunci-CN]",
      "3. Footage DITEMUKAN = minimal 1 VIDEO nyata (bukan foto, bukan hasil AI) yang benar-benar terlihat di hasil pencarian dan cocok dengan Yang Wajib Tampil (subjek + aksi + tempat sama atau sangat mirip, orientasi apa pun boleh karena bisa di-crop 9:16).",
      "4. Jika belum ketemu, JANGAN langsung pakai AI: ganti kata kunci minimal 3 variasi (sinonim, lebih umum, sudut berbeda dari ide yang sama, bahasa lain) dan cek lagi di minimal 3 sumber berbeda.",
      "5. KEPUTUSAN: jika ditemukan, Kata Kunci Pencarian Footage WAJIB berisi kata kunci yang TERBUKTI memunculkan video itu (bukan kata kunci awal yang gagal), dan baris Prompt AI diisi persis: Tidak Perlu AI, Cari Footage di Internet dengan Kata Kunci. Jika setelah semua variasi dan sumber tetap tidak ada video yang cocok (buntu), barulah tulis Prompt AI sesuai aturan_isi 5, dan Kata Kunci tetap diisi variasi terbaik.",
      "6. DILARANG menulis Prompt AI untuk klip yang footage nyatanya ditemukan. Jangan login, jangan isi form, jangan klik follow/like/download.",
      "RISET INI KERJA INTERNAL: DILARANG menampilkan URL, daftar hasil pencarian, atau catatan riset di output. Output tetap PERSIS sesuai <format_output>; hasil riset hanya terlihat lewat Kata Kunci Pencarian Footage dan keputusan Prompt AI atau Tidak Perlu AI.",
      "</riset_footage>",
      "",
      "<format_output>",
      "Teks biasa (BUKAN tabel), daftar bernomor, satu nomor per klip. Aturan code block: sub-baris yang kucopy langsung (Kata Kunci Pencarian Footage, Teks di Layar saat ada, Prompt AI saat perlu AI) wajib di dalam code block ```markdown``` sendiri sesuai pola di bawah; nomor, {Potongan Naskah}, label, dan sub-baris polos lainnya tetap ditulis biasa.",
      fmt.join("\n"),
      "Total nomor = jumlah baris potongan di <konteks> (4/8/12), tanpa ditambah atau dikurangi; tiap klip tepat 8 detik dan total durasi 32/64/96 detik.",
      "DILARANG mengemas jawaban sebagai file .md, .docx, atau .pdf — seluruh hasil ditampilkan langsung di percakapan sesuai format di atas.",
      "</format_output>",
      "",
      "<aturan_isi>",
      "1. Sumber visual: " +
        (th
          ? "Karakter Tampil (A-Roll: video karakter AI dari Zenka Influencer video builder), Stok B-Roll, Gambar AI, atau Tangkapan Layar; ditambah Shot Produk atau Demo Produk HANYA jika funnel MOFU/BOFU. Tulis pilihannya di baris Sumber Visual. Klip Karakter Tampil tidak perlu <riset_footage>: Kata Kunci Pencarian Footage diisi tanda - polos tanpa code block, dan baris Prompt AI diisi persis: Tidak Perlu AI, Pakai Video Karakter dari Influencer Video Builder. Klip lain menimpa video karakter saat editing. Utamakan Karakter Tampil di klip 1 (hook) dan klip terakhir (CTA)."
          : "NEVER Talking Head atau wajah kreator. HANYA Stok B-Roll, Gambar AI, Rekaman Layar, atau Infografis; ditambah Shot Produk atau Demo Produk (demo cukup tangan/produk, tanpa wajah kreator) HANYA jika funnel MOFU/BOFU.") +
        " " +
        aturanProduk,
      "2. Yang Wajib Tampil: 1-2 kalimat Bahasa Indonesia untuk pemula (siapa, sedang apa, di mana, benda apa). DILARANG istilah teknis: close-up, medium shot, angle, framing, B-Roll, footage, overlay, cinematic, POV, transisi, cut, talking head, asset, render.",
      '3. Kata Kunci Pencarian Footage: tiap kata kunci 2-4 kata, visual-searchable, konkret, dan TERBUKTI memunculkan video yang cocok saat dicari di <riset_footage>. Tulis tiap bahasa di baris terpisah dengan format "ID Indonesia: ...," lalu "EN Inggris: ...," lalu "CN China: ...,". SETIAP kata kunci diakhiri koma lalu ENTER (baris baru). CN WAJIB Hanzi (pinyin opsional), jangan pinyin saja.',
      "4. Teks di Layar (On Screen Text): singkat dan relevan dengan konteks potongan; boleh kata kunci, frasa penegas, atau angka. Jika tidak perlu, isi dengan tanda -.",
      '5. Prompt AI: HANYA jika <riset_footage> buntu (tidak ada video nyata yang cocok setelah semua variasi kata kunci dan sumber dicoba), tulis prompt Inggris detail (subjek + aksi + setting + lighting + camera move + vertical 9:16) yang WAJIB memuat frasa "cinematic haze", "lens flare", dan "depth of field". Jika cukup footage, isi persis: Tidak Perlu AI, Cari Footage di Internet dengan Kata Kunci.',
      "6. OVERLAY: Teks di Layar klip 1 WAJIB berisi teks overlay yang kamu tentukan dari frasa fokus (huruf besar kontras, 9:16, safe-area, tanpa watermark), dan teks yang sama dipakai di COVER.",
      th
        ? "7. Arahan karakter AI (isi untuk SEMUA klip, termasuk klip yang ditimpa visual lain, karena video karakter dibuat untuk seluruh naskah). Karakter duduk di studio podcast di belakang meja dan mikrofon, jadi semua gerak harus kecil, wajar, dan bisa dibuat AI video: Pembawaan Gerak Tangan = gerakan tangan konkret di depan dada atau di atas meja (mis. telapak terbuka ke arah kamera, menghitung dengan jari, menunjuk ringan ke kamera), tidak pernah menutupi wajah atau mulut, tanpa gerakan cepat atau rumit. Intonasi Bicara = nada sesuai emosi kalimat (mis. pelan-tegas, bersemangat, prihatin). Ekspresi Wajah = ekspresi natural sesuai emosi kalimat, tanpa berlebihan. Momen Produk = - jika funnel TOFU atau klip tidak membahas produk; jika MOFU/BOFU dan klip membahas produk, isi pegang, angkat ke kamera, atau demo: {aksi singkat}. Momen produk hanya dipakai jika switch Pegang produk dinyalakan di Influencer video builder, dan tangan yang memegang produk tidak dipakai untuk gerak tangan."
        : null,
      "</aturan_isi>",
      "",
      "<guardrail>",
      "DILARANG SARA. Topik POLITIK dan GOSIP (selebriti, figur publik, drama viral) BOLEH dengan visual NETRAL: (a) tidak memihak siapa pun — DILARANG logo, atribut, warna, atau simbol partai/kubu yang terbaca sebagai dukungan atau serangan; (b) DILARANG karikatur merendahkan, meme yang menghina tokoh, body shaming, atau Teks di Layar yang mengejek; (c) footage peristiwa asli dari sumber berita boleh, DILARANG menampilkan info pribadi; (d) Prompt AI DILARANG menggambarkan tokoh politik atau selebriti nyata (wajah/nama) — pakai ilustrasi netral atau simbol peristiwa; (e) visual dan Teks di Layar hanya mendukung sudut pandang frasa produk/kategori produk, bukan mengomentari orangnya atau pilihan politiknya.",
      "Jangan mengarang fakta atau angka di Teks di Layar. Jangan menanyakan apa pun kepadaku.",
      "</guardrail>",
      "",
      "Cek mandiri sebelum menjawab: funnel sudah ditentukan dari naskah dan knowledge, dan aturan produknya ditaati (TOFU tanpa produk sama sekali); setiap klip sudah dicari footage nyatanya lewat tab browser atau web search (bukan dari ingatan); kata kunci yang ditulis terbukti memunculkan video yang cocok; Prompt AI hanya muncul di klip yang footage-nya buntu, klip lain berisi Tidak Perlu AI, Cari Footage di Internet dengan Kata Kunci" + (th ? " (kecuali klip Karakter Tampil)" : "") + "; tiap nomor memakai 1 baris potongan dari <konteks> verbatim beserta rentang timestamp-nya, berurutan, tanpa dipotong ulang atau digabung, dan tiap klip tepat 8 detik; jumlah nomor sama dengan jumlah potongan (4/8/12); frasa fokus dan teks overlay sudah ditentukan, teks di layar klip 1 sama dengan teks overlay COVER; setiap prompt AI memuat tiga frasa wajib; COVER ditulis setelah daftar; setiap kata kunci pencarian, teks di layar (saat ada), dan prompt AI (saat perlu AI) berada di dalam code block ```markdown``` sendiri; " +
        (th
          ? "tiap klip punya Sumber Visual, dan klip Karakter Tampil berisi Tidak Perlu AI, Pakai Video Karakter dari Influencer Video Builder; setelah COVER ada label BAHAN INFLUENCER VIDEO BUILDER dan satu code block berisi SEMUA potongan verbatim dengan timestamp aslinya, urutan sama, masing-masing diakhiri arahan [Ekspresi | Tangan | Intonasi | Produk], dan Produk berisi - untuk TOFU; "
          : "") +
        "jawaban hanya tampil di chat, bukan file .md/.docx/.pdf.",
    ];
    return a
      .filter(function (x) {
        return x !== null;
      })
      .join("\n");
  }

  const penyusun = { utama: build };
  return penyusun[keluaran]();
}
