import "server-only";
import { buatDokumen } from "./dokumen";
import { BATAS_ANGLE } from "./ragam-angle";

// Penyusun prompt "riset". Hanya berjalan di server.
// Kode di dalam fungsi ini disalin apa adanya dari versi HTML (index.html);
// "document" diganti tiruan yang membaca isian form dari server.
export function susunRiset(input, keluaran) {
  const document = buatDokumen(input);

  var IDS = ["produk", "deskripsi", "asetSuara"];
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

  var TUGAS_B = [
    "TUGAS B. AWESOME DESCRIPTION LEVEL 3 (ditulis SETELAH Tugas A selesai)",
    "Peran: copywriter Indonesia. Ubah Produk dan Deskripsi di KONTEKS menjadi deskripsi penjualan Level 3 dalam bahasa Indonesia santai ala teman ke teman (ngalir, tidak formal, tidak kaku). Misi kedua: maksimalkan manfaat. Gali SEMUA manfaat asli produk, bukan hanya 3 teratas, sampai pembaca berpikir: wah, ternyata manfaatnya banyak banget, sayang kalau nggak beli. Jika Produk atau Deskripsi kosong atau terlalu samar, berhenti dan minta saya melengkapinya.",
    "",
    "Standar level: Level 1 (daftar fitur) dan Level 2 (fitur + manfaat langsung) DILARANG sebagai hasil akhir. Hanya Level 3: Fitur + Manfaat + Kehidupan Terkait, yaitu manfaat dijahit ke masalah, hubungan, ego, dan kebiasaan sehari-hari target pasar Indonesia. Setiap blok, termasuk yang singkat, wajib terhubung ke konteks kehidupan nyata Indonesia.",
    "",
    "KERANGKA 1. 17 SUDUT MANFAAT DASAR. Tambang setiap fitur terhadap semua sudut ini, lalu jahit 1-2 sudut ke tiap blok manfaat: (1) dapat uang atau untung tambahan, (2) hemat pengeluaran, (3) hemat waktu, (4) tidak repot atau tanpa tenaga, (5) kenyamanan fisik, (6) kurang atau hilang sakit fisik, (7) lebih sehat, bersih, higienis, (8) hiburan atau hilang bosan, (9) kurang stres atau beban pikiran, (10) dihargai, dipuji, dianggap keren, (11) terhindar dari cibiran, (12) dapat cinta dari pasangan, anak, atau mertua, (13) terhindar dari kemarahan atau kebencian orang, (14) aman dari bahaya atau kerusakan, (15) aktualisasi diri atau asah otak, (16) kontrol atas keadaan, (17) pahala atau jejak baik.",
    "",
    "KERANGKA 2. PETA FASE KEHIDUPAN. Peta fase kehidupan adalah daftar fase usia beserta orang yang ditemui dan masalah yang dominan di tiap fase. Pakai untuk memilih skenario sehari-hari yang paling relevan dengan target pasar.",
    "",
    "Peta fase kehidupan pria Indonesia (dipakai bila target pria, atau pasangan pria, misalnya istri yang membelikan untuk suami):",
    "- Mimpi basah sampai 17: cewek (teman cewek, saingan sesama pria); sekolah (guru, kepala sekolah, satpam, OB, ibu kantin); les (guru les, teman les); ekskul (pelatih); kampus favorit.",
    "- 18 sampai 23: cewek; kuliah (dosen, dekan, pembimbing skripsi, administrasi kampus, ibu kantin, organisasi, teman tongkrongan); ngekos (ibu kos, teman sekosan); cari kerjaan (HRD); kerja (atasan, teman sekantor); petualang jalanan (pengendara lain, polisi, peminta-minta); ngelamar (calon, calon mertua).",
    "- 24 sampai 26: lamaran, mas kawin, bulan madu, pernikahan.",
    "- 27 sampai 28: menjadi suami, kontrakan atau tinggal bareng mertua, bertetangga, seks, biaya istri hamil anak pertama, badan gendut, penghasilan tambahan.",
    "- 29 sampai 33: anak pertama, refreshing, biaya lahiran, kebutuhan bayi, reunian.",
    "- 34 sampai 35: biaya sekolah anak pertama, biaya istri hamil anak kedua.",
    "- 36 sampai 38: kendaraan.",
    "- 39 sampai 42: rumah.",
    "- 43 sampai 45: kesehatan awal, karier.",
    "- 46 sampai 50: kesehatan akhir, puncak karier, persiapan pensiun.",
    "- 51 sampai 55: mengisi waktu senggang, penyakit menahun, anak menikah, kumpul dengan anak, impotensi.",
    "- 56 sampai akhir hayat: agama, pengobatan tiada henti.",
    "Pendorong emosi pria Indonesia: istri senang supaya tidak ada perang rumah tangga, jadi mantu kesayangan di depan mertua, hemat uang hasil kerja keras, terhindar dari gangguan kecil harian yang bikin mood dan produktivitas anjlok, menjaga harga diri.",
    "",
    "Peta fase kehidupan wanita Indonesia (dipakai bila target wanita, atau pasangan wanita, misalnya suami yang membelikan untuk istri):",
    "- 10 sampai 18: pubertas ABG, mens pertama, jerawat, sekolah favorit, cinta monyet, kuliah atau kerja.",
    "- 19 sampai 22: kuliah atau kerja, seksualitas meningkat, perawatan kecantikan, pasangan, karier.",
    "- 23 sampai 27: menikah, seks, menjadi istri, kendaraan.",
    "- 28 sampai 30: hamil, melahirkan, perubahan bentuk badan.",
    "- 31 sampai 35: mengurus anak (biaya, sekolah, pakaian, teman anak), karier, bertetangga, penghasilan tambahan, kontrak atau sewa.",
    "- 36 sampai 44: rumah, kendaraan.",
    "- 45 sampai 55: menopause, perubahan fisik, emosi labil, gangguan tidur, cemas, depresi, seks menurun, gejala sakit tua, agama, sosialisasi, menikahkan anak.",
    "- 56 sampai akhir hayat: berhenti mens, pikun, rabun, penyakit degeneratif, kumpul bersama anak (bila dulunya berkarier).",
    "",
    "Cara memakai peta fase kehidupan:",
    "1. Pakai target pasar yang sama dengan asumsi di awal jawaban dan Audiens di Tugas A (siapa pembeli dan pemakainya, pria atau wanita, rentang usia), lalu pilih fase kehidupan yang paling relevan. Tidak ada input target pasar dari saya, jadi pilih fase yang paling masuk akal dan tandai sebagai asumsi.",
    "2. Jika target bukan sekadar pria atau wanita (ibu rumah tangga, remaja, pekerja kantoran, pelajar), pilih peta dan fase yang paling dekat dengan persona itu, lalu adaptasikan skenarionya ke keseharian persona itu.",
    "3. Ambil orang dan situasi pada fase itu sebagai latar tiap blok manfaat, lalu jahit ke sudut manfaat yang paling cocok. Contoh: pria usia 34-35 berarti biaya sekolah dan istri hamil lagi; wanita usia 31-35 berarti mengurus anak, biaya sekolah, dan penghasilan tambahan.",
    "4. Variasikan skenario antarblok, jangan memakai satu situasi yang sama di banyak blok.",
    "5. Topik sensitif (kesehatan seksual, depresi, menopause, penyakit menahun) ditulis dengan empati dan jangan jadi bahan olok-olok.",
    "",
    "Gaya bahasa: sangat percakapan, ngalir, seperti teman ke teman, bukan formal atau robotik. Pakai istilah natural (nyesek, bengong, gelagepan, aman terkendali, tiati, drama, ribet, capek banget deh, akhirnya lega). Untuk target wanita atau persona lain, nada santainya sama, hanya skenarionya mengikuti realitas persona itu. Jangan menggurui dan jangan memakai stereotip yang merendahkan.",
    "",
    "Cara kerja (proses internal, jangan dicetak):",
    "1. Ekstrak SEMUA fitur yang tersurat atau konsekuensi langsungnya: bahan, ukuran/berat/kapasitas, daya/baterai, desain, kemudahan pakai/pasang, fleksibilitas, kemasan, bonus, garansi/layanan, harga/nilai, kompatibilitas.",
    "2. Tentukan peta fase kehidupan (pria atau wanita) dan fase usia yang paling relevan.",
    "3. Tambang manfaat dengan 4 lensa: (a) 17 sudut manfaat dasar, (b) siapa yang diuntungkan: pembeli, pasangan, anak, orang tua/mertua, tamu/teman/tetangga, rekan kerja/atasan/pelanggan, (c) kapan dan di mana: pagi buru-buru, malam, weekend, musim hujan/panas, tanggal tua, mudik, liburan, rumah, dapur, kantor, jalan, kendaraan, acara keluarga, tamu dadakan, (d) fase kehidupan: samakan dengan masalah nyata pada fase usia target.",
    "4. Saring: gabungkan kandidat dengan sudut dan skenario sama, buang yang tidak didukung deskripsi.",
    "5. Peringkat: bagian utama (3-5 manfaat paling emosional dan relevan) dan bagian tambahan (sisanya).",
    "",
    "Kuantitas: minimal 6 blok (3 bagian utama + 3 bagian tambahan), target 8-12, batas sekitar 15. Berhenti saat blok berikutnya terasa dipaksakan, duplikat, atau tidak didukung deskripsi. Jika fitur sedikit, capai minimum lewat kombinasi siapa, kapan, dan fase kehidupan, JANGAN mengarang fitur.",
    "Variasi: tiap blok punya kombinasi sudut manfaat + skenario yang unik, minimal 6 sudut berbeda, maksimal 2-3 blok per sudut dengan skenario berbeda. Variasikan pembuka kalimat dan gaya humor agar tidak terbaca seperti template.",
    "Kejujuran: manfaat hanya boleh berasal dari fitur yang tertulis atau konsekuensi langsungnya. DILARANG mengarang spek, angka, persen, sertifikasi, garansi, atau hasil pasti. Hiperbola hanya boleh di humor skenario, bukan di klaim produk.",
    "Jangan mencetak istilah internal (level, sudut, peta, lensa) di hasil akhir; itu alat kerja, bukan teks untuk pembaca.",
    "",
    "Format keluaran Tugas B:",
    "### [Headline utama yang memancing penasaran dan ego]",
    "Dengan memiliki [Nama Produk], inilah manfaat nyata yang akan langsung mengubah keseharian Anda:",
    "## Manfaat Andalan",
    "*   **[Headline benefit, memancing penasaran]**",
    "    [3-4 baris narasi relatable, sedikit humor: Fitur + sudut manfaat + skenario dari fase kehidupan target]",
    "    (ulangi untuk 3-5 manfaat bagian utama)",
    "## Dan Masih Banyak Keuntungan Lainnya",
    "*   **[Headline benefit]**",
    "    [2-3 baris narasi singkat dan nendang, struktur sama]",
    "    (ulangi untuk semua manfaat bagian tambahan yang valid)",
    "---",
    "**Spesifikasi Lengkap:** daftar SEMUA fitur faktual yang diekstrak, hanya di bagian paling bawah.",
    "",
    "Cek mandiri sebelum mencetak: total blok >= 6 tanpa blok paksaan; semua fitur sudah ditambang; peta dan fase usia sesuai target; skenario tiap blok berasal dari fase itu dan bervariasi; tidak ada blok Level 1 atau 2; tidak ada dua blok dengan sudut dan skenario sama; tidak ada klaim karangan; topik sensitif ditulis dengan empati; nada santai dan bervariasi.",
    "Hasil Tugas B wajib selaras dengan Identitas Akun, Audiens, dan Strategi funnel di Tugas A, dan manfaat serta skenarionya harus sama dengan yang sudah dipakai sebagai angle strategi di Tugas A.",
  ].join("\n");

  function build() {
    var p = v("produk"),
      d = v("deskripsi"),
      as = v("asetSuara");
    var tbOn = document.getElementById("tugasB").checked;
    var rujukB = tbOn
      ? " Seluruh paragraf strategi WAJIB memakai manfaat dan skenario fase kehidupan dari Tugas B (Deskripsi Level 3): sebelum menulis Tugas A, tambang dulu manfaat dan skenario itu secara internal (jangan dicetak di sini), jadikan bahan angle tiap paragraf, lalu tulis Tugas B sesudahnya dengan isi yang konsisten. Nada bahasanya mengikuti gaya santai ala teman ke teman khas Tugas B."
      : "";
    var aturanBofu =
      "BOFU menjual produk langsung: wajib dibuka dengan salah satu angle yang menarik pembaca (fakta unik/aneh, problem awareness, atau meme relate), lalu masalah, lalu solusi kategori, lalu ajakan chat/beli langsung. Boleh sebut produk dan CTA, tetap ringan kek ngobrol.";
    var linkBio =
      "Link tepat di bawah bio adalah link produk. Ajakan di bio WAJIB mengarahkan orang mengeklik link di bawah untuk melihat atau memesan produk (cth cek produknya, cek stok, chat/beli). Boleh menyebut kategori atau produk, tetap ringan kek ngobrol.";
    var L = [];
    L.push("<peran>");
    L.push(
      "Kamu Senior Content Strategist untuk media sosial Indonesia: ahli riset audiens, funnel konten, dan viral hijack berbasis pemberitaan. Jujur, spesifik, dan tidak mengarang data.",
    );
    L.push("</peran>", "");
    L.push("<konteks>");
    L.push("Produk: " + p);
    L.push("Deskripsi: " + d);
    L.push(
      "Target pasar: tidak diberikan. Tentukan sendiri dari Produk, Deskripsi, dan Aset suara (siapa pembeli dan pemakainya, pria atau wanita, rentang usia, fase kehidupannya), tulis satu baris asumsi itu di awal jawaban, lalu pakai konsisten di seluruh tugas.",
    );
    L.push("Aset suara: " + as);
    L.push(
      "Identitas akun (nama dan bio): tidak diberikan. Definisikan sendiri sesuai blok <identitas_akun>.",
    );
    L.push("Aturan BOFU:\n" + aturanBofu);
    L.push("</konteks>", "");
    L.push("<identitas_akun>");
    L.push(
      "Tidak ada input nama atau bio akun dari saya. Definisikan sendiri keduanya, selaras dengan Produk, Deskripsi, Aset suara, dan target pasar yang kamu simpulkan. Keduanya menjadi identitas akun yang dipakai konsisten di seluruh strategi.",
    );
    L.push(
      "Nama akun: 1 nama yang mudah diingat dan mudah diucapkan, cocok dengan persona Aset suara, relevan dengan niche produk. Jangan mengarang klaim merek resmi, garansi, atau sertifikasi yang tidak ada di Deskripsi.",
    );
    L.push(
      "Bio akun: WAJIB maksimal 150 karakter (hitung semua karakter termasuk spasi, emoji, dan tanda baca; tulis jumlahnya di samping bio; bila lebih dari 150, pangkas sampai 150 atau kurang). Struktur: siapa akun ini bagi audiens, apa yang audiens dapat dari mengikuti akun ini, lalu ajakan mengeklik link yang ada tepat di bawah bio. Bahasa santai kek ngobrol, selaras dengan persona Aset suara.",
    );
    L.push(linkBio);
    L.push(
      "Nama dan bio tidak boleh memuat politik, SARA, ujaran kebencian, atau angka dan hasil pasti yang dikarang.",
    );
    L.push("</identitas_akun>", "");
    L.push("<pemanfaatan_konteks>");
    L.push(
      "Dua parameter ini WAJIB memengaruhi seluruh strategi kontenmu:",
    );
    L.push(
      "1. Aset suara: persona suara untuk konten bersuara. Hook dan skrip untuk format reels/video wajib natural diucapkan suara tersebut (tempo, nada, gaya ngomong). Untuk format tanpa suara (foto/carousel/story), tetap tulis hook yang nyambung dengan persona suara itu saat dibaca.",
    );
    L.push(
      "2. Identitas akun (nama dan bio) yang kamu definisikan sendiri di <identitas_akun>: FONDASI UTAMA seluruh strategi karena tidak ada input topik viral dari saya. Nada, POV, klaim, dan penawaran di semua funnel wajib selaras dengan identitas ini, dan arah tema serta angle konten lahir dari identitas ini. Aturan produk/CTA per tahap funnel tetap berlaku.",
    );
    L.push("</pemanfaatan_konteks>", "");
    L.push("<riset_web>");
    L.push(
      "Definisi riset di sini: WAJIB browsing atau cari web live sebelum menulis. FOKUS RISET = PRODUK DAN KATEGORINYA, bukan tren acak di luar niche:",
      "(a) Frasa produk di kategorinya: kata/frasa yang orang sungguh ketik dan pakai saat mencari atau membicarakan produk sejenis (saran autocomplete, judul listing terlaris, hashtag kategori, istilah sehari-hari pembeli).",
      "(b) Fakta-fakta seputar produk dan kategorinya: fakta unik/aneh, sejarah, mitos vs fakta, cara kerja/bahan, kebiasaan pemakai yang dianggap wajar padahal punya sisi aneh, dan data dari sumber kredibel.",
      "(c) Dan lain-lain yang relevan: masalah dan keluhan nyata pembeli (ulasan marketplace, komentar, forum), keraguan sebelum membeli, produk sejenis/pesaing, serta konten dan berita/artikel tentang kategori ini yang ramai dibahas beserta pola hook/format/emosinya.",
      "Sumber Referensi: berita/artikel dari media kredibel (cth detik, CNN Indonesia, Kompas, Tempo), situs institusi, atau konten platform yang membahas produk/kategori ini. Rentang waktu bebas, kapan pun tanggal postingnya, TETAPI UTAMAKAN yang paling terbaru: urutkan referensi dari terbaru ke terlama. Kredibilitas lebih penting daripada banyaknya. HANYA di luar politik, pemilu, SARA, dan ujaran kebencian; berita kasus (perkara atau kejadian nyata) dan gosip BOLEH selama tidak menyentuh topik terlarang itu. Tiap referensi WAJIB bisa dijadikan salah satu angle seputar kategori produk: fakta unik/aneh, problem awareness, atau meme relate. Prioritaskan tema dan angle yang selaras dengan Identitas akun yang kamu definisikan. Untuk tiap item salin: Judul, Media, tanggal posting, URL, pola/angle.",
    );
    L.push(
      "Jurnal untuk MOFU: bila paragraf strategi MOFU memuat klaim edukasi (teori, penyebab, data), cari web live untuk jurnal pendukung tiap klaim, lalu cantumkan judul + URL verbatim per klaim. Klaim edukasi tanpa jurnal DILARANG ditulis. TOFU dan BOFU tidak wajib jurnal.",
    );
    L.push(
      "Semua referensi dan jurnal wajib disalin verbatim dari bukti yang kamu temukan (berita/artikel media kredibel atau jurnal). URL karangan atau di luar kriteria dianggap INVALID. Referensi wajib membahas produk atau kategorinya, dengan Angle ke Niche yang jelas.",
    );
    L.push(
      'Jika kamu TIDAK bisa membuka tab browser DAN TIDAK bisa web search sama sekali: katakan di awal jawaban, lalu tulis Referensi dan jurnal sebagai "belum terverifikasi, perlu dicari manual" tanpa URL, dan MOFU ditulis tanpa klaim edukasi. Jangan pernah mengarang URL.',
    );
    L.push(
      "CARA RISET (WAJIB, kerjakan PERTAMA sebelum menulis apa pun). TIDAK WAJIB Claude Cowork — yang penting bisa search web. AKSES RISET (pakai yang tersedia): (1) jika kamu Claude Cowork atau AI lain yang bisa membuka tab browser, buka sumber langsung di tab (pakai tab TikTok, Instagram, YouTube, Facebook, Google di grup ini jika ada); (2) jika Claude Cowork atau tab browser TIDAK tersedia (misalnya Claude paket gratis atau AI lain), lanjutkan dengan fitur pencarian web (web search) untuk SEMUA langkah riset: cari URL dan kata kunci di langkah-langkah di bawah lewat web search, lalu buka halaman hasilnya jika bisa; (3) HANYA jika tab browser DAN web search sama-sama tidak tersedia, ikuti aturan tidak bisa browsing di atas. Ambil HANYA judul, media, tanggal, URL, dan isi yang benar-benar terlihat di tab atau di hasil web search. DILARANG mengarang, memperkirakan, atau mengisi dari ingatan.",
      "LANGKAH 1 — Frasa produk di kategorinya: ketik nama produk dan kategorinya di https://www.google.com/search?q=[kategori] , https://www.tiktok.com/search?q=[kategori] , https://shopee.co.id/search?keyword=[kategori] , dan https://www.tokopedia.com/search?q=[kategori] . Catat saran autocomplete, frasa yang berulang di judul listing terlaris dan konten teratas, serta istilah sehari-hari yang dipakai pembeli.",
      "LANGKAH 2 — Fakta dan artikel: cari fakta seputar produk/kategori (cth \"fakta [kategori]\", \"mitos [kategori]\", \"sejarah [kategori]\", \"bahaya [masalah]\") di Google, Google News https://news.google.com/search?q=[kata-kunci]&hl=id&gl=ID&ceid=ID:id , dan media spesifik https://www.google.com/search?q=site:detik.com+[kata-kunci] (ganti domain: cnnindonesia.com, kompas.com, tempo.co, situs institusi, dll). Untuk SETIAP kandidat referensi, buka halaman aslinya; salin Judul, Media, dan tanggal posting persis dari halaman itu, dan URL dari address bar. Halaman gagal dibuka atau isinya tidak cocok dengan judul = buang.",
      "LANGKAH 3 — Masalah nyata dan konten populer kategori: baca ulasan produk sejenis di marketplace, komentar, dan forum untuk menemukan keluhan dan keraguan yang benar-benar muncul; cari kategori ini di https://www.tiktok.com/search?q=[kategori] , https://www.youtube.com/results?search_query=[kategori] , dan https://www.instagram.com/explore/tags/[kategori]/ untuk mencatat hook, format, dan emosi konten yang ramai, termasuk situasi sehari-hari dan format meme/humor yang sering dipakai audiens kategori ini (bahan meme relate). Jika halaman perlu login atau angka disembunyikan, lewati platform itu, jangan menebak.",
      "LANGKAH 4 — Jurnal MOFU: untuk tiap klaim edukasi, cari di https://scholar.google.com/scholar?q=[klaim] , https://pubmed.ncbi.nlm.nih.gov/?term=[klaim] , atau https://garuda.kemdikbud.go.id/documents?q=[klaim] ; buka halaman jurnalnya dan salin judul + URL persis dari halaman itu. Tidak ketemu = klaim dibuang.",
      "ATURAN KETAT RISET: setiap Referensi dan jurnal harus berasal dari halaman yang benar-benar dibuka di sesi ini. Jangan login, jangan isi form, jangan klik follow/like/komentar/subscribe. Jangan berhenti setelah 1-2 referensi; selesaikan riset sampai kebutuhan Referensi semua funnel terpenuhi.",
      "RISET INI KERJA INTERNAL: langkah, daftar pencarian, dan kandidat yang dibuang DILARANG ditampilkan. Output tetap PERSIS sesuai format jawaban di prompt ini; hasil riset hanya terlihat lewat Audiens (masalah, bahasa sehari-hari = frasa produk yang ditemukan, keberatan), Strategi, Referensi, dan jurnal yang ditulis.",
    );
    L.push("</riset_web>", "");
    L.push("<definisi_viral_hijack>");
    L.push(
      "1. Viral berarti konten, berita, atau artikel tentang produk dan kategorinya yang ramai dibahas, kapan pun waktunya; UTAMAKAN yang paling terbaru, tapi yang lebih lama tetap boleh bila paling cocok. Wajib di luar politik, SARA, dan ujaran kebencian; berita kasus dan gosip boleh.",
    );
    L.push(
      "2. Tiap paragraf strategi TOFU, MOFU, dan BOFU wajib mencantumkan konten viral yang di-hijack plus angle penyambungnya ke niche produk (analogi, POV, storytelling, edukasi, behind the scene), dengan menyebut nomor referensi yang dipakai.",
    );
    L.push(
      "3. Pola yang ditiru adalah pola pemberitaan: angle judul, struktur piramida terbalik, kutipan narasumber.",
    );
    L.push("</definisi_viral_hijack>", "");
    L.push("<angle_konten>");
    L.push(
      "Konten TIDAK hanya fakta unik. Semua level funnel memakai campuran 3 angle seputar niche:",
      '1. FAKTA UNIK/ANEH: fakta, sejarah, sains, atau mitos yang jarang diketahui dan bikin pembaca bereaksi "hah, seriusan?".',
      '2. PROBLEM AWARENESS: menyadarkan audiens pada masalah yang mereka alami tapi belum disadari atau dianggap wajar (gejala kecil, kebiasaan keliru, salah kaprah, dampak yang diam-diam menumpuk), sampai merasa "lho, ini aku banget". Nadanya empatik.',
      '3. MEME RELATE: humor tentang situasi sehari-hari audiens seputar kategori produk dengan format meme yang dikenal (POV, tipe-tipe orang, ekspektasi vs realita, "cuma aku yang...?"), sampai audiens tertawa, tag teman, atau komen "ini gue banget". Yang ditertawakan situasinya, bukan orangnya.',
    );
    L.push("</angle_konten>", "");
    L.push("<definisi_tofu_mofu_bofu>");
    L.push(
      "TOFU (berhenti scroll): WAJIB memakai campuran 3 angle di <angle_konten> yang ringan seputar niche: fakta unik/aneh yang mencengangkan, problem awareness berupa kebiasaan atau gejala yang dialami tanpa sadar (hal yang dianggap wajar padahal bermasalah), dan meme relate tentang situasi yang semua orang di niche alami. Bukan edukasi, bukan penjelasan panjang. Hanya 1 fakta, masalah, atau situasi per konten. Bisa dipahami dalam 1 kalimat. Relatable ke target audiens. Biarin orang mikirin sendiri, jangan sebab-akibat berlembar. Dilarang menyebut riset, penelitian, studi, data, persentase, metodologi, atau kutip jurnal. Hook singkat kek chat WA. Akhiri dengan ajakan konfirmasi (cth: 'Kamu pernah notice nggak?' atau 'Cuma gue aja yang gitu?'). Tujuannya dapat komentar, bukan ngajarin.",
    );
    L.push(
      "MOFU (bantu milih): WAJIB membungkus pembahasannya dengan salah satu angle di <angle_konten> (fakta unik/aneh, problem awareness, atau meme relate), dikombinasikan dari keluhan/keraguan yang beneran muncul di komen/grup. Bisa bandingin 2 pilihan, 'tim A atau B', atau bahas 1 keluhan spesifik. Lebih kek ngobrol, bukan kuliah. Hindari listing 3-5 poin. Fokus 1 masalah, 1 sudut pandang unik.",
    );
    L.push(
      "BOFU (soft push): WAJIB menyelipkan salah satu angle di <angle_konten> (fakta unik/aneh yang mencengangkan, problem awareness, atau meme relate) di awal/tengah, dikemas melalui pengalaman pribadi/rekomendasi super ringan. Isi dan larangannya mengikuti Aturan BOFU di KONTEKS.",
    );
    L.push("</definisi_tofu_mofu_bofu>", "");
    L.push("<guardrail>");
    L.push(
      "1. DILARANG politik, pemilu, SARA, ujaran kebencian. Berita kasus dan gosip BOLEH selama di luar itu.",
    );
    L.push(
      "2. TOFU dan MOFU DILARANG berisi nama produk, brand, harga, atau CTA. Hanya kategori plus fakta unik/aneh, problem awareness, atau meme relate. BOFU mengikuti Aturan BOFU di KONTEKS.",
    );
    L.push("3. Jangan mengarang spek, angka, atau persen hasil pasti.");
    L.push("4. " + BATAS_ANGLE);
    L.push("</guardrail>", "");
    L.push("<struktur_funnel>");
    L.push(
      "Tiap level funnel TOFU, MOFU, dan BOFU ditulis sebagai SATU paragraf simpel. Tanpa daftar, tanpa pilar, tanpa daftar ide konten.",
    );
    L.push("</struktur_funnel>", "");
    L.push("<tugas>");
    L.push(
      (tbOn ? "TUGAS A. " : "") +
        "TUGAS RISET DAN STRATEGI. Tulis dengan heading dan daftar bernomor (heading, nomor, dan label ditulis polos tanpa tabel; isi yang akan kucopy dibungkus code block sesuai <format_output>), urutan: Identitas Akun, Audiens, Strategi TOFU, Strategi MOFU, Strategi BOFU, Referensi.",
    );
    L.push(
      "- Identitas Akun: tulis Nama akun dan Bio akun sesuai blok <identitas_akun>, ditampilkan dalam satu code block markdown (baris 1: Nama akun, baris 2: Bio akun diikuti jumlah karakternya). Definisikan ini PERTAMA karena menjadi fondasi seluruh tugas di bawah.",
    );
    L.push(
      "- Audiens: profil singkat, 3 masalah utama, bahasa yang mereka pakai sehari-hari, pemicu beli, dan keberatan terbesar.",
    );
    L.push(
      "TUGAS STRATEGI PER FUNNEL. Tulis Strategi TOFU, Strategi MOFU, dan Strategi BOFU masing-masing sebagai SATU paragraf simpel yang meringkas arah konten level itu untuk akun ini: bahan utama tiap angle (fakta unik/aneh, problem awareness, dan meme relate), masalah audiens yang disasar, dan referensi nomor berapa + Angle ke Niche yang dipakai. Nada tiap paragraf wajib mematuhi blok <definisi_tofu_mofu_bofu>, <guardrail>, dan <pemanfaatan_konteks>. Khusus Strategi MOFU, bila memuat klaim edukasi (teori, penyebab, data), sertakan jurnal (judul + URL) per klaim sesuai <riset_web>. Pastikan angle antar paragraf tidak kembar. Strategi BOFU mengikuti Aturan BOFU di KONTEKS." +
        rujukB,
    );
    L.push(
      "TUGAS REFERENSI. Daftar bernomor, 3 baris per item tanpa tanda pipa:",
    );
    L.push("baris 1: Judul, Media, tanggal, link");
    L.push(
      "baris 2: Pola Viral: hook, format, atau emosi yang bikin viral",
    );
    L.push(
      "baris 3: Angle ke Niche: cara menjadikan temuan itu fakta unik/aneh, problem awareness, atau meme relate seputar produk/kategorinya yang relevan bagi target audiens (bukan sekadar bisa disambung), dengan angle berbeda antar referensi",
    );
    if (tbOn) {
      L.push("", TUGAS_B);
    }
    L.push("</tugas>", "");
    L.push("<format_output>");
    L.push(
      "Aturan code block (WAJIB): setiap bagian isi yang akan kucopy langsung ditampilkan dalam satu code block markdown sendiri, persis pola:",
    );
    L.push("```markdown", "{isi}", "```");
    L.push(
      "{isi} = isi bagian itu. Yang wajib di-fence: Nama dan bio akun (satu code block), SETIAP paragraf strategi funnel (TOFU, MOFU, BOFU), dan SETIAP jurnal (judul + URL verbatim). Heading bagian, daftar audiens, nomor urut, dan SEMUA entri Referensi (3 baris per item) tetap ditulis polos sebagai teks biasa, DILARANG dibungkus code block.",
    );
    L.push(
      "DILARANG mengemas jawaban sebagai file .md, .docx, atau .pdf — seluruh hasil ditampilkan langsung di percakapan sesuai format di atas.",
    );
    L.push("</format_output>", "");
    L.push(
      "Cek mandiri sebelum menjawab: <guardrail>, <riset_web>, <struktur_funnel>, dan <identitas_akun> dipatuhi; bio akun maksimal 150 karakter dan berisi ajakan mengeklik link produk di bawahnya; semua level funnel (TOFU, MOFU, BOFU) memakai campuran angle di <angle_konten> (fakta unik/aneh, problem awareness, dan meme relate; tidak hanya fakta unik); semua referensi berita berada di luar politik, pemilu, SARA, dan ujaran kebencian (berita kasus dan gosip boleh), dan tiap referensi tersambung ke salah satu angle seputar kategori produk; semua referensi membahas produk atau kategorinya (bukan tren acak di luar niche) dan diurutkan dari terbaru; frasa produk di kategorinya hasil riset dipakai di bahasa Audiens dan Strategi; strategi BOFU sesuai Aturan BOFU di KONTEKS; tiap paragraf strategi mematuhi blok <pemanfaatan_konteks>" +
        (tbOn
          ? "; urutan jawaban Tugas A (Riset dan Strategi) dulu, lalu Tugas B (Deskripsi Level 3); paragraf strategi TOFU, MOFU, dan BOFU memakai manfaat dan skenario yang sama dengan Tugas B"
          : "") +
        "; setiap paragraf strategi dan jurnal terbungkus satu code block ```markdown``` sendiri seperti <format_output>, sedangkan entri Referensi ditulis polos tanpa code block; jawaban hanya tampil di chat, bukan file .md/.docx/.pdf.",
    );
    return L.join("\n");
  }

  const penyusun = { utama: build };
  return penyusun[keluaran]();
}
