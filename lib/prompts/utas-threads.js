import "server-only";
import { buatDokumen } from "./dokumen";

// Penyusun prompt "utas-threads". Hanya berjalan di server.
// Kode di dalam fungsi ini disalin apa adanya dari versi HTML (index_cb6776.html);
// "document" diganti tiruan yang membaca isian form dari server.
export function susunUtasThreads(input, keluaran) {
  const document = buatDokumen(input);

  function g(id){return document.getElementById(id)}
  function v(id){return g(id).value.trim()}
  function say(m){var s=g("st");s.textContent=m;setTimeout(function(){s.textContent=""},2500)}
  function problem(){
  if(!v("judul"))return "Isi topik pilihan";
  if(!v("alasan"))return "Isi Alasan + Bukti";
  return "";}

  var PERAN={lawan:"Peran Lawan (Salmon Effect): ambil sudut pandang yang melawan pemikiran umum",kawan:"Peran Kawan: tulis cerita yang sangat relatable sesuai topik",korban:"Peran Korban: bagikan pengalaman pribadi saat pernah gagal"};
  var RMAP={komentar:"Bagian mana yang paling bikin kamu penasaran? Aku tunggu obrolannya",wa:"Buat yang mau ngobrol lebih lanjut, link grup WA-nya ada di bio",ikuti:"Ikuti biar nggak ketinggalan bagian berikutnya",bio:"Semua lengkapnya sudah aku taruh di link bio",dm:"Kalau mau tanya-tanya dulu, DM aja ya!"};
  var MULTI_G6="Panjang teks bebas per post (tidak ada batasan jumlah kata/huruf yang mengikat), buat senatural dan semengalir mungkin.";
  var MULTI_FMT="[POST 1]\nLampirkan Visual: [YA / TIDAK]\nSumber Visual: [GENERATE AI / CARI GAMBAR] (jika YA, pilih yang paling cocok; tulis \"-\" jika TIDAK)\nPrompt Generate Image: tulis \"-\" saja jika bukan GENERATE AI; jika GENERATE AI, tampilkan persis pola ini:\n```markdown\n{prompt image berbahasa Inggris siap paste ke image generator AI}\n```\nKata Kunci Cari Gambar: tulis \"-\" saja jika bukan CARI GAMBAR; jika CARI GAMBAR, tampilkan persis pola ini:\n```markdown\n{kata kunci cari gambar berbahasa Inggris, 4-7 kata}\n```\nTeks Post:\n```markdown\n{teks post}\n```\n\n[POST 2]\nLampirkan Visual: [YA / TIDAK]\nSumber Visual: ....\nPrompt Generate Image: (pola sama dengan [POST 1])\nKata Kunci Cari Gambar: (pola sama dengan [POST 1])\nTeks Post:\n```markdown\n{teks post}\n```\n(dan seterusnya sampai post terakhir)\n\n[VERSI LENGKAP]\n```markdown\n{gabungan seluruh \"Teks Post\" dari POST 1 sampai POST terakhir menjadi satu tulisan utuh; DILARANG menyertakan marker [POST ...], baris Lampirkan Visual, Sumber Visual, Prompt Generate Image, maupun Kata Kunci Cari Gambar; susun berurutan sebagai satu teks mengalir dari awal sampai akhir; boleh rapikan transisi antar post agar nyaman dibaca tanpa mengubah inti isi; O (Offer) dan R (CTA) hanya muncul di bagian akhir}\n```";
  var CFG={
  "1":{line:"1 post (post tunggal, tanpa bersambung)",
  t:"Susun 1 POST mandiri (tanpa utas bersambung), siap paste sebagai satu post tunggal. P sampai R dipadatkan dalam satu post dengan TEKS POST MAKSIMAL 250 karakter (termasuk spasi/emoji), tetap kreatif dan mengalir tanpa terasa terpotong.",
  g6:"Panjang teks wajib maksimal 250 karakter termasuk spasi/emoji; buat senatural dan semengalir mungkin.",
  fmt:"[POST 1]\nLampirkan Visual: [YA / TIDAK]\nSumber Visual: [GENERATE AI / CARI GAMBAR] (jika YA, pilih yang paling cocok; tulis \"-\" jika TIDAK)\nPrompt Generate Image: tulis \"-\" saja jika bukan GENERATE AI; jika GENERATE AI, tampilkan persis pola ini:\n```markdown\n{prompt image berbahasa Inggris siap paste ke image generator AI}\n```\nKata Kunci Cari Gambar: tulis \"-\" saja jika bukan CARI GAMBAR; jika CARI GAMBAR, tampilkan persis pola ini:\n```markdown\n{kata kunci cari gambar berbahasa Inggris, 4-7 kata}\n```\nTeks Post:\n```markdown\n{teks post}\n```",chk:"format post mandiri dengan sumber visual plus prompt generate/kata kunci pencarian dan teks; semua bagian yang kucopy tampil di dalam code block ```markdown``` sendiri"},
  "3-5":{line:"3-5 utas bersambung",
  t:"Susun 3-5 utas bersambung, siap paste berurutan. Tidak wajib sampai 5: boleh berhenti di 3 atau 4 jika cerita sudah selesai. Yang terpenting setiap kalimat ngena ke target audiens, tanpa batasan huruf/kata yang kaku.",
   g6:MULTI_G6,fmt:MULTI_FMT,chk:"tiap POST memiliki sumber visual plus prompt generate atau kata kunci pencarian; di akhir ada VERSI LENGKAP berupa gabungan teks semua post tanpa marker [POST] dan tanpa metadata visual"},
  "7-9":{line:"7-9 utas bersambung",
  t:"Susun 7-9 utas bersambung, siap paste berurutan. Tidak wajib sampai 9: boleh berhenti di 7 atau 8 jika cerita sudah selesai. Yang terpenting setiap kalimat ngena ke target audiens, tanpa batasan huruf/kata yang kaku.",
   g6:MULTI_G6,fmt:MULTI_FMT,chk:"tiap POST memiliki sumber visual plus prompt generate atau kata kunci pencarian; di akhir ada VERSI LENGKAP berupa gabungan teks semua post tanpa marker [POST] dan tanpa metadata visual"}};

  function build(){
  var fun=v("funnel"),av=v("ajakan"),jc=CFG[v("jumlah")]||CFG["7-9"],single=v("jumlah")==="1";
  var ajMap={wa:"Gabung grup WhatsApp, tawarkan link di bio atau DM untuk gabung (tanpa perintah komen kata kunci)",komentar:"Interaksi & Diskusi, ajakan implisit: undang reaksi atau interaksi tanpa perintah komen",ikuti:"Ikuti / Follow",bio:"Klik Link di Bio",dm:"Pesan atau tanya dulu, DM aja ya!: ajak pembaca mengirim pesan langsung (DM) untuk bertanya soal topik atau produk"};
  var aj=av==="custom"?(v("ajakanCustom")||"Isi Sendiri"):(ajMap[av]||av);
  var rEx=av==="custom"?aj:(RMAP[av]||RMAP.komentar);
  var ending=av==="komentar"
  ?"Ajakan Interaksi & Diskusi harus IMPLISIT: DILARANG menyuruh berkomentar secara eksplisit (larang frasa \"Komen ...\", \"Tulis ... di kolom komentar\", \"Balas ...\", \"Reply ...\"). Cukup undang interaksi secara halus, misal pertanyaan pemantik atau ajakan berbagi cerita."
  :av==="wa"
  ?"Untuk grup WA, tawarkan link di bio atau ajakan DM untuk gabung, tanpa perintah komen kata kunci."
  :"";

  var aturanFunnel = "";
  if (fun === "TOFU") {
    aturanFunnel = "TOFU: Wajib dikemas lewat sudut pandang fakta unik, aneh, atau jarang diketahui orang sebagai daya tarik utama. DILARANG menyertakan link produk, jualan langsung, nama brand, atau harga. Fokus murni pada edukasi dan kesadaran.";
  } else if (fun === "MOFU") {
    aturanFunnel = "MOFU: Wajib dibuka dengan fakta unik, aneh, atau kisah mengejutkan yang relevan dengan topik, lalu dijembatani ke edukasi mendalam. BOLEH menyertakan link (seperti link grup WA atau link edukasi pendukung) serta CTA soft-selling sesuai ajakan di atas.";
  } else {
    aturanFunnel = "BOFU: Wajib diawali dengan fakta unik/aneh yang membongkar masalah mendasar, lalu diarahkan ke solusi produk. BOLEH menyertakan link produk/affiliate secara langsung, menyebutkan nama produk/brand, harga, serta CTA penawaran keras sesuai ajakan di atas.";
  }

  return [
  "<konteks_dasar>",
  "KONTEKS DASAR (WAJIB DITAATI): Semua konteks utama ada di knowledge yang saya tempel di awal chat ini — hasil Zenka Riset (audiens, strategi TOFU/MOFU/BOFU, ide TOFU#/MOFU#/BOFU# beserta Alasan/Bukti dan Referensi verbatim). Produk, target, nada, aset suara, pilar, dan aturan produk/harga/CTA per tahap funnel mengikuti knowledge itu. Jangan minta saya menempel ulang; jika data spesifik tidak ada, simpulkan dan tandai sebagai asumsi.",
  "</konteks_dasar>","",
  "<peran>",
  "Kamu menjalankan dua peran berurutan:",
  "1. Threads Copywriter & Visual Content Strategist (formula PASTOR): menulis "+(single?"post tunggal":"utas")+" Threads yang ngena, relatable, siap paste, serta **menentukan POST nomor berapa saja yang WAJIB dilampirkan visual (gambar/video pendek)** beserta detail ide visualnya.",
  "2. Threads Community Strategist: menyarankan komunitas atau topik Threads yang cocok untuk menayangkan tulisan itu.",
  "Suara penulisan mengikuti Peran Penulisan terpilih: "+PERAN[v("peran")],
  "</peran>","",
  "<konteks>",
  "Konteks produk, target audiens, Alasan/Bukti, dan pola viral mengikuti knowledge awal chat ini (ide yang saya sebut berikut Referensi terkait di Zenka Riset). Alasan/Bukti topik yang saya tulis di bagian konteks ini WAJIB jadi dasar utama tulisan.",
  "Topik pilihan: "+v("judul")+" ["+fun+"]",
  "Alasan + Bukti topik:\n"+v("alasan"),
  "Ajakan (CTA): "+aj,
  "Jumlah: "+jc.line,
  "</konteks>","",
  "<tugas>",
  jc.t+(single?"":" Akhiri jawaban dengan blok [VERSI LENGKAP] berupa gabungan teks semua post."),
  "</tugas>","",
  "<formula_pastor>",
  "P (Problem): sentil masalah utama target audiens.",
  "A (Amplify): perkuat dampak negatif jika masalah dibiarkan.",
  "S (Story/Solution): ceritakan solusinya.",
  "T (Transformation): gambarkan hasil akhirnya.",
  "O (Offer): tawarkan bantuan ringan.",
  "R (Response/CTA): beri dorongan bertindak memakai ajakan di atas, misal: \""+rEx+"\".",
  single?"Padatkan P sampai R dalam satu post dengan TEKS POST maksimal 250 karakter.":"Sebar P, A, S, T di post awal sampai tengah. O dan R hanya muncul di POST terakhir.",
  "</formula_pastor>","",
  "<aturan>",
  "1. POST 1 dibuka dengan kalimat pembuka yang mengangkat fakta unik, aneh, atau cerita yang memancing rasa penasaran tinggi.",
  "2. Seluruh tulisan memakai suara Peran Penulisan di atas secara konsisten.",
  "3. O (Offer) dan R (CTA) WAJIB memakai ajakan terpilih di atas dan hanya muncul di POST terakhir."+(ending?" "+ending:""),
  "4. ATURAN FUNNEL & FAKTA UNIK: "+aturanFunnel,
  "5. PANJANG KATA & POST: "+(single?"TEKS POST MAKSIMAL 250 karakter (termasuk spasi/emoji). Buat senatural, mengalir, dan tetap muat dalam batas itu.":"Bebas per post (tidak ada batasan huruf atau kata yang kaku). Buat senatural dan sepadat/sesantai kebutuhan isi cerita agar pesan ngena ke target audiens."),
  "6. PENEMPATAN VISUAL (GAMBAR/VIDEO): Tentukan secara spesifik di setiap POST apakah memerlukan visual (YA) atau tidak (TIDAK). Sangat disarankan menaruh visual di POST 1 (untuk penghenti jempol) dan POST pertengahan/bukti fakta unik. Saya TIDAK memakai Canva dan TIDAK melakukan aktivitas editing sama sekali, jadi di tiap POST ber-visual YA pilih satu SUMBER yang paling cocok dan tuliskan hasil siap-pakai: (a) Sumber Visual: GENERATE AI — tulis Prompt Generate Image berbahasa Inggris siap-paste ke image generator AI, memuat subjek utama, komposisi/angle, gaya & mood, pencahayaan, serta rasio Threads 4:5 atau 1:1; hasil harus final tanpa edit lanjut dan teks di dalam gambar hanya bila memang wajib. (b) Sumber Visual: CARI GAMBAR — tulis Kata Kunci Cari Gambar berbahasa Inggris yang spesifik (4-7 kata: subjek, gaya foto, suasana/setting) untuk dipakai di Google Images/Unsplash/Pexels, hindari visual ber-watermark. DILARANG menyuruhku mendesain, mengedit, memotong, menyusun, atau merakit visual di aplikasi/editor apa pun; visual harus final as-is.",
  "7. GAYA BAHASA: sisipkan slang viral sesuai profil audiens di knowledge awal secara natural. Jangan dipaksa: ambil yang paling cocok, maksimal 1-2 slang per POST, boleh 0 jika tidak cocok.",
  "8. DILARANG politik, SARA, gosip. Jangan mengarang spek, angka, atau persen hasil pasti.",
  "9. Jangan menanyakan apa pun kepadaku.",
  "</aturan>","",
  "<format_output>",
  "Aturan code block (WAJIB): setiap bagian isi yang nanti kucopy langsung ditampilkan dalam satu code block markdown sendiri, persis pola ini:",
  "```markdown",
  "{isi}",
  "```",
  "{isi} = isi bagian itu; baris label/heading/metadata (cth [POST n], Lampirkan Visual, Sumber Visual, Rekomendasi penempatan, jawaban \"-\") tetap ditulis biasa tanpa code block.",
  "Teks biasa, persis:",
  "Nama topik : .....",
  "Saran Komunitas/Topik Threads: (1-2 komunitas atau topik Threads yang relevan; TIAP komunitas satu code block sendiri):",
  "```markdown",
  "{nama komunitas 1}",
  "```",
  "```markdown",
  "{nama komunitas 2}",
  "```",
  "Rekomendasi Penempatan Visual Utama: .... (misal: Disarankan di POST 1 dan POST 3)",
  "",
  jc.fmt,
  "DILARANG mengemas jawaban sebagai file .md, .docx, atau .pdf — seluruh hasil ditampilkan langsung di percakapan sesuai format di atas.",
  "</format_output>","",
  "Cek mandiri sebelum menjawab: format persis; konten berbasis fakta unik/aneh yang menarik pembaca; tiap POST ber-visual YA mencantumkan Sumber Visual plus Prompt Generate Image berbahasa Inggris atau Kata Kunci Cari Gambar berbahasa Inggris, tanpa satu pun instruksi editing/Canva; "+(single?"panjang TEKS maksimal 250 karakter dan natural":"panjang teks bebas dan natural")+"; O dan R hanya di POST terakhir; aturan link/brand/produk sesuai funnel ("+fun+"); setiap bagian yang kucopy (Saran Komunitas, Prompt Generate Image, Kata Kunci Cari Gambar, Teks Post, dan VERSI LENGKAP jika ada) tampil di dalam code block ```markdown``` sendiri"+(single?"":"; di akhir ada VERSI LENGKAP: gabungan teks semua post tanpa marker [POST] dan tanpa metadata visual")+"; jawaban hanya tampil di chat, bukan file .md/.docx/.pdf."
  ].join("\n");}

  const penyusun = { utama: build };
  return penyusun[keluaran]();
}
