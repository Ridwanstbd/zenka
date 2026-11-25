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

  var PESAN_1 =
    "Menyapa, berterima kasih atas minatnya pada produk, lalu mengajukan satu pertanyaan ringan tentang kondisi atau kebutuhannya. Belum menawarkan produk.";

  var SCHEDULES = {
    3: [
      ["Pesan 1", "5–30 menit setelah data masuk", PESAN_1],
      [
        "Pesan 2",
        "hari ke-2",
        "Merespons kebutuhan calon konsumen dengan rekomendasi yang relevan, lalu menguatkannya lewat testimoni atau studi kasus singkat.",
      ],
      [
        "Pesan 3",
        "hari ke-5",
        "Penawaran soft-sell: {CTA}, dengan nada sopan dan pintu yang tetap terbuka.",
      ],
    ],
    5: [
      ["Pesan 1", "5–30 menit setelah data masuk", PESAN_1],
      [
        "Pesan 2",
        "hari ke-1",
        "Memberi rekomendasi yang sesuai kebutuhannya dan menjawab pertanyaan spesifik tentang produk, tanpa mengulang edukasi dasar.",
      ],
      [
        "Pesan 3",
        "hari ke-3",
        "Studi kasus atau testimoni singkat yang mirip dengan kondisi calon konsumen.",
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
      ["Pesan 1", "5–30 menit setelah data masuk", PESAN_1],
      [
        "Pesan 2",
        "hari ke-1",
        "Rekomendasi yang sesuai kebutuhannya, tanpa mengulang edukasi dasar.",
      ],
      [
        "Pesan 3",
        "hari ke-3",
        "Tips pemakaian atau cara mendapat hasil terbaik dari produk, murni memberi nilai.",
      ],
      [
        "Pesan 4",
        "hari ke-5",
        "Studi kasus atau testimoni singkat yang mirip dengan kondisi calon konsumen.",
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
      : "minta calon konsumen membalas untuk konfirmasi order, lalu detail pembayaran saya kirim manual lewat chat";
    sch = sch.map(function (s) {
      return [s[0], s[1], s[2].replace("{CTA}", CTA)];
    });
    if (pasif)
      sch[0] = [
        "Pesan 1",
        "segera setelah calon konsumen mengirim pesan pertama",
        (trig
          ? "Membalas pesan trigger calon konsumen dengan ramah"
          : "Membalas pesan calon konsumen dengan ramah") +
          ", menanyakan nama, lalu satu pertanyaan ringan tentang kebutuhannya. Belum menawarkan produk.",
      ];
    var L = [];
    L.push(
      "Kamu adalah copywriter direct-response dan spesialis follow-up WhatsApp untuk pasar Indonesia. Tugasmu membuat WhatsApp series untuk calon konsumen yang sudah teredukasi tentang produk saya (sudah mengenal produknya dari konten saya), " +
        (pasif
          ? "yang menghubungi saya duluan lewat WhatsApp untuk bertanya soal produk."
          : "yang sudah meninggalkan nama dan nomor WhatsApp lewat form."),
    );
    L.push("");
    L.push("## KONTEKS ALUR (penting dipahami)");
    if (pasif) {
      L.push(
        "- Calon konsumen menghubungi saya duluan lewat WhatsApp (misalnya klik tombol / link wa.me di bio, konten, atau iklan).",
      );
      L.push(
        "- Nama dan data calon konsumen BELUM diketahui saat pesan pertama masuk.",
      );
      L.push(
        "- Saya tidak mengirim pesan duluan. Saya membalas MANUAL satu per satu setelah pesan calon konsumen masuk (copy-paste dari template).",
      );
    } else {
      L.push(
        "- Calon konsumen mengisi nama dan nomor WhatsApp di form (misalnya di halaman produk atau link di bio).",
      );
      L.push(
        "- Data tersimpan dan dikirim oleh worker ke bot Telegram saya, lalu bot meneruskannya ke chat_id saya.",
      );
      L.push(
        "- WhatsApp TIDAK terkirim otomatis. Saya yang mengirim MANUAL satu per satu (copy-paste dari template, buka chat lewat nomor calon konsumen).",
      );
    }
    L.push(
      "- Calon konsumen sudah teredukasi tentang produk dari konten saya: JANGAN mengulang edukasi dasar. Fokus menggali kebutuhannya, menjawab keraguan, lalu closing.",
    );
    L.push("- Karena itu, semua pesan harus:");
    L.push(
      "  1. Mudah di-copy-paste dengan placeholder jelas: {nama}, {produk}, {nama_saya}.",
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
    L.push("- Produk / penawaran: " + v("produk", "produk dan harga"));
    L.push(
      "- Jenis produk: " + (fisik ? "produk fisik" : "produk digital"),
    );
    L.push(
      "- Cara closing: JANGAN arahkan calon konsumen membuka link penawaran. " +
        (fisik
          ? "Untuk konversi, tanyakan KECAMATAN calon konsumen saja dengan alasan mau dicekkan promo ongkirnya. Jangan menyebut atau meminta alamat lengkap di pesan mana pun."
          : "Minta calon konsumen membalas untuk konfirmasi order, lalu detail pembayaran dan akses produk saya kirim manual lewat chat. Tidak ada ongkir."),
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
      "- Gaya chat series: KONSULTATIF. Posisikan saya sebagai konsultan yang membantu, bukan penjual: tanyakan kondisi dan kebutuhan calon konsumen, dengarkan jawabannya, beri saran yang relevan, baru rekomendasikan produk sebagai solusi. Tiap pesan sebaiknya diakhiri pertanyaan yang mengajak calon konsumen bercerita.",
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
      L.push("## PESAN TRIGGER (calon konsumen bertanya soal produk)");
      L.push(
        "Sebelum series, buat 3 contoh pesan trigger yang dikirim CALON KONSUMEN ke saya untuk bertanya soal produk. Teks ini akan saya pasang sebagai pesan otomatis di link wa.me/{nomor_saya}?text=... pada tombol di bio, konten, atau iklan.",
      );
      L.push("Syarat pesan trigger:");
      L.push(
        "- Ditulis dari sudut pandang calon konsumen, singkat (maksimal 15 kata), natural, dan tidak terdengar seperti iklan.",
      );
      L.push(
        kata
          ? '- Wajib memuat kata kunci "' +
              kata +
              '" agar saya langsung tahu calon konsumen datang dari konten.'
          : "- Menyebut nama produk dengan jelas agar saya langsung tahu calon konsumen datang dari konten.",
      );
      L.push(
        "- Sertakan juga 1 contoh link wa.me/{nomor_saya}?text=... lengkap dengan teks yang sudah di-URL-encode.",
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
      "- Label (contoh: “Pesan 1 – Sapaan & Gali Kebutuhan”) dan waktu kirim yang disarankan",
    );
    L.push(
      "- Teks pesan siap copy-paste (maksimal 80 kata, boleh 1–2 emoji)",
    );
    if (ab)
      L.push(
        "- Variasi A dan B (nada berbeda) agar saya bisa memilih atau merotasi, masing-masing ditulis terpisah",
      );
    L.push("- Tujuan pesan dalam 1 kalimat");
    if (qr)
      L.push(
        "- Balasan cepat untuk 2–3 kemungkinan respons calon konsumen, misalnya: “Sudah dibaca, terima kasih”, “Berapa harganya?”, “Nanti dulu ya”",
      );

    var extra = [];
    if ($("cabang").checked)
      extra.push(
        "Percabangan: buat template singkat untuk kondisi (a) calon konsumen membalas dan tertarik, (b) calon konsumen membalas tapi menolak atau menunda, (c) calon konsumen tidak membalas sama sekali setelah pesan ke-" +
          Math.min(3, sch.length) +
          ".",
      );
    if ($("ops").checked)
      extra.push(
        pasif
          ? "Tips operasional manual: cara menyimpan kontak dan memberi label di WhatsApp Business setelah nama calon konsumen diketahui, opsi pesan sambutan (greeting message) otomatis, cara mencatat calon konsumen yang sudah dibalas dan sudah di-follow-up, serta batas aman jumlah pesan per hari."
          : "Tips operasional manual: urutan kerja efisien dari notifikasi Telegram ke WhatsApp (misalnya memakai link wa.me/{nomor}?text=...), cara menandai calon konsumen yang sudah di-follow-up, dan batas aman jumlah pesan per hari.",
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
      "Gunakan Bahasa Indonesia yang natural, bukan terjemahan kaku. Beri label jelas per pesan agar mudah di-scan dan disalin. Jangan menjelaskan teori panjang; fokus pada template yang langsung bisa dipakai.",
    );
    if (pasif) L.push("Khusus Pesan 1, jangan pakai {nama}.");
    L.push(
      "DILARANG membuat file (.md/.docx/.pdf); tampilkan hasil langsung di chat.",
    );
    return L.join("\n");
  }

  const penyusun = { utama: build };
  return penyusun[keluaran]();
}
