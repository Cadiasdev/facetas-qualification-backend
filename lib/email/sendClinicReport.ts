import { Resend } from "resend";
import { buildClinicEmailHTML } from "./buildClinicEmailHTML";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendClinicReport({
  clinicEmail,
  clinicName,
  lead,
}: {
  clinicEmail: string;
  clinicName: string;
  lead: any;
}) {
  const html = buildClinicEmailHTML({ clinicName, lead });

  await resend.emails.send({
    from: "Smile Finder <noreply@seudominio.com>",
    to: clinicEmail,
    subject: "🦷 Novo lead qualificado para facetas dentárias",
    html,
  });
}

