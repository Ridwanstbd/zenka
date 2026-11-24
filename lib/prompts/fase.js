import "server-only";
import { KOMPOSISI_FASE } from "@/lib/tools";

// Teks komposisi dan arahan fase channel untuk prompt topik video pendek dan topik utas.
// Angka komposisi diambil dari KOMPOSISI_FASE di lib/tools.js (sama dengan tabel di form):
// 1 rencana = 5 hari, array berisi komposisi hari ke-1 sampai ke-5.

const NAMA = { T: "TOFU", M: "MOFU", B: "BOFU" };
const JENIS = ["T", "M", "B"];

function ambil(fase) {
  return KOMPOSISI_FASE[fase] || KOMPOSISI_FASE.fase1;
}

// Total satu jenis dalam 1 rencana.
function jumlah(fase, j) {
  return ambil(fase).reduce((s, h) => s + h[j], 0);
}

// [1, 3, 5] -> "hari ke-1, ke-3, dan ke-5"
function sebutHari(urutan) {
  const ke = urutan.map((n, i) => (i === 0 ? "hari ke-" : "ke-") + n);
  if (ke.length === 1) return ke[0];
  return ke.slice(0, -1).join(", ") + (ke.length > 2 ? "," : "") + " dan " + ke[ke.length - 1];
}

// "4 TOFU (VH{d}T1 sampai VH{d}T4), TANPA MOFU, TANPA BOFU"
function rincianHari(hari, awalan) {
  return JENIS.map((j) => {
    const n = hari[j];
    if (!n) return "TANPA " + NAMA[j];
    const kode = awalan + j;
    return n + " " + NAMA[j] + " (" + (n === 1 ? kode + "1" : kode + "1 sampai " + kode + n) + ")";
  }).join(", ");
}

// Daftar kode untuk satu hari, cth "VH1T1 sampai VH1T2, VH1M1, VH1B1".
function kodeHari(hari, awalan) {
  return JENIS.filter((j) => hari[j])
    .map((j) => (hari[j] === 1 ? awalan + j + "1" : awalan + j + "1 sampai " + awalan + j + hari[j]))
    .join(", ");
}

// Jumlah per jenis dalam satu hari, cth "3-4" atau "1".
export function rentangJenis(fase, j) {
  const n = ambil(fase).map((h) => h[j]);
  const a = Math.min(...n);
  const b = Math.max(...n);
  return a === b ? String(a) : a + "-" + b;
}

export function adaBofu(fase) {
  return jumlah(fase, "B") > 0;
}

// kode = "VH" atau "UH", ph = penanda nomor hari di prompt ("{d}" atau "{h}").
// Hari berkomposisi sama digabung, cth "hari ke-1, ke-3, dan ke-5 = ...; hari ke-2 dan ke-4 = ...".
export function komposisiFase(fase, kode, ph) {
  const awalan = kode + ph;
  const grup = [];
  ambil(fase).forEach((hari, i) => {
    const kunci = JENIS.map((j) => hari[j]).join("-");
    const sama = grup.find((g) => g.kunci === kunci);
    if (sama) sama.urutan.push(i + 1);
    else grup.push({ kunci, hari, urutan: [i + 1] });
  });
  if (grup.length === 1) return "SETIAP hari = " + rincianHari(grup[0].hari, awalan);
  return grup.map((g) => sebutHari(g.urutan) + " = " + rincianHari(g.hari, awalan)).join("; ");
}

// Ringkasan per 1 rencana (5 hari), cth "13 TOFU (65%), 5 MOFU (25%), 2 BOFU (10%)".
export function porsiFase(fase) {
  const total = JENIS.reduce((s, j) => s + jumlah(fase, j), 0);
  return JENIS.map((j) => {
    const n = jumlah(fase, j);
    return n + " " + NAMA[j] + " (" + Math.round((n / total) * 100) + "%)";
  }).join(", ");
}

// Contoh kode tiap hari rencana baru, cth "contoh VH1: VH1T1 sampai VH1T4; VH2: VH2T1 sampai VH2T3, VH2M1; ...".
export function contohKode(fase, kode) {
  return "contoh " + ambil(fase).map((hari, i) => kode + (i + 1) + ": " + kodeHari(hari, kode + (i + 1))).join("; ");
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
      "TOFU (" + t + " per hari): ide paling mengejutkan, paling relate, dan paling mudah dibagikan (fakta unik/aneh, problem awareness ringan, dan meme relate), untuk audiens luas yang belum kenal akun ini.",
      "MOFU (" + m + " per hari): edukasi ringan seputar akar masalah, cukup untuk mulai menunjukkan bahwa akun ini paham niche-nya.",
      "BOFU: TIDAK ADA. Konten jualan di fase ini menurunkan reach karena engagement anjlok, jadi DILARANG ada ide yang menyebut produk, brand, harga, atau CTA beli.",
    ],
    fase2: [
      "FASE: Fase 2 — Branding (bangun trust & value). Base followers sudah terbentuk dan audiens mulai percaya.",
      'TUJUAN: membangun kepercayaan bahwa akun ini kredibel di niche-nya ("aku ngerti masalahmu dan tahu solusinya").',
      "TOFU (" + t + " per hari): tetap dominan untuk terus menarik followers baru.",
      "MOFU (" + m + " per hari): edukasi lebih dalam soal akar masalah dan penyebab tersembunyi, supaya audiens melihat akun ini sebagai sumber yang kredibel.",
      "BOFU (" + b + " per hari): mulai dicicil pelan-pelan secara soft-selling: produk hadir sebagai solusi wajar dari fakta, masalah, atau situasi relate yang dibahas, CTA lembut, TIDAK agresif dan TIDAK hard-selling.",
    ],
    fase3: [
      "FASE: Fase 3 — Income / monetisasi. Channel sudah punya identitas jelas dan followers loyal, dan BOFU sebelumnya sudah mendapat respons positif.",
      "TUJUAN: mengubah kepercayaan audiens jadi penjualan tanpa mematikan pertumbuhan followers.",
      "TOFU (" + t + " per hari): tetap dominan, karena TOFU yang terus menarik followers baru.",
      "MOFU (" + m + " per hari): perkuat kredibilitas dan kaitkan masalah audiens dengan solusi.",
      "BOFU (" + b + " per hari, maksimal 20%): boleh lebih tegas mengarahkan ke produk dan CTA, tetapi tetap berangkat dari angle fakta unik/aneh, problem awareness, atau meme relate supaya akun tidak terasa seperti akun jualan.",
    ],
  };
  return baris[fase] || baris.fase1;
}
