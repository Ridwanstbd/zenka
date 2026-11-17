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

  // Aturan yang berbeda per AI video generator.
  const GEN = {
    seedance: {
      nama: "Seedance 2.5",
      alat: "Seedance 2.5 (image-to-video, up to 30 seconds per clip, native audio with lip sync).",
      gambar: "It is the ONLY identity reference and the first frame of every clip.",
      klip: [
        "Split the script into clips at sentence ends (. ? !) only. Each clip is at most 30 seconds, the per-generation limit of Seedance 2.5. If one sentence alone runs longer than 30 seconds, split it at its most natural pause.",
        "Estimate speech time at 2.5 words per second. Clip duration = speech time + 1 second of breathing room, rounded up to whole seconds, minimum 4 and maximum 30 seconds.",
        "Timestamps in the clip labels run continuously across the whole video, starting at 00:00 and using each clip's duration (e.g., clip 1 00:00-00:12, clip 2 00:12-00:25).",
      ],
      label: "KLIP {n} | {mm:ss-mm:ss} | durasi {d} detik",
      dialog: 'Dialogue: The character speaks in Indonesian, saying: "{the clip\'s exact words}" (the words appear once, inside double quotes, verbatim).',
      rantai: null,
      cek: "every clip is at most 30 seconds and splits only at sentence ends; the durations follow 2.5 words per second plus 1 second; the label timestamps run continuously from 00:00",
    },
    flow: {
      nama: "Google Flow or Gemini with Veo",
      alat: "Google Flow or Gemini with Veo (8-second clips, native audio with lip sync), with the clips chained one after another.",
      gambar: "It is the identity reference and the first frame of clip 1. Every later clip starts from the last frame of the previous clip (see <chain>).",
      klip: [
        "Every clip is exactly 8 seconds, and Veo is less likely to generate speech when the dialogue does not fit in the clip. The clips are chained, so nothing is trimmed: each clip holds about 16-19 words (about 7-7.5 seconds of speech at 2.5 words per second), and the last moment of the clip is a short natural breath.",
        "Number of clips = total words ÷ 19, rounded up (e.g., a 30-second script of about 75 words becomes 4 clips). Split at sentence ends (. ? !) where possible; if that would overfill a clip, split at the most natural pause (a comma or a breath between phrases). Spread the words evenly so no clip is much shorter than the others.",
        "Timestamps in the clip labels run in 8-second steps across the whole video: clip 1 00:00-00:08, clip 2 00:08-00:16, clip 3 00:16-00:24, and so on.",
      ],
      label: "KLIP {n} | {mm:ss-mm:ss} | 8 detik | gambar awal: {gambar karakter (KLIP 1) atau frame terakhir KLIP n-1}",
      dialog:
        'Dialogue: The character says in Indonesian: "{the clip\'s exact words}" (the words appear once, inside double quotes, verbatim). End this section with: No subtitles, no captions, no on-screen text. (Veo tends to burn dialogue into the frame as text.)',
      rantai: [
        "Clip 1 starts from the attached character image as its first frame.",
        "Clip 2 and every later clip MUST start from the last frame of the previous clip's result. I will use that last frame as the first frame of the next clip (Flow: Extend on the previous clip, or save its last frame and use it in Frames to video; Gemini: attach the last frame as the starting image).",
        'Every prompt from clip 2 on opens its Subject section with: "Start from the attached image, which is the last frame of clip {n-1}." Then add a continuity line: the clip continues the same moment with no jump, with the same pose, framing, lighting, and expression at the first frame, and the motion carries on naturally from there.',
        "The identity, set, and voice descriptions stay word for word the same as in clip 1 (based on the original character image), so the face and voice do not drift along the chain.",
        "End every clip on a clean frame that works as the next first frame: eyes open, mouth softly closed or relaxed, head close to its starting position, hands still, no motion blur, never mid-blink or mid-word.",
      ],
      cek: "every clip is exactly 8 seconds with about 16-19 words of speech, and the number of clips is total words ÷ 19 rounded up; the label timestamps run in 8-second steps; clip 1 starts from the character image and every later Subject section opens with the last-frame line of the previous clip; every clip ends on a clean frame; every Dialogue section ends with the no-subtitles line",
    },
  };

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
      "Product anchor: write one fixed product description from the product photo (type, shape, size relative to a hand, colors, material and finish, cap or closure, label layout and colors) and use it word for word in every clip, so the product never changes.",
      "The product's own label and logo stay exactly as in the product photo, because this is my product. Do not invent new text on it and do not add any other logo. The label faces the camera in a relaxed way, never pushed into the lens.",
      "Holding: the character holds the product naturally in one hand at chest height, slightly to the side, so it never covers the mouth or the face. The fingers wrap around it with a correct grip, the product's scale fits the hand, and its weight shows in the wrist. The other hand stays free for small gestures.",
      "Entry: if the character image already shows the product in hand, keep it exactly so from the first frame. If not, clip 1 opens with the character bringing the product up from the desk into frame within the first 1-2 seconds, in one smooth motion, while starting to speak.",
      "On product moments in the script (when the product, its use, or its benefit is mentioned), the character lifts the product slightly toward the lens for 1-2 seconds, then lowers it back to chest height.",
      ...(g.rantai
        ? ["In chained clips, the product stays in the same hand and position in every clip's last frame, so the next clip starts with it."]
        : ["If the video tool accepts extra reference images, I will also attach the product photo there, so the Product section may also point to the product in the reference image."]),
      ...(demo
        ? [
            "Demo: in the clip where the script explains how the product is used or what it does (otherwise in the middle of the video), the character demonstrates it in one short, simple, physically real action that fits a seated podcast frame, lasting 2-4 seconds with both hands in frame, while speaking or during a short natural pause. Examples: opening the cap, pressing the pump, pouring a little into the palm, showing the texture or the contents to the lens. Describe each step of the action and the hand and finger positions precisely.",
            "The demo shows how the product is used, not results: no before-and-after, no instant effects, no exaggerated reactions.",
            "Demo physics: liquids, creams, powders, and moving parts behave like the real thing (gravity, thickness, reflections), with no morphing, melting, or duplicated product, and the fingers never pass through the product.",
          ]
        : []),
    ];
  }

  function build() {
    const genId = GEN[v("generator")] ? v("generator") : "seedance";
    const angleId = v("angle") === "dual" ? "dual" : "single";
    const g = GEN[genId];
    const k = KAMERA[genId + "-" + angleId];
    const daftar = (baris) => baris.map((x, i) => i + 1 + ". " + x);
    const pegang = document.getElementById("pegang").checked;
    const demo = pegang && document.getElementById("demo").checked;
    const produk = v("produk");
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
            "Image 2 (the second attached image): a photo of my product" +
              (produk ? " (" + produk + ")" : "") +
              ". It is the ONLY reference for the product's shape, size, colors, material, and label design.",
            "Product in the video: the character holds the product" + (demo ? " and demonstrates how it is used." : "."),
          ]
        : []),
      "AI video tool: " + g.alat,
      "Camera angle: " + (angleId === "dual" ? "dual angle (two-camera podcast setup)." : "single angle (one camera, no cuts)."),
      "Script/narration the character will speak (in Indonesian). It may contain timestamps such as 00:00-00:06 at the start of lines, and directions from my visual planner in square brackets at the end of lines, e.g. [Ekspresi: ... | Tangan: ... | Intonasi: ... | Produk: ...]. Timestamps and bracketed directions are not part of the speech:",
      "<<<",
      v("naskah"),
      ">>>",
      "</input>",
      "",
      "<task>",
      "Create a talking-head video script and motion prompt based on this character: split the script into clips, then write one detailed video generation prompt per clip for the AI video tool above. Include natural mouth movement, subtle head gestures, realistic blinking, the camera angle above, and keep the exact facial features of the attached character in every frame.",
      "Work through <clips>, " +
        (g.rantai ? "<chain>, " : "") +
        "<identity>, " +
        (pegang ? "<product>, " : "") +
        "<camera>, <performance>, and <realism> internally, then answer only in the format in <format_output>.",
      "</task>",
      "",
      "<clips>",
      "1. Remove timestamps, label lines, and bracketed directions from the speech. The spoken words stay verbatim: do not change, add, translate, or drop any word, and keep the original order. Keep each line's bracketed direction for <performance>.",
      ...daftar(g.klip).map((x) => x.replace(/^(\d+)/, (n) => String(Number(n) + 1))),
      "</clips>",
      "",
      ...(g.rantai ? ["<chain>", ...daftar(g.rantai), "</chain>", ""] : []),
      "<identity>",
      "1. Every clip prompt opens with an identity lock: the person from the character image, with the exact same face, skin, hair, outfit, and body in every frame, and no morphing or identity drift.",
      "2. Follow it with a short description of the character from the image (age, gender, ethnicity, key facial features, hair, outfit) and of the podcast set. Use the exact same wording for this description in every clip.",
      "3. Voice: describe one voice that fits the character (gender, age, timbre, pace), speaking natural conversational Indonesian, recorded close-mic like a podcast with slight room tone and no background music. Use the exact same voice description in every clip so the voice never changes between clips.",
      "</identity>",
      "",
      ...(pegang ? ["<product>", ...daftar(aturanProduk(g, demo)), "</product>", ""] : []),
      "<camera>",
      ...daftar(k.baris),
      "</camera>",
      "",
      "<performance>",
      "These motion details make the character move like a real human speaking. Put them in every clip prompt using concrete physical language:",
      "1. Mouth: lip shapes match each syllable of the Indonesian dialogue; the lips fully close on m, b, and p sounds and round on o and u sounds; teeth and tongue show naturally; the jaw moves with the syllables without over-articulating; the mouth relaxes during pauses.",
      "2. Blinking and eyes: natural, irregular blinks every 2-6 seconds, both eyelids closing fully, never staring without blinking; small natural eye movements; mostly looking into the lens, with brief glances down or to the side while thinking, then back to the lens; wet reflections and catchlights stay in the eyes.",
      "3. Head: small nods on key words, a slight tilt on questions, and subtle micro-movements; head motion stays within a few degrees, never bobbing or swaying constantly.",
      "4. Face and breathing: eyebrows lift slightly on emphasis; cheeks and smile lines move when smiling; a small inhale before longer sentences, with subtle chest and shoulder rise.",
      "5. Expression follows the meaning of each sentence (curious on questions, warm on empathy, confident on claims) without overacting. The vocal tone matches the face.",
      "6. Hands: if the hands are visible, occasional relaxed gestures near the desk that match the emphasis; otherwise they rest still. The character stays seated.",
      "7. Directions from the script: if a line has a bracketed direction, its Ekspresi (expression), Tangan (hand gesture), and Intonasi (intonation) replace the defaults above for the words of that line. Translate them into concrete English in the Performance section, and put the intonation in the Audio section as well. When a clip covers several lines, describe the changes in order (e.g., first ..., then ...). " +
        (pegang
          ? "Use the Produk direction to place the product moments" +
            (demo ? " and the demo" : "") +
            " from <product> instead of guessing; - means no special product moment in that line."
          : "Ignore the Produk direction, because the product is not in this video."),
      "</performance>",
      "",
      "<realism>",
      "1. Footage look: real footage from a mirrorless camera at 24 fps with natural motion blur, the same lens look and depth of field as the character image, true-to-life colors, and subtle sensor noise.",
      "2. Physics: hair strands and clothing folds respond subtly to movement; the microphone, desk, and background stay still; lighting and exposure stay constant with no flicker.",
      "3. Skin: pores, fine lines, and natural texture stay visible in every frame, with no smoothing, waxy look, or beauty filter.",
      "4. Do not use filler keywords such as cinematic, 8k, 4k, ultra HD, masterpiece, best quality, photorealistic, hyperrealistic, CGI, or render. Describe it as real camera footage instead.",
      "</realism>",
      "",
      "<format_output>",
      "Answer with no text before the first clip and none after the last clip. For each clip, in order:",
      "1. One label line: " + g.label + k.label,
      "2. One ```text code block with that clip's video prompt in English, 150-250 words, using these labeled sections in order:",
      "Subject: " + (g.rantai ? "(from clip 2 on, the last-frame line from <chain> first) " : "") + "identity lock and the fixed character description.",
      "Scene: the podcast set from the image, unchanged.",
      "Camera: the camera plan from <camera>" + k.bagian + ".",
      "Performance: mouth, eyes and blinking, head, face and breathing, expression, hands" + (g.rantai ? ", and the clean ending frame." : "."),
      ...(pegang
        ? [
            "Product: the fixed product description, how it is held, and what the product does in this clip from <product>" +
              (demo ? ", including the step-by-step demo in the demo clip." : "."),
          ]
        : []),
      g.dialog,
      "Audio: the fixed voice description, close-mic podcast sound, slight room tone, no music.",
      "Look: the footage look, physics, and skin details from <realism>.",
      "Avoid: a short comma-separated list of things to avoid, including face morphing, identity drift, plastic or smoothed skin, a staring face with no blinking, exaggerated mouth movement, lip sync drift, flickering teeth, warping background, flickering light, subtitles or on-screen text, watermarks" +
        (g.rantai ? ", a jump or pose reset at the first frame" : "") +
        (pegang ? ", the product changing shape or label, fingers passing through the product, the product covering the face." : "."),
      "Do not package the answer as a .md, .docx, or .pdf file. Show everything directly in the chat.",
      "</format_output>",
      "",
      "<guardrail>",
      "1. If no image is attached to this message, do not write any prompt. Reply only with: Lampirkan dulu gambar karakter final, lalu kirim ulang prompt ini." +
        (pegang
          ? " If only one image is attached and it does not clearly show the product, reply only with: Lampirkan juga foto produk sebagai gambar kedua, lalu kirim ulang prompt ini."
          : ""),
      "2. Keep the character an adult, as in the image, in modest clothing.",
      "3. Do not identify, name, or guess who the person is, and do not mention any celebrity, podcast show, or channel name.",
      "4. No subtitles, captions, on-screen text, logos, or watermarks in the video" +
        (pegang ? ", except the product's own label exactly as in the product photo" : "") +
        ". Subtitles are added later in editing.",
      "5. Do not ask me anything, except in the case of rule 1.",
      "</guardrail>",
      "",
      "Self-check before answering: an image is attached; the dialogue of all clips joined in order equals the script verbatim with no timestamps, no bracketed directions, and no changed, added, or dropped words; bracketed directions, if any, are followed in Performance and Audio; " +
        g.cek +
        "; the identity, set, and voice descriptions are word for word the same in every clip; " +
        k.cek +
        (pegang
          ? "; the product description is word for word the same in every clip, the product never covers the face, and its label follows the product photo"
          : "") +
        (demo
          ? "; there is exactly one short demo at the right moment, described step by step with hand positions, and it shows use, not results"
          : "") +
        "; each prompt has the sections Subject, Scene, Camera, Performance, " +
        (pegang ? "Product, " : "") +
        "Dialogue, Audio, Look, and Avoid in that order; the dialogue appears once in double quotes with the language stated; none of the filler keywords appear; the answer has only the clip labels and their ```text code blocks.",
    ].join("\n");
  }

  const penyusun = { utama: build };
  return penyusun[keluaran]();
}
