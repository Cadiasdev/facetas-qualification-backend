import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req, res) {
  // ===== CORS CONFIG =====
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { clinic_slug, answers, uploaded_photo } = req.body;

    if (!clinic_slug || !answers) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    // 1️⃣ Buscar clínica
    const { data: clinic, error: clinicError } = await supabase
      .from('clinics')
      .select('id')
      .eq('slug', clinic_slug)
      .single();

    if (clinicError || !clinic) {
      return res.status(400).json({ error: 'Clinic not found' });
    }

    // 2️⃣ Calcular score
    let score = 0;
    if (answers.urgency === 'immediate') score += 20;
    if (answers.budget >= 4000) score += 25;
    if (uploaded_photo) score += 15;
    if (answers.motivation) score += 15;
    if (answers.researched_before) score += 10;

    let profile_type = 'not_ideal';
    if (score >= 70) profile_type = 'premium';
    else if (score >= 40) profile_type = 'potential';

    // 3️⃣ Inserir lead COMPLETO
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        clinic_id: clinic.id,
        urgency: answers.urgency,
        budget: answers.budget,
        motivation: answers.motivation || null,
        researched_before: answers.researched_before,
        uploaded_photo: uploaded_photo || false,
        score,
        profile_type,
        status: 'new'
      })
      .select()
      .single();

    if (leadError) {
      console.error(leadError);
      return res.status(500).json({ error: 'Failed to save lead' });
    }

    // 4️⃣ Resposta limpa para o frontend
    return res.status(200).json({
      success: true,
      lead_id: lead.id,
      score,
      profile_type
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
