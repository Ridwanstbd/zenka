import "server-only";
import { buatDokumen } from "./dokumen";

// Penyusun prompt "pesan-pemicu-testimoni". Hanya berjalan di server.
// Kode di dalam fungsi ini disalin apa adanya dari versi HTML (index_a0e92c.html);
// "document" diganti tiruan yang membaca isian form dari server.
export function susunPesanPemicuTestimoni(input, keluaran) {
  const document = buatDokumen(input);

  var $ = function(id){return document.getElementById(id)};
  var REG = ['kosmetik','suplemen','alat kesehatan','sensitif-pribadi'];
  var KEY = 'prompt-testimoni-v1';
  var ids = ['toko','produk','jenis','pembeli','status','gaya','panggilan','media','jumlah','maxk','catatan'];

  function val(id){return ($(id).value||'').trim()}
  function topics(){
    var a=[]; document.querySelectorAll('#topik input:checked').forEach(function(c){a.push(c.value)}); return a;
  }
  function orPlaceholder(v,p){return v?v:p}

  function build(){
    var jenis=val('jenis'), reg=REG.indexOf(jenis)>-1;
    var toko=orPlaceholder(val('toko'),'[nama toko]');
    var produk=orPlaceholder(val('produk'),'[nama produk / kategori]');
    var pembeli=orPlaceholder(val('pembeli'),'[nama pembeli, boleh dikosongkan]');
    var n=Math.max(1,Math.min(10,parseInt(val('jumlah'))||5));
    var mk=Math.max(1,Math.min(6,parseInt(val('maxk'))||3));
    var tp=topics(); var tpTxt=tp.length?tp.join(', '):'kesan umum';
    var catatan=val('catatan');
    var L=[];

    L.push('# PERAN');
    L.push('Kamu adalah Customer Care Copywriter untuk toko online UMKM di Indonesia. Kamu menulis pesan pasca-pembelian yang hangat, singkat, dan membuat pembeli mau bercerita jujur tentang pengalamannya dengan kata-katanya sendiri.');
    L.push('');
    L.push('# TUJUAN');
    L.push('Menghasilkan pesan terima kasih yang memancing testimoni NATURAL, tidak seragam, dan jujur, untuk toko dan produk pada data di bawah.');
    L.push('');
    L.push('');
    L.push('<konteks_dasar>');
    L.push('KONTEKS DASAR (WAJIB DITAATI): Semua konteks utama ada di knowledge yang saya tempel di awal chat ini — hasil Zenka Riset (audiens, strategi TOFU/MOFU/BOFU, ide TOFU#/MOFU#/BOFU# beserta Alasan/Bukti dan Referensi verbatim). Gunakan sebagai sumber utama untuk: (a) suara merek dan gaya bicara, (b) profil dan bahasa target pembeli, (c) hal yang tidak boleh dilakukan, (d) pintu masuk yang sudah diputuskan. Jika knowledge ini bertentangan dengan aturan di bawah, ikuti yang paling membatasi. Jangan minta saya menempel ulang; jika data spesifik tidak ada, simpulkan dan tandai sebagai asumsi.');
    L.push('</konteks_dasar>');
    L.push('');
    L.push('# DATA TOKO DAN PRODUK');
    L.push('1. Nama toko: '+toko);
    L.push('2. Produk / kategori: '+produk);
    L.push('3. Jenis produk: '+jenis);
    L.push('4. Nama pembeli: '+pembeli);
    L.push('5. Status pesanan saat pesan dikirim: '+val('status'));
    L.push('6. Gaya bahasa: '+val('gaya'));
    L.push('7. Panggilan ke pembeli: '+val('panggilan'));
    L.push('8. Media: '+val('media'));
    L.push('9. Hal yang ingin diketahui toko: '+tpTxt);
    if(catatan) L.push('10. Catatan tambahan: '+catatan);
    L.push('');
    L.push('# ATURAN WAJIB');
    var banned='"manjur", "gacor", "mantap", "ampuh", "terbukti", "hasilnya luar biasa"';
    var r=[
     'Jangan menaruh kata di mulut pembeli. Dilarang memakai kata penggiring di pesan toko, misalnya '+banned+'.',
     'Ajukan satu pertanyaan terbuka yang mudah dijawab, misalnya "bagian apa yang paling terasa bedanya?" atau "ada yang bisa kami perbaiki?". Jangan memakai pertanyaan tertutup yang jawabannya hanya "iya".',
     'Beri ruang untuk jawaban kurang baik. Tulis bahwa kritik juga diterima, karena testimoni dengan kritik kecil terlihat lebih asli.',
     'Satu pesan, satu permintaan. Jangan meminta ulasan, foto, dan rating sekaligus.',
     'Sesuaikan isi pesan dengan status pesanan. Jangan menanyakan hasil pemakaian sebelum barang sampai atau sebelum ada waktu yang masuk akal untuk mencoba.',
     'Jangan menawarkan hadiah, diskon, atau imbalan dengan syarat ulasan harus positif. Ucapan terima kasih tanpa syarat boleh.',
     'Jangan menekan atau membuat pembeli merasa bersalah jika tidak menjawab.',
     'Pesan paling banyak '+mk+' kalimat dan 1 emoji. Tulis seperti manusia, bukan template iklan.',
     'Buat variasi. Setiap pesan harus berbeda agar testimoni yang masuk tidak seragam.',
     'Arahkan pertanyaan ke topik yang diminta toko: '+tpTxt+'.'
    ];
    r.forEach(function(t,i){L.push((i+1)+'. '+t)});
    if(reg){
      L.push('');
      L.push('# ATURAN TAMBAHAN: PRODUK TERATUR ('+jenis+')');
      L.push('- Jangan memancing pembeli menyebut khasiat, efek, atau hasil (misalnya meningkatkan stamina, memutihkan, menurunkan berat badan).');
      L.push('- Arahkan pertanyaan ke pengiriman, kemasan, kemudahan pakai, kenyamanan, dan layanan.');
      L.push('- Tambahkan satu kalimat keselamatan di pesan: "Kalau ada rasa tidak nyaman atau iritasi, hentikan pemakaian dan kabari kami."');
      L.push('- Jangan memakai kata klaim di pesan toko.');
      L.push('- Di akhir jawaban, ingatkan saya bahwa testimoni berisi klaim khasiat tidak boleh dipajang di publik dan harus disimpan untuk internal saja.');
    }
    L.push('');
    L.push('# TEKNIK PEMANCING (PILIH SATU PER PESAN)');
    L.push('A. Pertanyaan pengalaman: tanyakan kesan pertama saat produk sampai.');
    L.push('B. Pertanyaan perbandingan: tanyakan apa yang berbeda dari produk sejenis yang pernah dicoba.');
    L.push('C. Pertanyaan perbaikan: tanyakan satu hal yang bisa toko perbaiki.');
    L.push('D. Pertanyaan momen: tanyakan biasanya dipakai atau dinikmati dalam situasi apa.');
    L.push('E. Pesan sederhana tanpa pertanyaan: ucapan terima kasih yang memberi izin membalas kapan saja.');
    L.push('');
    L.push('# FORMAT OUTPUT');
    L.push('Berikan '+n+' variasi pesan. Untuk tiap pesan tulis:');
    L.push('- Teknik yang dipakai (A sampai E)');
    L.push('- Kapan sebaiknya dikirim (sesuai status pesanan)');
    L.push('- Teks pesan siap kirim, di dalam satu code block ```markdown``` sendiri (pola: baris ```markdown, baris baru, teks pesan, baris baru, ``` penutup)');
    L.push('');
    L.push('Lalu berikan:');
    L.push('- 1 balasan jika pembeli menjawab positif (berterima kasih dan minta izin: "Boleh kami simpan cerita kakak sebagai masukan? Nama akan kami samarkan."), di dalam satu code block ```markdown``` sendiri');
    L.push('- 1 balasan jika pembeli menyampaikan keluhan (minta maaf, tanyakan detail, tawarkan solusi, tanpa membela diri), di dalam satu code block ```markdown``` sendiri');
    L.push('- 1 balasan jika pembeli diam selama 3 hari (maksimal satu pengingat lembut, setelah itu berhenti), di dalam satu code block ```markdown``` sendiri');
    L.push('');
    L.push('Aturan code block: semua teks yang kucopy langsung (teks pesan dan balasan) tampil di dalam code block ```markdown``` sendiri persis pola di atas; label, teknik, kapan dikirim, dan heading tetap ditulis biasa.');
    L.push('DILARANG mengemas jawaban sebagai file .md, .docx, atau .pdf — seluruh hasil ditampilkan langsung di percakapan sesuai format di atas.');
    L.push('');
    L.push('# CEK AKHIR');
    L.push('Sebelum menjawab, periksa tiap pesan: tidak ada kata penggiring, tidak ada imbalan bersyarat, hanya satu permintaan, tidak lebih dari '+mk+' kalimat, selaras dengan knowledge awal (konteks dasar), cocok dengan status pesanan, dan semua teks pesan serta balasan tampil di dalam code block ```markdown``` sendiri, dan jawaban hanya tampil di chat, bukan file .md/.docx/.pdf. Perbaiki sendiri jika ada yang melanggar.');
    return L.join('\n');
  }

  const penyusun = { utama: build };
  return penyusun[keluaran]();
}
