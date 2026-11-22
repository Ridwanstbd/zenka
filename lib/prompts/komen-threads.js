import "server-only";
import { buatDokumen } from "./dokumen";
import { BATAS_MEME } from "./ragam-angle";

// Penyusun prompt "komen-threads". Hanya berjalan di server.
// Kode di dalam fungsi ini disalin apa adanya dari versi HTML (index_d54a56.html);
// "document" diganti tiruan yang membaca isian form dari server.
export function susunKomenThreads(input, keluaran) {
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
    return !v("utasTarget")
      ? "Isi utas target"
      : "";
  }

  var PERAN = {
    lawan: {
      label: "Peran Lawan (Salmon Effect)",
      arah: "Ambil sudut pandang yang melawan pemikiran umum. Berbeda pendapat dengan sopan dan cerdas, tanpa menyerang atau merendahkan penulis utas.",
    },
    kawan: {
      label: "Peran Kawan",
      arah: "Tulis komentar yang sangat relatable sesuai topik, seperti teman yang ikut nimbrung dan merasa senasib.",
    },
    korban: {
      label: "Peran Korban",
      arah: "Bagikan pengalaman pribadi singkat saat pernah gagal terkait topik, jujur dan rendah hati, tanpa angka atau hasil karangan.",
    },
  };

  function build() {
    var p = PERAN[g("peran").value];
    return [
      "<konteks_dasar>",
      "KONTEKS DASAR (WAJIB DITAATI): Semua konteks utama ada di knowledge yang saya tempel di awal chat ini — hasil Zenka Riset (audiens, strategi TOFU/MOFU/BOFU, ide TOFU#/MOFU#/BOFU# beserta Alasan/Bukti dan Referensi verbatim). Produk, target, nada, dan aset suara mengikuti knowledge itu.",
      "</konteks_dasar>",
      "",
      "<peran>",
      "Kamu adalah Threads Community Commenter: pengguna Threads yang aktif berkomentar secara natural, menambah nilai pada utas orang lain, dan memancing obrolan tanpa terdengar seperti iklan atau bot.",
      "Suara komentar mengikuti peran terpilih: " + p.label + ". " + p.arah,
      "</peran>",
      "",
      "<konteks>",
      "Utas target: " + v("utasTarget"),
      "Konteks riset/produk/audiens mengikuti knowledge awal chat ini (ide yang saya sebut berikut Referensi terkait di Zenka Riset).",
      "</konteks>",
      "",
      "<tugas>",
      "Tulis 1 komentar murni untuk utas Threads di atas, tetap sesuai knowledge awal dan sesuai peran terpilih.",
      "</tugas>",
      "",
      "<format_output>",
      'Hanya teks komentar, siap paste. Tanpa label, tanpa pembuka seperti "Komentar:", dan tanpa penjelasan tambahan. Pendek: 1-3 kalimat, maksimal sekitar 40 kata. Natural seperti komentar manusia, emoji maksimal 1 dan hanya jika cocok.',
      "Tampilkan jawaban persis pola ini (teks komentar wajib di dalam satu code block ```markdown``` sendiri):",
      "```markdown",
      "{teks komentar}",
      "```",
      "Tidak ada teks apa pun di luar ketiga baris pola itu.",
      "DILARANG mengemas jawaban sebagai file .md, .docx, atau .pdf — seluruh hasil ditampilkan langsung di percakapan sesuai format di atas.",
      "</format_output>",
      "",
      "<guardrail>",
      "1. Komentar relevan langsung dengan Utas target dan memakai inti knowledge awal. Jangan menyalin knowledge mentah-mentah.",
      "2. Tambahkan nilai: sudut pandang baru, pengalaman, atau pertanyaan pemantik yang membuat penulis atau pembaca ingin membalas.",
      '3. Ikuti nada utas target: jika utasnya meme atau humor relate (POV, tipe-tipe orang, ekspektasi vs realita, "cuma aku yang...?"), komentar boleh ikut bercanda dengan menambah 1 situasi relate yang nyambung atau melanjutkan punchline-nya, tetap dengan suara peran terpilih. ' + BATAS_MEME,
      "4. DILARANG promosi: tanpa nama produk, brand, harga, link, hashtag, atau ajakan beli.",
      "5. Jangan mengarang angka, data, atau hasil pasti. DILARANG politik, SARA, gosip.",
      "6. Jangan menanyakan apa pun kepadaku.",
      "</guardrail>",
      "",
      "Cek mandiri sebelum menjawab: hanya 1 komentar tanpa label, suaranya konsisten dengan peran terpilih, tidak ada unsur promosi, dan terdengar seperti manusia; jawaban persis tiga baris pola itu yaitu baris ```markdown, teks komentar, baris ``` tanpa teks lain di luarnya; jawaban hanya tampil di chat, bukan file .md/.docx/.pdf.",
    ].join("\n");
  }

  const penyusun = { utama: build };
  return penyusun[keluaran]();
}
