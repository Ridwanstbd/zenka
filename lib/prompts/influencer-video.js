import "server-only";
import { buatDokumen } from "./dokumen";

// Penyusun prompt "influencer-video". Hanya berjalan di server.
// Prompt ditulis dalam bahasa Inggris karena hasilnya (prompt video) juga
// berbahasa Inggris; dialog tetap berbahasa Indonesia sesuai naskah.
export function susunInfluencerVideo(input, keluaran) {
  const document = buatDokumen(input);

  function v(id) {
    return document.getElementById(id).value.trim();
  }

  // Bahan dari Visual Planner Video Pendek ("BAHAN INFLUENCER VIDEO BUILDER").
  // Isinya: satu baris RASIO VIDEO lalu satu baris per klip 8 detik dengan bentuk
  // "00:00-00:08 {naskah} [Ekspresi: ... | Tangan: ... | Intonasi: ... | Produk: ...]".
  // Bahan boleh ditempel dengan atau tanpa pagar ```markdown```. Bahan versi lama
  // (dengan baris PLATFORM TUJUAN, INSTRUKSI CAPTION, FONT, POSISI, WARNA dan elemen
  // "Caption:") tetap bisa ditempel: semua instruksi caption dibuang di sini,
  // karena video tidak boleh memuat huruf apa pun. Naskah biasa (tanpa header)
  // dibiarkan apa adanya seperti sebelumnya.
  const RE_WAKTU = /^\d{1,2}:\d{2}\s*[-\u2013\u2014]\s*\d{1,2}:\d{2}/;
  const RE_HEADER =
    /^(RASIO VIDEO|PLATFORM TUJUAN|INSTRUKSI CAPTION|FONT|POSISI|WARNA)\b/i;
  const RE_ELEMEN_CAPTION = /\s*\|\s*Caption\s*:[^\]]*(?=\])/gi;
  const RE_ADA_CAPTION = /[\[|]\s*Caption\s*:/i;
  // Planner selalu memotong 8 detik per baris: 4/8/12 baris = 32/64/96 detik.
  const BARIS_KE_DURASI = { 4: "30 Detik", 8: "60 Detik", 12: "90 Detik" };

  function bacaNaskah(mentah) {
    const asli = mentah.trim();
    const baris = asli
      .replace(/\r/g, "")
      .split("\n")
      .map((x) => x.trim())
      .filter(
        (x) =>
          x &&
          !/^```/.test(x) &&
          !/^BAHAN INFLUENCER VIDEO BUILDER:?$/i.test(x) &&
          !/^\(Angka timestamp/i.test(x),
      );
    const header = [];
    const isi = [];
    for (const b of baris) {
      if (RE_WAKTU.test(b)) isi.push(b);
      else if (isi.length)
        isi[isi.length - 1] += " " + b; // baris yang terpotong di tengah
      else header.push(b);
    }
    const dariPlanner =
      header.some((b) => RE_HEADER.test(b)) ||
      isi.some((b) => RE_ADA_CAPTION.test(b));
    if (!isi.length || !dariPlanner)
      return { planner: false, naskah: asli, baris: 0 };
    return {
      planner: true,
      naskah: isi.map((b) => b.replace(RE_ELEMEN_CAPTION, "")).join("\n"),
      baris: isi.length,
    };
  }

  // Target per durasi video, sama dengan pilihan durasi di Naskah video pendek.
  // Jumlah klip wajib per generator: Seedance sekitar 15 detik per klip,
  // Flow/Veo tetap 8 detik per klip. min/maks = batas jumlah kata naskah
  // (tempo 2,5 kata per detik, dengan sedikit kelonggaran dari target naskah).
  const DURASI = {
    "30 Detik": {
      detik: 30,
      aktual: 32,
      min: 70,
      maks: 90,
      seedance: 2,
      flow: 4,
    },
    "60 Detik": {
      detik: 60,
      aktual: 64,
      min: 140,
      maks: 170,
      seedance: 4,
      flow: 8,
    },
    "90 Detik": {
      detik: 90,
      aktual: 96,
      min: 210,
      maks: 250,
      seedance: 6,
      flow: 12,
    },
  };

  const mmss = (detik) =>
    String(Math.floor(detik / 60)).padStart(2, "0") +
    ":" +
    String(detik % 60).padStart(2, "0");

  // Aturan yang berbeda per AI video generator; jumlah = jumlah klip wajib.
  const buatGen = (jumlah, detik, aktual, grup) => ({
    seedance: {
      nama: "Seedance 2.5",
      alat: "Seedance 2.5 (image-to-video, up to 30 seconds per clip, native audio with lip sync).",
      gambar:
        "It is the ONLY identity reference and the first frame of every clip.",
      klip: [
        ...(grup
          ? [
              "My script is already cut by my visual planner into " +
                grup * jumlah +
                " lines of 8 seconds each (every line starts with its own timestamp). Make each clip exactly " +
                grup +
                " consecutive whole lines, in order (clip 1 = lines 1-" +
                grup +
                ", clip 2 = lines " +
                (grup + 1) +
                "-" +
                grup * 2 +
                ", and so on). Never cut inside a line and never move words between lines; this replaces the sentence-end splitting rule below. The planner's timestamps do not set the clip labels: the labels follow the duration rule below.",
            ]
          : []),
        "Make exactly " +
          jumlah +
          " clips, no more and no fewer: the selected duration is " +
          detik +
          " seconds, rounded up to " +
          aktual +
          " seconds (the extra " +
          (aktual - detik) +
          " seconds are tolerance), so each clip covers about " +
          Math.round(aktual / jumlah) +
          " seconds of speech. Split at sentence ends (. ? !) and balance the clips so their lengths are close to each other. If no sentence end gives a balanced split, split at the most natural pause (a comma or a breath between phrases). Each clip is at most 30 seconds, the per-generation limit of Seedance 2.5.",
        "Estimate speech time at 2.5 words per second. Clip duration = speech time + 1 second of breathing room, rounded up to whole seconds, minimum 4 and maximum 30 seconds.",
        "Timestamps in the clip labels run continuously across the whole video, starting at 00:00 and using each clip's duration (e.g., clip 1 00:00-00:15, clip 2 00:15-00:29).",
      ],
      label: "KLIP {n} | {mm:ss-mm:ss} | durasi {d} detik",
      dialog:
        'Dialogue: The character speaks in Indonesian, saying: "{the clip\'s exact words}" (the words appear once, inside double quotes, verbatim).',
      rantai: null,
      cek:
        "there are exactly " +
        jumlah +
        " clips, balanced in length, each at most 30 seconds and split at sentence ends or natural pauses; the durations follow 2.5 words per second plus 1 second; the label timestamps run continuously from 00:00",
    },
    flow: {
      nama: "Google Flow or Gemini with Veo",
      alat: "Google Flow or Gemini with Veo (8-second clips, native audio with lip sync), with the clips chained one after another.",
      gambar:
        "It is the identity reference and the first frame of clip 1. Every later clip starts from the last frame of the previous clip (see <chain>).",
      klip: [
        ...(grup
          ? [
              "My script is already cut by my visual planner into " +
                jumlah +
                " lines of exactly 8 seconds each (every line starts with its own timestamp, in the same 8-second steps as the clip labels). Each line is exactly one clip, in order (line 1 = clip 1, line 2 = clip 2, and so on). Never move words between lines; this replaces the rule below about splitting at sentence ends.",
            ]
          : []),
        "Every clip is exactly 8 seconds, and Veo is less likely to generate speech when the dialogue does not fit in the clip. The clips are chained, so nothing is trimmed: each clip holds about 16-20 words, spoken at a natural conversational pace within about 7.5 seconds, and the last moment of the clip is a short natural breath.",
        "Make exactly " +
          jumlah +
          " clips, no more and no fewer: the selected duration is " +
          detik +
          " seconds, rounded up to " +
          aktual +
          " seconds, so " +
          jumlah +
          " chained clips of 8 seconds (" +
          jumlah * 8 +
          " seconds in total); the extra " +
          (aktual - detik) +
          " seconds are tolerance, so never add, cut, or shorten a clip. Spread the words evenly (total words ÷ " +
          jumlah +
          " per clip) so no clip is much shorter or longer than the others. Split at sentence ends (. ? !) where possible; otherwise at the most natural pause (a comma or a breath between phrases).",
        "Timestamps in the clip labels run in 8-second steps across the whole video: clip 1 00:00-00:08, clip 2 00:08-00:16, and so on, up to clip " +
          jumlah +
          " " +
          mmss(jumlah * 8 - 8) +
          "-" +
          mmss(jumlah * 8) +
          ".",
      ],
      label:
        "KLIP {n} | {mm:ss-mm:ss} | 8 detik | gambar awal: {gambar karakter (KLIP 1) atau frame terakhir KLIP n-1}",
      dialog:
        'Dialogue: The character says in Indonesian: "{the clip\'s exact words}" (the words appear once, inside double quotes, verbatim).',
      rantai: [
        "Clip 1 starts from the attached character image as its first frame.",
        "Clip 2 and every later clip MUST start from the last frame of the previous clip's result. I will use that last frame as the first frame of the next clip (Flow: Extend on the previous clip, or save its last frame and use it in Frames to video; Gemini: attach the last frame as the starting image).",
        'Every prompt from clip 2 on opens its Subject section with: "Start from the attached image, which is the last frame of clip {n-1}." Then add a continuity line: the clip continues the same moment with no jump, with the same pose, framing, lighting, and expression at the first frame, and the motion carries on naturally from there.',
        "The identity, set, lighting, camera-and-lens, and voice descriptions stay word for word the same as in clip 1 (based on the original character image), so the face, light, and voice do not drift along the chain.",
        "End every clip on a clean frame that works as the next first frame: eyes open, mouth softly closed or relaxed, head close to its starting position, hands still, no motion blur, never mid-blink or mid-word.",
      ],
      cek:
        "there are exactly " +
        jumlah +
        " clips, each exactly 8 seconds with about 16-20 words of speech spread evenly; the label timestamps run in 8-second steps up to " +
        mmss(jumlah * 8) +
        "; clip 1 starts from the character image and every later Subject section opens with the last-frame line of the previous clip; every clip ends on a clean frame",
    },
  });

  const DUAL = [
    "Dual angle, a real two-camera podcast setup, both cameras locked on tripods with only very slight natural drift.",
    "Angle A: the exact framing of the attached character image (same shot size, eye level, same lens look and depth of field). The character looks into this lens.",
    "Angle B: a second camera about 35 degrees to one side (pick the side with more visible room in the set), eye level, a slightly wider medium shot that shows the character in three-quarter view, still talking toward Angle A, with the same room and lighting seen from that side. Describe Angle B identically in every clip (same side, distance, and background elements) so it looks like the same second camera.",
  ];

  // Rencana kamera untuk tiap kombinasi generator dan angle.
  const KAMERA = {
    "seedance-single": {
      baris: [
        "Single angle: one fixed camera position for every clip, at the exact framing of the attached image (same shot size, eye level, same lens look and depth of field).",
        "Camera motion stays almost invisible, like a real podcast camera on a tripod: either a very slow, barely noticeable push-in, or a locked-off shot with very slight natural drift. Alternate between the two across clips for variety.",
        "No cuts, no zoom jumps, no orbit, no pan, no shake.",
      ],
      label: "",
      bagian: "",
      cek: "every clip stays on one camera with no cuts",
    },
    "seedance-dual": {
      baris: [
        ...DUAL,
        "Each clip starts on Angle A, because the attached image is the first frame. Alternate between Angle A and Angle B at sentence boundaries, never mid-word, with each shot 5-10 seconds long. A clip shorter than 8 seconds stays on Angle A with no cut.",
        "Write the shots as timestamped sections inside the clip, e.g., [00:00-00:07] Angle A ..., [00:07-00:15] Angle B .... These shot timestamps start at 00:00 in every clip (unlike the clip labels, which count across the whole video). The voice and lip sync continue seamlessly across each cut.",
      ],
      label: " | angle {urutan shot, mis. A → B → A}",
      bagian: ", with the timestamped shot sections",
      cek: "every clip starts on Angle A and cuts only at sentence boundaries with shots of 5-10 seconds; Angle B is described identically in every clip",
    },
    "flow-single": {
      baris: [
        "Single angle: one fixed camera position for every clip, at the exact framing of the attached character image (same shot size, eye level, same lens look and depth of field).",
        "The camera is locked off on a tripod with only very slight natural drift. No push-in or zoom, because the clips are chained and any zoom would keep adding up from clip to clip.",
        "No cuts, no orbit, no pan, no shake.",
      ],
      label: "",
      bagian: "",
      cek: "every clip stays on one locked-off camera with no cuts and no zoom",
    },
    "flow-dual": {
      baris: [
        ...DUAL,
        "The clips are chained, so every clip starts on the same angle as the last frame of the previous clip. Clip 1 starts on Angle A.",
        "Cut once per clip to the other angle, at a sentence end or natural pause near the middle (around 3.5-4.5 seconds), never mid-word: clip 1 A → B, clip 2 B → A, clip 3 A → B, and so on. Each clip ends on the angle the next clip starts with. If a clip has no pause near the middle, it stays on its starting angle, and the next clip starts on that same angle.",
        "Write the shots as timestamped sections inside the clip, e.g., [00:00-00:04] Angle A ..., [00:04-00:08] Angle B .... These shot timestamps start at 00:00 in every clip (unlike the clip labels, which count across the whole video). The voice and lip sync continue seamlessly across the cut.",
      ],
      label: " | angle {mis. A → B}",
      bagian: ", with the timestamped shot sections",
      cek: "clip 1 starts on Angle A, every clip starts on the angle the previous clip ended on and cuts at most once near the middle at a pause; Angle B is described identically in every clip",
    },
  };

  // Aturan produk di tangan karakter, dan demo bila diaktifkan.
  function aturanProduk(g, demo) {
    return [
      "Product anchor: write one fixed product description from the product image, starting from my product description if I gave one (type, shape, size relative to a hand, colors, material and finish, cap or closure, label layout and colors) and use it word for word in every clip, so the product never changes.",
      "The product's own label and logo stay exactly as in the product photo, because this is my product. Do not invent new text on it and do not add any other logo. The label faces the camera in a relaxed way, never pushed into the lens.",
      "Holding: the character holds the product naturally in one hand at chest height, slightly to the side, so it never covers the mouth or the face. The fingers wrap around it with a correct grip, the product's scale fits the hand, and its weight shows in the wrist. The other hand stays free for small gestures.",
      "Entry: if the character image already shows the product in hand, keep it exactly so from the first frame. If not, clip 1 opens with the character bringing the product up from the desk into frame within the first 1-2 seconds, in one smooth motion, while starting to speak.",
      "On product moments in the script (when the product, its use, or its benefit is mentioned), the character lifts the product slightly toward the lens for 1-2 seconds, then lowers it back to chest height.",
      ...(g.rantai
        ? [
            "In chained clips, the product stays in the same hand and position in every clip's last frame, so the next clip starts with it.",
          ]
        : [
            "If the video tool accepts extra reference images, I will also attach the product photo there, so the Product section may also point to the product in the reference image.",
          ]),
      ...(demo
        ? [
            "Demo: in the clip where the script explains how the product is used or what it does (otherwise in the middle of the video), the character demonstrates it in one short, simple, physically real action that fits a seated podcast frame, lasting 2-4 seconds with both hands in frame, while speaking or during a short natural pause. Examples: opening the cap, pressing the pump, pouring a little into the palm, showing the texture or the contents to the lens. Describe each step of the action and the hand and finger positions precisely.",
            "The demo shows how the product is used, not results: no before-and-after, no instant effects, no exaggerated reactions.",
            "Demo physics: liquids, creams, powders, and moving parts behave like the real thing (gravity, thickness, reflections), with no morphing, melting, or duplicated product, and the fingers never pass through the product.",
          ]
        : []),
    ];
  }

  // Aturan suara. "ai": suara dibuat generator. Bila memakai suara sendiri,
  // Seedance menerima rekaman sebagai referensi audio ("rekaman"), sedangkan
  // Flow tidak, jadi suaranya diganti dengan voice changer setelah jadi ("ganti").
  function aturanSuara(genId, ciri) {
    const ciriBaris = ciri
      ? [
          "My voice, for the voice description (translate it into English): " +
            ciri +
            ".",
        ]
      : [];
    if (!document.getElementById("suara").checked) {
      return {
        input: [],
        identitas:
          "describe one voice that fits the character (gender, age, timbre, pace), speaking natural conversational Indonesian, recorded close-mic like a podcast with slight room tone and no background music.",
        intonasi:
          " Translate them into concrete English in the Performance section, and put the intonation in the Audio section as well.",
        arahan: "Performance and Audio",
        dialog: "",
        audio:
          "Audio: the fixed voice description, close-mic podcast sound, slight room tone, no music.",
        cek: "",
      };
    }
    if (genId === "seedance") {
      return {
        input: [
          "Voice: the character speaks in my own voice. When I generate each clip in Seedance, I will attach my own recording of exactly that clip's dialogue as an audio reference, and the voice and lip sync follow it.",
          ...ciriBaris,
        ],
        identitas:
          'the voice comes from my recording attached to each clip. Describe it as "the voice from the attached audio reference", followed by ' +
          (ciri
            ? "a short description of my voice from <input>"
            : "the gender and approximate age of the character") +
          ", speaking natural conversational Indonesian, recorded close-mic like a podcast with no background music.",
        intonasi:
          " Translate them into concrete English in the Performance section. The intonation itself comes from my recording, so use the Intonasi direction only to match the face to the voice, and do not describe it in the Audio section.",
        arahan: "Performance",
        dialog:
          " Then add: The voice and lip sync follow the attached audio reference, which says exactly these words.",
        audio:
          "Audio: the fixed voice description; the speech follows the timing, pauses, and intonation of the attached audio reference; close-mic podcast sound, no music.",
        cek: "; every Dialogue section ends with the audio reference line, and every Audio section follows the attached recording",
      };
    }
    return {
      input: [
        "Voice: the character will speak in my own voice. The video tool cannot take my recording, so after generating I will replace the generated voice with mine using a speech-to-speech voice changer, which keeps the timing and lip sync. The generated voice must therefore be close to mine and clean.",
        ...ciriBaris,
      ],
      identitas:
        "describe one voice that " +
        (ciri ? "matches my voice in <input>" : "fits the character") +
        " (gender, age, timbre, pace), speaking natural conversational Indonesian, recorded dry and close-mic like a podcast, one speaker only, with no reverb, no background music, and no sound effects, so a voice changer can replace it cleanly.",
      intonasi:
        " Translate them into concrete English in the Performance section, and put the intonation in the Audio section as well.",
      arahan: "Performance and Audio",
      dialog: "",
      audio:
        "Audio: the fixed voice description, dry close-mic podcast sound with one speaker, no reverb, no music, no sound effects.",
      cek: "; the voice is dry and clean, with no reverb, music, or sound effects",
    };
  }

  function build() {
    const genId = v("generator") === "flow" ? "flow" : "seedance";
    const angleId = v("angle") === "dual" ? "dual" : "single";
    const bahan = bacaNaskah(v("naskah"));
    const planner = bahan.planner;
    // Bahan planner sudah dipotong per 8 detik, jadi durasi mengikuti jumlah barisnya
    // (4/8/12 baris) agar tidak bentrok dengan pilihan durasi di form.
    const durasi =
      planner && BARIS_KE_DURASI[bahan.baris]
        ? BARIS_KE_DURASI[bahan.baris]
        : DURASI[v("durasi")]
          ? v("durasi")
          : "60 Detik";
    const dur = DURASI[durasi];
    const jumlah = dur[genId];
    // grup = jumlah baris planner per klip (Flow 1, Seedance 2); 0 bila bukan bahan planner.
    const grup =
      planner && BARIS_KE_DURASI[bahan.baris] ? bahan.baris / jumlah : 0;
    const g = buatGen(jumlah, dur.detik, dur.aktual, grup)[genId];
    const kamera = KAMERA[genId + "-" + angleId];
    const k = planner
      ? {
          ...kamera,
          baris: [
            "Frame: vertical 9:16 (1080x1920), full frame with no letterbox or black bars, for both angles. The attached character image is the vertical first frame, so keep its framing inside that vertical frame.",
            ...kamera.baris,
          ],
          bagian: kamera.bagian + ", in the vertical 9:16 frame",
        }
      : kamera;
    const daftar = (baris) => baris.map((x, i) => i + 1 + ". " + x);
    const pegang = document.getElementById("pegang").checked;
    const demo = pegang && document.getElementById("demo").checked;
    const produk = v("produk");
    const s = aturanSuara(genId, v("ciriSuara"));
    return [
      "<role>",
      "Act as an expert AI video prompt engineer and documentary cinematographer. You specialize in talking-head videos for " +
        g.nama +
        " that are indistinguishable from real camera footage of a real person speaking.",
      "</role>",
      "",
      "<input>",
      "I have attached my finalized character image" +
        (pegang ? " (Image 1, the first attached image)" : "") +
        ": the pose, outfit, and podcast set are final. " +
        g.gambar,
      ...(pegang
        ? [
            "Image 2 (the second attached image): a photo of my product, or a product reference sheet of it with several panels (views, opened state, in use, contents). It is the ONLY reference for the product's shape, size, colors, material, and label design." +
              (produk ? " Product description from me: " + produk : ""),
            "Product in the video: the character holds the product" +
              (demo ? " and demonstrates how it is used." : "."),
          ]
        : []),
      "AI video tool: " + g.alat,
      "Video duration: " +
        dur.detik +
        " seconds selected, rounded up to " +
        dur.aktual +
        " seconds (the extra " +
        (dur.aktual - dur.detik) +
        " seconds are tolerance), which means exactly " +
        jumlah +
        " clips of " +
        (genId === "flow" ? 8 : Math.round(dur.aktual / jumlah)) +
        " seconds each (see <clips>).",
      ...s.input,
      "Camera angle: " +
        (angleId === "dual"
          ? "dual angle (two-camera podcast setup)."
          : "single angle (one camera, no cuts)."),
      "Script/narration the character will speak (in Indonesian). It may contain timestamps such as 00:00-00:08 at the start of lines, and directions from my visual planner in square brackets at the end of lines, e.g. [Ekspresi: ... | Tangan: ... | Intonasi: ... | Produk: ...]." +
        " Timestamps and bracketed directions are not part of the speech:",
      "<<<",
      bahan.naskah,
      ">>>",
      "</input>",
      "",
      "<task>",
      "Create a talking-head video script and motion prompt based on this character: split the script into clips, then write one detailed video generation prompt per clip for the AI video tool above. Include natural mouth movement, subtle head gestures, realistic blinking, the camera angle above, and keep the exact facial features of the attached character in every frame.",
      "Work through <clips>, " +
        (g.rantai ? "<chain>, " : "") +
        "<identity>, " +
        (pegang ? "<product>, " : "") +
        "<camera>, <performance>, <no_text>, " +
        "and <realism> internally, then answer only in the format in <format_output>.",
      "</task>",
      "",
      "<clips>",
      "1. Remove timestamps, label lines, and bracketed directions from the speech. The spoken words stay verbatim: do not change, add, translate, or drop any word, and keep the original order. Keep each line's bracketed direction for <performance>.",
      ...daftar(g.klip).map((x) =>
        x.replace(/^(\d+)/, (n) => String(Number(n) + 1)),
      ),
      "</clips>",
      "",
      ...(g.rantai ? ["<chain>", ...daftar(g.rantai), "</chain>", ""] : []),
      "<identity>",
      "1. Every clip prompt opens with an identity lock: the person from the character image, with the exact same face, skin, hair, outfit, and body in every frame, and no morphing or identity drift.",
      "2. Follow it with a short description of the character from the image (age, gender, ethnicity, key facial features, hair, outfit) and of the podcast set. Use the exact same wording for this description in every clip.",
      "3. Voice: " +
        s.identitas +
        " Use the exact same voice description in every clip so the voice never changes between clips.",
      "</identity>",
      "",
      ...(pegang
        ? ["<product>", ...daftar(aturanProduk(g, demo)), "</product>", ""]
        : []),
      "<camera>",
      ...daftar(k.baris),
      "</camera>",
      "",
      "<performance>",
      "These motion details make the character move like a real human speaking. Put them in every clip prompt using concrete physical language:",
      "1. Mouth: lip shapes match each syllable of the Indonesian dialogue; the lips fully close on m, b, and p sounds and round on o and u sounds; teeth and tongue show naturally; the jaw moves with the syllables without over-articulating; the mouth relaxes during pauses.",
      "2. Blinking and eyes: natural, irregular blinks every 2-6 seconds, both eyelids closing fully, never staring without blinking; small natural eye movements; mostly looking into the lens, with brief glances down or to the side while thinking, then back to the lens; wet reflections and catchlights stay in the eyes.",
      "3. Head: small nods on key words, a slight tilt on questions, and subtle micro-movements; head motion stays within a few degrees, never bobbing or swaying constantly.",
      "4. Face and breathing: eyebrows lift slightly on emphasis; cheeks and smile lines move when smiling; subtle micro-expressions between phrases (a brief squint, a small lip press, a slightly asymmetric smile); a small inhale before longer sentences, with subtle chest and shoulder rise.",
      "5. Expression follows the meaning of each sentence (curious on questions, warm on empathy, confident on claims, playful on jokes and relatable meme lines) without overacting. For comedic or meme lines, use comic timing: a deadpan look into the lens, a knowing smirk, eyes widening slightly in mock surprise, a held-back laugh, or a short beat of silence before the punchline. The vocal tone matches the face.",
      "6. Hands: if the hands are visible, occasional relaxed gestures near the desk that match the emphasis; otherwise they rest still. The character stays seated.",
      "7. Directions from the script: if a line has a bracketed direction, its Ekspresi (expression), Tangan (hand gesture), and Intonasi (intonation) replace the defaults above for the words of that line." +
        " A direction never creates text: ignore any part of it that asks for text, captions, or titles in the video." +
        s.intonasi +
        " When a clip covers several lines, describe the changes in order (e.g., first ..., then ...). " +
        (pegang
          ? "Use the Produk direction to place the product moments" +
            (demo ? " and the demo" : "") +
            " from <product> instead of guessing; - means no special product moment in that line."
          : "Ignore the Produk direction, because the product is not in this video."),
      "</performance>",
      "",
      "<no_text>",
      "1. No letters of any kind appear in any frame: no captions, no subtitles, no titles, no lower thirds, no on-screen text, no numbers, no symbols that read as writing, no logos, no watermarks, no timestamps, no interface elements, no speech bubbles. The spoken words exist only as audio and lip movement and are never rendered as text, and no caption is added to the video because I add subtitles later in editing.",
      "2. Describe the scene with positive wording as well, because video models often ignore negatives: in every Scene section, write that every surface is plain and free of writing: a plain wall with no signs, posters, or wall art; screens and monitors switched off or turned away; a microphone and headphones with no visible brand marking; an outfit with no prints, lettering, or logos; no books, bottles, clocks, calendars, or other objects with readable markings in the set. If the attached character image shows any lettering, describe that surface as plain and unmarked, and never read, copy, or quote the lettering.",
      "3. Words from the script appear only inside the Dialogue section, never in Subject, Scene, Camera, Performance, Audio, Look, or Avoid, so the video model has no written words to draw." +
        (pegang
          ? " The one exception is the product's own label, which stays exactly as in the product photo: never describe, spell out, extend, enlarge, or rewrite its words in the prompt, only say that the label looks exactly as in the product photo."
          : ""),
      "</no_text>",
      "",
      "<realism>",
      "1. Camera and lens: read the lens look from the character image and write it as concrete camera terms, e.g., shot on a full-frame mirrorless camera, 35mm lens, f/2.8, 24 fps with natural motion blur, true-to-life colors, subtle sensor grain, raw ungraded footage. Pick the focal length and aperture that match the image's field of view and background blur, and use the exact same wording in every clip.",
      "2. Lighting: describe the real light visible in the character image: its source (window, practical lamp, or soft studio light), direction, softness, and color temperature, with natural shadows under the nose and chin, gentle falloff across the face, and darker corners in the room. It looks like light in a real room, not flat, perfectly even studio light. Do not add new light sources, sunlight changes, or lens flare, because the first frame must match the image. Use the exact same wording in every clip; lighting and exposure stay constant with no flicker.",
      "3. Physics: hair strands, including a few flyaway strands, and slight fabric wrinkles shift subtly with movement; the microphone, desk, and background stay still.",
      "4. Skin: pores, fine lines, slight uneven tone, and natural texture stay visible in every frame, with no smoothing, waxy look, or beauty filter.",
      "5. Do not use filler keywords such as cinematic, 8k, 4k, ultra HD, masterpiece, best quality, photorealistic, hyperrealistic, CGI, or render. Describe it as real camera footage instead.",
      "</realism>",
      "",
      "<format_output>",
      "Answer with exactly " +
        jumlah +
        " clips, with no text before the first clip and none after the last clip. For each clip, in order:",
      "1. One label line: " + g.label + k.label,
      "2. One ```text code block with that clip's video prompt in English, 150-250 words, using these labeled sections in order:",
      "Subject: " +
        (g.rantai
          ? "(from clip 2 on, the last-frame line from <chain> first) "
          : "") +
        "identity lock and the fixed character description.",
      "Scene: the podcast set from the image, unchanged, with the fixed lighting description from <realism>, and every surface described as plain and free of writing (<no_text> 2).",
      "Camera: the camera plan from <camera>" + k.bagian + ".",
      "Performance: mouth, eyes and blinking, head, face and breathing, expression, hands" +
        (g.rantai ? ", and the clean ending frame." : "."),
      ...(pegang
        ? [
            "Product: the fixed product description, how it is held, and what the product does in this clip from <product>" +
              (demo
                ? ", including the step-by-step demo in the demo clip."
                : "."),
          ]
        : []),
      g.dialog +
        s.dialog +
        " End this section with the line: " +
        (pegang
          ? "No text of any kind appears in the video except the product's own label exactly as in the product photo: no subtitles, no captions, no extra letters, no numbers, no logos, no watermarks."
          : "No text of any kind appears in the video: no subtitles, no captions, no letters, no numbers, no logos, no watermarks.") +
        (g.rantai
          ? " (Veo tends to burn dialogue into the frame as text.)"
          : ""),
      s.audio,
      "Look: the fixed camera and lens terms, physics, and skin details from <realism>.",
      "Avoid: a short comma-separated list of things to avoid, including face morphing, identity drift, plastic or smoothed skin, a staring face with no blinking, exaggerated mouth movement, lip sync drift, flickering teeth, warping background, flat even studio lighting, flickering light, any text, letters, numbers, captions, subtitles, titles, logos, signs, readable screens, or watermarks" +
        (g.rantai ? ", a jump or pose reset at the first frame" : "") +
        (pegang
          ? ", the product changing shape or label, fingers passing through the product, the product covering the face."
          : "."),
      "Do not package the answer as a .md, .docx, or .pdf file. Show everything directly in the chat.",
      "</format_output>",
      "",
      "<guardrail>",
      "1. If no image is attached to this message, do not write any prompt. Reply only with: Lampirkan dulu gambar karakter final, lalu kirim ulang prompt ini." +
        (pegang
          ? " If only one image is attached and it does not clearly show the product, reply only with: Lampirkan juga foto produk sebagai gambar kedua, lalu kirim ulang prompt ini."
          : ""),
      "2. Count the words of the speech (without timestamps and bracketed directions). If it has more than " +
        dur.maks +
        " words, it does not fit " +
        jumlah +
        " clips: do not write any prompt. Reply only with: Naskah terlalu panjang untuk durasi " +
        durasi +
        " (" +
        jumlah +
        " klip). Pilih durasi yang lebih panjang atau pendekkan naskah, lalu kirim ulang prompt ini.",
      "3. If it has fewer than " +
        dur.min +
        " words, do not write any prompt. Reply only with: Naskah terlalu pendek untuk durasi " +
        durasi +
        " (" +
        jumlah +
        " klip). Pilih durasi yang lebih pendek atau tambah naskahnya, lalu kirim ulang prompt ini.",
      "4. Keep the character an adult, as in the image, in modest clothing.",
      "5. Do not identify, name, or guess who the person is, and do not mention any celebrity, podcast show, or channel name.",
      "6. No text of any kind in the video: no letters, numbers, captions, subtitles, titles, lower thirds, signs, readable screens, logos, or watermarks" +
        (pegang
          ? ", except the product's own label exactly as in the product photo"
          : "") +
        ". Do not offer, suggest, or write any caption, and do not put any word of the script into a prompt outside its Dialogue section. Subtitles are added later in editing.",
      "7. Do not ask me anything, except in the cases of rules 1 to 3.",
      "</guardrail>",
      "",
      "Self-check before answering: an image is attached; the dialogue of all clips joined in order equals the script verbatim with no timestamps, no bracketed directions, and no changed, added, or dropped words; bracketed directions, if any, are followed in " +
        s.arahan +
        "; " +
        g.cek +
        s.cek +
        "; the identity, set, lighting, camera-and-lens, and voice descriptions are word for word the same in every clip; " +
        k.cek +
        (pegang
          ? "; the product description is word for word the same in every clip, the product never covers the face, and its label follows the product photo"
          : "") +
        (demo
          ? "; there is exactly one short demo at the right moment, described step by step with hand positions, and it shows use, not results"
          : "") +
        "; each prompt has the sections Subject, Scene, Camera, Performance, " +
        (pegang ? "Product, " : "") +
        "Dialogue, Audio, " +
        "Look, and Avoid in that order; the spoken dialogue appears once in double quotes with the language stated" +
        "; no prompt asks for or contains any caption, subtitle, title, number, or readable text" +
        (pegang
          ? " (apart from the product's own label as in the product photo)"
          : "") +
        ", every Scene section describes plain surfaces free of writing, every Dialogue section ends with the no-text line, and every Avoid list names text and letters" +
        "; none of the filler keywords appear; the answer has only the clip labels and their ```text code blocks.",
    ].join("\n");
  }

  const penyusun = { utama: build };
  return penyusun[keluaran]();
}
