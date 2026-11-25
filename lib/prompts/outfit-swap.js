import "server-only";
import { buatDokumen } from "./dokumen";

// Penyusun prompt "outfit-swap". Hanya berjalan di server.
// Prompt ditulis dalam bahasa Inggris karena hasilnya (prompt gambar) juga
// harus berbahasa Inggris; pesan untuk pengguna tetap berbahasa Indonesia.
export function susunOutfitSwap(input, keluaran) {
  const document = buatDokumen(input);

  function v(id) {
    return document.getElementById(id).value.trim();
  }

  const KEMIRIPAN = {
    persis: {
      teks: "exact copy of the garment in Image 2.",
      aturan:
        "Copy the garment from Image 2 as closely as possible: same garment type, exact color, fabric, pattern, cut, collar, closures, pockets, and details (except logos and readable text, see <guardrail>).",
      cek: "the garment copies Image 2 closely",
    },
    gaya: {
      teks: "match the style and type of the garment in Image 2.",
      aturan:
        "Match the style and type of the garment in Image 2: same garment type, color family, fabric type, and overall look. Small details such as pocket shape or button count may differ.",
      cek: "the garment matches the style and type of Image 2",
    },
  };

  // Cakupan ganti: hanya atasan (bawaan) atau semua pakaian termasuk bawahan.
  const CAKUPAN = {
    atas: {
      teks: "upper body only. Replace only the top and any outer layer; the bottoms from Image 1 stay exactly the same.",
      tetap: " the bottoms (trousers, jeans, skirt, or shorts),",
      aturan:
        "Upper-body swap only: replace the top and any outer layer with the ones from Image 2. If Image 2 shows only an outer layer (jacket, blazer, cardigan, overshirt), put it over the inner top from Image 1 and keep that inner top unless it clashes with the new layer. Keep the bottoms (trousers, jeans, skirt, or shorts) from Image 1 exactly as they are, even if Image 2 shows other bottoms.",
      detail: "",
      lipatan: "",
      tepi: "neckline, collar, and wrists",
      kata: "240-340",
      hindari: "changing the trousers or skirt",
      cek: "only the upper-body clothing changes and the bottoms stay the same as Image 1",
    },
    semua: {
      teks: "the full outfit. Replace ALL clothing in Image 1 with the clothing from Image 2, including the bottoms (trousers, jeans, skirt, or shorts) when Image 2 shows them.",
      tetap: "",
      aturan:
        "Full outfit swap: replace every garment in Image 1 with its counterpart from Image 2: the top, any outer layer, and the bottoms (trousers, jeans, skirt, or shorts). If Image 2 shows bottoms, the bottoms in Image 1 MUST change to them; never keep the old bottoms in that case. If Image 2 shows no bottoms, keep the bottoms from Image 1 unchanged and do not invent new ones. If Image 2 shows only an outer layer on top, put it over the inner top from Image 1 and keep that inner top unless it clashes with the new layer. Change the bottoms only where they are visible in Image 1: never extend the frame downward to show more of the body (only the small zoom-out in <clarity> rule 4 may widen the top and sides), and keep the desk and anything in front of the legs.",
      detail: " For the bottoms, also describe the waistband, rise, leg shape (straight, tapered, wide), length, and hem.",
      lipatan: " For the bottoms: creases across the lap and hips, fabric bunching behind the knees, and hems that fall naturally for a seated pose.",
      tepi: "neckline, collar, wrists, waistband, and hems",
      kata: "260-360",
      hindari: "the old bottoms from Image 1 remaining when Image 2 shows bottoms",
      cek: "every garment that Image 2 shows replaces its counterpart in Image 1, including the bottoms when Image 2 shows them (the Image 1 bottoms are kept only if Image 2 has none), and the framing is not extended downward",
    },
  };

  function build() {
    const k = KEMIRIPAN[v("kemiripan")] || KEMIRIPAN.persis;
    const c = document.getElementById("bawahan").checked ? CAKUPAN.semua : CAKUPAN.atas;
    const anchor = v("anchor");
    return [
      "<role>",
      "Act as an expert AI image prompt engineer, professional photo retoucher, and fashion stylist. You specialize in photo edits that are indistinguishable from a real, unedited photograph, with clothing that looks physically worn by a real person.",
      "</role>",
      "",
      "<input>",
      "I have attached two images.",
      "Image 1 (the first attached image): my character, already posed in a podcast setting. Everything in it stays the same except the clothing and the limited adjustments in <clarity>.",
      "Image 2 (the second attached image): the reference clothing/wardrobe. It is the ONLY source for the new clothing.",
      ...(anchor ? ["Character anchor (fixed identity text of my character): " + anchor] : []),
      "Clothing match level: " + k.teks,
      "Swap scope: " + c.teks,
      "</input>",
      "",
      "<task>",
      "Write ONE image generation prompt that performs an outfit swap as an edit of Image 1: keep the exact face, facial expression, pose, and background environment from Image 1, but change the clothing to the outfit from Image 2, following the swap scope in <input>. Also make sure the result passes the rules in <clarity> for a clear subject, bright light, background contrast, and frame margins. The new clothing must blend seamlessly and have realistic fabric textures, as if the person had been photographed wearing it.",
      "Work through <keep>, <outfit>, <clarity>, and <realism> internally, then answer only in the format in <format_output>.",
      "</task>",
      "",
      "<keep>",
      "1. Open the prompt by framing it as an edit: Image 1 is the photo to edit, Image 2 is the clothing reference, and only the clothing changes, apart from any adjustment <clarity> requires.",
      "2. List what stays the same as Image 1 (lighting, background tones, and framing change only as far as <clarity> allows): face and identity, facial expression and mouth shape, gaze direction, hair (including strands that fall over the collar or shoulders), skin tone and texture, body shape, pose and hand positions," + c.tetap + " accessories such as headphones or a watch, the microphone and boom arm, the desk and everything in front of the body, the background, lighting, camera angle, framing, crop, aspect ratio, depth of field, color grade, and grain.",
      "3. Briefly describe the person in Image 1 (age, gender, ethnicity, key facial features, hair) so the model locks the identity." +
        (anchor ? " Use the character anchor word for word for this description. If it conflicts with Image 1, Image 1 wins." : ""),
      "4. Take nothing from any person in Image 2: not their face, hair, skin, body, pose, or background.",
      "</keep>",
      "",
      "<outfit>",
      "1. Describe the garment(s) from Image 2 precisely: garment type, exact color (a specific shade name, e.g., deep olive green), fabric and its weight (e.g., heavyweight cotton twill, washed denim, soft lambswool knit, matte nylon), surface texture (weave, knit, grain, nap), pattern and its scale, neckline or collar, closures (zipper, number of buttons), pockets, seams and stitching, cuffs and hem, fit (slim, regular, relaxed, oversized), and length." + c.detail,
      "2. " + k.aturan,
      "3. " + c.aturan,
      "4. Fit the garment to the body and pose in Image 1: natural drape for a seated pose, folds at the elbows and inner arms, compression wrinkles at the waist, slight tension across the shoulders and back, and a collar that sits naturally around the neck." + c.lipatan,
      "5. Correct overlaps: hair, headphone cables, the microphone, and the hands stay in front of the garment wherever they are in Image 1. The garment never passes through the body, the chair, or the equipment.",
      "</outfit>",
      "",
      "<clarity>",
      "These are the ONLY adjustments allowed to the lighting, background, and framing of Image 1. Check Image 1 against each rule: if it already passes, keep that part exactly as it is; if not, make the smallest change that passes, and describe it in the prompt.",
      "1. Clear subject: the character is the first thing the eye goes to. The face is sharp and unobstructed, nothing bright, busy, or high-contrast sits right behind the head, and no object appears to grow out of the head or shoulders.",
      "2. Bright light: a well-lit, bright exposure. If Image 1 is dim or the face is muddy, raise the exposure and add soft fill while keeping the same light direction and color temperature. Both eyes and the shadow side of the face stay clearly visible. No clipped highlights on the skin or on light materials, no crushed blacks, and no flat washed-out look.",
      "3. Background contrast: judge the outfit's main color and whether it is light, medium, or dark. The area behind the head, shoulders, and torso must clearly differ from it in brightness, and in color where it looks natural. If it does not, change only the tone or color of the wall, panels, or chair behind the character: lighter behind a dark outfit, a deeper but still well-lit tone behind a light outfit, clearly lighter or deeper behind a medium outfit. The layout and every object stay where they are. The garment color follows <outfit> and is never changed to get contrast. The hair also stays distinct from what is behind it. The separation comes from tone, light, and depth of field, never from an outline or glow.",
      "4. Frame margins: clear space above the top of the hair (about 8-12% of the frame height) and on both sides (at least 10% of the frame width between each side edge and the nearest shoulder, elbow, or hand). If Image 1 is tighter than this, zoom out slightly: keep the aspect ratio and camera angle, make the character a little smaller, and continue the same room naturally into the new space at the top and sides, rebuilding any cut-off hair or shoulder consistently with the rest. Never extend the frame downward to show more of the body; the bottom edge may crop the body or desk as it does in Image 1.",
      "</clarity>",
      "",
      "<realism>",
      "These details make the edit look like a real photo, not a composite. Put them in the prompt using physical, photographic language:",
      "1. Lighting match: the new garment is lit by the same lights as the final photo (Image 1, with any brightening from <clarity>), with the same direction, softness, color temperature, shadows, and color spill from the room. The material reacts to light correctly (e.g., soft highlights on leather, a matte surface on cotton, a slight sheen on satin).",
      "2. Seamless edges: natural transitions at the " + c.tepi + ", with no halo, outline, or hard cut edge, and soft contact shadows where the fabric touches the skin and the chair.",
      "3. Fabric detail: visible weave or knit, fine stitching, slight lint and natural wear, realistic thickness at the hems and seams, and buttons or zipper teeth at a realistic scale.",
      "4. Photo match: the garment has the same sharpness, focus, sensor grain, and color grade as the rest of the photo, as if it came from the same camera in the same moment.",
      "5. Do not use filler keywords (8k, ultra HD, masterpiece, photorealistic, hyperrealistic, octane render, Unreal Engine, cinematic lighting); they push models toward a CGI look. Describe a real photograph instead.",
      "</realism>",
      "",
      "<format_output>",
      "Output only the final optimized prompt: exactly one ```text code block, with no label, no explanation, and no other text before or after it.",
      "Inside it: the prompt in English, " + c.kata + ' words of flowing sentences (not a keyword list), in this order: edit framing (Image 1 to edit, Image 2 clothing reference, the clothing change, and the swap scope) → what stays the same → clarity adjustments (clear subject, bright light, background contrast, frame margins) → short identity description → new garment details → fit and drape on the pose → overlaps → lighting and material response → edges and photo match → one closing sentence that starts with "Avoid:" and lists 10-14 things to avoid, including: changing the face or expression, changing the pose, replacing the background or its objects, ' + c.hindari + ", painted-on or flat clothing, plastic-looking fabric, a halo or hard edges around the clothes, clothing passing through the body or the microphone, mismatched lighting on the clothes, a dim or underexposed face, blown-out highlights, a background that blends into the clothes, the head, shoulders, or hands touching or cut off by the top or side edges, logos, text, watermarks.",
      "Do not create a file; show it directly in the chat.",
      "</format_output>",
      "",
      "<guardrail>",
      "1. If fewer than 2 images are attached to this message, do not write any prompt. Reply only with: Lampirkan dulu 2 gambar, yaitu Gambar 1 karakter yang sudah berpose dan Gambar 2 referensi pakaian, lalu kirim ulang prompt ini.",
      "2. Keep the character an adult, as in Image 1.",
      "3. Do not identify, name, or guess who appears in either image, and do not mention any celebrity name.",
      "4. Modest clothing only. If the clothing in Image 2 is revealing, adapt it into a modest version of the same style.",
      "5. No brand names, logos, or readable text. If the garment in Image 2 has a logo, brand name, or printed text, replace it with plain fabric of the same color and describe the garment generically.",
      "6. Do not ask me anything, except in the case of rule 1.",
      "</guardrail>",
      "",
      "Self-check before answering: 2 images are attached; the prompt is framed as an edit of Image 1 where the clothing changes; the face, expression, pose, hair, accessories, and microphone stay the same as Image 1; the background, lighting, and framing change only as far as <clarity> allows; the face is sharp, unobstructed, and brightly lit; the background behind the head and torso clearly differs in brightness from the new outfit; the top and side margins pass <clarity> rule 4; " +
        c.cek +
        "; " +
        k.cek +
        '; nothing comes from any person in Image 2; the garment fits the seated pose with natural folds and correct overlaps; lighting on the clothes matches the final photo, and edges, sharpness, and grain match Image 1; no logos or readable text; none of the filler keywords appear; the prompt ends with an "Avoid:" sentence; the answer is exactly one ```text code block with no other text.',
    ].join("\n");
  }

  const penyusun = { utama: build };
  return penyusun[keluaran]();
}
