import "server-only";

// Sepuluh jenis konten evergreen (tahan lama dan menahan scroll) untuk prompt riset,
// topik video pendek, dan topik utas.
// keluarga = cara penulis hilir (naskah, caption, utas, visual planner) mengeksekusi jenis ini.
export const JENIS_EVERGREEN = [
  { nama: "KESALAHAN UMUM", tag: "KESALAHAN-UMUM", pemicu: "orang takut ternyata selama ini keliru", isi: "kebiasaan atau cara yang umum dilakukan padahal keliru, berikut yang benarnya", keluarga: "PROBLEM AWARENESS" },
  { nama: "MITOS VS FAKTA", tag: "MITOS-FAKTA", pemicu: "menguji keyakinan penonton", isi: "satu kepercayaan yang populer diuji dengan fakta yang bisa diverifikasi", keluarga: "FAKTA UNIK/ANEH" },
  { nama: "TANDA ATAU CIRI", tag: "TANDA-CIRI", pemicu: "orang ingin mengecek diri sendiri", isi: "tanda atau ciri yang bisa langsung dicocokkan dengan diri, barang, atau kebiasaannya", keluarga: "PROBLEM AWARENESS" },
  { nama: "KENAPA BISA BEGITU", tag: "KENAPA-BEGITU", pemicu: "menjawab hal yang dialami tapi belum dipahami", isi: "penjelasan sederhana atas satu hal yang sering dialami", keluarga: "PROBLEM AWARENESS" },
  { nama: "DULU VS SEKARANG", tag: "DULU-SEKARANG", pemicu: "memancing nostalgia dan perbandingan", isi: "perubahan kebiasaan, cara, atau barang dari masa lalu ke masa kini", keluarga: "FAKTA UNIK/ANEH" },
  { nama: "ASAL-USUL DAN FAKTA UNIK", tag: "ASAL-USUL-UNIK", pemicu: "memancing rasa ingin tahu dan enak dibagikan", isi: "asal-usul, sejarah, atau fakta yang jarang diketahui", keluarga: "FAKTA UNIK/ANEH" },
  { nama: "CERITA RELATE", tag: "CERITA-RELATE", pemicu: 'penonton merasa "ini aku banget"', isi: "cerita atau adegan sehari-hari yang akrab, boleh lucu dan boleh haru", keluarga: "MEME RELATE jika lucu atau berformat meme; selain itu PROBLEM AWARENESS" },
  { nama: "TUTORIAL SINGKAT", tag: "TUTORIAL-SINGKAT", pemicu: "manfaatnya jelas dan sering disimpan", isi: "cara melakukan satu hal dalam beberapa langkah pendek yang bisa langsung dicoba", keluarga: "PROBLEM AWARENESS" },
  { nama: "A VS B", tag: "A-VS-B", pemicu: "orang terdorong memilih dan berkomentar", isi: "dua pilihan, kebiasaan, atau cara yang setara dibandingkan, lalu audiens diajak memilih", keluarga: "PROBLEM AWARENESS" },
  { nama: "DAFTAR CEK", tag: "DAFTAR-CEK", pemicu: "praktis dan layak disimpan", isi: "daftar poin pendek untuk diperiksa sebelum, saat, atau sesudah melakukan sesuatu", keluarga: "PROBLEM AWARENESS" },
];

// Daftar bernomor 10 jenis, dipakai di dalam prompt.
export function daftarEvergreen() {
  return JENIS_EVERGREEN.map((j, i) => i + 1 + ". " + j.nama + " [" + j.tag + "]: " + j.pemicu + ". Isinya " + j.isi + ".");
}

// Syarat evergreen dan penahan scroll.
export const SYARAT_EVERGREEN =
  "EVERGREEN: tiap ide tetap relevan dan masuk akal bila ditonton atau dibaca 1 tahun lagi. DILARANG menumpang tren atau viralitas sesaat: berita, gosip, politik, film atau lagu yang sedang ramai, istilah viral, sound atau template yang sedang tren, serta momen bertanggal.";
export const SYARAT_TAHAN_SCROLL =
  "MENAHAN SCROLL: judul langsung memperlihatkan pemicu jenisnya, spesifik (satu situasi, satu masalah, atau satu pertanyaan), dipahami sekali baca, dan janjinya benar-benar dijawab oleh isinya. DILARANG clickbait yang menipu.";

// media = "video" atau "utas"; menentukan sebutan audiens.
export function ragamAngle(media) {
  const penikmat = media === "utas" ? "pembaca" : "penonton";
  return [
    "Tiap ide WAJIB memakai SALAH SATU dari 10 jenis konten evergreen berikut, dikaitkan secara relevan dengan niche/kategori produk pada <konteks>. Sebutan audiensnya " + penikmat + ".",
    ...daftarEvergreen(),
    SYARAT_EVERGREEN,
    SYARAT_TAHAN_SCROLL,
    "CAMPURAN JENIS: 4 ide dalam satu hari WAJIB memakai 4 jenis yang berbeda. Dalam 1 rencana 5 hari (20 ide), ke-10 jenis WAJIB muncul TEPAT 2 kali, dan kedua idenya beda sudut pandang dan hook. DILARANG 2 ide berurutan memakai jenis yang sama, termasuk saat menyambung dari hari sebelumnya.",
  ];
}

