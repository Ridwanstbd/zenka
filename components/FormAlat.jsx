"use client";

// Form umum untuk semua tool. Browser hanya mengirim isian; prompt disusun
// di server lewat /api/prompt/[slug], jadi template tidak pernah ada di sini.
import { useEffect, useRef, useState } from "react";
import { nilaiAwal, kolomDisimpan, kunciSimpan, syaratTerpenuhi } from "@/lib/tools";

function pesanKosong(out, kurang) {
  return out.kosong || `Isi ${kurang.join(", ")} dulu. Prompt akan muncul di sini.`;
}

// Gabungkan isian tersimpan ke nilai saat ini, hanya untuk kolom dan tipe yang cocok.
function gabungTersimpan(tool, dasar, tersimpan) {
  const hasil = { ...dasar };
  if (!tersimpan || typeof tersimpan !== "object") return hasil;
  for (const k of kolomDisimpan(tool)) {
    const v = tersimpan[k.id];
    if (k.jenis === "checkbox" && typeof v === "boolean") hasil[k.id] = v;
    else if (k.jenis === "centang-grup" && Array.isArray(v)) hasil[k.id] = v.filter((x) => k.opsi.some((o) => o.nilai === x));
    else if ((k.jenis === "select" || k.jenis === "pilihan") && k.opsi.some((o) => o.nilai === v)) hasil[k.id] = v;
    else if (["text", "textarea", "angka"].includes(k.jenis) && typeof v === "string") hasil[k.id] = v;
  }
  return hasil;
}

