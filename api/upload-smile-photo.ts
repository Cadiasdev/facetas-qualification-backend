import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false
  }
};

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: "Invalid form data" });
    }

    const lead_id = fields.lead_id as string;
    const photo = files.photo as formidable.File;

    if (!lead_id || !photo) {
      return res.status(400).json({ error: "Missing lead_id or photo" });
    }

    const fileBuffer = fs.readFileSync(photo.filepath);
    const filePath = `${lead_id}/${Date.now()}-${photo.originalFilename}`;

    // 1️⃣ Upload para Storage
    const { error: uploadError } = await supabase.storage
      .from("smile-photos")
      .upload(filePath, fileBuffer, {
        contentType: photo.mimetype || "image/jpeg"
      });

    if (uploadError) {
      console.error(uploadError);
      return res.status(500).json({ error: "Upload failed" });
    }

    // 2️⃣ Gerar URL assinada
    const { data: signedUrlData } = await supabase.storage
      .from("smile-photos")
      .createSignedUrl(filePath, 60 * 60 * 24 * 7); // 7 dias

    // 3️⃣ Atualizar lead
    await supabase
      .from("leads")
      .update({ photo_url: signedUrlData?.signedUrl })
      .eq("id", lead_id);

    return res.status(200).json({
      success: true,
      photo_url: signedUrlData?.signedUrl
    });
  });
}
