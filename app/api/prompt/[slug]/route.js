import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_AKSES, kodeValid } from "@/lib/akses";
import { cariTool, semuaKolom, nilaiAwal, namaKolom } from "@/lib/tools";
import { PENYUSUN } from "@/lib/prompts";

const BATAS_KARAKTER = 12000;

export async function POST(request, { params }) {
  // Cek ulang kode akses di sini juga, jangan hanya mengandalkan proxy.
  const kode = (await cookies()).get(COOKIE_AKSES)?.value;
  if (!kodeValid(kode)) {
    return NextResponse.json({ galat: "Butuh kode akses. Masuk dulu." }, { status: 401 });
  }

  const { slug } = await params;
  const tool = cariTool(slug);
  const susun = PENYUSUN[slug];
  if (!tool || !tool.siap || !susun) {
    return NextResponse.json({ galat: "Tool tidak ditemukan." }, { status: 404 });
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ galat: "Data form tidak terbaca." }, { status: 400 });
  }

  // Ambil hanya kolom yang terdaftar, rapikan, dan tolak nilai pilihan yang tidak dikenal.
  const awal = nilaiAwal(tool);
  const input = {};
  for (const k of semuaKolom(tool)) {
    const masuk = data?.[k.id];
    if (k.jenis === "checkbox") {
      input[k.id] = masuk === true;
    } else if (k.jenis === "centang-grup") {
      // Simpan hanya nilai yang dikenal, dengan urutan seperti di form.
      const dipilih = Array.isArray(masuk) ? masuk : [];
      input[k.id] = k.opsi.map((o) => o.nilai).filter((n) => dipilih.includes(n));
    } else if (k.jenis === "select" || k.jenis === "pilihan") {
      input[k.id] = k.opsi.some((o) => o.nilai === masuk) ? masuk : awal[k.id];
    } else {
      input[k.id] = String(masuk ?? "").trim().slice(0, BATAS_KARAKTER);
    }
  }

  // Susun setiap kotak hasil yang kolom wajibnya sudah lengkap.
  const hasil = {};
  for (const out of tool.keluaran) {
    const kurang = out.wajib.filter((id) => !input[id]);
    hasil[out.id] = kurang.length
      ? { kurang: kurang.map((id) => namaKolom(tool, id)) }
      : { prompt: susun(input, out.id) };
  }

  return NextResponse.json({ hasil });
}
