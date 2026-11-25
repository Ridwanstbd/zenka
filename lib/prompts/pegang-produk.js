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
      "Image 1 (the first attached image): my character, already posed and dressed in a podcast setting. Everything in it stays exactly the same except what the product placement needs.",
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
        "and its real label, as if it had been there when the photo was taken.",
      "Work through <keep>, <product>, and <realism> internally, then answer only in the format in <format_output>.",
      "</task>",
      "",
      "<keep>",
      "1. Open the prompt by framing it as an edit: Image 1 is the photo to edit, Image 2 is the product reference" +
        " (and Image 3 the real product photo, if attached), and only the product placement changes.",
      "2. " + c.pose,
      "3. List what stays exactly the same as Image 1: face and identity, facial expression and mouth shape, gaze direction, hair, skin tone and texture, body shape, the outfit, accessories such as headphones or a watch, the microphone and boom arm, the desk, the background, lighting, camera angle, framing, crop, aspect ratio, depth of field, color grade, and grain.",
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
      "<realism>",
      "These details make the edit look like a real photo, not a composite. Put them in the prompt using physical, photographic language:",
      "1. Lighting match: the product is lit by the same lights as Image 1, with the same direction, softness, color temperature, and color spill from the room. Its reflections and specular highlights show the podcast room, not a studio backdrop.",
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
        ". Photo match: the product has the same sharpness, focus, sensor grain, and color grade as the rest of Image 1, as if it came from the same camera in the same moment.",
      (diTangan ? "6" : "5") +
        ". Do not use filler keywords (8k, ultra HD, masterpiece, photorealistic, hyperrealistic, octane render, Unreal Engine, product mockup, cinematic lighting); they push models toward a CGI look. Describe a real photograph instead.",
      "</realism>",
      "",
      "<format_output>",
      "Output only the final optimized prompt: exactly one ```text code block, with no label, no explanation, and no other text before or after it.",
      'Inside it: the prompt in English, 200-300 words of flowing sentences (not a keyword list), in this order: edit framing (Image 1 to edit, the product reference, only the product placement changes) → what stays the same → short identity description → product description with the quoted brand name → position and size → ' +
        (diTangan ? "grip and fingers → " : "") +
        'label visibility → lighting, reflections, and shadows → material and photo match → one closing sentence that starts with "Avoid:" and lists 8-10 things to avoid, including: changing the face, expression, outfit, or background, a grid or several panels, a second product, a changed or garbled label, the wrong product size, ' +
        (diTangan ? "extra or fused fingers, fingers passing through the product, " : "a floating product, ") +
        "the product covering the face or the microphone, mismatched lighting, a pasted-on look, other logos, watermarks.",
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
      "Self-check before answering: at least 2 images are attached; the prompt is framed as an edit of Image 1 where only the product placement changes; the face, expression, outfit, hair, accessories, microphone, background, lighting, and framing stay the same as Image 1; " +
        c.cek +
        "; exactly one closed product appears, with the label and quoted brand name from the product images; its size matches the in-hand panel of Image 2; " +
        (diTangan ? "the grip is natural and the fingers are correct; " : "") +
        'the product never covers the face or the microphone; the result is one single photo, not a grid; lighting, shadows, sharpness, and grain match Image 1; none of the filler keywords appear; the prompt ends with an "Avoid:" sentence; the answer is exactly one ```text code block with no other text.',
    ].join("\n");
  }

  const penyusun = { utama: build };
  return penyusun[keluaran]();
}
