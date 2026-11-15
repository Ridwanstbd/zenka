import NavAtas from "@/components/NavAtas";
import DaftarCabang from "@/components/DaftarCabang";
import { CABANG, TOOLS } from "@/lib/tools";

export default function Beranda() {
  // Kirim ke browser hanya data yang dibutuhkan daftar, bukan konfigurasi form.
  const cabang = CABANG.map((c) => ({
    ...c,
    tools: TOOLS.filter((t) => t.cabang === c.id).map(({ slug, judul, ringkas, siap }) => ({ slug, judul, ringkas, siap })),
  })).filter((c) => c.tools.length);

  return (
    <>
      <header className="kepala">
        <NavAtas />
        <h1>Pilih tool untuk kontenmu</h1>
        <p>Mulai dari lead magnet dan riset, lalu buka cabang konten yang mau kamu kerjakan.</p>
      </header>
      <DaftarCabang cabang={cabang} />
    </>
  );
}
