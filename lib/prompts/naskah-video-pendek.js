import "server-only";
import { buatDokumen } from "./dokumen";
import { BATAS_ANGLE, bacaAngle } from "./ragam-angle";

// Penyusun prompt "naskah-video-pendek". Hanya berjalan di server.
// Kode di dalam fungsi ini disalin apa adanya dari versi HTML (index_0e4edf.html);
// "document" diganti tiruan yang membaca isian form dari server.
export function susunNaskahVideoPendek(input, keluaran) {
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
    if (!v("judul")) return "Isi judul topik";
    if (!v("alasan")) return "Isi Alasan + Bukti";
    return "";
  }

  function build() {
    var fun = v("funnel"),
      av = v("ajakan");
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
    var nm;
    if (fun !== "BOFU")
      nm =
        "TOFU dan MOFU steril: DILARANG nama produk, brand, atau harga.";
    else
      nm = "BOFU: jual langsung, boleh menyebut nama produk.";
    var ending = "Ending memakai CTA pilihan di atas.";
    // Target panjang per durasi, dihitung dengan tempo 2,5 kata per detik
    // (tempo yang sama dipakai untuk timestamp potongan naskah).
    var TARGET = {
      "30 Detik": { kata: "76-80 kata", segmen: "1-2 kalimat", potongan: "4", detik: 32, maksKata: 90 },
      "60 Detik": { kata: "152-160 kata", segmen: "1-2 kalimat", potongan: "8", detik: 64, maksKata: 170 },
      "90 Detik": { kata: "228-240 kata", segmen: "1-2 kalimat", potongan: "12", detik: 96, maksKata: 250 },
    };
    var tg = TARGET[v("durasi")] || TARGET["60 Detik"];
    var mmss = (detik) =>
      String(Math.floor(detik / 60)).padStart(2, "0") + ":" + String(detik % 60).padStart(2, "0");
    return [
      "<konteks_dasar>",
      "KONTEKS DASAR (WAJIB DITAATI): Semua konteks utama ada di knowledge yang saya tempel di awal chat ini — hasil Zenka Riset (audiens, strategi TOFU/MOFU/BOFU, ide TOFU#/MOFU#/BOFU# beserta Alasan/Bukti dan Referensi verbatim). Konteks produk, Alasan/Bukti, dan riset mengikuti knowledge itu.",
      "</konteks_dasar>",
      "",
      "<peran>",
      "Kamu menjalankan dua peran berurutan:",
      "1. Short-Video Scriptwriter: menulis naskah video pendek berformat H-F-B-E (Hook, Foreshadow, Body, Ending) yang mengalir, langsung, tidak membingungkan penonton, relevan dengan audiens, dan terdengar natural saat diucapkan.",
      "2. Brand Safety Editor (Guardian): memastikan aturan nama produk serta aturan format terpenuhi sebelum jawaban final.",
      "</peran>",
      "",
      "<konteks>",
      "Konteks produk, Alasan/Bukti, dan pola viral mengikuti knowledge awal chat ini (ide yang saya sebut berikut Referensi terkait di Zenka Riset). Alasan/Bukti topik yang saya tulis di bagian konteks ini WAJIB jadi dasar utama naskah.",
      'Topik: "' + v("judul") + '" [' + fun + "]",
      "Alasan + Bukti topik:\n" + v("alasan"),
      "SUMBER FRASA FOKUS (WAJIB, cek dulu sebelum menulis): cari di chat ini hasil Zenka Caption video pendek yang PALING TERBARU (bagian TIKTOK, INSTAGRAM REELS, FACEBOOK REELS, THREADS, YOUTUBE SHORTS, TAG YOUTUBE). Caption memakai SATU frasa fokus yang sama di SEMUA platform: frasa itu muncul persis di 80 karakter pertama caption TIKTOK, INSTAGRAM REELS, FACEBOOK REELS, THREADS, dan YOUTUBE SHORTS, juga ditulis utuh di awal judul YOUTUBE SHORTS dan menjadi tag PERTAMA di TAG YOUTUBE. Cara memastikan: bandingkan 80 karakter pertama caption kelima platform itu; rangkaian kata yang identik di semua caption adalah frasa fokus. Judul dan TAG YOUTUBE hanya dipakai sebagai penguat. Jika ada caption yang berbeda, pakai frasa yang muncul identik di caption PALING BANYAK platform. Frasa itu hasil riset frasa platform di caption dan bisa berupa gabungan frasa tren + frasa kategori produk (3-6 kata) atau frasa kategori saja (2-4 kata). WAJIB dipakai UTUH dan VERBATIM (tanpa memotong bagian trennya, tanpa mengubah kata, urutan, ejaan, sinonim, atau terjemahan) sebagai FRASA FOKUS naskah ini, mengalahkan definisi di bawah. Jika ada beberapa hasil caption, pakai yang paling akhir.",
      'SYARAT WAJIB (CEK PALING PERTAMA, NASKAH GAGAL DITULIS JIKA TIDAK TERPENUHI): lihat pesan SAYA (pengguna) yang PALING TERBARU sebelum pesan ini, yaitu pesan tepat sebelum prompt naskah ini. Naskah HANYA boleh ditulis jika pesan itu adalah perintah membuat caption video pendek (cirinya: diawali baris "PERINTAH: BUAT CAPTION VIDEO PENDEK (Zenka Caption)" atau meminta caption TIKTOK, INSTAGRAM REELS, FACEBOOK REELS, THREADS, YOUTUBE SHORTS, KATEGORI VIDEO YOUTUBE, TAG YOUTUBE) dan kamu sudah menjawabnya dengan hasil caption. Jika pesan saya yang paling terbaru BUKAN perintah membuat caption video pendek (perintah lain apa pun, termasuk caption carousel), JANGAN tulis naskah, hook, estimasi, atau apa pun. Balas HANYA dengan kalimat ini: "Naskah gagal ditulis: perintah terakhir sebelum ini bukan perintah membuat caption video pendek. Jalankan dulu prompt Zenka Caption video pendek, lalu kirim ulang prompt naskah ini." DILARANG menentukan frasa fokus sendiri sebagai pengganti.',
      'DEFINISI HOOK & FRASA FOKUS (tentukan sendiri, jangan tanya aku): FRASA FOKUS = frasa fokus dari hasil caption terbaru (lihat SUMBER FRASA FOKUS), tanpa cadangan: jika tidak ada, ikuti SYARAT WAJIB di atas (naskah gagal ditulis). HOOK = kalimat PERTAMA naskah (KALIMAT AUDIO 3S): 1 kalimat pendek, sekitar 8-16 kata (terucap sekitar 3 detik), memuat frasa fokus UTUH di bagian mana pun dalam kalimat itu (tidak harus kata pertama), terdengar seperti orang ngobrol ke teman, bukan seperti keyword atau judul SEO. Boleh diawali pembuka natural (cth: "Kamu pernah sadar nggak,", "Ternyata", "Jujur deh,") dan disambung kata penghubung natural sebelum/sesudah frasa fokus; kata-kata frasa fokus sendiri tetap utuh, berurutan, dan tidak diubah. Contoh untuk frasa fokus "cara belajar investing": KAKU = "Cara belajar investing ini wajib kamu tahu."; NATURAL = "Kamu pernah sadar nggak, cara belajar investing paling gampang itu justru dari dompet sendiri?"; MEME (untuk angle meme relate) = "Tipe orang yang baru niat cara belajar investing langsung beli lima buku, dibaca satu halaman.". Hook memancing reaksi sesuai angle topik di <angle_topik>, cocok dengan funnel ' +
        fun +
        ", dan mengikuti pola hook viral di Referensi knowledge.",
      "Durasi pilihan: " +
        v("durasi") +
        " | Durasi aktual: " +
        tg.detik +
        " detik (" +
        tg.potongan +
        " klip × 8 detik; selisihnya toleransi) | Gaya: " +
        v("gaya") +
        " | Sapaan: " +
        v("sapaan") +
        " | CTA Ending: " +
        aj,
      "</konteks>",
      "",
      "<angle_topik>",
      bacaAngle("alasan"),
      'FAKTA UNIK/ANEH: hook bikin penonton bereaksi "seriusan?" atau "kok bisa ya?", lalu Body membuka faktanya dan menyambungkannya ke keseharian penonton.',
      'PROBLEM AWARENESS: hook menyentil gejala, kebiasaan keliru, atau salah kaprah yang dialami penonton sampai merasa "lho, ini aku banget"; Body membedah masalahnya dengan nada empatik.',
      'MEME RELATE: naskah dibawakan seperti sketsa atau monolog komedi singkat. Hook langsung masuk format meme topik (POV, tipe-tipe orang, ekspektasi vs realita, "cuma aku yang...?"), Body berisi 2-3 momen situasi sehari-hari yang makin relate lalu ditutup punchline, dan untuk MOFU/BOFU disambung 1 poin edukasi atau solusi yang nyambung dengan situasinya. Target reaksinya senyum atau ketawa, "ini aku banget", dan tag teman. Kata ganti tetap mengikuti Sapaan yang dipilih (DILARANG gue/lo walau format meme aslinya memakai kata itu). Kontras ekspektasi vs realita ditulis berurutan ("Ekspektasinya ... Realitanya ...") tanpa kata pertentangan.',
      BATAS_ANGLE,
      "</angle_topik>",
      "",
      "<tugas>",
      "Pertama, tentukan hook dan frasa fokus sesuai definisi di konteks. Lalu kembangkan Alasan/Bukti topik di konteks sebagai dasar utama (didukung Alasan/Bukti + Referensi ide terkait di knowledge awal) menjadi naskah H-F-B-E penuh, relevan dengan audiens, dan jangan keluar topik. Utamakan kejelasan: satu arah pikiran, tanpa kata pertentangan, dan tanpa kalimat penjelas/caveat. BUAT SEDERHANA: hanya 1 ide yang bisa dijelaskan dalam 1 kalimat, langsung kena tanpa bikin mikir berat.",
      "Terakhir, setelah naskah utuh final, potong naskah utuh itu menjadi " + tg.potongan + " potongan bertimestamp, masing-masing tepat 8 detik, sesuai <potong_naskah> (bahan langsung untuk Zenka Visual Planner).",
      "</tugas>",
      "",
      "<format_output>",
      "Jawaban terdiri dari 3 bagian berurutan: (A) naskah utuh, (B) baris estimasi, (C) potongan naskah.",
      "1. Naskah utuh = SATU PARAGRAF mengalir tanpa label [HOOK], [FORESHADOW], [BODY], atau [ENDING], tanpa enter di dalam paragraf, ditulis sebagai teks biasa.",
      "2. Setelah naskah utuh, tekan ENTER satu kali dan tulis 1 kalimat estimasi di baris baru tersendiri. Kalimat itu WAJIB menyebut durasi aktual " +
        tg.detik +
        " detik (" +
        tg.potongan +
        " klip × 8 detik, dari pilihan " +
        v("durasi") +
        " yang dibulatkan ke atas; selisihnya toleransi) dan jumlah kata.",
      "3. Panjang naskah utuh WAJIB " +
        tg.kata +
        " (durasi aktual " +
        tg.detik +
        " detik pada tempo 2,5 kata per detik, " +
        tg.potongan +
        " klip × 8 detik), tiap segmen " +
        tg.segmen +
        ". Hitung kata sebelum menjawab; jika kurang atau lebih, tulis ulang sampai masuk rentang. Tidak pernah lebih dari " +
        tg.maksKata +
        " kata.",
      "4. Di bawah baris estimasi, tulis label POTONGAN NASKAH di baris sendiri, lalu semua potongan sesuai <potong_naskah>, satu potongan per baris, rentang timestamp dulu baru isi potongan. Pola persis:",
      "00:00-00:08 {potongan naskah 1}",
      "00:08-00:16 {potongan naskah 2}",
      "dst. dalam langkah 8 detik; potongan ke-" + tg.potongan + " = " + mmss(tg.detik - 8) + "-" + mmss(tg.detik),
      "Angka timestamp di pola di atas hanya contoh bentuk; hitung angka sebenarnya sesuai <potong_naskah>.",
      "DILARANG membuat file (.md/.docx/.pdf); tampilkan hasil langsung di chat.",
      "</format_output>",
      "",
      "<aturan_naskah>",
      '1. HOOK: kalimat PERTAMA naskah adalah hook yang kamu tentukan sendiri, memuat frasa fokus utuh di mana saja dalam kalimat itu sehingga frasa fokus pasti terucap, dengan susunan kalimat yang natural diucapkan (lihat contoh KAKU vs NATURAL di konteks). TES BACA KERAS: ucapkan hook dalam hati; jika terdengar seperti keyword, judul artikel, atau iklan kaku, susun ulang kalimatnya (frasa fokus tetap utuh) sampai terdengar seperti orang ngobrol. Satu angle saja, tanpa kata pertentangan dan tanpa caveat, tanpa label "Hook" atau "Frasa fokus" di output.',
      "2. Pakai sapaan yang dipilih. DILARANG kata lo, lu, gue, gw. DILARANG membuka dengan Halo, Hai, atau Assalamualaikum. Tanpa hashtag.",
      "3. " + nm,
      "4. Naskah harus langsung dan tidak membingungkan penonton. Satu kalimat = satu arah pikiran. DILARANG memakai kata pertentangan: tetapi, tapi, akan tetapi, walaupun, walau, namun, meskipun, meski, kendati, kendatipun, padahal, sedangkan, sebaliknya, di sisi lain, alih-alih, dan sejenisnya.",
      '5. DILARANG menulis klaim lalu menambahkan kalimat penjelas/caveat yang membatalkan atau menggantungkan klaim, termasuk persis: "Tapi penelitiannya pada manusia masih terbatas,". Varian yang juga dilarang: "walaupun penelitiannya masih terbatas", "meski belum terbukti pada manusia", "namun perlu diingat", "tapi efeknya berbeda tiap orang", "walau tidak selalu", "masih perlu penelitian lanjutan", "meskipun demikian". Jika data belum pasti, jangan tulis caveat-nya: ganti dengan fakta aman atau angle hiburan, atau buang klaim tersebut.',
      "6. MOFU: bagian Body tanpa produk. " + ending,
      "7. " +
        (fun === "TOFU"
          ? "TOFU WAJIB menghibur: ringan, relatable, lucu/aneh, bikin penonton senyum atau penasaran. DILARANG menggurui, DILARANG nada jualan, DILARANG edukasi berat, dan DILARANG caveat/disclaimer."
          : "Pastikan naskah fokus pada tujuan funnel " +
            fun +
            " dan tidak keluar topik."),
      "8. Foreshadow TOFU dan MOFU wajib memuat 1 doa positif singkat untuk retensi: 1 kalimat, wajar, tulus, nyambung dengan topik, dan terasa sebagai harapan baik. Boleh kreatif, misalnya mendoakan agar lunas hutang, mendapat rezeki melimpah, atau kebaikan lain yang relevan. Tanpa kata amin dan tanpa caveat. DILARANG doa absurd, aneh, lebay, mengada-ada, menyebut hal mustahil, atau keluar konteks.",
      '9. KERINGANAN: HANYA 1 ide sederhana yang bisa dijelasin dalam 1 kalimat. Target bisa langsung ngebayangin situasinya (relatable). Bikin reaksi sesuai angle tanpa perlu dijelasin lebih lanjut: "seriusan?" atau "kok bisa ya?" (fakta unik), "lho, ini aku banget" (problem awareness), atau senyum/ketawa dan "ini aku banget" (meme relate). Hindari konsep abstrak, istilah teknis, atau fakta yang butuh penjelasan bertingkat. Kalau nggak bisa disederhanain lagi jadi lebih ringan, ubah angle-nya.',
      "</aturan_naskah>",
      "",
      "<potong_naskah>",
      "Kerjakan SETELAH naskah utuh final dan lolos semua aturan di atas. Tiap potongan nanti menjadi 1 klip video tepat 8 detik di Zenka Visual Planner.",
      "1. POTONG (berpikir dulu): baca seluruh naskah utuh, lalu potong menjadi TEPAT " + tg.potongan + " potongan. Tiap potongan mewakili tepat 8 detik dan berisi sekitar 20 kata (tempo bicara 2,5 kata per detik, dengan jeda napas singkat di akhir klip). Bagi kata merata supaya tidak ada potongan yang jauh lebih pendek atau lebih panjang dari potongan lain.",
      "2. Pisahkan di tanda baca . ? !. Jika tanda itu belum menghasilkan " + tg.potongan + " potongan berisi sekitar 20 kata, boleh memisah di koma atau jeda alami antarfrasa. DILARANG memotong di tengah kata.",
      "3. VERBATIM: salin teks dari naskah utuh apa adanya, urutan sama persis, tanpa diubah, ditambah, atau dihilangkan. Jika semua potongan disambung kembali, hasilnya persis sama dengan naskah utuh.",
      "4. RENTANG TIMESTAMP: awali tiap potongan dengan rentang waktu format mm:ss-mm:ss, lalu satu spasi, baru isi potongan. Potongan pertama 00:00-00:08, potongan kedua 00:08-00:16, dan seterusnya dalam langkah tepat 8 detik tanpa celah dan tanpa tumpang tindih. Potongan terakhir adalah " + mmss(tg.detik - 8) + "-" + mmss(tg.detik) + " (= " + tg.potongan + " klip × 8 detik).",
      "5. DURASI PILIHAN VS TOLERANSI: durasi pilihan adalah " + v("durasi") + ", tetapi karena tiap klip wajib 8 detik, total durasi dibulatkan ke atas menjadi " + tg.detik + " detik (" + mmss(tg.detik) + "). Selisihnya adalah toleransi. Pakai " + tg.detik + " detik dan " + mmss(tg.detik) + " di baris estimasi dan timestamp; jangan pakai angka durasi pilihan sebagai akhir timestamp.",
      "</potong_naskah>",
      "",
      "<guardrail>",
      "DILARANG SARA. Topik POLITIK dan GOSIP (selebriti, figur publik, drama viral) BOLEH dibahas, dengan aturan NETRAL yang WAJIB berlaku di seluruh naskah termasuk hook: (a) tidak memihak atau membela siapa pun — partai, tokoh, kandidat, pemerintah, oposisi, selebriti, maupun pihak yang berseteru; (b) DILARANG ujaran kebencian, hinaan, ejekan, julukan merendahkan, body shaming, atau serangan kepada pihak mana pun; (c) DILARANG menilai siapa benar atau salah, DILARANG ajakan memilih, menolak, atau memboikot pihak tertentu; (d) DILARANG hoaks, rumor yang belum terkonfirmasi, tuduhan, info pribadi, atau klaim yang tidak ada di Alasan/Bukti dan knowledge; (e) HANYA berkomentar dari sudut pandang frasa produk/kategori produk: sebut sisi peristiwa yang netral dan faktual, lalu bawa ke angle topik seputar kategori produk, bukan mengomentari orangnya atau pilihan politiknya; (f) topik POLITIK DILARANG dibawakan sebagai meme, dan meme dari topik GOSIP hanya menertawakan situasi penonton, bukan orang yang digosipkan. Doa di Foreshadow juga netral, tidak mendoakan kemenangan/kekalahan pihak mana pun.",
      "Aturan nama produk kalah atas alasan ide jika bertabrakan. Jangan mengarang angka, testimoni, atau hasil pasti. Jangan menanyakan apa pun kepadaku.",
      "</guardrail>",
      "",
      'Cek mandiri: pesan terbaru saya sebelum prompt ini adalah perintah caption yang sudah kamu jawab (jika tidak, balas hanya dengan pesan gagal di SYARAT WAJIB); kalimat pertama adalah hook pendek (sekitar 3 detik) yang memuat frasa fokus caption secara utuh dan lolos TES BACA KERAS; naskah utuh satu paragraf tanpa label bagian, lalu satu baris estimasi; label POTONGAN NASKAH dan daftar TEPAT ' + tg.potongan + ' potongan verbatim dan berurutan (sambungannya persis naskah utuh), tiap baris diawali timestamp mm:ss-mm:ss langkah tepat 8 detik tanpa celah dari 00:00 sampai ' + mmss(tg.detik) + '; jumlah kata ' + tg.kata.replace(" kata", "") + ' kata (durasi aktual ' + tg.detik + ' detik dari pilihan ' + v("durasi") + ', selisihnya toleransi), maksimal ' + tg.maksKata + ' kata; tanpa kata pertentangan dan tanpa kalimat penjelas/caveat; sesuai angle topik di <angle_topik>; doa positif, kreatif, dan wajar; aturan produk sesuai funnel; CTA Ending sesuai pilihan; QUICK TEST lolos (jelas dalam 1 kalimat, relatable, reaksi sesuai angle, ringan); jawaban hanya di chat.',
    ].join("\n");
  }

  const penyusun = { utama: build };
  return penyusun[keluaran]();
}
