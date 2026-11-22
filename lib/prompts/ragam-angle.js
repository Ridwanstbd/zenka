import "server-only";

// Tiga jenis angle topik (fakta unik, problem awareness, meme relate) untuk prompt
// topik video pendek dan topik utas, supaya ide tiap hari tidak semuanya fakta unik.

// media = "video" atau "utas"; menentukan sebutan audiens dan contoh format meme.
export function ragamAngle(media) {
  const utas = media === "utas";
  const penikmat = utas ? "pembaca" : "penonton";
  const formatMeme = utas
    ? 'POV, tipe-tipe orang, ekspektasi vs realita, "cuma aku yang...?", atau format teks/template meme yang sedang ramai di Threads'
    : 'POV, tipe-tipe orang, ekspektasi vs realita, "cuma aku yang...?", atau template/sound meme yang sedang tren';
  return [
    "Tiap ide WAJIB memakai SALAH SATU dari 3 jenis angle berikut, dikaitkan secara relevan dengan niche/kategori produk pada <konteks>:",
    "1. FAKTA UNIK/ANEH: fakta, sejarah, sains, atau mitos seputar kategori produk yang jarang diketahui dan bikin " + penikmat + ' bereaksi "hah, seriusan?". Tag: [FAKTA-UNIK-SEJARAH], [FAKTA-UNIK-SAINS], [FAKTA-UNIK-MITOS], [FAKTA-UNIK-KEBIASAAN].',
    '2. PROBLEM AWARENESS: menyadarkan audiens pada masalah yang sebenarnya mereka alami tapi belum disadari, dianggap wajar, atau belum punya nama (gejala kecil sehari-hari, kebiasaan yang ternyata keliru, salah kaprah, atau dampak yang diam-diam menumpuk), sampai mereka merasa "lho, ini aku banget". Masalahnya diambil dari masalah/keluhan target audiens di Riset pada <konteks>. Nadanya empatik, bukan menakut-nakuti atau menyalahkan. Tag: [PROBLEM-GEJALA], [PROBLEM-KEBIASAAN-SALAH], [PROBLEM-SALAH-KAPRAH], [PROBLEM-DAMPAK].',
    "3. MEME RELATE: humor tentang situasi sehari-hari target audiens seputar kategori produk yang langsung terasa relate, dikemas dengan format meme yang dikenal (" + formatMeme + "), sampai " + penikmat + ' tertawa, tag teman, atau komen "ini gue banget". Yang ditertawakan situasinya, BUKAN orangnya. Tag: [MEME-POV], [MEME-TIPE-ORANG], [MEME-EKSPEKTASI-REALITA], [MEME-TEMPLATE-TREN].',
    "CAMPURAN PER HARI: dari 10 ide per hari, tiap jenis angle WAJIB muncul minimal 3 kali (pola dasar: 4 fakta unik, 3 problem awareness, 3 meme relate; boleh digeser selama tiap jenis tetap minimal 3). Campuran ini berlaku juga di dalam TOFU yang dominan, jadi TOFU tidak boleh hanya fakta unik. DILARANG 3 ide berurutan memakai jenis angle yang sama.",
  ];
}

// Isi tiap funnel per jenis angle. label = nama funnel di prompt,
// cth { T: "T (TOFU)", M: "M (MOFU)", B: "B (BOFU)" }.
export function isiFunnel(bofu, label) {
  return [
    "- " + label.T + ': pancing rasa penasaran dan rasa relate massal. Fakta unik = fakta/sejarah aneh atau mitos absurd; problem awareness = gejala atau kebiasaan yang dialami tanpa sadar, cukup sampai "lho, aku juga gitu" tanpa solusi; meme relate = situasi paling umum yang paling gampang dibagikan dan di-tag ke teman.',
    "- " + label.M + ": bahas akar masalah dan edukasi. Fakta unik = penyebab tersembunyi atau kebiasaan nyeleneh yang sering salah dipahami; problem awareness = bedah kenapa masalah itu terjadi dan salah kaprah yang memperparahnya; meme relate = perjuangan atau drama audiens menghadapi masalah itu (cth mencoba solusi yang keliru), diselipi 1 poin edukasi.",
    ...(bofu
      ? ["- " + label.B + ": berangkat dari salah satu angle, lalu ditarik menuju solusi produk langsung. Fakta unik = fakta mengejutkan soal dampak buruk membiarkan masalah; problem awareness = kerugian nyata kalau masalah terus dibiarkan; meme relate = situasi relate yang punchline-nya produk sebagai penyelamat."]
      : []),
  ];
}

// Batasan isi angle meme relate dan problem awareness; dipakai juga di prompt riset, utas, naskah, caption, dll.
export const BATAS_MEME =
  "Meme relate DILARANG merendahkan audiens, body shaming, mengejek kondisi kesehatan atau ekonomi, maupun menyindir orang nyata.";
export const BATAS_ANGLE =
  BATAS_MEME +
  " Problem awareness DILARANG menakut-nakuti berlebihan, mendiagnosis, atau membuat klaim yang tidak didukung riset.";

// Baris guardrail ragam angle (tanpa nomor).
export function guardrailAngle() {
  return (
    "Ide WAJIB bervariasi: fakta unik/aneh, problem awareness, dan meme relate bercampur setiap hari dengan tag angle masing-masing; DILARANG semua ide fakta unik. " +
    BATAS_ANGLE
  );
}

// Cara AI menentukan angle 1 topik. sumber = "alasan" (Alasan ditempel di prompt)
// atau "riwayat" (prompt tanpa kolom Alasan, jadi ide dicari di riwayat chat).
export function bacaAngle(sumber) {
  const tag = "[FAKTA-UNIK-...] = fakta unik/aneh, [PROBLEM-...] = problem awareness, [MEME-...] = meme relate";
  const simpul =
    'simpulkan dari judul topik dan isinya: format meme (POV, tipe-tipe orang, ekspektasi vs realita, "cuma aku yang...?") atau humor situasi sehari-hari = meme relate; menyentil gejala, kebiasaan keliru, atau salah kaprah audiens = problem awareness; selain itu = fakta unik/aneh.';
  return sumber === "riwayat"
    ? "ANGLE TOPIK (tentukan sendiri, jangan tanya aku): cari ide dengan judul topik yang sama di riwayat chat ini; tag di awal Alasan-nya menentukan angle (" + tag + "). Jika tidak ketemu, " + simpul
    : "ANGLE TOPIK: baca dari tag di awal Alasan (" + tag + "). Jika tidak ada tag, " + simpul;
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
