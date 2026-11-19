import "server-only";
import { susunRiset } from "./riset";
import { susunTopikVideoPendek } from "./topik-video-pendek";
import { susunCaptionVideoPendek } from "./caption-video-pendek";
import { susunNaskahVideoPendek } from "./naskah-video-pendek";
import { susunVisualPlannerVideoPendek } from "./visual-planner-video-pendek";
import { susunTopikUtasThreads } from "./topik-utas-threads";
import { susunUtasThreads } from "./utas-threads";
import { susunKomenThreads } from "./komen-threads";
import { susunPesanPemicuTestimoni } from "./pesan-pemicu-testimoni";
import { susunWhatsappSeries } from "./whatsapp-series";
import { susunBaseCharacter } from "./base-character";
import { susunBaseProduct } from "./base-product";
import { susunCharacterMatching } from "./character-matching";
import { susunOutfitSwap } from "./outfit-swap";
import { susunPegangProduk } from "./pegang-produk";
import { susunInfluencerVideo } from "./influencer-video";

// Hubungkan slug tool dengan fungsi penyusun prompt-nya.
// Setiap fungsi menerima (input, keluaran) dan mengembalikan teks prompt.
export const PENYUSUN = {
  "riset": susunRiset,
  "topik-video-pendek": susunTopikVideoPendek,
  "caption-video-pendek": susunCaptionVideoPendek,
  "naskah-video-pendek": susunNaskahVideoPendek,
  "visual-planner-video-pendek": susunVisualPlannerVideoPendek,
  "topik-utas-threads": susunTopikUtasThreads,
  "utas-threads": susunUtasThreads,
  "komen-threads": susunKomenThreads,
  "pesan-pemicu-testimoni": susunPesanPemicuTestimoni,
  "whatsapp-series": susunWhatsappSeries,
  "base-character": susunBaseCharacter,
  "base-product": susunBaseProduct,
  "character-matching": susunCharacterMatching,
  "outfit-swap": susunOutfitSwap,
  "pegang-produk": susunPegangProduk,
  "influencer-video": susunInfluencerVideo,
};
