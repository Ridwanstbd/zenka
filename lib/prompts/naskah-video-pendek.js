import "server-only";
import { buatDokumen } from "./dokumen";

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
      pdfbio: "Dapatkan PDF lead magnet, klik link di bio",
    };
    var aj =
      av === "custom"
        ? v("ajakanCustom") || "Isi Sendiri"
        : ajMap[av] || av;
    var nm;
    if (fun !== "BOFU")
      nm =
        "TOFU dan MOFU steril: DILARANG nama produk, brand, atau harga. Lead magnet hanya boleh muncul di Ending jika CTA pilihan menyebutnya.";
    else
      nm =
        "BOFU: aturan produk/lead magnet ikut keputusan di knowledge awal. Mode lead magnet: boleh menyebut lead magnet, DILARANG menyebut produk; janji = klaim PDF lead magnet diarahkan ke link di bio. Mode jual langsung di knowledge: boleh menyebut produk, DILARANG menyebut lead magnet.";
    var ending =
      "Ending memakai CTA pilihan di atas" +
      (fun === "BOFU"
        ? " (default BOFU + lead magnet di knowledge: ajakan klik link di bio untuk menerima PDF)"
        : "") +
      ". Klaim PDF lead magnet dikirim via link di bio; DILARANG mengarahkan klaim PDF ke komentar.";
    return [
      "<konteks_dasar>",
      "KONTEKS DASAR (WAJIB DITAATI): Semua konteks utama ada di knowledge yang saya tempel di awal chat ini — hasil Zenka Lead Magnet (lead magnet yang sudah jadi), dan hasil Zenka Riset (audiens, strategi TOFU/MOFU/BOFU, ide TOFU#/MOFU#/BOFU# beserta Alasan/Bukti dan Referensi verbatim). Konteks produk, Alasan/Bukti, mode lead magnet/jualan, mekanisme PDF, dan riset mengikuti knowledge itu.",
      "</konteks_dasar>",
      "",
      "<peran>",
      "Kamu menjalankan dua peran berurutan:",
      "1. Short-Video Scriptwriter: menulis naskah video pendek berformat H-F-B-E (Hook, Foreshadow, Body, Ending) yang mengalir, langsung, tidak membingungkan penonton, relevan dengan audiens, dan terdengar natural saat diucapkan.",
      "2. Brand Safety Editor (Guardian): memastikan aturan nama produk dan lead magnet serta aturan format terpenuhi sebelum jawaban final.",
      "</peran>",
      "",
      "<konteks>",
      "Konteks produk, Alasan/Bukti, dan pola viral mengikuti knowledge awal chat ini (ide yang saya sebut berikut Referensi terkait di Zenka Riset). Alasan/Bukti topik yang saya tulis di bagian konteks ini WAJIB jadi dasar utama naskah.",
      'Topik: "' + v("judul") + '" [' + fun + "]",
      "Alasan + Bukti topik:\n" + v("alasan"),
      "SUMBER FRASA FOKUS (WAJIB, cek dulu sebelum menulis): cari di chat ini hasil Zenka Caption video pendek yang PALING TERBARU (bagian TIKTOK, INSTAGRAM REELS, FACEBOOK REELS, THREADS, YOUTUBE SHORTS, TAG YOUTUBE). Caption memakai SATU frasa fokus yang sama di SEMUA platform: frasa itu muncul persis di 80 karakter pertama caption TIKTOK, INSTAGRAM REELS, FACEBOOK REELS, THREADS, dan YOUTUBE SHORTS, juga ditulis utuh di awal judul YOUTUBE SHORTS dan menjadi tag PERTAMA di TAG YOUTUBE. Cara memastikan: bandingkan 80 karakter pertama caption kelima platform itu; rangkaian kata yang identik di semua caption adalah frasa fokus. Judul dan TAG YOUTUBE hanya dipakai sebagai penguat. Jika ada caption yang berbeda, pakai frasa yang muncul identik di caption PALING BANYAK platform. Frasa itu hasil riset frasa platform di caption dan bisa berupa gabungan frasa tren + frasa kategori produk (3-6 kata) atau frasa kategori saja (2-4 kata). WAJIB dipakai UTUH dan VERBATIM (tanpa memotong bagian trennya, tanpa mengubah kata, urutan, ejaan, sinonim, atau terjemahan) sebagai FRASA FOKUS naskah ini, mengalahkan definisi di bawah. Jika ada beberapa hasil caption, pakai yang paling akhir.",
      'SYARAT WAJIB (CEK PALING PERTAMA, NASKAH GAGAL DITULIS JIKA TIDAK TERPENUHI): lihat pesan SAYA (pengguna) yang PALING TERBARU sebelum pesan ini, yaitu pesan tepat sebelum prompt naskah ini. Naskah HANYA boleh ditulis jika pesan itu adalah perintah membuat caption video pendek (cirinya: diawali baris "PERINTAH: BUAT CAPTION VIDEO PENDEK (Zenka Caption)" atau meminta caption TIKTOK, INSTAGRAM REELS, FACEBOOK REELS, THREADS, YOUTUBE SHORTS, KATEGORI VIDEO YOUTUBE, TAG YOUTUBE) dan kamu sudah menjawabnya dengan hasil caption. Jika pesan saya yang paling terbaru BUKAN perintah membuat caption video pendek (perintah lain apa pun, termasuk caption carousel), JANGAN tulis naskah, hook, estimasi, atau apa pun. Balas HANYA dengan kalimat ini: "Naskah gagal ditulis: perintah terakhir sebelum ini bukan perintah membuat caption video pendek. Jalankan dulu prompt Zenka Caption video pendek, lalu kirim ulang prompt naskah ini." DILARANG menentukan frasa fokus sendiri sebagai pengganti.',
      'DEFINISI HOOK & FRASA FOKUS (tentukan sendiri, jangan tanya aku): FRASA FOKUS = frasa fokus dari hasil caption terbaru (lihat SUMBER FRASA FOKUS), tanpa cadangan: jika tidak ada, ikuti SYARAT WAJIB di atas (naskah gagal ditulis). HOOK = kalimat PERTAMA naskah (KALIMAT AUDIO 3S): 1 kalimat pendek, sekitar 8-16 kata (terucap sekitar 3 detik), memuat frasa fokus UTUH di bagian mana pun dalam kalimat itu (tidak harus kata pertama), terdengar seperti orang ngobrol ke teman, bukan seperti keyword atau judul SEO. Boleh diawali pembuka natural (cth: "Kamu pernah sadar nggak,", "Ternyata", "Jujur deh,") dan disambung kata penghubung natural sebelum/sesudah frasa fokus; kata-kata frasa fokus sendiri tetap utuh, berurutan, dan tidak diubah. Contoh untuk frasa fokus "cara belajar investing": KAKU = "Cara belajar investing ini wajib kamu tahu."; NATURAL = "Kamu pernah sadar nggak, cara belajar investing paling gampang itu justru dari dompet sendiri?". Hook menimbulkan rasa penasaran atau "seriusan?", cocok dengan funnel ' +
        fun +
        ", dan mengikuti pola hook viral di Referensi knowledge.",
      "Durasi: " +
        v("durasi") +
        " | Gaya: " +
        v("gaya") +
        " | Sapaan: " +
        v("sapaan") +
        " | CTA Ending: " +
        aj,
      "</konteks>",
      "",
      "<tugas>",
      "Pertama, tentukan hook dan frasa fokus sesuai definisi di konteks. Lalu kembangkan Alasan/Bukti topik di konteks sebagai dasar utama (didukung Alasan/Bukti + Referensi ide terkait di knowledge awal) menjadi naskah H-F-B-E penuh, relevan dengan audiens, dan jangan keluar topik. Utamakan kejelasan: satu arah pikiran, tanpa kata pertentangan, dan tanpa kalimat penjelas/caveat. BUAT SEDERHANA: hanya 1 ide yang bisa dijelaskan dalam 1 kalimat, langsung kena tanpa bikin mikir berat.",
      "</tugas>",
      "",
      "<format_output>",
      "Aturan code block: paragraf naskah (bagian yang kucopy) wajib tampil di dalam satu code block markdown sendiri, persis pola:",
      "```markdown",
      "{naskah}",
      "```",
      "1. Naskah = SATU PARAGRAF mengalir tanpa label [HOOK], [FORESHADOW], [BODY], atau [ENDING], tanpa enter di dalam paragraf, ditulis di dalam satu code block ```markdown``` seperti pola di atas.",
      "2. Setelah code block ditutup, tekan ENTER satu kali dan tulis 1 kalimat estimasi durasi dan jumlah kata di baris baru tersendiri, di luar code block.",
      "3. Maksimal 160 kata total, tiap segmen 2-3 kalimat, panjang disesuaikan dengan durasi terpilih.",
      "DILARANG mengemas jawaban sebagai file .md, .docx, atau .pdf — seluruh hasil ditampilkan langsung di percakapan sesuai format di atas.",
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
      '9. KERINGANAN: HANYA 1 ide sederhana yang bisa dijelasin dalam 1 kalimat. Target bisa langsung ngebayangin situasinya (relatable). Bikin orang bilang "seriusan?" atau "kok bisa ya?" tanpa perlu dijelasin lebih lanjut. Hindari konsep abstrak, istilah teknis, atau fakta yang butuh penjelasan bertingkat. Kalau nggak bisa disederhanain lagi jadi lebih ringan, ubah angle-nya.',
      "</aturan_naskah>",
      "",
      "<guardrail>",
      "DILARANG SARA. Topik POLITIK dan GOSIP (selebriti, figur publik, drama viral) BOLEH dibahas, dengan aturan NETRAL yang WAJIB berlaku di seluruh naskah termasuk hook: (a) tidak memihak atau membela siapa pun — partai, tokoh, kandidat, pemerintah, oposisi, selebriti, maupun pihak yang berseteru; (b) DILARANG ujaran kebencian, hinaan, ejekan, julukan merendahkan, body shaming, atau serangan kepada pihak mana pun; (c) DILARANG menilai siapa benar atau salah, DILARANG ajakan memilih, menolak, atau memboikot pihak tertentu; (d) DILARANG hoaks, rumor yang belum terkonfirmasi, tuduhan, info pribadi, atau klaim yang tidak ada di Alasan/Bukti dan knowledge; (e) HANYA berkomentar dari sudut pandang frasa produk/kategori produk: sebut sisi peristiwa yang netral dan faktual, lalu bawa ke fakta unik kategori produk, bukan mengomentari orangnya atau pilihan politiknya. Doa di Foreshadow juga netral, tidak mendoakan kemenangan/kekalahan pihak mana pun.",
      "Aturan nama produk kalah atas alasan ide jika bertabrakan. Jangan mengarang angka, testimoni, atau hasil pasti. Jangan menanyakan apa pun kepadaku.",
      "</guardrail>",
      "",
      'Cek mandiri sebelum menjawab: pesan saya yang paling terbaru sebelum prompt ini adalah perintah membuat caption video pendek dan sudah kamu jawab (jika tidak, balas hanya dengan pesan gagal di SYARAT WAJIB); frasa fokus sama persis (verbatim, utuh, tidak dipotong) dengan frasa fokus hasil caption itu dan terucap utuh di kalimat pertama; kalimat pertama adalah hook pendek (sekitar 3 detik) yang memuat frasa fokus utuh dan lolos TES BACA KERAS (terdengar seperti orang ngobrol, bukan keyword); tidak ada label bagian; satu paragraf terbungkus satu code block ```markdown``` sendiri lalu satu baris estimasi di luar code block; tidak lebih dari 160 kata; tidak ada kata pertentangan di seluruh naskah termasuk hook (tetapi, tapi, walaupun, namun, meskipun, padahal, dan sejenisnya); tidak ada kalimat penjelas/caveat seperti "Tapi penelitiannya pada manusia masih terbatas,"; TOFU terasa menghibur; doa positif, kreatif, dan wajar (bukan absurd); aturan nama produk dan lead magnet sesuai mode; CTA Ending sesuai pilihan. QUICK TEST: bisa dijelasin dalam 1 kalimat; relatable (bisa langsung kebayang); bikin reaksi "seriusan?" atau "kok bisa ya?" tanpa perlu dijelasin lebih lanjut; ringan, nggak bikin mikir berat; jawaban hanya tampil di chat, bukan file .md/.docx/.pdf.',
    ].join("\n");
  }

  const penyusun = { utama: build };
  return penyusun[keluaran]();
}
