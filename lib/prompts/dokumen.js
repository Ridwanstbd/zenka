import "server-only";

// Pengganti "document" milik browser, supaya kode penyusun prompt dari
// versi HTML bisa dipakai apa adanya di server tanpa diubah.
// Isian form sudah dirapikan oleh route API sebelum sampai ke sini.
export function buatDokumen(input) {
  return {
    getElementById(id) {
      const nilai = input[id];
      return {
        value: typeof nilai === "string" ? nilai : "",
        checked: nilai === true,
      };
    },
    // Untuk radio: input[name="level"]:checked
    querySelector(selektor) {
      const cocok = /name="([^"]+)"/.exec(selektor);
      const nilai = cocok ? input[cocok[1]] : "";
      return nilai ? { value: nilai } : null;
    },
    // Untuk grup centang: #topik input:checked
    querySelectorAll(selektor) {
      const cocok = /#([\w-]+) input:checked/.exec(selektor);
      const daftar = cocok && Array.isArray(input[cocok[1]]) ? input[cocok[1]] : [];
      return daftar.map((value) => ({ value }));
    },
  };
}
