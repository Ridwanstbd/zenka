// Aturan kode akses, dipakai oleh proxy.js dan route API.
// Daftar kode diambil dari environment variable ZENKA_CODES (dipisah koma).

export const COOKIE_AKSES = "zenka_akses";
export const UMUR_COOKIE = 60 * 60 * 24 * 30; // 30 hari

export function daftarKode() {
  return (process.env.ZENKA_CODES || "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
}

export function kodeValid(kode) {
  return Boolean(kode) && daftarKode().includes(kode);
}
