import "server-only";
import { KOMPOSISI_FASE } from "@/lib/tools";

// Teks komposisi dan arahan fase channel untuk prompt topik video pendek dan topik utas.
// Angka komposisi diambil dari KOMPOSISI_FASE di lib/tools.js (sama dengan tabel di form).

const NAMA = { T: "TOFU", M: "MOFU", B: "BOFU" };
const JENIS = ["T", "M", "B"];

function ambil(fase) {
  return KOMPOSISI_FASE[fase] || KOMPOSISI_FASE.fase1;
}

function samaTiapHari(k) {
  return JENIS.every((j) => k.ganjil[j] === k.genap[j]);
}

// "9 TOFU (VH{d}T1 sampai VH{d}T9), 1 MOFU (VH{d}M1), TANPA BOFU"
function rincianHari(hari, awalan) {
  return JENIS.map((j) => {
    const n = hari[j];
    if (!n) return "TANPA " + NAMA[j];
    const kode = awalan + j;
    return n + " " + NAMA[j] + " (" + (n === 1 ? kode + "1" : kode + "1 sampai " + kode + n) + ")";
  }).join(", ");
}

// Daftar kode untuk satu hari, cth "VH1T1 sampai VH1T7, VH1M1 sampai VH1M2, VH1B1".
function kodeHari(hari, awalan) {
  return JENIS.filter((j) => hari[j])
    .map((j) => (hari[j] === 1 ? awalan + j + "1" : awalan + j + "1 sampai " + awalan + j + hari[j]))
    .join(", ");
}

// Jumlah per jenis dalam satu hari, cth "6-7" atau "9".
export function rentangJenis(fase, j) {
  const k = ambil(fase);
  const a = k.ganjil[j];
  const b = k.genap[j];
  return a === b ? String(a) : Math.min(a, b) + "-" + Math.max(a, b);
}

export function adaBofu(fase) {
  const k = ambil(fase);
  return k.ganjil.B + k.genap.B > 0;
}

// kode = "VH" atau "UH", ph = penanda nomor hari di prompt ("{d}" atau "{h}").
export function komposisiFase(fase, kode, ph) {
  const k = ambil(fase);
  const awalan = kode + ph;
  if (samaTiapHari(k)) return "SETIAP hari = " + rincianHari(k.ganjil, awalan);
  return (
    "hari GANJIL (" + kode + "1, " + kode + "3, " + kode + "5, dst.) = " + rincianHari(k.ganjil, awalan) +
    "; hari GENAP (" + kode + "2, " + kode + "4, " + kode + "6, dst.) = " + rincianHari(k.genap, awalan)
  );
}

// Ringkasan per 2 hari, cth "13 TOFU (65%), 5 MOFU (25%), 2 BOFU (10%)".
export function porsiFase(fase) {
  const k = ambil(fase);
  const total = JENIS.reduce((s, j) => s + k.ganjil[j] + k.genap[j], 0);
  return JENIS.map((j) => {
    const n = k.ganjil[j] + k.genap[j];
    return n + " " + NAMA[j] + " (" + Math.round((n / total) * 100) + "%)";
  }).join(", ");
}

// Contoh kode hari 1 dan hari 2, cth "contoh VH1: ...; contoh VH2: ...".
export function contohKode(fase, kode) {
  const k = ambil(fase);
  return "contoh " + kode + "1: " + kodeHari(k.ganjil, kode + "1") + "; contoh " + kode + "2: " + kodeHari(k.genap, kode + "2");
}

// Bagian <fase_channel>: tujuan fase dan cara tiap funnel diarahkan.
export function arahFase(fase) {
  const t = rentangJenis(fase, "T");
  const m = rentangJenis(fase, "M");
  const b = rentangJenis(fase, "B");
  const baris = {
    fase1: [
      "FASE: Fase 1 — Growth awal (cari followers). Channel masih baru: algoritma dan audiens belum kenal akun ini.",
      "TUJUAN: menambah followers. Utamakan ide yang memancing rasa penasaran, share, dan follow; makin viral-friendly makin bagus.",
      "TOFU (" + t + " per hari): fakta unik/aneh paling mengejutkan dan paling mudah dibagikan, untuk audiens luas yang belum kenal akun ini.",
      "MOFU (" + m + " per hari): edukasi ringan seputar akar masalah, cukup untuk mulai menunjukkan bahwa akun ini paham niche-nya.",
      "BOFU: TIDAK ADA. Konten jualan di fase ini menurunkan reach karena engagement anjlok, jadi DILARANG ada ide yang menyebut produk, brand, harga, atau CTA beli.",
    ],
    fase2: [
      "FASE: Fase 2 — Branding (bangun trust & value). Base followers sudah terbentuk dan audiens mulai percaya.",
      'TUJUAN: membangun kepercayaan bahwa akun ini kredibel di niche-nya ("aku ngerti masalahmu dan tahu solusinya").',
      "TOFU (" + t + " per hari): tetap dominan untuk terus menarik followers baru.",
      "MOFU (" + m + " per hari): edukasi lebih dalam soal akar masalah dan penyebab tersembunyi, supaya audiens melihat akun ini sebagai sumber yang kredibel.",
      "BOFU (" + b + " per hari): mulai dicicil pelan-pelan secara soft-selling: produk hadir sebagai solusi wajar dari fakta yang dibahas, CTA lembut, TIDAK agresif dan TIDAK hard-selling.",
    ],
    fase3: [
      "FASE: Fase 3 — Income / monetisasi. Channel sudah punya identitas jelas dan followers loyal, dan BOFU sebelumnya sudah mendapat respons positif.",
      "TUJUAN: mengubah kepercayaan audiens jadi penjualan tanpa mematikan pertumbuhan followers.",
      "TOFU (" + t + " per hari): tetap dominan, karena TOFU yang terus menarik followers baru.",
      "MOFU (" + m + " per hari): perkuat kredibilitas dan kaitkan masalah audiens dengan solusi.",
      "BOFU (" + b + " per hari, maksimal 20%): boleh lebih tegas mengarahkan ke produk dan CTA, tetapi tetap berangkat dari fakta unik/aneh supaya akun tidak terasa seperti akun jualan.",
    ],
  };
  return baris[fase] || baris.fase1;
}
