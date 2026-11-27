import "server-only";
import { buatDokumen } from "./dokumen";
import {
  BATAS_ANGLE,
  BATAS_EVERGREEN,
  SYARAT_EVERGREEN,
  SYARAT_TAHAN_SCROLL,
  daftarEvergreen,
} from "./ragam-angle";

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
    "[Headline utama yang memancing penasaran dan ego]",
    "Dengan memiliki [Nama Produk], inilah manfaat nyata yang akan langsung mengubah keseharian Anda:",
    "Manfaat Andalan",
    "[Headline benefit, memancing penasaran]",
    "    [3-4 baris narasi relatable, sedikit humor: Fitur + sudut manfaat + skenario dari fase kehidupan target]",
    "    (ulangi untuk 3-5 manfaat bagian utama)",
    "Dan Masih Banyak Keuntungan Lainnya",
    "[Headline benefit]",
    "    [2-3 baris narasi singkat dan nendang, struktur sama]",
    "    (ulangi untuk semua manfaat bagian tambahan yang valid)",
    "Spesifikasi Lengkap: daftar SEMUA fitur faktual yang diekstrak, hanya di bagian paling bawah.",
    "",
    "Cek mandiri sebelum mencetak: total blok >= 6 tanpa blok paksaan; semua fitur sudah ditambang; peta dan fase usia sesuai target; skenario tiap blok berasal dari fase itu dan bervariasi; tidak ada blok Level 1 atau 2; tidak ada dua blok dengan sudut dan skenario sama; tidak ada klaim karangan; topik sensitif ditulis dengan empati; nada santai dan bervariasi.",
    "Hasil Tugas B wajib selaras dengan Identitas Akun, Audiens, dan Strategi funnel di Tugas A, dan manfaat serta skenarionya harus sama dengan yang sudah dipakai sebagai angle strategi di Tugas A.",
  ].join("\n");

  function build() {
    var p = v("produk"),
      d = v("deskripsi"),
      as = v("asetSuara");
    var aturanBofu =
      "BOFU menjual produk langsung: wajib dibuka dengan pemicu salah satu jenis konten di <angle_konten>, lalu masalah, lalu solusi kategori, lalu ajakan chat/beli langsung. Boleh sebut produk dan CTA, tetap ringan kek ngobrol.";
    var linkBio =
      "Link tepat di bawah bio adalah link produk. Ajakan di bio WAJIB mengarahkan orang mengeklik link di bawah untuk melihat atau memesan produk (cth cek produknya, cek stok, chat/beli). Boleh menyebut kategori atau produk, tetap ringan kek ngobrol.";
    var L = [];
    L.push("<peran>");
    L.push(
      "Kamu Senior Content Strategist untuk media sosial Indonesia: ahli riset audiens, funnel konten, dan konten evergreen yang menahan scroll. Jujur, spesifik, dan tidak mengarang data.",
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
      "2. Identitas akun (nama dan bio) yang kamu definisikan sendiri di <identitas_akun>: FONDASI UTAMA seluruh strategi karena tidak ada input topik dari saya. Nada, POV, klaim, dan penawaran di semua funnel wajib selaras dengan identitas ini, dan arah tema serta angle konten lahir dari identitas ini. Aturan produk/CTA per tahap funnel tetap berlaku.",
    );
    L.push("</pemanfaatan_konteks>", "");
    L.push("<riset_web>");
    L.push(
      "Definisi riset di sini: WAJIB browsing atau cari web live sebelum menulis. FOKUS RISET = PRODUK DAN KATEGORINYA serta kebutuhan audiens yang BERULANG dan tahan lama, bukan tren, berita, atau viralitas sesaat:",
      "(a) Frasa produk di kategorinya: kata/frasa yang orang sungguh ketik dan pakai saat mencari atau membicarakan produk sejenis (saran autocomplete, judul listing terlaris, hashtag kategori, istilah sehari-hari pembeli).",
      "(b) Fakta-fakta seputar produk dan kategorinya: fakta unik/aneh, sejarah, mitos vs fakta, cara kerja/bahan, kebiasaan pemakai yang dianggap wajar padahal punya sisi aneh, dan data dari sumber kredibel.",
      "(c) Dan lain-lain yang relevan: pertanyaan yang terus berulang, masalah dan keluhan nyata pembeli (ulasan marketplace, komentar, forum), kesalahan umum, mitos, tanda atau ciri yang sering ditanyakan, kebiasaan dulu dan sekarang, pilihan yang sering diperbandingkan, keraguan sebelum membeli, dan produk sejenis/pesaing.",
      "Sumber Referensi: situs institusi, jurnal, ensiklopedia, media kredibel, atau konten platform yang membahas produk/kategori ini. UTAMAKAN yang paling kredibel dan isinya masih benar serta berguna dalam jangka panjang; sumber lama tetap boleh. HANYA di luar politik, pemilu, SARA, ujaran kebencian, gosip, dan berita sesaat. Tiap referensi WAJIB bisa dijadikan salah satu jenis konten di <angle_konten>. Prioritaskan tema yang selaras dengan Identitas akun yang kamu definisikan. Untuk tiap item salin: Judul, Media, tanggal posting (tulis \"tanpa tanggal\" bila tidak tercantum), URL, pemicu/angle.",
    );
    L.push(
      "Jurnal untuk MOFU: bila paragraf strategi MOFU memuat klaim edukasi (teori, penyebab, data), cari web live untuk jurnal pendukung tiap klaim, lalu cantumkan judul + URL verbatim per klaim. Klaim edukasi tanpa jurnal DILARANG ditulis. TOFU dan BOFU tidak wajib jurnal.",
    );
    L.push(
      "Semua referensi dan jurnal wajib disalin verbatim dari bukti yang kamu temukan (sumber sesuai kriteria di atas). URL karangan atau di luar kriteria dianggap INVALID. Referensi wajib membahas produk atau kategorinya, dengan Angle ke Niche yang jelas.",
    );
    L.push(
      'Jika kamu TIDAK bisa membuka tab browser DAN TIDAK bisa web search sama sekali: katakan di awal jawaban, lalu tulis Referensi dan jurnal sebagai "belum terverifikasi, perlu dicari manual" tanpa URL, dan MOFU ditulis tanpa klaim edukasi. Jangan pernah mengarang URL.',
    );
    L.push(
      "CARA RISET (WAJIB, kerjakan PERTAMA sebelum menulis apa pun). AKSES RISET (pakai yang tersedia): (1) jika bisa membuka tab browser (mis. Claude Cowork), buka sumber langsung (pakai tab TikTok, Instagram, YouTube, Facebook, Google di grup ini jika ada); (2) jika tidak, pakai web search untuk SEMUA langkah riset dan buka halaman hasilnya jika bisa; (3) jika keduanya tidak tersedia, ikuti aturan tidak bisa browsing di atas. Ambil HANYA judul, media, tanggal, URL, dan isi yang benar-benar terlihat di tab atau di hasil web search. DILARANG mengarang, memperkirakan, atau mengisi dari ingatan.",
      "LANGKAH 1 — Frasa produk di kategorinya: ketik nama produk dan kategorinya di https://www.google.com/search?q=[kategori] , https://www.tiktok.com/search?q=[kategori] , https://shopee.co.id/search?keyword=[kategori] , dan https://www.tokopedia.com/search?q=[kategori] . Catat saran autocomplete, frasa yang berulang di judul listing terlaris dan konten teratas, serta istilah sehari-hari yang dipakai pembeli.",
      "LANGKAH 2 — Fakta dan penjelasan: cari fakta seputar produk/kategori (cth \"fakta [kategori]\", \"mitos [kategori]\", \"asal-usul [kategori]\", \"kenapa [masalah]\", \"ciri [masalah]\", \"kesalahan [kebiasaan]\", \"cara [kebutuhan]\") di Google, situs institusi, ensiklopedia, dan media spesifik https://www.google.com/search?q=site:detik.com+[kata-kunci] (ganti domain: kompas.com, tempo.co, situs institusi, dll). Untuk SETIAP kandidat referensi, buka halaman aslinya; salin Judul, Media, dan tanggal posting persis dari halaman itu, dan URL dari address bar. Halaman gagal dibuka atau isinya tidak cocok dengan judul = buang.",
      "LANGKAH 3 — Masalah nyata dan konten yang bertahan: baca ulasan produk sejenis di marketplace, komentar, dan forum untuk menemukan keluhan dan keraguan yang benar-benar muncul berulang; cari kategori ini di https://www.tiktok.com/search?q=[kategori] , https://www.youtube.com/results?search_query=[kategori] , dan https://www.instagram.com/explore/tags/[kategori]/ , lalu utamakan konten yang masih berguna meski sudah lama (masih dikomentari, ditanyakan, atau dicari). Catat hook, format, dan emosi yang menahan scroll. Jika halaman perlu login atau angka disembunyikan, lewati platform itu, jangan menebak.",
      "LANGKAH 4 — Jurnal MOFU: untuk tiap klaim edukasi, cari di https://scholar.google.com/scholar?q=[klaim] , https://pubmed.ncbi.nlm.nih.gov/?term=[klaim] , atau https://garuda.kemdikbud.go.id/documents?q=[klaim] ; buka halaman jurnalnya dan salin judul + URL persis dari halaman itu. Tidak ketemu = klaim dibuang.",
      "ATURAN KETAT RISET: setiap Referensi dan jurnal harus berasal dari halaman yang benar-benar dibuka di sesi ini. Jangan login, jangan isi form, jangan klik follow/like/komentar/subscribe. Jangan berhenti setelah 1-2 referensi; selesaikan riset sampai kebutuhan Referensi semua funnel terpenuhi.",
      "RISET INI KERJA INTERNAL: langkah, daftar pencarian, dan kandidat yang dibuang DILARANG ditampilkan. Output tetap PERSIS sesuai format jawaban di prompt ini; hasil riset hanya terlihat lewat Audiens (masalah, bahasa sehari-hari = frasa produk yang ditemukan, keberatan), Strategi, Referensi, dan jurnal yang ditulis.",
    );
    L.push("</riset_web>", "");
    L.push("<definisi_evergreen>");
    L.push("1. " + SYARAT_EVERGREEN);
    L.push("2. " + SYARAT_TAHAN_SCROLL);
    L.push(
      "3. Tiap paragraf strategi TOFU, MOFU, dan BOFU wajib mencantumkan jenis konten yang dipakai, pemicu penahan scrollnya, dan angle penyambungnya ke niche produk, dengan menyebut nomor referensi yang dipakai.",
    );
    L.push("</definisi_evergreen>", "");
    L.push("<angle_konten>");
    L.push(
      "Semua level funnel memakai 10 jenis konten evergreen seputar niche:",
    );
    L.push(...daftarEvergreen());
    L.push("</angle_konten>", "");
    L.push("<definisi_tofu_mofu_bofu>");
    L.push(
      "TOFU (berhenti scroll): pilih jenis konten di <angle_konten> yang paling ringan dan paling luas. Satu ide per konten, dipahami dalam 1 kalimat, relatable ke target audiens. Bukan penjelasan panjang; tutorial dan daftar cek dibuat sangat pendek. Dilarang menyebut metodologi, persentase, atau kutip jurnal, dan jangan bergaya laporan riset. Hook singkat kek chat WA. Akhiri dengan ajakan ringan yang sesuai jenisnya (cth: 'Kamu pernah notice nggak?', 'Kamu tim yang mana?', atau 'Simpan buat dicek nanti'). Tujuannya berhenti scroll lalu komentar, simpan, atau bagikan.",
    );
    L.push(
      "MOFU (bantu milih): pilih jenis konten di <angle_konten> yang membantu audiens memahami dan memilih, dikombinasikan dengan keluhan/keraguan yang beneran muncul di komen/grup. Lebih kek ngobrol, bukan kuliah. Fokus 1 masalah, 1 sudut pandang unik; poin atau langkah hanya dipakai pada tutorial singkat dan daftar cek, dan tetap pendek.",
    );
    L.push(
      "BOFU (soft push): WAJIB menyelipkan pemicu salah satu jenis konten di <angle_konten> di awal/tengah, dikemas melalui pengalaman pribadi/rekomendasi super ringan. Isi dan larangannya mengikuti Aturan BOFU di KONTEKS.",
    );
    L.push("</definisi_tofu_mofu_bofu>", "");
    L.push("<guardrail>");
    L.push(
      "1. DILARANG politik, pemilu, SARA, ujaran kebencian, gosip, berita sesaat, dan menumpang tren.",
    );
    L.push(
      "2. TOFU dan MOFU DILARANG berisi nama produk, brand, harga, atau CTA. Hanya kategori plus jenis konten evergreen. BOFU mengikuti Aturan BOFU di KONTEKS.",
    );
    L.push("3. Jangan mengarang spek, angka, atau persen hasil pasti.");
    L.push("4. " + BATAS_ANGLE);
    L.push("5. " + BATAS_EVERGREEN);
    L.push("</guardrail>", "");
    L.push("<struktur_funnel>");
    L.push(
      "Tiap level funnel TOFU, MOFU, dan BOFU ditulis sebagai SATU paragraf simpel. Tanpa daftar, tanpa pilar, tanpa daftar ide konten.",
    );
    L.push("</struktur_funnel>", "");
    L.push("<tugas>");
    L.push(
      "TUGAS RISET DAN STRATEGI (Tugas A + Tugas B). Hasil output HARUS berupa JSON kompak (single-line) dengan struktur persis:",
    );
    L.push("{");
    L.push(
      '  "target-strategi": "string: Target pasar (1 baris asumsi) + Identitas Akun (Nama akun, Bio akun + jumlah karakter) + Audiens (profil singkat, 3 masalah utama, bahasa sehari-hari, pemicu beli, keberatan terbesar) + Strategi TOFU (1 paragraf: 3-4 jenis konten andalan, bahan utama, masalah audiens, referensi + angle) + Strategi MOFU (1 paragraf: sama, sertakan jurnal judul+URL per klaim edukasi) + Strategi BOFU (1 paragraf: soft push dengan pemicu jenis konten, mengikuti Aturan BOFU) + Referensi (bernomer, 3 baris/item: Judul+Media+tanggal+link, Pola Penahan Scroll, Angle ke Niche). SEMUA paragraf strategi WAJIB memakai manfaat dan skenario fase kehidupan dari Tugas B."',
    );
    L.push(
      '  "awesome-description": "string: Tugas B Level 3 lengkap - Headline utama memancing penasaran/ego, Manfaat Andalan (3-5 blok: headline benefit + 3-4 baris narasi relatable Fitur+Sudut+Skenario), Dan Masih Banyak Keuntungan Lainnya (semua blok tambahan: headline + 2-3 baris), Spesifikasi Lengkap (daftar semua fitur faktual). Gaya santai ala teman ke teman, variasi pembuka kalimat, minimal 6 blok total, peta fase kehidupan pria/wanita sesuai target pasar."',
    );
    L.push("}");
    L.push("- Escape: newline → \\n, double quote → \\\", backslash → \\\\");
    L.push("- TIDAK ADA teks di luar JSON, TIDAK ADA markdown code block, TIDAK ADA pretty-print");
    L.push("</tugas>", "");
    L.push(
      "Cek mandiri: Output adalah JSON valid single-line dengan kedua key target-strategi dan awesome-description terisi (bukan string kosong); escape \\n, \\\", \\\\ benar; bio akun ≤150 karakter mengajak klik link produk; 3 strategi funnel mencakup ke-10 jenis konten; all aturan <guardrail>, <riset_web>, <struktur_funnel>, <identitas_akun>, <pemanfaatan_konteks> dipatuhi; strategi BOFU sesuai Aturan BOFU; referensi valid, jurnal MOFU lengkap; jawaban hanya JSON di chat.",
    );
    return L.join("\n");
  }

  const penyusun = { utama: build };
  return penyusun[keluaran]();
}
