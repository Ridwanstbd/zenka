import "server-only";
import { buatDokumen } from "./dokumen";
import { BATAS_ANGLE, bacaAngle } from "./ragam-angle";

// Penyusun prompt "caption-video-pendek". Hanya berjalan di server.
// Kode di dalam fungsi ini disalin apa adanya dari versi HTML (index_72470b.html);
// "document" diganti tiruan yang membaca isian form dari server.
export function susunCaptionVideoPendek(input, keluaran) {
  const document = buatDokumen(input);

  function v(id) {
    return document.getElementById(id).value.trim();
  }
  function say(m) {
    var s = document.getElementById("st");
    s.textContent = m;
    setTimeout(function () {
      s.textContent = "";
    }, 2500);
  }
  function ready() {
    return v("judul");
  }

  // Blok riset hashtag & frasa berbasis angka asli (dipakai ulang di zenka-caption-carousel).
  function rantaiRiset(platforms) {
    var P = {
      TikTok: {
        buka: "- TikTok: buka https://www.tiktok.com/tag/[hashtag] -> catat jumlah posts/videos (dan views jika tampil). Frasa: https://www.tiktok.com/search?q=[frasa].",
        ambang: "| TikTok (posts) | < 1rb | 1rb – 100rb* | > 500rb |",
      },
      Instagram: {
        buka: "- Instagram: buka https://www.instagram.com/explore/tags/[hashtag]/ -> catat jumlah posts. Jika perlu login atau angka disembunyikan, tulis \"tidak terlihat\" — jangan menebak.",
        ambang: "| Instagram (posts) | < 10rb | 10rb – 500rb | > 1 juta |",
      },
      "YouTube Shorts": {
        buka: "- YouTube Shorts: buka https://www.youtube.com/hashtag/[hashtag] -> catat jumlah videos dan channels. Frasa: https://www.youtube.com/results?search_query=[frasa].",
        ambang: "| YouTube Shorts (videos) | < 100rb | 100rb – 5 juta | > 5 juta / mega-tag |",
      },
      Facebook: {
        buka: "- Facebook: buka https://www.facebook.com/hashtag/[hashtag] -> catat angka jika tampil; jika tidak tampil tulis \"tidak terlihat\", lalu ukuran boleh memakai angka Instagram tag yang sama dengan tanda \"acuan IG\".",
        ambang: "| Facebook (posts, jika terlihat) | < 10rb | 10rb – 500rb | > 1 juta |",
      },
      Threads: {
        buka: "- Threads: buka https://www.threads.com/search?q=[topik] -> Threads tidak menampilkan jumlah post; catat apakah topic tag muncul di saran pencarian (ya/tidak) dan recency hasilnya.",
        ambang: "",
      },
    };
    var L = [
      "PERAN TAMBAHAN (kerjakan PERTAMA, sebelum menulis caption): kamu adalah riset analis hashtag & keyword konten short-form. Riset WAJIB memakai data live dari internet. TIDAK WAJIB Claude Cowork — yang penting bisa search web. AKSES RISET (pakai yang tersedia): (1) jika kamu Claude Cowork atau AI lain yang bisa membuka tab browser, buka platform langsung di tab (pakai tab TikTok, Instagram, YouTube, Facebook, Google di grup ini jika ada); (2) jika Claude Cowork atau tab browser TIDAK tersedia (misalnya Claude paket gratis atau AI lain), lanjutkan dengan fitur pencarian web (web search) untuk SEMUA langkah riset: cari URL dan kata kunci di langkah-langkah di bawah lewat web search, lalu buka halaman hasilnya jika bisa; (3) HANYA jika tab browser DAN web search sama-sama tidak tersedia, JANGAN tulis output apa pun — batalkan tugas dan katakan kamu tidak bisa memproses tanpa riset web, lalu minta aku mengaktifkan fitur web search. Ambil HANYA angka yang benar-benar terlihat di tab atau di hasil web search. DILARANG mengarang angka atau mengisinya dari ingatan.",
      "Input riset: Topik = Topik di <konteks>; niche = produk di konteks dasar; bahasa/negara target = audiens di konteks dasar (default Indonesia); platform = " + platforms.join(", ") + ".",
      "",
      "LANGKAH 1 — Kumpulkan kandidat: buat 15–20 kandidat hashtag dan 10 kandidat frasa/keyword dari Topik + niche, campuran bahasa lokal dan Inggris, dari umum sampai sangat spesifik. Tambahkan kandidat dari autocomplete kolom pencarian tiap platform (ketik topik, catat saran yang muncul).",
      "LANGKAH 2 — Buka dan hitung di tiap platform: untuk SETIAP kandidat, buka halamannya dan catat angka persis yang tampil:",
    ];
    platforms.forEach(function (p) {
      L.push(P[p].buka);
    });
    L.push(
      "Jika halaman gagal dimuat, web search \"[hashtag] [platform]\" dan pakai angka hanya jika sumbernya jelas dan terbaru; tandai \"dari web search\".",
      "MODE WEB SEARCH (tanpa tab browser): jumlah posts sering tidak tampil (mis. Instagram perlu login). Pakai angka hanya jika memang terlihat di hasil pencarian atau halaman yang dibuka. Jika tetap tidak terlihat, tentukan ukuran kecil/menengah/besar dari sinyal yang terlihat: banyaknya hasil dan konten baru, seberapa sering tag/frasa muncul di konten teratas, apakah hasil teratas didominasi akun/media raksasa, dan apakah sudah jadi topik utama nasional (= besar) atau baru 1-2 hasil (= kecil). Penilaian ini hanya untuk kerja internal; DILARANG menuliskannya sebagai angka.",
      "LANGKAH 3 — Cek kesegaran (recency): di halaman hashtag/hasil pencarian, lihat 9–12 konten teratas dan catat berapa yang diunggah dalam 7 hari dan 30 hari terakhir, untuk menilai apakah tag/frasa sedang naik atau sudah jenuh.",
      "LANGKAH 4 — Klasifikasi ukuran:",
      "| Platform | Kecil | MENENGAH (target) | Besar |",
    );
    platforms.forEach(function (p) {
      if (P[p].ambang) L.push(P[p].ambang);
    });
    if (platforms.indexOf("TikTok") > -1)
      L.push(
        "*Jika TikTok menampilkan views, pakai patokan views: menengah = 100rb – 500rb (batas atas 1 juta).",
      );
    L.push(
      "Angka di celah antar-ambang (mis. Instagram 500rb–1 juta) = menengah-atas: boleh mengisi slot besar bila tak ada tag besar yang relevan.",
      "Hashtag generik #fyp, #foryou, #fypシ, #viral, #trending, #reels, #explore, #shorts otomatis dikeluarkan dari kandidat (#shorts hanya dipakai sebagai slot wajib YouTube jika ada).",
      "LANGKAH 5 — Frasa / keyword: tiap frasa cari di kolom search tiap platform (dan Google), catat: muncul di autocomplete (ya/tidak); jumlah hasil yang ditampilkan (jika tidak ada, tulis \"tidak ditampilkan\"); recency = berapa dari 10 hasil teratas yang < 7 hari. Frasa berpotensi = muncul di autocomplete + ≥ 3 dari 10 hasil < 7 hari + konten teratas belum didominasi akun raksasa.",
      "LANGKAH 6 — Frasa tren acak: cari frasa/topik yang SEDANG TREN secara acak, BOLEH di luar niche (film/series, musik, olahraga, kejadian, politik, gosip/selebriti, meme, istilah viral; tetap di luar SARA; tren politik dan gosip wajib mengikuti aturan NETRAL di <guardrail>). Buka https://www.tiktok.com/search?q=[frasa] , https://www.instagram.com/explore/tags/[tag]/ , https://www.youtube.com/results?search_query=[frasa] , dan https://trends.google.com/trending?geo=ID (jika bisa dibuka). Catat jumlah postingan/video yang terlihat.",
      "SARING 2 HARI: pakai hanya tren yang ramai dalam 2 hari terakhir (mayoritas konten teratas diunggah ≤ 2 hari). Lebih lama dari itu = buang.",
      "JUMLAH POSTINGAN MENENGAH: pakai hanya tren yang jumlah postingannya masuk ukuran MENENGAH di tabel Langkah 4 (sudah dicari orang, tapi belum jenuh dan belum didominasi akun raksasa). Terlalu kecil atau terlalu besar = buang. Jika angka tidak terlihat di platform mana pun, nilai ukurannya dari sinyal sesuai MODE WEB SEARCH; jika sinyalnya juga tidak cukup, buang.",
      "TES JEMBATAN (satu tes): bisakah jembatan dari tren itu ke kategori produk dijelaskan dalam SATU kalimat dan masih masuk akal bagi target audiens (= audiens di konteks dasar)? Kalau bisa, pakai. Kalau tidak, lewati dan cek tren berikutnya.",
      "Pilih 1 tren terbaik yang lolos saringan 2 hari, jumlah menengah, dan tes jembatan. Jika tidak ada satu pun yang lolos, frasa fokus kembali ke frasa kategori berpotensi Tinggi dari Langkah 5.",
      "Hasil riset (internal): tiap kandidat diberi status Pakai/Cadangan/Buang berdasarkan ukuran + recency; frasa diberi potensi Tinggi/Sedang/Rendah; tren diberi status Lolos/Lewati.",
      "",
      "ATURAN KETAT RISET: setiap angka harus berasal dari halaman atau hasil web search yang benar-benar dibuka di sesi ini (dengan URL yang jelas). Jika angka tidak terlihat, anggap \"tidak terlihat\" dan jangan pernah menulis angka perkiraan; ukurannya boleh dinilai dari sinyal sesuai MODE WEB SEARCH. Jangan login, jangan isi form, jangan klik follow/like/komentar. Jangan berhenti setelah 2–3 hashtag; selesaikan semua kandidat. Frasa fokus dan hashtag final HANYA boleh diambil dari hasil riset ini.",
      "RISET INI KERJA INTERNAL: DILARANG menampilkan tabel, angka, URL, atau catatan riset di output. Output tetap PERSIS sesuai <format_output> — hasil riset hanya terlihat lewat frasa fokus dan hashtag yang dipilih.",
    );
    return L.join("\n");
  }

  function build() {
    var fun = v("funnel"),
      bofu = fun === "BOFU";
    var av = v("ajakan");
    var ajMap = {
      komentar: "Komentar & Diskusi",
      ikuti:
        "Ikuti akun: ajak penonton menekan tombol follow pada akun yang memposting video ini (akunku), bukan sekadar mengikuti tips/sarannya",
      bio: "Klik Link di Bio",
      dm: "Pesan atau tanya dulu, DM aja ya!: ajak penonton mengirim pesan langsung (DM) ke akunku untuk bertanya soal topik atau produk",
    };
    var aj =
      av === "custom"
        ? v("ajakanCustom") || "Isi Sendiri"
        : ajMap[av] || av;
    var aturanFunnel = bofu
      ? "Mode BOFU: jual langsung, boleh menyebut nama produk, harga, dan CTA produk."
      : "Mode " + fun + ": DILARANG nama produk, brand, harga, atau CTA jualan.";
    return [
      "PERINTAH: BUAT CAPTION VIDEO PENDEK (Zenka Caption)",
      "<konteks_dasar>",
      "KONTEKS DASAR (WAJIB DITAATI): Semua konteks utama ada di knowledge yang saya tempel di awal chat ini — hasil Zenka Riset (audiens, strategi TOFU/MOFU/BOFU, ide TOFU#/MOFU#/BOFU# beserta Alasan/Bukti dan Referensi verbatim). Produk, target, nada, bukti/Referensi viral, dan aturan produk/harga/CTA per funnel mengikuti knowledge itu.",
      "</konteks_dasar>",
      "",
      "<peran>",
      "Kamu menjalankan dua peran berurutan:",
      "1. Social Media Copywriter: menulis caption pendek per platform dengan struktur Hook + Value + Pertanyaan/CTA yang meniru pola hook viral.",
      "2. Platform SEO dan Hashtag Specialist: menyusun hashtag sesuai kap per platform, tag YouTube siap paste (maksimal 500 karakter), dan sinyal GEO agar caption mudah dikutip AI.",
      "</peran>",
      "",
      "<konteks>",
      "Topik: " + (v("judul") || "-"),
      bacaAngle("riwayat"),
      "Mode funnel/CTA: " + fun,
      "Durasi: " +
        v("durasi") +
        " | Gaya: " +
        v("gaya") +
        " | Sapaan: " +
        v("sapaan") +
        " | CTA: " +
        aj,
      "Konteks produk, Alasan/Bukti, dan pola viral mengikuti knowledge awal chat ini (ide yang saya sebut berikut Referensi terkait di Zenka Riset).",
      "</konteks>",
      "",
      "<format_output>",
      "Aturan code block: SETIAP isi yang kucopy (caption, hashtag, judul YouTube, kategori, tag YouTube) wajib ditampilkan di dalam satu code block markdown sendiri, pola persis: baris ```markdown, baris baru, isi lengkap, baris baru, baris ``` penutup.",
       "Teks biasa. Tulis 7 bagian berurutan dengan judul persis (huruf kapital): TIKTOK, INSTAGRAM REELS, FACEBOOK REELS, THREADS, YOUTUBE SHORTS, KATEGORI VIDEO YOUTUBE, TAG YOUTUBE.",
       "- TIKTOK: 2 code block tanpa label lain: code block pertama berisi caption, code block kedua berisi tepat 3 hashtag satu baris.",
       "- INSTAGRAM REELS: 2 code block tanpa label lain: code block pertama berisi caption, code block kedua berisi tepat 5 hashtag satu baris.",
       "- FACEBOOK REELS: 2 code block tanpa label lain: code block pertama berisi caption, code block kedua berisi tepat 2 hashtag satu baris.",
       "- THREADS: 1 code block saja berisi caption yang diakhiri 1 topic tag inline (1 kata tanpa spasi setelah #, gaya #sourdoughbaking), DILARANG code block hashtag terpisah dan DILARANG lebih dari 1 tag.",
       "- YOUTUBE SHORTS: 3 code block berurutan tanpa label lain: pertama judul (maksimal 60 karakter, frasa fokus ditulis UTUH dan persis di awal judul, DILARANG ada hashtag di judul), kedua caption, ketiga tepat 3 hashtag satu baris (1 di antaranya wajib #shorts). Hashtag hanya untuk deskripsi video, bukan judul.",
       "- KATEGORI VIDEO YOUTUBE: 1 code block berisi kategori yang sesuai ketentuan resmi YouTube untuk video ini berdasarkan isi/topik. WAJIB kategori resmi YouTube saat upload video: Film & Animation, Autos & Vehicles, Music, Pets & Animals, Sports, Travel & Events, Gaming, People & Blogs, Comedy, Entertainment, News & Politics, Howto & Style, Education, Science & Technology. Topik meme relate yang isinya humor cocok ke Comedy atau Entertainment. DILARANG kategori di luar daftar resmi YouTube.",
       "- TAG YOUTUBE: 1 code block berisi tag siap paste ke kolom Tag di YouTube Studio, dipisah koma, tanpa tanda #, TOTAL TIDAK LEBIH DARI 500 KARAKTER (termasuk koma dan spasi). Tag PERTAMA = frasa fokus persis, sisanya turunan frasa fokus, termasuk 3-5 frasa pertanyaan long-tail gaya pencarian (cara/bagaimana/apakah) supaya mudah ditemukan Google dan Google AI (Gemini). Hitung total karakter sebelum menulis; jika lebih dari 500, buang tag dari urutan paling akhir sampai muat.",
      "DILARANG menulis label [CAPTION], [5HASHTAG], atau [JUDUL] di output.",
      "DILARANG mengemas jawaban sebagai file .md, .docx, atau .pdf — seluruh hasil ditampilkan langsung di percakapan sesuai format di atas.",
      "</format_output>",
      "",
      "<aturan_caption>",
      "1. Frasa fokus: GABUNGAN frasa tren acak yang lolos Langkah 6 di <riset_web> + frasa kategori produk (frasa kategori diambil dari frasa berpotensi Tinggi hasil Langkah 5; jika tak ada yang Tinggi, pakai Sedang terbaik), 3-6 kata, ditulis gaya QUERY PENCARIAN yang natural — kata yang orang sungguh ketik (mis. 'skincare ala drakor', bukan jargon brand). Jika tidak ada tren yang lolos, frasa fokus = frasa kategori saja (2-4 kata). SATU frasa ini dipakai MENGIKAT di semua caption, judul YouTube, dan tag YouTube; DILARANG mengganti frasa di tengah jalan.",
      "2. Hook paling cocok: susun TEPAT 1 hook terbaik untuk video ini — menahan scroll dalam 3 detik pertama, spesifik satu angle — lalu pakai sebagai bagian Hook yang konsisten di struktur tiap caption. Nada hook mengikuti ANGLE TOPIK di <konteks>: fakta unik = memancing rasa penasaran; problem awareness = menyentil masalah yang bikin penonton merasa \"ini aku banget\"; meme relate = hook bernada meme yang lucu dan relate (cth diawali \"POV:\", \"Tipe orang yang...\", atau \"Cuma aku yang...?\").",
      "3. Tiap caption: frasa fokus ada di 80 karakter pertama, total di bawah 200 karakter, struktur Hook + Value + Pertanyaan/CTA.",
      "4. Tiap caption WAJIB meniru 1 pola hook dari Referensi di konteks dasar (atau bukti yang saya lampirkan). Jika menyebut referensi viral, salin verbatim (judul, platform, tanggal, URL; views jika ada). URL karangan dianggap INVALID.",
      "5. GEO (Grounding AI): kalimat Hook tiap caption WAJIB bisa berdiri sendiri sebagai jawaban yang dapat dikutip ChatGPT/Perplexity/Google AI — pakai pertanyaan natural gaya pencarian (cara/bagaimana/apakah) atau klaim spesifik yang jelas. Untuk angle meme relate, Hook tetap bernada meme dan syarat GEO ini dipindah ke kalimat Value sesudahnya, yang menyebut situasi atau masalahnya dengan jelas sehingga tetap bisa dikutip AI. Angka/bukti hanya boleh dari Referensi di konteks dasar; DILARANG mengarang angka.",
      "6. " + aturanFunnel,
      "</aturan_caption>",
      "",
      "<riset_web>",
      rantaiRiset(["TikTok", "Instagram", "YouTube Shorts", "Facebook", "Threads"]),
      "</riset_web>",
      "",
      "<aturan_hashtag>",
      "Jumlah TEPAT per platform (kap resmi per platform): TIKTOK 3, INSTAGRAM REELS 5, FACEBOOK REELS 2, YOUTUBE SHORTS 3 (1 wajib #shorts), THREADS 1 topic tag inline di akhir caption (bukan code block hashtag).",
      "Komposisi wajib berdasarkan UKURAN hasil riset (Langkah 4 di <riset_web>), hanya dari kandidat berstatus Pakai. Hashtag TREN yang lolos Langkah 6 (ukurannya menengah) mengisi 1 slot menengah (jika ada); slot lain berisi hashtag kategori produk: INSTAGRAM REELS 5 = 1 besar + 3 menengah (1 tren + 1 keyword persis frasa fokus + 1 kategori) + 1 kecil. TIKTOK 3 = 1 besar + 2 menengah (1 tren + 1 keyword persis frasa fokus). FACEBOOK REELS 2 = 1 besar + 1 menengah (tren, atau keyword persis jika tak ada tren). YOUTUBE SHORTS 3 = #shorts (slot mega-tag wajib) + 1 tag tren + 1 tag niche/kategori. THREADS = 1 topic tag menengah/spesifik yang mudah dicari, tulis 1 kata tanpa spasi. Jika slot ukuran tertentu kosong, isi dengan kandidat Cadangan terdekat.",
      "Diurutkan dari reach terbesar (besar -> menengah -> kecil). SEMUA huruf kecil [a-z0-9] diawali #, huruf besar dianggap INVALID. DILARANG #fyp, #viral, #reels, #explore, #trending, dan tag tak relevan. Hashtag WAJIB di caption/deskripsi, bukan komentar dan bukan judul. Hashtag YouTube hanya masuk code block hashtag (deskripsi), DILARANG muncul di judul. Ambil dari hasil riset web (trending relevan saat ini) + niche produk di konteks dasar, bukan dari memori dan bukan mengarang.",
      "</aturan_hashtag>",
      "",
      "<guardrail>",
      "DILARANG SARA. Topik/tren POLITIK dan GOSIP (selebriti, figur publik, drama viral) BOLEH, dengan aturan NETRAL yang WAJIB berlaku di semua caption, judul, hashtag, dan tag YouTube: (a) tidak memihak atau membela siapa pun — partai, tokoh, kandidat, pemerintah, oposisi, selebriti, maupun pihak yang berseteru; (b) DILARANG ujaran kebencian, hinaan, ejekan, julukan merendahkan, body shaming, atau serangan kepada pihak mana pun; (c) DILARANG menilai siapa benar atau salah, DILARANG ajakan memilih, menolak, atau memboikot pihak tertentu; (d) DILARANG hoaks, rumor yang belum terkonfirmasi, tuduhan, info pribadi, atau klaim yang tidak terlihat di sumber yang dibuka; (e) HANYA berkomentar dari sudut pandang frasa produk/kategori produk: ambil sisi peristiwa yang netral dan faktual, lalu kaitkan ke angle topik seputar kategori produk, bukan mengomentari orangnya atau pilihan politiknya; (f) hashtag dari tren politik/gosip hanya boleh tag peristiwa atau istilah netral, DILARANG tag nama partai, kandidat, kubu, atau tag yang terbaca mendukung/menyerang; (g) tren POLITIK DILARANG dibawakan sebagai meme, dan meme dari tren GOSIP hanya menertawakan situasi penonton, bukan orang yang digosipkan. Jika tidak bisa netral, jangan pakai tren itu.",
      BATAS_ANGLE,
      "Jangan mengarang spek, angka, atau persen hasil pasti. Jangan menanyakan apa pun kepadaku.",
      "</guardrail>",
    ].join("\n");
  }

  const penyusun = { utama: build };
  return penyusun[keluaran]();
}
