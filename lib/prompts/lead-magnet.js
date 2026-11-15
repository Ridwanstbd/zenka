import "server-only";
import { buatDokumen } from "./dokumen";

// Penyusun prompt "lead-magnet". Hanya berjalan di server.
// Kode di dalam fungsi ini disalin apa adanya dari versi HTML (index_1.html);
// "document" diganti tiruan yang membaca isian form dari server.
export function susunLeadMagnet(input, keluaran) {
  const document = buatDokumen(input);

  function v(id) {
    return document.getElementById(id).value.trim();
  }
  function J(a) {
    return a.join("\n");
  }
  function say(k, m) {
    var s = document.getElementById("st-" + k);
    s.textContent = m;
    setTimeout(function () {
      s.textContent = "";
    }, 2500);
  }

  function buildKonsep() {
    return J([
      "<peran>",
      "Kamu Lead Magnet Strategist dan Information Product Architect senior (30+ tahun): ahli psikologi target audiens Indonesia, empathy-driven marketing, dan desain gratisan yang menarik lead sekaligus mengarahkan mereka membeli produk utama.",
      "</peran>",
      "",
      "<konteks>",
      "Produk: " + v("produk"),
      "Harga Produk: " + v("harga"),
      "Deskripsi: " + v("deskripsi"),
      "</konteks>",
      "",
      "<guardrail>",
      "1. DILARANG politik, SARA, gosip.",
      "2. Jangan mengarang fakta, angka, testimoni, atau legalitas yang tidak ada di konteks. Jika dibutuhkan, pakai placeholder dalam kurung siku, cth [isi testimoni asli].",
      "3. Jangan menanyakan apa pun kepadaku dan jangan minta konfirmasi. Jika ada nilai kosong, simpulkan dari konteks.",
      "4. Bahasa Indonesia santai, praktis, hangat, tidak kaku.",
      "</guardrail>",
      "",
      "<tugas>",
      "Berfikir mendalam terlebih dahulu sebelum menjawab: pahami jenis produk, harga yang ditawarkan, target audiens, dan masalah utama mereka dari Deskripsi. Pikirkan bagaimana gratisan yang tepat bisa menangkap lead dan mengarahkan mereka membeli produk pada harga tersebut.",
      "",
      "Setelah berpikir, tulis 5 ide lead magnet dengan ketentuan:",
      "1. 5 ide tidak boleh sama jenis maupun sama angle; variasikan jenis lead magnet (checklist, mini e-book, template, kalkulator, cheat sheet, worksheet, dsb sesuai yang paling cocok).",
      "2. Judul spesifik dan mengandung janji hasil konkret yang paling didengar audiens target.",
      "3. Tiap ide menjembatani ke produk: lead magnet memberi kemenangan kecil, produk menghabiskan masalah penuh, sehingga alami mendorong lead untuk membeli produk pada harga di atas.",
      "4. STRUKTUR KERANGKA tiap ide menyesuaikan jenis lead magnet: e-book dan mini e-book memakai pola bab (Cover dengan janji, Kata Pengantar/isu, pembahasan inti per bab, Halaman CTA produk, Penutup, Lampiran); checklist memakai urutan langkah pakai terurut; template dan kalkulator fokus cara pakai, isian, dan hasil. Tiap bagian: judul + sub-bagian + 1 kalimat arah isi. Bagian CTA boleh menyebut produk dan harga yang ada di konteks.",
      "</tugas>",
      "",
      "<format_output>",
      "Tulis tepat 5 ide dengan urutan yang PERSIS seperti ini: label ditulis polos (di luar code block), setiap isi dalam satu code block markdown sendiri. Contoh dua ide pertama lalu lanjutkan persis polanya sampai ide kelima:",
      "Judul 1:",
      "```markdown",
      "{isi judul}",
      "```",
      "Struktur Kerangka Judul 1:",
      "```markdown",
      "{isi struktur kerangka}",
      "```",
      "Judul 2:",
      "```markdown",
      "{isi judul}",
      "```",
      "Struktur Kerangka Judul 2:",
      "```markdown",
      "{isi struktur kerangka}",
      "```",
      "dan seterusnya sampai Judul 5 dan Struktur Kerangka Judul 5.",
      "{isi judul} = judul lengkap ide itu. {isi struktur kerangka} = STRUKTUR KERANGKA utuh ide itu, siap tempel ke Prompt Bangun.",
      "DILARANG mengemas jawaban sebagai file .md, .docx, atau .pdf — seluruh hasil ditampilkan langsung di percakapan sesuai format di atas.",
      "</format_output>",
    ]);
  }

  function buildBangun() {
    return J([
      "<peran>",
      "Kamu Senior Content Writer sekaligus Riset Editor yang menulis draf lead magnet berbasis sumber nyata, dengan sentuhan Sales Copywriter yang menyisipkan penjualan produk secara halus dan natural. Tulisanmu santai, praktis, dan menghibur.",
      "</peran>",
      "",
      "<konteks>",
      "Judul: " + (v("b-judul") || "-"),
      "Produk saya: " + v("produk"),
      "Harga produk saya: " + v("harga"),
      "Struktur kerangka (kembangkan SEMUA bagian yang tertulis, urut sesuai kerangka, tanpa ada yang hilang):\n" +
        v("b-struktur"),
      "</konteks>",
      "",
      "<riset_web>",
      "Sebelum menulis tiap klaim faktual (angka, data, fakta, penelitian), WAJIB browsing atau cari web live, bukan dari memori dan bukan ketik manual. Tiap klaim faktual wajib punya minimal 1 sumber valid: jurnal ilmiah diutamakan; jika jurnal tidak ketemu setelah browsing, boleh artikel web kredibel (media, portal berita, situs institusi, blog ahli) yang relevan.",
      "Tulis label sumber (Jurnal: atau Artikel web:) + judul + URL + penulis/tanggal jika ada, VERBATIM dari hasil browsing. DILARANG mengarang URL, judul, atau DOI, dan DILARANG URL mati.",
      "Bagian yang hanya memuat pengalaman, instruksi, atau penjualan tanpa klaim faktual tidak wajib sumber.",
      "TIDAK WAJIB Claude Cowork — yang penting bisa search web. AKSES RISET (pakai yang tersedia): (1) jika kamu Claude Cowork atau AI lain yang bisa membuka tab browser, buka sumber langsung di tab (pakai tab TikTok, Instagram, YouTube, Facebook, Google di grup ini jika ada) untuk memastikan riset web valid; (2) jika Claude Cowork atau tab browser TIDAK tersedia (misalnya Claude paket gratis atau AI lain), lanjutkan dengan fitur pencarian web (web search) untuk mencari jurnal dan artikel, lalu buka halaman hasilnya jika bisa; (3) HANYA jika tab browser DAN web search sama-sama tidak tersedia, ikuti aturan di bawah.",
      "Jika kamu TIDAK bisa membuka tab browser DAN TIDAK bisa web search sama sekali, katakan di awal jawaban, lalu tulis draf tanpa klaim faktual spesifik dan tandai bagian yang butuh sumber dengan [butuh sumber].",
      "</riset_web>",
      "",
      "<guardrail>",
      "1. Tiap bagian kerangka ditulis dengan heading + draf. Cover, Pengantar, Penutup, dan CTA ringkas sesuai fungsinya; bagian teks berisi 150-250 kata per bagian; Lampiran berisi alat siap pakai (checklist, kalkulator, template pesan, profil penulis).",
      "2. Sisipkan penjualan produk secara natural: nama produk + manfaat + CTA ringan di bagian keuntungan atau bukti, di Halaman CTA (penawaran utama: harga dan cara mendapatkan sesuai jenis produk), dan di Penutup (dorongan bertindak). Jangan hard-sell di bagian pembuka; utamakan value dulu.",
      "3. Sesuaikan istilah dengan jenis produk (fisik: varian, stok, garansi; kelas: batch, materi; digital: akses, download).",
      "4. Jangan mengarang data, harga, atau testimoni yang tidak ada di konteks. DILARANG politik, SARA, dan gosip.",
      "5. Ingatkan di akhir bahwa ini DRAF dan wajib ditulis ulang dengan bahasa sendiri sebelum dipakai.",
      "</guardrail>",
      "",
      "<format_output>",
      "Aturan code block (WAJIB): heading nama bagian kerangka tetap ditulis polos; isi draf tiap bagian (paragraf, langkah, isi alat, dan sumber Jurnal/Artikel verbatim di bawah klaimnya, termasuk placeholder [butuh sumber] jika ada) tampil dalam satu code block markdown sendiri per bagian, persis pola:",
      "```markdown",
      "{isi}",
      "```",
      "{isi} = isi lengkap bagian itu; setelah ``` penutup, bagian berikutnya ditulis polos.",
      "DILARANG mengemas jawaban sebagai file .md, .docx, atau .pdf — seluruh hasil ditampilkan langsung di percakapan sesuai format di atas.",
      "</format_output>",
      "",
      "<tugas>",
      "Bangun draf per bagian kerangka, urut sesuai kerangka, dengan sumber hasil riset web di tiap klaim faktual dan penjualan produk saya yang disisipkan secara natural.",
      "</tugas>",
    ]);
  }

  const penyusun = { konsep: buildKonsep, bangun: buildBangun };
  return penyusun[keluaran]();
}
