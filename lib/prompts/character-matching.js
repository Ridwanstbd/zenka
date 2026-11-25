import "server-only";
import { buatDokumen } from "./dokumen";

// Penyusun prompt "character-matching". Hanya berjalan di server.
// Prompt ditulis dalam bahasa Inggris karena hasilnya (prompt gambar) juga
// harus berbahasa Inggris; pesan untuk pengguna tetap berbahasa Indonesia.
export function susunCharacterMatching(input, keluaran) {
  const document = buatDokumen(input);

  function v(id) {
    return document.getElementById(id).value.trim();
  }

  const PAKAIAN = {
    image1: {
      teks: "Image 1 (keep the base character's outfit).",
      aturan:
        "Outfit: keep the exact outfit from Image 1 (same garments, colors, fabric, and fit). Do not copy the clothes of the person in Image 2.",
      cek: "the outfit follows Image 1",
    },
    image2: {
      teks: "Image 2 (use the outfit worn in the reference).",
      aturan:
        "Outfit: dress the character in the outfit worn in Image 2 (same garment types, colors, and fabric), fitted naturally to the build from Image 1. If Image 2 shows no person, keep the outfit from Image 1.",
      cek: "the outfit follows Image 2, or Image 1 when Image 2 shows no person",
    },
  };

  function build() {
    const p = PAKAIAN[v("pakaian")] || PAKAIAN.image1;
    const anchor = v("anchor");
    return [
      "<role>",
      "Act as an expert AI image prompt engineer and professional portrait photographer. You specialize in identity-consistent, hyper-realistic photos of people that are indistinguishable from a real, unedited photograph.",
      "</role>",
      "",
      "<input>",
      "I have attached two images.",
      "Image 1 (the first attached image): my fixed base character. It may be a multi-panel character sheet. It is the ONLY source for the face, hair, skin, and body.",
      "Image 2 (the second attached image): the reference for the new pose, camera angle, and environment, a podcast talking-head setup. It is the ONLY source for the pose, framing, camera, background, and lighting.",
      ...(anchor ? ["Character anchor (fixed identity text of my base character): " + anchor] : []),
      "Outfit source: " + p.teks,
      "</input>",
      "",
      "<task>",
      "Write ONE precise image generation prompt that keeps the exact facial identity, hair, and features of the person in Image 1, but places them into the pose, camera angle, and podcast studio background shown in Image 2. The result must be a single photograph, not a character sheet or a collage.",
      "Work through <identity>, <scene>, and <realism> internally, then answer only in the format in <format_output>.",
      "</task>",
      "",
      "<identity>",
      "1. Open the prompt by assigning the roles: Image 1 is the identity reference, Image 2 is the pose and scene reference.",
      "2. Describe the person from Image 1 feature by feature: exact age, gender, ethnicity; face shape; eyebrows; eyes (shape, eyelid type, iris color); nose; lips; cheekbones; jawline and chin; skin tone with its undertone; moles, freckles, or other marks with their exact location; hair (length, texture, color, cut, parting); facial hair; build. If Image 1 has several panels, read each feature from the panel whose head angle is closest to Image 2.",
      ...(anchor
        ? ["   Use the character anchor word for word as the core of this description, then add any detail visible in Image 1 that the anchor misses. If they conflict, Image 1 wins."]
        : []),
      "3. State explicitly that the face must match Image 1 exactly and must not blend with, borrow from, or be influenced by any person in Image 2. Take nothing from the person in Image 2 except the pose: not their face, hair, skin tone, body build, age, or tattoos.",
      "4. Use concrete visual words. Never use vague praise words such as beautiful, handsome, pretty, perfect, flawless, or attractive.",
      "5. " + p.aturan,
      "</identity>",
      "",
      "<scene>",
      "1. Pose from Image 2: body orientation, posture, head tilt and turn, gaze direction, hand and arm placement, and how the person relates to the microphone and desk. If Image 2 shows no person, use a natural seated talking-head pose: seated at the desk, upper body facing the camera, forearms resting on the desk, gaze into the lens.",
      "2. Camera from Image 2: shot size (e.g., medium close-up from mid-chest up), camera height and vertical angle, horizontal angle, subject position in the frame, lens feel, depth of field, and orientation with aspect ratio (e.g., 16:9 landscape or 9:16 vertical).",
      "3. Environment from Image 2: describe the podcast set item by item: microphone type and boom arm, headphones if present, desk surface, chair, acoustic panels, shelves, plants, lamps, practical lights, wall color and texture, and what sits out of focus behind the subject. Describe equipment generically (e.g., a black dynamic broadcast microphone on a boom arm), never by brand name.",
      "4. Expression: a natural mid-conversation expression, relaxed face, lips gently parted or softly closed, eyes alive and engaged, like a real frame from a podcast video. No posed commercial smile.",
      "5. The microphone sits in front of the mouth at a natural distance and angle, but never covers the face.",
      "</scene>",
      "",
      "<realism>",
      "These details make the result look like a real human in a real room. Put them in the prompt using physical, photographic language:",
      "1. Lighting match: the person is lit by the same light sources as the scene in Image 2, with the same direction, softness, and color temperature, matching shadows, light spill from the practical lights, and a realistic catchlight in each eye. The person must not look pasted into the background.",
      "2. Camera: a real camera (e.g., full-frame camera, 35mm or 50mm lens, f/2.8, sharp focus on the eyes, soft natural background blur), true-to-life colors, unretouched RAW photo look, and the same subtle sensor grain on the person and the background.",
      "3. Skin: real, unretouched texture with visible pores, fine vellus hair, subtle uneven tone, slight natural redness around the nose, a light natural sheen under the studio lights, and the moles or marks from Image 1 in the same places.",
      "4. Eyes and hair: detailed iris patterns, a natural wet waterline, individual hair strands, a natural hairline with baby hairs, and a few flyaway strands.",
      "5. Body and contact: anatomically correct hands with five fingers, realistic contact shadows where the arms and hands touch the desk, and correct scale between the person, the microphone, and the furniture.",
      "6. Do not use filler keywords (8k, ultra HD, masterpiece, photorealistic, hyperrealistic, octane render, Unreal Engine, cinematic lighting); they push models toward a CGI look. Describe a real photograph instead.",
      "</realism>",
      "",
      "<format_output>",
      "Output only the final optimized prompt: exactly one ```text code block, with no label, no explanation, and no other text before or after it.",
      'Inside it: the prompt in English, 200-300 words of flowing sentences (not a keyword list), in this order: image roles (Image 1 identity, Image 2 pose and scene) → identity details → outfit → pose and expression → camera and framing → podcast set → lighting → realism details → one closing sentence that starts with "Avoid:" and lists 8-10 things to avoid, including: changing the face, blending the face with the person in Image 2, plastic or airbrushed skin, CGI look, deformed hands, the microphone covering the face, mismatched lighting between the person and the background, text, watermarks, logos.',
      "Do not create a file; show it directly in the chat.",
      "</format_output>",
      "",
      "<guardrail>",
      "1. If fewer than 2 images are attached to this message, do not write any prompt. Reply only with: Lampirkan dulu 2 gambar, yaitu Gambar 1 base character dan Gambar 2 image reference, lalu kirim ulang prompt ini.",
      "2. Keep the character an adult, as in Image 1.",
      "3. Do not identify, name, or guess who appears in either image, and do not mention any celebrity, podcast show, or channel name.",
      "4. Modest everyday clothing. No nudity, and no suggestive poses or outfits.",
      "5. No brand names, logos, or readable text on the clothes, the equipment, or the background.",
      "6. Do not ask me anything, except in the case of rule 1.",
      "</guardrail>",
      "",
      "Self-check before answering: 2 images are attached; the prompt names Image 1 as the identity source and Image 2 as the pose and scene source; every facial feature from Image 1 is described with concrete words; nothing about the face, hair, or body comes from the person in Image 2; " +
        p.cek +
        '; the pose, camera, framing, aspect ratio, podcast set, and lighting follow Image 2; the person is lit like the scene; the microphone does not cover the face; none of the filler keywords appear; the prompt ends with an "Avoid:" sentence; the answer is exactly one ```text code block with no other text.',
    ].join("\n");
  }

  const penyusun = { utama: build };
  return penyusun[keluaran]();
}
