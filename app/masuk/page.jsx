export const metadata = { title: "Masuk ke Zenka" };

export default async function Masuk({ searchParams }) {
  const { galat } = await searchParams;
  const linkBeli = process.env.ZENKA_BELI;

  return (
    <main className="masuk">
      <div className="kartu">
        <h1>zenka</h1>
        <p>Generator prompt konten untuk jualan. Masukkan kode akses sekali untuk membuka semua tool.</p>
        <form method="POST" action="/api/masuk">
          <label htmlFor="kode">Kode akses</label>
          <input id="kode" name="kode" type="text" autoComplete="off" required autoFocus />
          <button type="submit">Masuk</button>
          {galat && (
            <p className="galat" role="alert">
              Kode tidak dikenali. Periksa lagi huruf besar-kecilnya.
            </p>
          )}
        </form>
        {linkBeli && (
          <p className="beli">
            Belum punya kode? <a href={linkBeli}>Dapatkan akses Zenka</a>
          </p>
        )}
      </div>
    </main>
  );
}
