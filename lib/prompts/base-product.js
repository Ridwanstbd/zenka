import "server-only";
import { buatDokumen } from "./dokumen";

// Penyusun prompt "base-product". Hanya berjalan di server.
// Prompt ditulis dalam bahasa Inggris karena hasilnya (prompt gambar) juga
// harus berbahasa Inggris; pesan untuk pengguna tetap berbahasa Indonesia.
export function susunBaseProduct(input, keluaran) {
  const document = buatDokumen(input);

  function v(id) {
    return document.getElementById(id).value.trim();
  }

  // Setiap jenis kemasan menentukan isi 3 panel yang berbeda antar produk:
  // kondisi terbuka (f), cara pakai (h), dan close-up isi (i).
  const JENIS = {
    spray: {
      teks: "a spray bottle with a spray head or pump-spray nozzle",
      buka: "the protective cap removed and standing upright beside the bottle, the spray head, actuator, and nozzle hole clearly visible",
      demo: "one hand holding the bottle, the index finger pressing the actuator down, a fine, partly transparent cone of mist spraying sideways out of the nozzle",
      isi: "a macro close-up of the nozzle right after one spray, tiny droplets hanging in the air and a few fine droplets on the backdrop, showing the liquid's true color and clarity",
    },
    "kapsul-botol": {
      teks: "capsules or tablets in a bottle with a screw cap",
      buka: "the cap unscrewed and lying beside the bottle, the open bottle mouth showing the capsules or tablets inside",
      demo: "one hand tilting the open bottle over the open palm of the other hand, two capsules or tablets sliding out of the bottle mouth into the palm",
      isi: "three to five capsules or tablets resting in an open palm, showing their exact color, shape, size, and surface finish",
    },
    "kapsul-strip": {
      teks: "capsules or tablets in a blister strip, sold in an outer box (the box is the main product in the packshots)",
      buka: "the outer box open with one blister strip half pulled out of it",
      demo: "a thumb pushing one capsule or tablet through the foil of the blister strip, the foil torn at that pocket",
      isi: "the blister strip with one or two capsules or tablets lying beside it, showing their exact color, shape, size, and surface finish",
    },
    cairan: {
      teks: "a liquid (such as a syrup, drink, honey, or liquid herbal) in a bottle with a cap",
      buka: "the cap removed and standing beside the bottle, the open bottle mouth visible",
      demo: "one hand tilting the bottle and pouring a thin stream of the liquid into a plain clear measuring spoon held by the other hand",
      isi: "the liquid in a plain clear spoon or a small plain clear glass beside the bottle, showing its true color, clarity, and thickness",
    },
    tetes: {
      teks: "a serum, oil, or drops in a dropper bottle",
      buka: "the dropper lifted out of the bottle and held above the open bottle mouth, the glass pipette partly filled",
      demo: "fingers squeezing the dropper bulb, a single drop forming at the tip of the glass pipette",
      isi: "two or three drops on a fingertip, showing the liquid's true color, clarity, and thickness",
    },
    tube: {
      teks: "a cream, gel, or ointment in a squeeze tube",
      buka: "the cap removed and lying beside the tube, the tube nozzle visible",
      demo: "fingers gently squeezing the tube, a pea-sized amount of the product coming out of the nozzle onto the fingertip of the other hand",
      isi: "a macro close-up of a small amount of the product on a fingertip, showing its texture, color, and shine",
    },
    pot: {
      teks: "a cream, balm, or paste in a jar or pot with a lid",
      buka: "the lid removed and lying beside the jar, the product surface inside visible",
      demo: "one hand holding the open jar while a fingertip of the other hand scoops a small amount of the product",
      isi: "a macro close-up of the scooped product on a fingertip, showing its texture, color, and shine",
    },
    pump: {
      teks: "a lotion, soap, or liquid in a pump bottle",
      buka: "the pump head unlocked in the up position, ready to press, the nozzle visible",
      demo: "one hand pressing the pump head, a small amount of the product dispensed into the cupped palm of the other hand",
      isi: "the dispensed product in a palm, showing its texture, color, and thickness",
    },
    bubuk: {
      teks: "a powder in a sachet or pouch",
      buka: "the sachet or pouch torn open along its tear notch, the powder visible at the opening",
      demo: "one hand pouring the powder from the open sachet into a plain clear glass of water",
      isi: "a small mound of the powder on a plain spoon beside the sachet, showing its grain size and color",
    },
    "roll-on": {
      teks: "a roll-on bottle (such as an oil or a liquid balm)",
      buka: "the cap removed and lying beside the bottle, the roller ball visible",
      demo: "one hand rolling the roller ball across the inner wrist of the other arm, leaving a thin glossy line of liquid on the skin",
      isi: "a macro close-up of the roller ball coated with a thin film of the liquid, with the glossy line on the skin behind it",
    },
    lainnya: {
      teks: "the packaging type described in my notes and shown in the photos",
      buka: "the product opened or in its ready-to-use state, any cap or lid placed beside it",
      demo: "hands performing the main step of using the product, the way it is really used",
      isi: "a macro close-up of the product's contents or working part, showing its true color and texture",
    },
  };

  function build() {
    const j = JENIS[v("jenis")] || JENIS.lainnya;
    const nama = v("nama");
    const ukuran = v("ukuran");
    const isi = v("isi");
    const catatan = v("catatan");
    return [
      "<role>",
      "Act as an expert AI image prompt engineer and professional e-commerce product photographer. You specialize in product photos that are indistinguishable from real, unedited studio photographs, and in building consistent product reference sheets that keep a real product identical across all AI-generated content.",
      "</role>",
      "",
      "<input>",
      "Product photos: attached to this message. They show my real product from one or more angles.",
      "Packaging type: " + j.teks + ".",
      "Product name and brand: " + (nama || "not given, read it from the label in the photos") + ".",
      "Real size: " + (ukuran || "not given, estimate it from the packaging type and the photos") + ".",
      "Contents and texture: " + (isi || "not given, use what the photos show") + ".",
      ...(catatan ? ["Extra notes from me (may be written in Indonesian, translate them to English): " + catatan] : []),
      "</input>",
      "",
      "<task>",
      "Study the attached product photos and my details, then write a detailed, hyper-realistic image generation prompt for a PRODUCT REFERENCE SHEET. This sheet becomes the master reference for my product in all future content, including videos where a character holds and demonstrates it, so the product must be identical in every panel and identical to the real product in the photos.",
      "Work through <product>, <sheet>, and <realism> internally, then answer only in the format in <format_output>.",
      "</task>",
      "",
      "<product>",
      "1. If the photos clearly show a different packaging type than the one I selected, follow the photos.",
      "2. Describe the product precisely from the photos, part by part: overall shape and proportions (height to width), real size in cm or ml, the material and finish of each part (body, cap or closure, label), exact colors with concrete names (e.g., deep forest green, matte off-white) and where each color sits, the closure type, transparency and fill level, and any embossing or special print such as metallic foil.",
      "3. Label: describe the layout (where the logo, brand name, product name, icons, and color blocks sit). Quote the brand name and any large, clearly legible label text exactly as printed, letter by letter, inside double quotes in the prompt (e.g., the label reads \"BRAND\" in bold white capitals). Describe small print as small lines of fine print. Never invent words.",
      "4. This is my real product, so it must look exactly like the photos. Do not redesign, restyle, recolor, simplify, or improve it. Do not add any text, claim, badge, certification mark, or logo that is not on the real product, and do not remove anything that is.",
      "5. Parts not shown in any photo (such as the back or the contents): use my details if I gave them. Otherwise choose the plainest, most typical look for this packaging type, keep the same colors and design language, and add no readable text.",
      "6. Use concrete visual words. Never use vague praise words such as premium, luxurious, elegant, sleek, beautiful, or perfect. They push image models toward a generic advertising render.",
      "</product>",
      "",
      "<sheet>",
      "1. Frame the image as a product reference sheet: 9 real studio photographs of the same physical product, arranged in a 3x3 grid in one square 1:1 image, on a seamless light-gray paper backdrop, with thin clean equal gaps between panels.",
      "2. Top row, from left to right in this exact order, the closed product standing upright on its base (or lying flat if it cannot stand), camera at the product's mid-height:",
      "   a. Front view: front label square to the camera, centered.",
      "   b. Three-quarter view: the product rotated about 45 degrees, showing the front label and its right side.",
      "   c. Side view: the product rotated 90 degrees, a true side profile showing its silhouette and depth.",
      "3. Middle row, from left to right in this exact order:",
      "   d. Back view: the product rotated 180 degrees, the back of the product square to the camera.",
      "   e. High-angle view: the camera about 45 degrees above the product, showing the top of the closure and the product's 3D shape.",
      "   f. Opened state: " + j.buka + ".",
      "4. Bottom row, from left to right in this exact order, hand panels:",
      "   g. In hand: one hand holding the closed product naturally with a correct, relaxed grip, front label facing the camera, showing the product's true size against the hand.",
      "   h. In use: " + j.demo + ".",
      "   i. Contents close-up: " + j.isi + ".",
      "5. Name all 9 views and their angles explicitly in the prompt. Image models often mirror, repeat, or skip views, or draw the wrong number of panels, when the layout is vague.",
      "6. The same product in all 9 panels, as if one physical product stood on a turntable and was then picked up: the same shape, colors, materials, label, and size. In panels a to e the product has the same scale, fills about 75% of the panel height, and stands on the same baseline.",
      "7. Hands: the same pair of natural adult hands in every hand panel, with a medium warm skin tone, short clean nails, no nail polish, no rings, watches, or bracelets. Show only hands and forearms, never a face or body. The product's size against the hand matches its real size.",
      "8. Props only where a panel needs them (such as a spoon or a glass), plain, clear, and unbranded. No other objects, plants, or decorations.",
      "9. No text, labels, view names, numbers, captions, or watermarks anywhere in the image, except what is printed on the product itself.",
      "</sheet>",
      "",
      "<realism>",
      "These details make the result look like a real photograph of a real product. Put them in the prompt using physical, photographic language:",
      "1. Camera: shot on a full-frame camera with a 100mm macro lens for every panel (no wide-angle distortion), f/11 for panels a to f and f/8 for the hand panels, ISO 100, sharp focus across the whole product, true-to-life colors, unretouched RAW photo look, subtle natural sensor grain.",
      "2. Lighting: two large softboxes at the left and right and a soft overhead diffuser, giving even light, clean specular highlights along the product's edges that reveal its material, and a soft natural contact shadow under the product. No dramatic, cinematic, neon, or colored light.",
      "3. Materials: real material behavior, such as glass thickness and refraction, the slight surface texture of plastic, the matte grain of cardboard, the sheen of metallic foil, the edge of a label sticker, and the fine print texture of the label. One or two tiny real-world imperfections such as a faint dust speck or a micro-scratch, kept subtle.",
      "4. Contents: liquids, creams, powders, mist, capsules, and tablets follow real physics, such as gravity, thickness, translucency, and reflections. Capsules show a real gelatin sheen, tablets a real matte surface.",
      "5. Hands: anatomically correct with five fingers each, real skin texture with visible pores and knuckle creases, fingertips pressing slightly into the product for a believable grip, and no fingers passing through the product.",
      "6. Do not use filler keywords such as 8k, 4k, ultra HD, masterpiece, best quality, photorealistic, hyperrealistic, octane render, Unreal Engine, 3D packshot, mockup, or cinematic lighting. They push image models toward a polished CGI render. Describe the result as a real photograph instead.",
      "</realism>",
      "",
      "<format_output>",
      "Answer in exactly this order, with no other text before, between, or after:",
      "1. The line PROMPT UTAMA, then one ```text code block with the main prompt in English: 300-450 words of flowing sentences (not a keyword list), in this order: shot type and layout (all three rows and all 9 views in order, each with its angle) → product type and real size → shape and materials → colors → closure → label layout with the quoted label text → hands → opened state, use, and contents details → lighting → camera → material and realism details → background → consistency and no-extra-text rule → one closing sentence that starts with \"Avoid:\" and lists the 8-10 most important things to avoid.",
      "2. The line NEGATIVE PROMPT, then one ```text code block with the full negative prompt in English, comma-separated. Include at least: CGI, 3D render, product mockup, illustration, cartoon, plastic-looking render, redesigned packaging, changed logo, wrong colors, misspelled brand name, garbled label text, invented text, mirrored label, extra logos, different product between panels, inconsistent size, inconsistent label, duplicate panels, wrong view angle, missing view, extra panels, floating product, missing shadow, extra fingers, deformed hands, fused fingers, fingers passing through the product, unrealistic liquid, melting product, oversaturated colors, HDR look, dramatic shadows, colored lighting, cluttered background, branded props, face, people, text, captions, watermark.",
      "3. The line ANCHOR PRODUK, then one ```text code block with one English paragraph of 50-70 words containing the fixed product description: packaging type, real size, shape, colors, materials, closure, label layout with the quoted brand name, and what the contents look like. I will paste it into every future image or video prompt that shows this product, together with the product sheet image, so the product stays consistent.",
      "Do not package the answer as a .md, .docx, or .pdf file. Show everything directly in the chat.",
      "</format_output>",
      "",
      "<guardrail>",
      "1. If no image is attached to this message, do not write any prompt. Reply only with: Lampirkan dulu foto produk (minimal tampak depan dengan label terlihat), lalu kirim ulang prompt ini.",
      "2. If the photos show more than one different product, use only the product in the first photo.",
      "3. No people other than hands and forearms. No face anywhere in the image.",
      "4. The use panel shows normal use only: no results, no before-and-after, no health or benefit claims, and no medical scenes.",
      "5. Do not ask me anything, except in the case of rule 1.",
      "</guardrail>",
      "",
      "Self-check before answering: a product photo is attached; the product description follows the photos and adds or removes nothing; the brand name and large label text are quoted exactly with no invented words; the layout has exactly 9 panels in a 3x3 grid: a top row of front, three-quarter, side; a middle row of back, high angle, opened state; a bottom row of in hand, in use, contents close-up; the opened state, use, and contents panels fit the packaging type; product, size, and label are the same in all 9 panels and the hands are the same in every hand panel; the camera, lighting, material, contents, and hand details from <realism> are present; none of the filler keywords in <realism> point 6 appear; the main prompt ends with an \"Avoid:\" sentence; the answer is exactly 3 labels with 3 ```text code blocks and no other text.",
    ].join("\n");
  }

  const penyusun = { utama: build };
  return penyusun[keluaran]();
}
