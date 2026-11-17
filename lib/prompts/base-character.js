import "server-only";
import { buatDokumen } from "./dokumen";

// Penyusun prompt "base-character". Hanya berjalan di server.
// Prompt ditulis dalam bahasa Inggris karena hasilnya (prompt gambar) juga
// harus berbahasa Inggris; pesan untuk pengguna tetap berbahasa Indonesia.
export function susunBaseCharacter(input, keluaran) {
  const document = buatDokumen(input);

  function v(id) {
    return document.getElementById(id).value.trim();
  }

  const MODE = {
    inspirasi: {
      teks: "inspiration only (the reference may show someone else, so the result must be an original fictional person).",
      aturan:
        "Treat the reference as inspiration only. Keep its overall vibe, styling, and general facial category, but change at least 3 distinctive features (for example nose shape, brow shape, jawline, lip shape, or mole placement) so the result is an original fictional person, not a lookalike of the person in the photo.",
      cek: "at least 3 distinctive facial features differ from the reference",
    },
    sendiri: {
      teks: "faithful likeness (the reference shows me or a person who has given consent).",
      aturan:
        "The reference shows me or a person who has given consent. Replicate the facial features as faithfully as possible, including natural asymmetry and distinguishing marks, so the character is clearly recognizable as that person.",
      cek: "the facial features follow the reference faithfully",
    },
  };

  function build() {
    const m = MODE[v("referensi")] || MODE.inspirasi;
    return [
      "<role>",
      "Act as an expert AI image prompt engineer and professional portrait photographer. You specialize in hyper-realistic photos of people that are indistinguishable from a real, unedited photograph, and in building consistent base characters for AI influencers.",
      "</role>",
      "",
      "<input>",
      "Image reference: attached to this message (face and/or style reference).",
      "Character brief from me (may be written in Indonesian, translate it to English): " + v("deskripsi"),
      "Reference usage: " + m.teks,
      "</input>",
      "",
      "<task>",
      "Study the attached image reference and the character brief, then write a detailed, hyper-realistic image generation prompt for a BASE CHARACTER SHEET of an AI influencer. This sheet becomes the master identity reference for all future content, so the face, body, hair, and outfit must be identical in every panel.",
      "Work through <identity>, <sheet>, and <realism> internally, then answer only in the format in <format_output>.",
      "</task>",
      "",
      "<identity>",
      "1. Take gender, age, and ethnicity from the brief. If one is missing, estimate it from the reference. Write the age as one exact number (e.g., 25-year-old), never a range. The brief wins whenever it conflicts with the reference.",
      "2. Describe the face precisely, feature by feature: face shape; forehead and hairline; eyebrows (shape, thickness, color); eyes (shape, eyelid type such as monolid, hooded, or double eyelid, iris color, spacing); nose (bridge height, tip shape, nostril width); lips (fullness, shape, natural color); cheekbones; jawline and chin; skin tone with its undertone (e.g., warm light-tan skin with a golden undertone); distinguishing marks such as moles or freckles with their exact location.",
      "3. Hair: length, texture (straight, wavy, curly), color, cut, parting, and volume. Facial hair if any (style and density). Body: height impression, build, and shoulder width.",
      '4. Use concrete visual words (e.g., "slightly hooded almond-shaped dark brown eyes"). Never use vague praise words such as beautiful, handsome, pretty, perfect, flawless, or attractive. They push image models toward a generic AI face.',
      "5. " + m.aturan,
      "</identity>",
      "",
      "<sheet>",
      "1. Frame the image as a set of real studio photographs in the style of model agency digitals (polaroids), assembled into one landscape 3:2 image on a seamless light-gray paper backdrop.",
      "2. Top row, 3 head-and-shoulders portraits: front view, three-quarter view, side profile. Bottom row, 3 full-body shots: front, side, back, standing in a relaxed natural posture with the arms slightly away from the body.",
      "3. Same person, same hairstyle, same outfit, and same lighting in every panel. Equal spacing with thin clean gaps between panels.",
      "4. Expression follows the brief (e.g., ramah = a warm, subtle closed-mouth smile that reaches the eyes). If the brief names no expression, use a calm, relaxed neutral expression. Keep it natural, never a posed commercial smile.",
      "5. Outfit: casual, neat everyday clothes that match the brief and the reference style, in solid neutral colors, with no logos, prints, or text.",
      "6. No text, labels, numbers, captions, or watermarks anywhere in the image.",
      "</sheet>",
      "",
      "<realism>",
      "These details make the result look like a real human. Put them in the prompt using physical, photographic language:",
      "1. Camera: shot on a full-frame camera, 85mm prime lens for the portraits and 50mm for the full-body shots, f/8, ISO 100, sharp focus on the eyes, true-to-life colors, unretouched RAW photo look, subtle natural sensor grain.",
      "2. Lighting: a large soft octabox key light at 45 degrees, gentle fill from the opposite side, and a soft hair light for separation. Even, diffused light with soft natural shadows under the nose and chin, and a realistic catchlight in each eye. No dramatic, cinematic, neon, or colored light.",
      "3. Skin: real, unretouched skin texture with visible pores (larger around the nose and cheeks), fine vellus hair on the cheeks and jaw, subtle uneven tone, slight natural redness around the nose, faint under-eye texture, a light natural sheen on the T-zone, and 1 to 3 small natural imperfections suited to the age. No makeup, or only minimal natural makeup.",
      "4. Eyes: detailed iris patterns, a natural wet waterline, eyelashes of uneven length, and a slight natural asymmetry between the two eyes.",
      "5. Hair: individual strands visible, a natural hairline with baby hairs, a few flyaway strands, and visible scalp at the parting.",
      "6. Face and body: slight natural facial asymmetry, natural teeth if visible (not overly white or uniform), anatomically correct hands with five fingers, and realistic proportions for the age and build.",
      "7. Clothing: real fabric texture with visible weave, natural creases, and stitching.",
      "8. Do not use filler keywords such as 8k, 4k, ultra HD, masterpiece, best quality, photorealistic, hyperrealistic, octane render, Unreal Engine, or cinematic lighting. They push image models toward a polished CGI look. Describe the result as a real photograph instead.",
      "</realism>",
      "",
      "<format_output>",
      "Answer in exactly this order, with no other text before, between, or after:",
      "1. The line PROMPT UTAMA, then one ```text code block with the main prompt in English: 200-300 words of flowing sentences (not a keyword list), in this order: shot type and layout → subject (exact age, gender, ethnicity) → face details → hair → body and outfit → expression and pose → lighting → camera → skin and realism details → background → consistency and no-text rule → one closing sentence that starts with \"Avoid:\" and lists the 8-10 most important things to avoid.",
      "2. The line NEGATIVE PROMPT, then one ```text code block with the full negative prompt in English, comma-separated. Include at least: plastic skin, airbrushed skin, overly smooth skin, waxy skin, doll-like face, beauty filter, heavy makeup, perfectly symmetrical face, CGI, 3D render, illustration, cartoon, anime, painting, oversaturated colors, HDR look, glossy skin, uncanny eyes, extra fingers, deformed hands, distorted face, different face between panels, inconsistent outfit, text, labels, watermark, logo, blurry face, cinematic color grading, dramatic shadows.",
      "3. The line ANCHOR KARAKTER, then one ```text code block with one English paragraph of 50-70 words containing the fixed identity: age, gender, ethnicity, key facial features, skin tone, hair, build, and signature outfit. I will paste it at the start of every future image prompt for this character, together with the character sheet image, so the face stays consistent.",
      "Do not package the answer as a .md, .docx, or .pdf file. Show everything directly in the chat.",
      "</format_output>",
      "",
      "<guardrail>",
      "1. If no image is attached to this message, do not write any prompt. Reply only with: Lampirkan dulu gambar referensi wajah atau gaya, lalu kirim ulang prompt ini.",
      "2. The character must be an adult. If the brief or the reference suggests someone under 18, set the age to 20 with adult facial and body proportions.",
      "3. Do not identify, name, or guess who the person in the reference is, and do not mention any celebrity or public figure in the prompt.",
      "4. Modest everyday clothing. No nudity, and no suggestive poses or outfits.",
      "5. No brand names or logos on the clothes or in the background.",
      "6. Do not ask me anything, except in the case of rule 1.",
      "</guardrail>",
      "",
      "Self-check before answering: an image is attached; the age is one exact adult number; every facial feature in <identity> is described with concrete words and no vague praise words; " +
        m.cek +
        "; the layout has 6 panels (3 portraits on top, 3 full-body shots below) with the same identity and outfit; the camera, lighting, skin, eyes, hair, and fabric details from <realism> are present; none of the filler keywords in <realism> point 8 appear; the main prompt ends with an \"Avoid:\" sentence; the answer is exactly 3 labels with 3 ```text code blocks and no other text.",
    ].join("\n");
  }

  const penyusun = { utama: build };
  return penyusun[keluaran]();
}