// Arah tiap funnel. label = nama funnel di prompt,
// cth { T: "T (TOFU)", M: "M (MOFU)", B: "B (BOFU)" }.
export function isiFunnel(bofu, label) {
  return [
    "- " + label.T + ": masalah, rasa penasaran, dan situasi yang paling umum sehingga dipahami orang yang belum kenal akun ini; satu ide per konten, ringan, tanpa solusi produk.",
    "- " + label.M + ": lebih dalam soal akar masalah, cara, dan pertimbangan sebelum memilih, supaya akun terasa paham niche-nya dan kontennya layak disimpan.",
    ...(bofu
      ? ["- " + label.B + ": tetap berangkat dari pemicu salah satu jenis konten, lalu ditarik secara wajar menuju produk sebagai solusi."]
      : []),
    "Semua jenis konten boleh dipakai di funnel mana pun; kedalaman dan tujuannya mengikuti funnel.",
  ];
}

// Batasan isi angle meme relate dan problem awareness; dipakai juga di prompt riset, utas, naskah, caption, dll.
export const BATAS_MEME =
  "Meme relate DILARANG merendahkan audiens, body shaming, mengejek kondisi kesehatan atau ekonomi, maupun menyindir orang nyata.";
export const BATAS_ANGLE =
  BATAS_MEME +
  " Problem awareness DILARANG menakut-nakuti berlebihan, mendiagnosis, atau membuat klaim yang tidak didukung riset.";

// Batasan isi tiap jenis konten evergreen.
export const BATAS_EVERGREEN =
  "Tanda atau ciri dan daftar cek DILARANG dipakai untuk mendiagnosis. Mitos vs fakta, kenapa bisa begitu, dulu vs sekarang, dan asal-usul HANYA memakai fakta yang bisa diverifikasi, tanpa sejarah atau penjelasan karangan. Tutorial HANYA berisi langkah yang aman dan wajar. A vs B DILARANG menyebut atau menjatuhkan merek lain.";

// Baris guardrail ragam jenis konten (tanpa nomor).
export function guardrailAngle() {
  return (
    "Ide WAJIB evergreen dan bervariasi sesuai 10 jenis konten, masing-masing dengan tag jenisnya. " +
    BATAS_EVERGREEN +
    " " +
    BATAS_ANGLE
  );
}

// Cara AI menentukan angle 1 topik. sumber = "alasan" (Alasan ditempel di prompt)
// atau "riwayat" (prompt tanpa kolom Alasan, jadi ide dicari di riwayat chat).
export function bacaAngle(sumber) {
  const tag = "[FAKTA-UNIK-...] = fakta unik/aneh, [PROBLEM-...] = problem awareness, [MEME-...] = meme relate";
  const tagEvergreen = JENIS_EVERGREEN.map((j) => "[" + j.tag + "] = " + j.keluarga).join("; ");
  const bentuk =
    "Untuk tag jenis konten evergreen, bentuk dan pemicu jenisnya WAJIB dipertahankan di dalam eksekusi angle tersebut, dan keduanya mengalahkan contoh pembuka angle: " +
    JENIS_EVERGREEN.map((j) => j.nama + " = " + j.isi + " (pemicu: " + j.pemicu + ")").join("; ") +
    ".";
  const simpul =
    'simpulkan dari judul topik dan isinya: format meme (POV, tipe-tipe orang, ekspektasi vs realita, "cuma aku yang...?") atau humor situasi sehari-hari = meme relate; menyentil gejala, kebiasaan keliru, atau salah kaprah audiens = problem awareness; selain itu = fakta unik/aneh.';
  const peta = "Tag jenis konten evergreen dan angle eksekusinya: " + tagEvergreen + ". " + bentuk;
  return sumber === "riwayat"
    ? "ANGLE TOPIK (tentukan sendiri, jangan tanya aku): cari ide dengan judul topik yang sama di riwayat chat ini; tag di awal Alasan-nya menentukan angle (" + tag + "). " + peta + " Jika tidak ketemu, " + simpul
    : "ANGLE TOPIK: baca dari tag di awal Alasan (" + tag + "). " + peta + " Jika tidak ada tag, " + simpul;
}

// Cara mengeksekusi tiap angle saat menulis konten dari 1 topik (dipakai penulis utas).
export function eksekusiAngle() {
  return [
    bacaAngle("alasan"),
    'FAKTA UNIK/ANEH: buka dengan fakta, sejarah, atau mitos yang bikin pembaca bereaksi "hah, seriusan?", lalu sambungkan ke masalah audiens.',
    'PROBLEM AWARENESS: buka dengan menyentil gejala, kebiasaan keliru, atau salah kaprah yang dialami pembaca sampai merasa "lho, ini aku banget"; P (Problem) dan A (Amplify) jadi pusat tulisan, nadanya empatik.',
    "MEME RELATE: buka dengan format meme yang dipakai topik (POV, tipe-tipe orang, ekspektasi vs realita, \"cuma aku yang...?\") dan situasi sehari-hari yang lucu; nada ringan dan jenaka tetap terasa sampai tulisan masuk ke solusi, yang ditertawakan situasinya, bukan orangnya.",
  ];
}
