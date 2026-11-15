"use client";

// Cabang tool dalam bentuk accordion. Cabang yang dibuka/ditutup diingat di browser.
import Link from "next/link";
import { useEffect, useState } from "react";

const KUNCI = "zenka-cabang-terbuka";

export default function DaftarCabang({ cabang }) {
  const [terbuka, setTerbuka] = useState(() => [cabang[0]?.id]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KUNCI);
      const simpan = raw ? JSON.parse(raw) : null;
      if (Array.isArray(simpan)) setTerbuka(simpan.filter((id) => cabang.some((c) => c.id === id)));
    } catch {}
  }, [cabang]);

  function alih(id, buka) {
    setTerbuka((lama) => {
      const baru = buka ? [...new Set([...lama, id])] : lama.filter((x) => x !== id);
      try {
        localStorage.setItem(KUNCI, JSON.stringify(baru));
      } catch {}
      return baru;
    });
  }

  return (
    <div className="akordeon">
      {cabang.map((c) => (
        <details
          key={c.id}
          className="cabang"
          open={terbuka.includes(c.id)}
          onToggle={(e) => {
            const buka = e.currentTarget.open;
            if (buka !== terbuka.includes(c.id)) alih(c.id, buka);
          }}
        >
          <summary>
            <span className="kepala-cabang">
              <span className="judul-cabang">{c.judul}</span>
              <span className="ringkas-cabang">{c.ringkas}</span>
            </span>
            <span className="jumlah-cabang">{c.tools.length} tool</span>
          </summary>
          <ol className="daftar">
            {c.tools.map((t) => (
              <li key={t.slug}>
                {t.siap ? (
                  <Link href={`/alat/${t.slug}`}>
                    <strong>{t.judul}</strong>
                    <span>{t.ringkas}</span>
                  </Link>
                ) : (
                  <div className="belum">
                    <strong>{t.judul}</strong>
                    <span>Segera hadir. {t.ringkas}</span>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </details>
      ))}
    </div>
  );
}
