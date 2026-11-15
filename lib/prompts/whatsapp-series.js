import "server-only";
import { buatDokumen } from "./dokumen";

// Penyusun prompt "whatsapp-series". Hanya berjalan di server.
// Kode di dalam fungsi ini disalin apa adanya dari versi HTML (index_d9de3a.html);
// "document" diganti tiruan yang membaca isian form dari server.
export function susunWhatsappSeries(input, keluaran) {
  const document = buatDokumen(input);

  var IDS = [
    "nama",
    "niche",
    "audiens",
    "freebie",
    "manfaat",
    "produk",
    "jenis",
    "urgensi",
    "gaya",
    "sapaan",
    "testi",
    "keberatan",
    "perlakuan",
    "kata",
    "jumlah",
  ];
  var CHK = ["trigger", "ab", "qr", "cabang", "ops"];
  var KEY = "wa-series-prompt-v1";
  var $ = function (i) {
    return document.getElementById(i);
  };

  var SCHEDULES = {
    3: [
      [
        "Pesan 1",
        "5–30 menit setelah download",
        "Menyapa, memastikan freebie berhasil diunduh, dan mengajukan satu pertanyaan ringan untuk memancing balasan. Belum menawarkan produk.",
      ],
      [
        "Pesan 2",
        "hari ke-2",
        "Memberi tips cepat atau quick win dari freebie, lalu menyambungkan masalah lead ke solusi saya lewat testimoni atau studi kasus singkat.",
      ],
      [
        "Pesan 3",
        "hari ke-5",
        "Penawaran soft-sell: {CTA}, dengan nada sopan dan pintu yang tetap terbuka.",
      ],
    ],
    5: [
      [
        "Pesan 1",
        "5–30 menit setelah download",
        "Menyapa, memastikan freebie berhasil diunduh, dan mengajukan satu pertanyaan ringan untuk memancing balasan. Belum menawarkan produk.",
      ],
      [
        "Pesan 2",
        "hari ke-1",
        "Memberi tips cepat atau quick win dari freebie agar lead mulai memakainya.",
      ],
      [
        "Pesan 3",
        "hari ke-3",
        "Studi kasus atau testimoni singkat, lalu menyambungkan masalah lead ke solusi saya.",
      ],
      [
        "Pesan 4",
        "hari ke-5",
        "Penawaran soft-sell: jelaskan penawaran dan manfaat, lalu {CTA}.",
      ],
      [
        "Pesan 5",
        "hari ke-7",
        "Penutup sopan dengan urgensi yang jujur, atau pesan perpisahan yang meninggalkan pintu terbuka.",
      ],
    ],
    7: [
      [
        "Pesan 1",
        "5–30 menit setelah download",
        "Menyapa, memastikan freebie berhasil diunduh, dan mengajukan satu pertanyaan ringan. Belum menawarkan produk.",
      ],
      [
        "Pesan 2",
        "hari ke-1",
        "Quick win dari freebie agar lead mulai memakainya.",
      ],
      [
        "Pesan 3",
        "hari ke-3",
        "Tips lanjutan yang belum ada di freebie, murni memberi nilai.",
      ],
      [
        "Pesan 4",
        "hari ke-5",
        "Studi kasus atau testimoni singkat yang menyambungkan masalah lead ke solusi saya.",
      ],
      [
        "Pesan 5",
        "hari ke-7",
        "Menjawab keberatan umum calon pembeli secara jujur.",
      ],
      [
        "Pesan 6",
        "hari ke-10",
        "Penawaran soft-sell: penawaran dan manfaat, lalu {CTA}.",
      ],
      [
        "Pesan 7",
        "hari ke-14",
        "Penutup sopan dengan urgensi yang jujur, atau pesan perpisahan yang meninggalkan pintu terbuka.",
      ],
    ],
  };

  function v(id, label) {
    var x = $(id).value.trim();
    return x || "[isi " + label + "]";
  }

  function build() {
    var n = $("jumlah").value,
      sch = SCHEDULES[n].slice(),
      ab = $("ab").checked,
      qr = $("qr").checked;
    var pasif = $("perlakuan").value === "pasif";
    var trig = pasif && $("trigger").checked;
    var kata = $("kata").value.trim();
    var fisik = $("jenis").value !== "digital";
    var CTA = fisik
      ? "tanyakan kecamatannya untuk dicekkan promo ongkirnya"
      : "minta lead membalas untuk konfirmasi order, lalu detail pembayaran saya kirim manual lewat chat";
    sch = sch.map(function (s) {
      return [s[0], s[1], s[2].replace("{CTA}", CTA)];
    });
    if (pasif)
      sch[0] = [
        "Pesan 1",
        "segera setelah lead mengirim pesan pertama",
        (trig
          ? "Membalas pesan trigger lead dengan ramah, menanyakan nama, lalu mengirim freebie/link unduhan"
          : "Membalas pesan lead dengan ramah, menanyakan nama, lalu mengirim freebie/link unduhan") +
          " dan satu pertanyaan ringan. Belum menawarkan produk.",
      ];
    var L = [];
    L.push(
      "Kamu adalah copywriter direct-response dan spesialis follow-up WhatsApp untuk pasar Indonesia. Tugasmu membuat WhatsApp series untuk " +
        (pasif
          ? "lead yang menghubungi saya duluan lewat WhatsApp untuk meminta freebie."
          : "lead yang baru mengunduh freebie dari landing page lead magnet saya."),
    );
    L.push("");
    L.push("## KONTEKS ALUR (penting dipahami)");
    if (pasif) {
      L.push(
        "- Calon lead menghubungi saya duluan lewat WhatsApp (misalnya klik tombol / link wa.me di landing page atau iklan).",
      );
      L.push(
        "- Nama dan data lead BELUM diketahui saat pesan pertama masuk.",
      );
      L.push(
        "- Saya tidak mengirim pesan duluan. Saya membalas MANUAL satu per satu setelah pesan lead masuk (copy-paste dari template).",
      );
    } else {
      L.push(
        "- Calon lead mengisi nama dan nomor WhatsApp di landing page, lalu klik tombol download.",
      );
      L.push(
        "- Data tersimpan dan dikirim oleh worker ke bot Telegram saya, lalu bot meneruskannya ke chat_id saya.",
      );
      L.push(
        "- WhatsApp TIDAK terkirim otomatis. Saya yang mengirim MANUAL satu per satu (copy-paste dari template, buka chat lewat nomor lead).",
      );
    }
    L.push("- Karena itu, semua pesan harus:");
    L.push(
      "  1. Mudah di-copy-paste dengan placeholder jelas: {nama}, {freebie}, {nama_saya}, {link_freebie}.",
    );
    L.push(
      "  2. Terasa personal dan tidak seperti broadcast, karena dikirim satu per satu.",
    );
    L.push("  3. Singkat, ramah, dan natural dibaca di HP.");
    L.push(
      "  4. Aman dari risiko dianggap spam: tanpa link jualan, tanpa huruf kapital semua.",
    );
    if (pasif)
      L.push(
        "  5. Pesan 1 TIDAK memakai {nama} karena nama belum diketahui: sapa netral lalu tanyakan nama dengan sopan. {nama} baru dipakai mulai pesan berikutnya.",
      );
    L.push("");
    L.push("## INFORMASI BISNIS");
    L.push("- Nama saya / brand: " + v("nama", "nama"));
    L.push("- Bisnis / niche: " + v("niche", "niche"));
    L.push(
      "- Target audiens dan masalah utamanya: " +
        v("audiens", "target audiens"),
    );
    L.push(
      "- Freebie yang diunduh: " +
        v("freebie", "judul dan format freebie"),
    );
    L.push("- Manfaat utama freebie: " + v("manfaat", "manfaat freebie"));
    L.push(
      "- Produk / penawaran lanjutan: " + v("produk", "produk dan harga"),
    );
    L.push(
      "- Jenis produk: " + (fisik ? "produk fisik" : "produk digital"),
    );
    L.push(
      "- Cara closing: JANGAN arahkan lead membuka link penawaran. " +
        (fisik
          ? "Untuk konversi, tanyakan KECAMATAN lead saja dengan alasan mau dicekkan promo ongkirnya. Jangan menyebut atau meminta alamat lengkap di pesan mana pun."
          : "Minta lead membalas untuk konfirmasi order, lalu detail pembayaran dan akses produk saya kirim manual lewat chat. Tidak ada ongkir."),
    );
    L.push(
      "- Bonus / urgensi nyata: " +
        ($("urgensi").value.trim() ||
          "tidak ada, jangan mengarang urgensi"),
    );
    L.push(
      "- Gaya bahasa: " +
        $("gaya").value +
        "; sapaan: " +
        $("sapaan").value,
    );
    L.push(
      "- Gaya chat series: KONSULTATIF. Posisikan saya sebagai konsultan yang membantu, bukan penjual: tanyakan kondisi dan kebutuhan lead, dengarkan jawabannya, beri saran yang relevan, baru rekomendasikan produk sebagai solusi. Tiap pesan sebaiknya diakhiri pertanyaan yang mengajak lead bercerita.",
    );
    L.push(
      "- Testimoni / bukti sosial: " +
        ($("testi").value.trim() ||
          "tidak ada, jangan mengarang testimoni; gunakan placeholder {testimoni} bila perlu"),
    );
    L.push(
      "- Keberatan umum calon pembeli: " +
        ($("keberatan").value.trim() || "[isi keberatan umum]"),
    );
    if (trig) {
      L.push("");
      L.push("## PESAN TRIGGER (lead meminta lead magnet)");
      L.push(
        "Sebelum series, buat 3 contoh pesan trigger yang dikirim LEAD ke saya untuk meminta freebie. Teks ini akan saya pasang sebagai pesan otomatis di link wa.me/{nomor_saya}?text=... pada tombol landing page, bio, atau iklan.",
      );
      L.push("Syarat pesan trigger:");
      L.push(
        "- Ditulis dari sudut pandang lead, singkat (maksimal 15 kata), natural, dan tidak terdengar seperti iklan.",
      );
      L.push(
        kata
          ? '- Wajib memuat kata kunci "' +
              kata +
              '" agar saya langsung tahu lead datang dari lead magnet.'
          : "- Menyebut nama freebie dengan jelas agar saya langsung tahu lead datang dari lead magnet.",
      );
      L.push(
        "- Tiap contoh di dalam code block ```markdown``` sendiri.",
      );
      L.push(
        "- Sertakan juga 1 contoh link wa.me/{nomor_saya}?text=... lengkap dengan teks yang sudah di-URL-encode, di code block sendiri.",
      );
      L.push(
        "- Pesan 1 di series harus terasa sebagai balasan langsung atas pesan trigger ini.",
      );
    }
    L.push("");
    L.push("## OUTPUT YANG DIMINTA");
    L.push(
      "Buat series follow-up " + n + " pesan dengan jadwal berikut:",
    );
    L.push("");
    sch.forEach(function (s, i) {
      L.push(i + 1 + ". " + s[0] + ": " + s[1] + ". " + s[2]);
    });
    L.push("");
    L.push("Untuk SETIAP pesan, berikan:");
    L.push(
      "- Label (contoh: “Pesan 1 – Sapaan & Konfirmasi”) dan waktu kirim yang disarankan",
    );
    L.push(
      "- Teks pesan siap copy-paste (maksimal 80 kata, boleh 1–2 emoji) di dalam satu code block ```markdown``` sendiri",
    );
    if (ab)
      L.push(
        "- Variasi A dan B (nada berbeda) agar saya bisa memilih atau merotasi, masing-masing di dalam code block ```markdown``` sendiri",
      );
    L.push("- Tujuan pesan dalam 1 kalimat");
    if (qr)
      L.push(
        "- Balasan cepat untuk 2–3 kemungkinan respons lead, misalnya: “Sudah dibaca, terima kasih”, “Berapa harganya?”, “Nanti dulu ya” — tiap balasan di dalam code block ```markdown``` sendiri",
      );

    var extra = [];
    if ($("cabang").checked)
      extra.push(
        "Percabangan: buat template singkat untuk kondisi (a) lead membalas dan tertarik, (b) lead membalas tapi menolak atau menunda, (c) lead tidak membalas sama sekali setelah pesan ke-" +
          Math.min(3, sch.length) +
          ".",
      );
    if ($("ops").checked)
      extra.push(
        pasif
          ? "Tips operasional manual: cara menyimpan kontak dan memberi label di WhatsApp Business setelah nama lead diketahui, opsi pesan sambutan (greeting message) otomatis, cara mencatat lead yang sudah dibalas dan sudah di-follow-up, serta batas aman jumlah pesan per hari."
          : "Tips operasional manual: urutan kerja efisien dari notifikasi Telegram ke WhatsApp (misalnya memakai link wa.me/{nomor}?text=...), cara menandai lead yang sudah di-follow-up, dan batas aman jumlah pesan per hari.",
      );
    if (extra.length) {
      L.push("");
      L.push("## TAMBAHAN");
      extra.forEach(function (e, i) {
        L.push(i + 1 + ". " + e);
      });
    }
    L.push("");
    L.push("## FORMAT");
    L.push(
      "Gunakan Bahasa Indonesia yang natural, bukan terjemahan kaku. Sajikan dalam format rapi (heading per pesan) agar mudah di-scan dan disalin. Jangan menjelaskan teori panjang; fokus pada template yang langsung bisa dipakai.",
    );
    L.push(
      "Aturan code block: setiap bagian yang kucopy langsung (" +
        (trig ? "tiap pesan trigger, " : "") +
        "teks pesan, tiap variasi A/B, tiap balasan cepat) wajib tampil di dalam satu code block markdown sendiri, pola persis: baris ```markdown, baris baru, isi lengkap dengan placeholder {nama} / {freebie} / {nama_saya} / {link_freebie}, baris baru, baris ``` penutup. Label, waktu kirim, dan tujuan pesan tetap ditulis biasa tanpa code block." +
        (pasif ? " Khusus Pesan 1, jangan pakai {nama}." : ""),
    );
    L.push(
      "DILARANG mengemas jawaban sebagai file .md, .docx, atau .pdf — seluruh hasil ditampilkan langsung di percakapan sesuai format di atas.",
    );
    return L.join("\n");
  }

  const penyusun = { utama: build };
  return penyusun[keluaran]();
}
