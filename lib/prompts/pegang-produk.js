import "server-only";
import { buatDokumen } from "./dokumen";

// Penyusun prompt "pegang-produk". Hanya berjalan di server.
// Prompt ditulis dalam bahasa Inggris karena hasilnya (prompt gambar) juga
// harus berbahasa Inggris; pesan untuk pengguna tetap berbahasa Indonesia.
export function susunPegangProduk(input, keluaran) {
  const document = buatDokumen(input);

  function v(id) {
    return document.getElementById(id).value.trim();
  }

  const CARA = {
    satu: {
      teks: "held in one hand at chest height.",
      pose: "Only the arm and hand that hold the product may change position. The other arm and hand stay exactly as in Image 1.",
      aturan:
        "Position: the character holds the product naturally in one hand at chest height, slightly to the side of the body, front label turned toward the camera in a relaxed way, never pushed toward the lens. Use the hand that changes the pose the least.",
      cek: "the product is held in one hand at chest height, slightly to the side",
    },
    dua: {
      teks: "held with both hands in front of the chest.",
      pose: "Only both arms and hands may change position to hold the product. Everything else stays exactly as in Image 1.",
      aturan:
        "Position: the character holds the product with both hands in front of the chest, slightly lower than the chin, front label turned toward the camera, as if showing it during a conversation. One hand supports the base, the other steadies the side.",
      cek: "the product is held with both hands in front of the chest",
    },
    meja: {
      teks: "standing on the desk in front of the character, within reach.",
      pose: "The pose stays exactly as in Image 1, including both arms and hands.",
      aturan:
        "Position: the product stands upright on the desk in front of the character, within arm's reach and on the side of the free hand, front label turned toward the camera. It is fully visible and is not hidden by the microphone, the hands, or other objects.",
      cek: "the product stands on the desk within reach, fully visible, and the pose is unchanged",
    },
  };

  function build() {
    const c = CARA[v("cara")] || CARA.satu;
    const anchor = v("anchor");
    const anchorProduk = v("anchorProduk");
    const diTangan = v("cara") !== "meja";
    return [
      "<role>",
      "Act as an expert AI image prompt engineer, professional photo retoucher, and commercial product photographer. You specialize in photo edits that are indistinguishable from a real, unedited photograph, with products that look physically held by a real person in the room.",
      "</role>",
      "",
      "<input>",
      "I have attached two or three images.",
      "Image 1 (the first attached image): my character, already posed and dressed in a podcast setting. Everything in it stays the same except what the product placement needs and the limited adjustments in <clarity>.",
      "Image 2 (the second attached image): a product reference sheet of my real product with 9 panels (front, three-quarter, side, back, high angle, opened state, in hand, in use, contents close-up). It is the reference for the product's shape, size, colors, material, and label from every side. The in-hand panel shows the correct size of the product against a hand.",
      "Image 3 (optional, the third attached image): a real photo of my product. If it is attached, it wins over Image 2 for the label text, logo, and colors.",
      ...(anchorProduk ? ["Product anchor (fixed description text of my product): " + anchorProduk] : []),
      ...(anchor ? ["Character anchor (fixed identity text of my character): " + anchor] : []),
      "Product placement: " + c.teks,
      "</input>",
      "",
      "<task>",
      "Write ONE image generation prompt that adds my product to Image 1 as an edit: keep the exact face, facial expression, outfit, background, and lighting from Image 1, and place one unit of the product from Image 2 " +
        (diTangan ? "in the character's hand" : "on the desk in front of the character") +
        ", with the correct size, " +
        (diTangan ? "a natural grip, " : "") +
        "and its real label, as if it had been there when the photo was taken. Also make sure the result passes the rules in <clarity> for a clear subject, bright light, background contrast, and frame margins.",
      "Work through <keep>, <product>, <clarity>, and <realism> internally, then answer only in the format in <format_output>.",
      "</task>",
      "",
      "<keep>",
      "1. Open the prompt by framing it as an edit: Image 1 is the photo to edit, Image 2 is the product reference" +
        " (and Image 3 the real product photo, if attached), and only the product placement changes, apart from any adjustment <clarity> requires.",
      "2. " + c.pose,
      "3. List what stays the same as Image 1 (lighting, background tones, and framing change only as far as <clarity> allows): face and identity, facial expression and mouth shape, gaze direction, hair, skin tone and texture, body shape, the outfit, accessories such as headphones or a watch, the microphone and boom arm, the desk, the background, lighting, camera angle, framing, crop, aspect ratio, depth of field, color grade, and grain.",
      "4. Briefly describe the person in Image 1 (age, gender, ethnicity, key facial features, hair, outfit) so the model locks the identity." +
        (anchor ? " Use the character anchor word for word for this description. If it conflicts with Image 1, Image 1 wins." : ""),
      "5. The result is one single photo like Image 1, not a grid, a sheet, or several panels. Take nothing from Image 2 except the product itself: not its gray backdrop, its hands, its props, or its layout.",
      "</keep>",
      "",
      "<product>",
      "1. Describe the product precisely" +
        (anchorProduk ? ", using the product anchor word for word" : " from Image 2") +
        ": packaging type, real size, shape, colors, materials, closure, and label layout. Quote the brand name exactly as printed, inside double quotes. If anything conflicts with the product images, the images win.",
      "2. Exactly one unit of the product, closed, in the same form as the front view in Image 2. Its label and logo stay exactly as in the product images, because this is my product. Do not redesign it, invent text on it, or add any other logo.",
      "3. " + c.aturan,
      "4. Size: the product's size against the hand and the body matches the in-hand panel of Image 2 and its real size. Not larger or smaller.",
      ...(diTangan
        ? [
            "5. Grip: the fingers wrap around the product with a correct, relaxed grip, the thumb on the front edge and the fingers behind it, placed so the brand name stays visible. Fingertips press slightly into the product, and its weight shows in the wrist.",
            "6. The product never covers the mouth, the face, or the microphone, and it stays in the same focus plane as the hand.",
          ]
        : ["5. The product sits flat on the desk surface with a soft contact shadow under it, and it never covers the mouth, the face, or the microphone."]),
      "</product>",
      "",
      "<clarity>",
      "These are the ONLY adjustments allowed to the lighting, background, and framing of Image 1. Check Image 1 against each rule: if it already passes, keep that part exactly as it is; if not, make the smallest change that passes, and describe it in the prompt.",
      "1. Clear subject: the character is the first thing the eye goes to. The face is sharp and unobstructed, nothing bright, busy, or high-contrast sits right behind the head, and no object appears to grow out of the head or shoulders. The product is the second thing the eye goes to: fully inside the frame, sharp, evenly lit so the brand name is readable, with no glare across the label, and standing out in brightness or color from what is directly behind it (clothing, desk, or wall).",
      "2. Bright light: a well-lit, bright exposure. If Image 1 is dim or the face is muddy, raise the exposure and add soft fill while keeping the same light direction and color temperature. Both eyes and the shadow side of the face stay clearly visible. No clipped highlights on the skin or on light materials, no crushed blacks, and no flat washed-out look.",
      "3. Background contrast: judge the outfit's main color and whether it is light, medium, or dark. The area behind the head, shoulders, and torso must clearly differ from it in brightness, and in color where it looks natural. If it does not, change only the tone or color of the wall, panels, or chair behind the character: lighter behind a dark outfit, a deeper but still well-lit tone behind a light outfit, clearly lighter or deeper behind a medium outfit. The layout and every object stay where they are. The outfit and the product keep their real colors and are never changed to get contrast. The hair also stays distinct from what is behind it. The separation comes from tone, light, and depth of field, never from an outline or glow.",
      "4. Frame margins: clear space above the top of the hair (about 8-12% of the frame height) and on both sides (at least 10% of the frame width between each side edge and the nearest shoulder, elbow, hand, or the product). If Image 1 is tighter than this, zoom out slightly: keep the aspect ratio and camera angle, make the character a little smaller, and continue the same room naturally into the new space at the top and sides, rebuilding any cut-off hair or shoulder consistently with the rest. Do not extend the frame downward to show more of the body; the bottom edge may crop the body or desk, but never cuts through the product or the hand that holds it.",
      "</clarity>",
      "",
      "<realism>",
      "These details make the edit look like a real photo, not a composite. Put them in the prompt using physical, photographic language:",
      "1. Lighting match: the product is lit by the same lights as the final photo (Image 1, with any brightening from <clarity>), with the same direction, softness, color temperature, and color spill from the room. Its reflections and specular highlights show the podcast room, not a studio backdrop.",
      "2. Contact and shadows: soft contact shadows where the product touches the " +
        (diTangan ? "fingers and palm, and a faint shadow of the product on the hand and clothing" : "desk") +
        ". No halo, outline, or hard cut edge around the product" +
        (diTangan ? " or the hand" : "") +
        ".",
      "3. Material: real material behavior, such as glass refraction, the slight surface texture of plastic, the matte grain of cardboard, the sheen of metallic foil, and the edge of a label sticker.",
      ...(diTangan
        ? ["4. Hands: anatomically correct with five fingers, the same skin tone and texture as the character in Image 1, with visible knuckle creases and nails, and no fingers passing through the product."]
        : []),
      (diTangan ? "5" : "4") +
        ". Photo match: the product has the same sharpness, focus, sensor grain, and color grade as the rest of the photo, as if it came from the same camera in the same moment.",
      (diTangan ? "6" : "5") +
        ". Do not use filler keywords (8k, ultra HD, masterpiece, photorealistic, hyperrealistic, octane render, Unreal Engine, product mockup, cinematic lighting); they push models toward a CGI look. Describe a real photograph instead.",
      "</realism>",
      "",
      "<format_output>",
      "Output only the final optimized prompt: exactly one ```text code block, with no label, no explanation, and no other text before or after it.",
      'Inside it: the prompt in English, 260-360 words of flowing sentences (not a keyword list), in this order: edit framing (Image 1 to edit, the product reference, and the product placement) → what stays the same → clarity adjustments (clear subject, bright light, background contrast, frame margins) → short identity description → product description with the quoted brand name → position and size → ' +
        (diTangan ? "grip and fingers → " : "") +
        'label visibility → lighting, reflections, and shadows → material and photo match → one closing sentence that starts with "Avoid:" and lists 10-14 things to avoid, including: changing the face, expression, or outfit, replacing the background or its objects, a grid or several panels, a second product, a changed or garbled label, the wrong product size, ' +
        (diTangan ? "extra or fused fingers, fingers passing through the product, " : "a floating product, ") +
        "the product covering the face or the microphone, mismatched lighting, a dim or underexposed face, glare on the label, a background that blends into the clothes or the product, the head, shoulders, hands, or product touching or cut off by the top or side edges, a pasted-on look, other logos, watermarks.",
      "Do not create a file; show it directly in the chat.",
      "</format_output>",
      "",
      "<guardrail>",
      "1. If fewer than 2 images are attached to this message, do not write any prompt. Reply only with: Lampirkan dulu 2 gambar, yaitu Gambar 1 karakter final yang sudah berpose dan Gambar 2 product sheet hasil Base product, lalu kirim ulang prompt ini.",
      "2. Keep the character an adult, as in Image 1.",
      "3. Do not identify, name, or guess who appears in Image 1, and do not mention any celebrity name.",
      "4. The product is only " +
        (diTangan ? "held" : "placed") +
        ", closed: no use, no demo, no consuming or applying, no results, and no health or benefit claims. The demo happens later in the video.",
      "5. No brand names, logos, or readable text anywhere in the image except the product's own label.",
      "6. Do not ask me anything, except in the case of rule 1.",
      "</guardrail>",
      "",
      "Self-check before answering: at least 2 images are attached; the prompt is framed as an edit of Image 1 that adds the product; the face, expression, outfit, hair, accessories, and microphone stay the same as Image 1; the background, lighting, and framing change only as far as <clarity> allows; the face and product are sharp and brightly lit with a readable label; the background behind the head and torso clearly differs in brightness from the outfit, and the product stands out from what is behind it; the top and side margins pass <clarity> rule 4; " +
        c.cek +
        "; exactly one closed product appears, with the label and quoted brand name from the product images; its size matches the in-hand panel of Image 2; " +
        (diTangan ? "the grip is natural and the fingers are correct; " : "") +
        'the product never covers the face or the microphone; the result is one single photo, not a grid; product lighting and shadows match the final photo, and sharpness and grain match Image 1; none of the filler keywords appear; the prompt ends with an "Avoid:" sentence; the answer is exactly one ```text code block with no other text.',
    ].join("\n");
  }

  const penyusun = { utama: build };
  return penyusun[keluaran]();
}