function Kolom({ k, nilai, ubah }) {
  if (k.jenis === "info") {
    return (
      <label>
        {k.label}
        {k.bantuan && <small>{k.bantuan}</small>}
      </label>
    );
  }
  if (k.jenis === "checkbox") {
    return (
      <label className="chk dalam">
        <input type="checkbox" checked={nilai} onChange={(e) => ubah(k.id, e.target.checked)} />
        <span>
          {k.label}
          {k.bantuan && <small>{k.bantuan}</small>}
        </span>
      </label>
    );
  }
  if (k.jenis === "centang-grup") {
    const alih = (n, aktif) =>
      ubah(k.id, k.opsi.map((o) => o.nilai).filter((x) => (x === n ? aktif : nilai.includes(x))));
    return (
      <div className="grup-centang" role="group" aria-label={k.label}>
        <span className="judul-grup">{k.label}</span>
        <div className="checks">
          {k.opsi.map((o) => (
            <label key={o.nilai} className="chk">
              <input type="checkbox" checked={nilai.includes(o.nilai)} onChange={(e) => alih(o.nilai, e.target.checked)} />
              <span>{o.teks}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }
  if (k.jenis === "pilihan") {
    return (
      <div className="pills" role="radiogroup" aria-label={k.label}>
        {k.opsi.map((o) => (
          <label key={o.nilai} className="pill">
            <input type="radio" name={k.id} value={o.nilai} checked={nilai === o.nilai} onChange={() => ubah(k.id, o.nilai)} />
            <span>{o.teks}</span>
          </label>
        ))}
      </div>
    );
  }
  let isian;
  if (k.jenis === "textarea") {
    isian = <textarea value={nilai} placeholder={k.placeholder} onChange={(e) => ubah(k.id, e.target.value)} />;
  } else if (k.jenis === "select") {
    isian = (
      <select value={nilai} onChange={(e) => ubah(k.id, e.target.value)}>
        {k.opsi.map((o) => (
          <option key={o.nilai} value={o.nilai}>{o.teks}</option>
        ))}
      </select>
    );
  } else if (k.jenis === "angka") {
    isian = <input type="number" min={k.min} max={k.max} value={nilai} onChange={(e) => ubah(k.id, e.target.value)} />;
  } else {
    isian = <input type="text" value={nilai} placeholder={k.placeholder} onChange={(e) => ubah(k.id, e.target.value)} />;
  }
  return (
    <label>
      {k.label}
      {k.bantuan && <small>{k.bantuan}</small>}
      {isian}
    </label>
  );
}

// Kelompokkan kolom setengah yang berurutan agar tampil berdampingan (2 per baris).
function susunBaris(kolom) {
  const baris = [];
  for (const k of kolom) {
    const akhir = baris[baris.length - 1];
    if (k.setengah && Array.isArray(akhir) && akhir.length < 2) akhir.push(k);
    else baris.push(k.setengah ? [k] : k);
  }
  return baris;
}

export default function FormAlat({ tool }) {
  const [nilai, setNilai] = useState(() => nilaiAwal(tool));
  const [hasil, setHasil] = useState({});
  const [memuat, setMemuat] = useState(false);
  const [galat, setGalat] = useState("");
  const [status, setStatus] = useState({});
  const permintaan = useRef(null);
  const sudahDimuat = useRef(false);

  // Muat pilihan dan isian tersimpan dari browser.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(kunciSimpan(tool));
      if (raw) setNilai((lama) => gabungTersimpan(tool, lama, JSON.parse(raw)));
    } catch {}
    sudahDimuat.current = true;
  }, [tool]);

  useEffect(() => {
    if (sudahDimuat.current) {
      try {
        const simpan = {};
        for (const k of kolomDisimpan(tool)) simpan[k.id] = nilai[k.id];
        localStorage.setItem(kunciSimpan(tool), JSON.stringify(simpan));
      } catch {}
    }
    setMemuat(true);
    const jeda = setTimeout(async () => {
      permintaan.current?.abort();
      const ctrl = new AbortController();
      permintaan.current = ctrl;
      try {
        const res = await fetch(`/api/prompt/${tool.slug}`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(nilai),
          signal: ctrl.signal,
        });
        if (res.status === 401) {
          window.location.href = "/masuk";
          return;
        }
        const data = await res.json();
        if (data.hasil) {
          setHasil(data.hasil);
          setGalat("");
        } else {
          setGalat(data.galat || "Prompt gagal disusun. Coba lagi.");
        }
      } catch (e) {
        if (e.name === "AbortError") return;
        setGalat("Koneksi terputus. Periksa internet lalu ubah isian untuk mencoba lagi.");
      }
      setMemuat(false);
    }, 350);
    return () => clearTimeout(jeda);
  }, [nilai, tool]);

  function ubah(id, v) {
    setNilai((lama) => ({ ...lama, [id]: v }));
  }

  const kunciStatus = tool.keluaran[0].id;
  function kabari(kunci, pesan) {
    setStatus((s) => ({ ...s, [kunci]: pesan }));
    setTimeout(() => setStatus((s) => ({ ...s, [kunci]: "" })), 2500);
  }

  async function salin(out) {
    const h = hasil[out.id];
    if (!h?.prompt) {
      kabari(out.id, h?.kurang ? "Lengkapi kolom wajib dulu" : "Prompt belum siap");
      return;
    }
    try {
      await navigator.clipboard.writeText(h.prompt);
      kabari(out.id, "Prompt disalin");
    } catch {
      kabari(out.id, "Salin manual dari kotak");
    }
  }

  function unduh(out) {
    const h = hasil[out.id];
    if (!h?.prompt) {
      kabari(out.id, "Prompt belum siap");
      return;
    }
    const url = URL.createObjectURL(new Blob([h.prompt], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = tool.unduh;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 500);
    kabari(out.id, "Berkas diunduh");
  }

  function isiCepat() {
    const c = tool.isiCepat;
    setNilai((lama) => {
      const baru = { ...lama };
      if (c.isi) Object.assign(baru, c.isi);
      else for (const id of c.kolom) baru[id] = c.nilai;
      return baru;
    });
    kabari(kunciStatus, c.pesan);
  }

  function kosongkan() {
    if (!window.confirm("Kosongkan semua isian?")) return;
    setNilai(nilaiAwal(tool));
    kabari(kunciStatus, "Formulir dikosongkan");
  }

  function infoAtas(out, prompt) {
    const bagian = [];
    if (out.catatan) {
      bagian.push(String(nilai[out.catatan.kolom] || "").trim() ? out.catatan.terisi : out.catatan.kosong);
    }
    bagian.push(
      `${prompt.length.toLocaleString("id-ID")} karakter, sekitar ${Math.round(prompt.length / 4).toLocaleString("id-ID")} token`,
    );
    return bagian.join(" | ");
  }

  const banyak = tool.keluaran.length > 1;
  const terlihat = (k) => syaratTerpenuhi(k.tampilJika, nilai);
  const p = tool.peringatan;
  const tampilPeringatan = p && p.nilai.includes(nilai[p.kolom]);
  let langkahAlur = null;
  if (tool.alur) {
    langkahAlur = [...(tool.alur.langkah[nilai[tool.alur.kolom]] || Object.values(tool.alur.langkah)[0])];
    const g = tool.alur.gantiPertama;
    if (g && syaratTerpenuhi(g.syarat, nilai)) langkahAlur[0] = g.teks;
  }

  return (
    <>
      {langkahAlur && (
        <ol className="alur" aria-label="Alur kerja">
          {langkahAlur.map((s) => <li key={s}>{s}</li>)}
        </ol>
      )}
      <main className="alat">
        <form onSubmit={(e) => e.preventDefault()}>
          {tool.bagian.map((b) => (
            <fieldset key={b.legenda}>
              <legend>{b.legenda}</legend>
              {susunBaris(b.kolom.filter(terlihat)).map((baris) =>
                Array.isArray(baris) ? (
                  <div className="g2" key={baris[0].id}>
                    {baris.map((k) => <Kolom key={k.id} k={k} nilai={nilai[k.id]} ubah={ubah} />)}
                  </div>
                ) : (
                  <Kolom key={baris.id} k={baris} nilai={nilai[baris.id]} ubah={ubah} />
                ),
              )}
            </fieldset>
          ))}
          {tampilPeringatan && (
            <p className="peringatan" role="status">{p.teks.replace("{nilai}", nilai[p.kolom])}</p>
          )}
        </form>

        <section className={banyak ? "side banyak" : "side"} aria-label="Hasil prompt">
          {tool.keluaran.map((out, i) => {
            const h = hasil[out.id];
            const teks = galat
              ? galat
              : h?.prompt || (h?.kurang ? pesanKosong(out, h.kurang) : "Menyusun prompt…");
            return (
              <div className="out-grp" key={out.id}>
                <div className="bar">
                  {i === 0 &&
                    (tool.centang || []).map((k) => (
                      <label key={k.id} className="chk">
                        <input type="checkbox" checked={nilai[k.id]} onChange={(e) => ubah(k.id, e.target.checked)} />
                        <span>
                          {k.label}
                          {k.bantuan && <small>{k.bantuan}</small>}
                        </span>
                      </label>
                    ))}
                  <span className="prog">
                    {h?.prompt && !galat ? infoAtas(out, h.prompt) : ""}
                    {memuat && h?.prompt ? " · memperbarui" : ""}
                  </span>
                </div>
                <pre tabIndex={0}>{teks}</pre>
                <div className="btns">
                  <button type="button" onClick={() => salin(out)}>{out.tombol}</button>
                  {tool.unduh && <button type="button" className="alt" onClick={() => unduh(out)}>Unduh .txt</button>}
                  {i === 0 && tool.isiCepat && (
                    <button type="button" className="alt" onClick={isiCepat}>{tool.isiCepat.tombol}</button>
                  )}
                  {i === 0 && tool.kosongkan && (
                    <button type="button" className="alt" onClick={kosongkan}>Kosongkan form</button>
                  )}
                  <span className="status" role="status">{status[out.id]}</span>
                </div>
              </div>
            );
          })}
        </section>
      </main>
    </>
  );
}
