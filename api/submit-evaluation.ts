import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { clinic_slug, answers, uploaded_photo } = req.body;

    const { data: clinic, error: clinicError } = await supabase
      .from('clinics')
      .select('id')
      .eq('slug', clinic_slug)
      .single();

    if (clinicError || !clinic) {
      return res.status(400).json({ error: 'Clinic not found' });
    }

    let score = 0;
    if (answers.urgency === 'immediate') score += 20;
    if (answers.budget >= 4000) score += 25;
    if (uploaded_photo) score += 15;
    if (answers.motivation) score += 15;
    if (answers.researched_before) score += 10;

    let profile_type = 'not_ideal';
    if (score >= 70) profile_type = 'premium';
    else if (score >= 40) profile_type = 'potential';

    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        clinic_id: clinic.id,
        score,
        profile_type
      })
      .select()
      .single();

    if (leadError) throw leadError;

    const responses = Object.entries(answers).map(([key, value]) => ({
      lead_id: lead.id,
      question_key: key,
      answer_value: String(value)
    }));

    await supabase.from('lead_responses').insert(responses);

    return res.status(200).json({
      success: true,
      profile_type,
      score
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}