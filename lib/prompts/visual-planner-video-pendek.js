import "server-only";
import { buatDokumen } from "./dokumen";
import { BATAS_MEME, bacaAngle } from "./ragam-angle";

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
  function problem() {
    return !v("naskah") ? "Isi potongan naskah" : "";
  }

  function build() {
    var aturanProduk =
      "ATURAN PRODUK SESUAI FUNNEL: Jika funnel TOFU, DILARANG menampilkan produk, kemasan, logo, brand, atau demo produk di klip atau B-roll mana pun. Jika funnel MOFU atau BOFU, BOLEH menyertakan B-roll Shot Produk (produk asli milikku: kemasan, tekstur, detail, produk di tangan/di tempat pakai) dan Demo Produk (cara pakai, proses pemakaian, sebelum-sesudah pemakaian yang wajar) pada bagian transkrip yang relevan — terutama saat naskah membahas solusi, cara pakai, bukti, atau penawaran. Tidak wajib ada; B-roll lain tetap memakai sumber visual biasa. B-roll Shot/Demo Produk direkam sendiri dari produk asli: tidak perlu <riset_footage>, DILARANG Prompt AI yang menggambarkan produk (AI tidak bisa meniru produk asli dengan akurat), dan baris Prompt AI diisi persis: Tidak Perlu AI, Rekam Sendiri Produk Asli. Kata Kunci Pencarian Footage tetap diisi sebagai referensi gaya pengambilan gambar produk sejenis.";
    var fmt = [
      "1. {Rentang Timestamp} {Potongan Naskah}",
      "- Teks di Layar (On Screen Text) (jika tidak perlu, tulis tanda - polos):",
      "....",
      "- Pembawaan Gerak Tangan :",
      "....",
      "- Intonasi Bicara :",
      "....",
      "- Ekspresi Wajah :",
      "....",
      "- Momen Produk :",
      "....",
    ];
    fmt.push(
      "2. {Rentang Timestamp} {Potongan Naskah}",
      "dst.",
      "",
      "B-ROLL TIMPA",
      "B-Roll 1",
      '- Posisi Timpa : dari kata "{kata awal}" sampai kata "{kata akhir}"',
      "- Transkrip yang Ditimpa (kutipan verbatim dari kata awal sampai kata akhir):",
      "....",
      "- Sumber Visual :",
      "....",
      "- Yang Wajib Tampil :",
      "....",
      "- Kata Kunci Pencarian Footage (berisi 2 baris bahasa):",
      "ID Indonesia: ...",
      "EN Inggris: ...",
      "- Link Bukti Gambar (link GAMBAR yang SUDAH TERBUKTI ada dan terlihat saat riset, baik lewat tab browser maupun web search, yaitu gambar yang cocok dengan Yang Wajib Tampil; berisi 1-2 link; jika B-roll tidak perlu riset footage atau tidak ada link gambar yang terverifikasi, tulis tanda - polos):",
      "https://...",
      "- Prompt AI atau Tidak Perlu AI (jika perlu AI: prompt Inggris; jika cukup footage: tulis persis Tidak Perlu AI, Cari Footage di Internet dengan Kata Kunci):",
      "....",
      "",
      "B-Roll 2",
      "dst. (jika tidak ada bagian transkrip yang pas ditimpa, tulis tanda - polos di bawah label B-ROLL TIMPA)",
      "",
      "COVER",
      "....",
      "",
      "BAHAN INFLUENCER VIDEO BUILDER",
      "RASIO VIDEO: 9:16 vertikal penuh (1080x1920), tanpa letterbox atau bingkai hitam, karakter dan semua elemen dikomposisikan untuk layar vertikal.",
      "",
      "00:00-00:08 {Potongan Naskah 1} [Ekspresi: Menghadap kamera, ... | Tangan: ... | Intonasi: ... | Produk: ...]",
      "00:08-00:16 {Potongan Naskah 2} [Ekspresi: ... | Tangan: ... | Intonasi: ... | Produk: ...]",
      "dst. sampai potongan terakhir",
      "(Angka timestamp di pola hanya contoh bentuk; pakai rentang timestamp asli tiap potongan. Blok ini tidak memuat caption, subtitle, atau teks apa pun untuk dibuat AI video generator.)",
    );
    var noGaya = "8";
    var a = [
      "<konteks_dasar>",
      "KONTEKS DASAR (WAJIB DITAATI): Semua konteks utama ada di knowledge yang saya tempel di awal chat ini — hasil Zenka Riset (audiens, strategi TOFU/MOFU/BOFU, ide TOFU#/MOFU#/BOFU# beserta Alasan/Bukti dan Referensi verbatim). Strategi funnel dan gaya bahasa mengikuti knowledge itu.",
      "</konteks_dasar>",
      "",
      "<peran>",
      "Kamu menjalankan tiga peran berurutan:",
      "1. Video Storyboard Planner: memakai potongan naskah yang sudah jadi sebagai klip, menentukan teks di layar tiap klip, lalu menandai rentang transkrip (dari kata awal sampai kata akhir) yang ditimpa B-roll beserta apa yang harus tampil di sana.",
      "2. Footage Researcher dan AI Visual Prompt Engineer: MENCARI footage nyata di internet untuk tiap B-roll (browser tab / web search), menyusun kata kunci pencarian footage dua bahasa (ID dan EN) yang terbukti menghasilkan video, menulis prompt gambar AI HANYA jika footage nyata benar-benar tidak ditemukan (buntu), dan merancang konsep cover.",
      "3. AI Presenter Director: mengarahkan ekspresi wajah, gerak tangan, intonasi, dan momen produk karakter AI influencer (videonya dibuat di Zenka Influencer video builder) sesuai emosi tiap kalimat, lalu menyusun bahan siap tempel untuk Influencer video builder.",
      "</peran>",
      "",
      "<konteks>",
      "Level: TalkingHead dengan karakter AI influencer: karakter duduk di studio podcast dan berbicara ke kamera. Video karakter (A-Roll) dibuat di Zenka Influencer video builder untuk SELURUH naskah, jadi suaranya berjalan terus dari awal sampai akhir. B-roll MENIMPA video karakter saat editing pada rentang transkrip dari kata awal sampai kata akhir yang ditentukan (BUKAN per klip), sementara suaranya tetap dari video karakter; di luar rentang B-roll, video karakter yang tampil.",
      "FUNNEL (tentukan sendiri, jangan tanya aku): cocokkan naskah dengan ide TOFU#/MOFU#/BOFU# dan strategi funnel di knowledge Zenka Riset. TOFU = menarik perhatian audiens baru lewat masalah/edukasi umum tanpa jualan; MOFU = membangun kepercayaan lewat solusi, cara, bukti, atau perbandingan; BOFU = mendorong keputusan lewat penawaran, testimoni, atau ajakan membeli. Jika tidak jelas, anggap TOFU. Funnel ini menentukan ATURAN PRODUK SESUAI FUNNEL di <aturan_isi> 1.",
      bacaAngle("riwayat") +
        " Angle ini menentukan gaya visual di <aturan_isi> " +
        noGaya +
        ".",
      "DEFINISI FRASA FOKUS & TEKS OVERLAY (tentukan sendiri dari naskah, jangan tanya aku): FRASA FOKUS = 3-6 kata inti dari kalimat pertama (hook) di potongan pertama yang menjadi kata kunci utama video. TEKS OVERLAY = teks penegas singkat 3-6 kata untuk klip 1 dan cover, diambil dari frasa fokus atau inti hook, tanpa mengarang fakta atau angka.",
      "Potongan naskah (sudah dipotong di Zenka Naskah menjadi klip tepat 8 detik; 1 baris = 1 klip, diawali rentang timestamp dalam langkah 8 detik; total 4/8/12 klip = 32/64/96 detik):\n" +
        v("naskah"),
      "</konteks>",
      "",
      "<langkah>",
      "LANGKAH 1, sebagai Storyboard Planner, PAKAI POTONGAN APA ADANYA: tiap baris potongan di <konteks> = 1 klip tepat 8 detik = 1 nomor. Salin rentang timestamp dan isi potongan verbatim, urutan sama persis. DILARANG memotong ulang, menggabungkan, memecah, mengubah teks, atau mengubah timestamp. Total durasi video sudah dibulatkan ke kelipatan 8 (32/64/96 detik); selisih dari durasi pilihan adalah toleransi dan bukan alasan untuk mengubah klip. Tiap potongan adalah KONTEKS KLIP VIDEO.",
      "",
      "LANGKAH 2, sebagai Storyboard Planner dan AI Presenter Director, ISI DAFTAR KLIP: untuk SETIAP potongan, isi Teks di Layar dan arahan karakter (Pembawaan Gerak Tangan, Intonasi Bicara, Ekspresi Wajah, Momen Produk) berdasarkan konteks klip itu saja (jangan generik, jangan campur konteks potongan lain).",
      "",
      "LANGKAH 3, sebagai Storyboard Planner dan Footage Researcher, B-ROLL TIMPA: baca seluruh transkrip (semua potongan berurutan) sebagai satu teks utuh, lalu tandai rentang kata yang pas ditimpa B-roll sesuai <aturan_isi> 1. Posisi timpa ditentukan dari transkrip, BUKAN per klip. Untuk setiap B-roll, tentukan dulu Posisi Timpa dan Yang Wajib Tampil, lalu JALANKAN <riset_footage> untuk B-roll itu SEBELUM mengisi Kata Kunci Pencarian Footage, Link Bukti Gambar, dan Prompt AI atau Tidak Perlu AI.",
      "",
      "LANGKAH 4, sebagai AI Visual Prompt Engineer, COVER: setelah B-ROLL TIMPA selesai, tulis bagian COVER berisi konsep cover final 9:16, teks overlay (sama persis dengan Teks di Layar klip 1), dan keputusan prompt AI image-to-image berdasarkan aset klip aktual. Utamakan frame dari footage nyata yang ditemukan di <riset_footage> atau frame dari video karakter. Jika perlu gambar AI, tulis prompt Inggris detail dan sebut gambar klip dasarnya, dengan klausa larangan teks seperti di <aturan_isi> 5: prompt cover DILARANG meminta AI menuliskan teks overlay atau huruf apa pun, karena teks overlay ditambahkan manual di editor setelah gambar jadi. Jika footage cukup, tulis \"Tidak Perlu AI\".",
      "LANGKAH 5, sebagai AI Presenter Director, BAHAN INFLUENCER VIDEO BUILDER: setelah COVER, susun SEMUA potongan (termasuk bagian yang nanti ditimpa B-roll, karena suaranya tetap dari video karakter) menjadi satu blok teks, 1 baris per potongan, urutan sama: rentang timestamp dan potongan naskah verbatim, lalu arahan dalam kurung siku [Ekspresi: ... | Tangan: ... | Intonasi: ... | Produk: ...]. Isi arahan diringkas dari sub-baris Ekspresi Wajah, Pembawaan Gerak Tangan, Intonasi Bicara, dan Momen Produk klip itu, masing-masing maksimal 8 kata, konkret, tanpa tanda | atau ] di dalamnya. KHUSUS BARIS PERTAMA (00:00-00:08): karakter WAJIB menghadap lurus ke kamera selama 8 detik penuh untuk mengekspresikan hook; isi Ekspresi diawali kata Menghadap kamera lalu ekspresi sesuai emosi hook (mis. alis terangkat, mata melebar), Tangan tidak menutupi wajah, dan Produk tetap mengikuti aturan funnel. Isi arahan DILARANG meminta atau menyebut teks, tulisan, huruf, angka, caption, subtitle, logo, atau papan tulisan apa pun di dalam video. TANPA CAPTION: video karakter dibuat AI tanpa huruf sama sekali; caption dan teks di layar ditambahkan nanti di editor, bukan oleh AI video generator. Tulis satu baris RASIO VIDEO sebagai baris PERTAMA di dalam blok itu, sebelum baris potongan pertama, persis seperti pola di <format_output>.",
      "</langkah>",
      "",
      "<riset_footage>",
      "PRINSIP: UTAMAKAN VIDEO NYATA YANG SUDAH ADA. Prompt AI untuk generate video/gambar adalah JALAN TERAKHIR, hanya dipakai jika pencarian footage nyata sudah buntu.",
      'WAJIB riset web live. AKSES RISET (pakai yang tersedia): (1) jika bisa membuka tab browser (mis. Claude Cowork), buka platform langsung (pakai tab TikTok, Instagram, YouTube, Facebook, Google di grup ini jika ada); (2) jika tidak, pakai web search untuk SEMUA langkah riset dan buka halaman hasilnya jika bisa; (3) jika keduanya tidak tersedia, JANGAN tulis output apa pun: batalkan tugas, katakan tidak bisa memproses tanpa riset web, dan minta aku mengaktifkan web search. DILARANG memutuskan ada/tidaknya footage dari ingatan atau perkiraan: keputusan hanya dari yang terlihat di tab atau di hasil web search.',
      "Untuk SETIAP B-roll di B-ROLL TIMPA (kecuali B-roll Shot/Demo Produk saat funnel MOFU/BOFU), cari footage yang menampilkan isi Yang Wajib Tampil:",
      "1. Susun kata kunci awal ID dan EN (2-4 kata, konkret: subjek + aksi/benda + tempat). UTAMAKAN INDONESIA: kata kunci ID selalu dicari lebih dulu di setiap sumber dan setiap query, lalu EN sebagai cadangan atau pelengkap.",
      "2. Cari dengan kata kunci itu di sumber berikut (buka halamannya, lihat hasilnya):",
      "- Stok gratis: https://www.pexels.com/search/videos/[kata-kunci-EN]/ | https://pixabay.com/videos/search/[kata-kunci-EN]/ | https://mixkit.co/free-stock-video/[kata-kunci-EN]/ | https://coverr.co/s?q=[kata-kunci-EN]",
      "- Platform: https://www.youtube.com/results?search_query=[kata-kunci] | https://www.tiktok.com/search?q=[kata-kunci] | Google Video: https://www.google.com/search?q=[kata-kunci]&tbm=vid",
      '- Jika memakai WEB SEARCH (tanpa tab browser), jalankan query ini satu per satu untuk tiap B-roll (ganti [kata kunci] dengan kata kunci ID lebih dulu, lalu EN sebagai cadangan): "[kata kunci] site:youtube.com/shorts" | "[kata kunci] site:tiktok.com" | "[kata kunci] youtube shorts" | "[kata kunci] tiktok video" | "[kata kunci-EN] stock video pexels" untuk footage, lalu untuk link bukti gambar: "[kata kunci] gambar" | "[kata kunci-EN] photo pexels" | "[kata kunci-EN] photo unsplash". Hasil video menjadi kandidat footage; hasil gambar (halaman gambar di Google Images, Pexels, Unsplash, atau Pixabay) menjadi kandidat link bukti.',
      "3. Footage DITEMUKAN = minimal 1 VIDEO nyata (bukan foto, bukan hasil AI) yang benar-benar terlihat di hasil pencarian dan cocok dengan Yang Wajib Tampil (subjek + aksi + tempat sama atau sangat mirip, orientasi apa pun boleh karena bisa di-crop 9:16).",
      "4. Jika belum ketemu, JANGAN langsung pakai AI: ganti kata kunci minimal 3 variasi (sinonim, lebih umum, sudut berbeda dari ide yang sama, variasi bahasa Indonesia dicoba lebih dulu, baru Inggris) dan cek lagi di minimal 3 sumber berbeda.",
      "5. KEPUTUSAN: jika ditemukan, Kata Kunci Pencarian Footage WAJIB berisi kata kunci yang TERBUKTI memunculkan video itu (bukan kata kunci awal yang gagal), dan baris Prompt AI diisi persis: Tidak Perlu AI, Cari Footage di Internet dengan Kata Kunci. Jika setelah semua variasi dan sumber tetap tidak ada video yang cocok (buntu), barulah tulis Prompt AI sesuai aturan_isi 5, dan Kata Kunci tetap diisi variasi terbaik.",
      "6. DILARANG menulis Prompt AI untuk B-roll yang footage nyatanya ditemukan. Jangan login, jangan isi form, jangan klik follow/like/download.",
      "7. LINK BUKTI GAMBAR (berlaku di tab browser MAUPUN web search): untuk setiap B-roll yang footage-nya DITEMUKAN, ambil link GAMBAR (foto, bukan video) yang cocok dengan Yang Wajib Tampil (subjek + aksi + tempat sama atau sangat mirip) dan benar-benar muncul di hasil riset, berupa URL halaman gambar atau URL file gambar langsung (.jpg, .png, .webp) dari Google Images, Pexels, Unsplash, Pixabay, atau situs lain. Jika pakai tab browser: ambil dari hasil pencarian gambar atau halaman gambar yang sudah terbuka. Jika pakai web search: ambil URL persis dari daftar hasil pencarian; jika bisa membuka halaman itu (web fetch), buka dulu untuk memastikan gambarnya ada dan cocok dengan Yang Wajib Tampil; jika tidak bisa dibuka, link tetap boleh dipakai HANYA jika judul atau deskripsi di hasil pencarian jelas cocok dengan Yang Wajib Tampil. UTAMAKAN gambar berkonten Indonesia (lokasi, orang, atau suasana Indonesia) selama cocok dengan Yang Wajib Tampil; pakai gambar luar negeri hanya jika tidak ada yang cocok. Link ditulis di baris Link Bukti Gambar. DILARANG mengarang, menebak, menyusun sendiri, memperpendek, atau mengubah link: hanya URL yang persis muncul di hasil riset. Jika tidak ada link gambar yang terverifikasi, tulis tanda - polos di baris Link Bukti Gambar; keputusan Prompt AI tetap mengikuti langkah 5.",
      "RISET INI KERJA INTERNAL: DILARANG menampilkan daftar hasil pencarian, catatan riset, atau URL selain Link Bukti Gambar di output. Output tetap PERSIS sesuai <format_output>; hasil riset hanya terlihat lewat Kata Kunci Pencarian Footage, Link Bukti Gambar, dan keputusan Prompt AI atau Tidak Perlu AI.",
      "</riset_footage>",
      "",
      "<format_output>",
      "Teks biasa (BUKAN tabel): daftar bernomor satu nomor per klip, lalu bagian B-ROLL TIMPA berisi B-Roll 1, B-Roll 2, dst. urut sesuai transkrip. Ikuti pola di bawah.",
      fmt.join("\n"),
      "Total nomor = jumlah baris potongan di <konteks> (4/8/12), tanpa ditambah atau dikurangi; tiap klip tepat 8 detik dan total durasi 32/64/96 detik.",
      "DILARANG membuat file (.md/.docx/.pdf); tampilkan hasil langsung di chat.",
      "</format_output>",
      "",
      "<aturan_isi>",
      '1. B-ROLL TIMPA: video karakter AI (A-Roll dari Zenka Influencer video builder) tampil di seluruh video, kecuali pada rentang transkrip yang ditimpa B-roll. POSISI TIMPA BERDASARKAN TRANSKRIP, BUKAN PER KLIP: tiap B-roll dimulai di kata awal dan berakhir di kata akhir yang kamu pilih, ditulis di baris Posisi Timpa dengan format dari kata "..." sampai kata "...", dan kutipan transkrip yang ditimpa disalin verbatim di baris Transkrip yang Ditimpa. B-roll boleh di bagian mana pun, termasuk klip 1 dan klip terakhir, boleh lebih pendek dari satu klip, dan boleh melintasi batas klip; urutkan sesuai transkrip dan jangan tumpang tindih. PILIH SENDIRI bagian yang pas ditimpa: pilih B-roll jika kata-katanya menyebut hal yang bisa diperlihatkan (benda, tempat, aktivitas, situasi, masalah, atau bukti); biarkan video karakter tampil jika kekuatannya ada pada wajah karakter yang bicara langsung (opini, curhat, atau ajakan). Jumlah B-roll tidak dibatasi, tetapi jangan memaksa seluruh transkrip ditimpa. Sumber Visual tiap B-roll: Stok B-Roll, Gambar AI, atau Tangkapan Layar; ditambah Shot Produk atau Demo Produk HANYA jika funnel MOFU/BOFU. ' +
        aturanProduk,
      "2. Yang Wajib Tampil: 1-2 kalimat Bahasa Indonesia untuk pemula (siapa, sedang apa, di mana, benda apa). DILARANG istilah teknis: close-up, medium shot, angle, framing, B-Roll, footage, overlay, cinematic, POV, transisi, cut, talking head, asset, render.",
      '3. Kata Kunci Pencarian Footage: tiap kata kunci 2-4 kata, visual-searchable, konkret, dan TERBUKTI memunculkan video yang cocok saat dicari di <riset_footage>. Kata kunci ID ditulis lebih dulu dan menjadi yang utama (UTAMAKAN INDONESIA). Tulis tiap bahasa di baris terpisah dengan format "ID Indonesia: ...," lalu "EN Inggris: ...,". SETIAP kata kunci diakhiri koma lalu ENTER (baris baru).',
      "4. Teks di Layar (On Screen Text): singkat dan relevan dengan konteks potongan; boleh kata kunci, frasa penegas, atau angka. Letakkan di zona aman UI TikTok (hindari 12% atas, 25% bawah, dan 18% kanan layar). Jika tidak perlu, isi dengan tanda -.",
      '5. Prompt AI: HANYA jika <riset_footage> buntu (tidak ada video nyata yang cocok setelah semua variasi kata kunci dan sumber dicoba), tulis prompt Inggris detail (subjek + aksi + setting + lighting + camera move + vertical 9:16) yang WAJIB memuat frasa "cinematic haze", "lens flare", dan "depth of field", serta klausa larangan teks persis: "no text, no letters, no numbers, no words, no captions, no subtitles, no logos, no watermarks, no readable signs or screens" (AI tidak boleh membuat huruf apa pun; jangan juga menyuruh AI menulis Teks di Layar). Jika cukup footage, isi persis: Tidak Perlu AI, Cari Footage di Internet dengan Kata Kunci.',
      '6. OVERLAY: Teks di Layar klip 1 WAJIB berisi teks overlay yang kamu tentukan dari frasa fokus (huruf besar kontras, 9:16, safe-area, tanpa watermark), dan teks yang sama dipakai di COVER. Untuk angle meme relate, teks overlay boleh memakai label format meme di depannya (cth "POV:", "TIPE ORANG YANG...", "EKSPEKTASI VS REALITA") selama frasa fokus tetap ada.',
      "7. Arahan karakter AI (isi untuk SEMUA klip, termasuk klip yang sebagian atau seluruhnya ditimpa B-roll, karena video karakter dibuat untuk seluruh naskah). Karakter duduk di studio podcast di belakang meja dan mikrofon, jadi semua gerak harus kecil, wajar, dan bisa dibuat AI video: Pembawaan Gerak Tangan = gerakan tangan konkret di depan dada atau di atas meja (mis. telapak terbuka ke arah kamera, menghitung dengan jari, menunjuk ringan ke kamera), tidak pernah menutupi wajah atau mulut, tanpa gerakan cepat atau rumit. Intonasi Bicara = nada sesuai emosi kalimat (mis. pelan-tegas, bersemangat, prihatin). Ekspresi Wajah = ekspresi natural sesuai emosi kalimat, tanpa berlebihan; untuk angle meme relate, ekspresi dan intonasi boleh lebih ekspresif demi timing komedi (mis. muka datar menatap kamera, mata membesar kaget, senyum tertahan, jeda sebentar sebelum punchline), tetap wajar untuk AI video. Momen Produk = - jika funnel TOFU atau klip tidak membahas produk; jika MOFU/BOFU dan klip membahas produk, isi pegang, angkat ke kamera, atau demo: {aksi singkat}. KHUSUS KLIP 1 (detik 0-8): Ekspresi Wajah WAJIB diawali menghadap kamera dan mengekspresikan hook secara kuat tapi wajar; karakter tidak boleh menoleh atau melihat ke arah lain. Momen produk hanya dipakai jika switch Pegang produk dinyalakan di Influencer video builder, dan tangan yang memegang produk tidak dipakai untuk gerak tangan.",
      noGaya +
        ". GAYA VISUAL SESUAI ANGLE: fakta unik = visual yang membuktikan atau memperlihatkan faktanya; problem awareness = visual momen masalah sehari-hari yang dialami penonton (gejala, kebiasaan keliru), dengan nada empatik; meme relate = visual yang memerankan situasi relate di naskah secara harfiah plus momen reaksi (kaget, pasrah, ketawa), dan Teks di Layar boleh bergaya caption meme singkat. Untuk meme relate, utamakan footage stok orang biasa; DILARANG memakai cuplikan film, acara TV, atau wajah selebriti sebagai template meme. " +
        BATAS_MEME,
      "</aturan_isi>",
      "",
      "<guardrail>",
      "DILARANG SARA. Topik POLITIK dan GOSIP (selebriti, figur publik, drama viral) BOLEH dengan visual NETRAL: (a) tidak memihak siapa pun — DILARANG logo, atribut, warna, atau simbol partai/kubu yang terbaca sebagai dukungan atau serangan; (b) DILARANG karikatur merendahkan, meme yang menghina tokoh, body shaming, atau Teks di Layar yang mengejek; (c) footage peristiwa asli dari sumber berita boleh, DILARANG menampilkan info pribadi; (d) Prompt AI DILARANG menggambarkan tokoh politik atau selebriti nyata (wajah/nama) — pakai ilustrasi netral atau simbol peristiwa; (e) visual dan Teks di Layar hanya mendukung sudut pandang frasa produk/kategori produk, bukan mengomentari orangnya atau pilihan politiknya.",
      "Jangan mengarang fakta atau angka di Teks di Layar. Jangan menanyakan apa pun kepadaku.",
      "</guardrail>",
      "",
      "Cek mandiri: aturan produk sesuai funnel ditaati (TOFU tanpa produk); gaya visual tiap klip mengikuti angle di <aturan_isi> " +
        noGaya +
        "; footage tiap B-roll sudah dicari lewat riset (bukan ingatan) dan kata kunci terbukti memunculkan video; Prompt AI hanya di B-roll yang footage-nya buntu, B-roll lain berisi Tidak Perlu AI, Cari Footage di Internet dengan Kata Kunci (kecuali B-roll Shot/Demo Produk)" +
        "; tiap nomor = 1 baris potongan dari <konteks> verbatim dengan timestamp-nya, berurutan, tepat 8 detik, jumlah nomor sama dengan jumlah potongan (4/8/12); teks di layar klip 1 sama dengan teks overlay COVER; setiap prompt AI memuat tiga frasa wajib dan klausa larangan teks; B-ROLL TIMPA ditulis setelah daftar klip dan COVER setelah B-ROLL TIMPA; sub-baris terisi sesuai pola; " +
        "tiap B-roll punya Posisi Timpa dari kata awal sampai kata akhir yang ada verbatim di transkrip, Transkrip yang Ditimpa verbatim, dan Sumber Visual; B-roll dipilih dari kecocokan isi transkrip, bukan per klip (boleh di bagian mana pun termasuk klip 1, boleh melintasi batas klip), urut sesuai transkrip, dan tidak tumpang tindih; setelah COVER ada label BAHAN INFLUENCER VIDEO BUILDER dan satu blok teks berisi SEMUA potongan verbatim dengan timestamp aslinya, urutan sama, masing-masing diakhiri arahan [Ekspresi | Tangan | Intonasi | Produk], dan Produk berisi - untuk TOFU; baris pertama BAHAN INFLUENCER VIDEO BUILDER (00:00-00:08) diawali Ekspresi: Menghadap kamera; tidak ada elemen Caption, instruksi caption, atau permintaan teks apa pun di BAHAN INFLUENCER VIDEO BUILDER, dan blok itu diawali satu baris RASIO VIDEO 9:16; " +
        "setiap B-roll yang footage-nya ditemukan punya Link Bukti Gambar dari hasil riset (bukan karangan), atau tanda - jika tidak ada; jawaban hanya di chat.",
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
