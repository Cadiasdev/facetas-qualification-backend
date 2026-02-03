export function buildClinicEmailHTML({
  clinicName,
  lead,
}: {
  clinicName: string;
  lead: any;
}) {
  return `
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Novo Lead Qualificado</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);">
          
          <!-- HEADER -->
          <tr>
            <td style="padding:24px 32px;background:#0fb9b1;color:#ffffff;">
              <h1 style="margin:0;font-size:20px;">
                ${clinicName}
              </h1>
              <p style="margin:4px 0 0;font-size:14px;opacity:0.9;">
                Novo lead qualificado recebido
              </p>
            </td>
          </tr>

          <!-- RESUMO -->
          <tr>
            <td style="padding:32px;">
              <h2 style="margin:0 0 16px;font-size:18px;color:#111;">
                Resumo do Lead
              </h2>

              <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#333;">
                <tr>
                  <td><strong>Nome:</strong></td>
                  <td>${lead.name || "Não informado"}</td>
                </tr>
                <tr>
                  <td><strong>Telefone:</strong></td>
                  <td>${lead.phone || "-"}</td>
                </tr>
                <tr>
                  <td><strong>Email:</strong></td>
                  <td>${lead.email || "-"}</td>
                </tr>
                <tr>
                  <td><strong>Urgência:</strong></td>
                  <td>${lead.urgency}</td>
                </tr>
                <tr>
                  <td><strong>Orçamento:</strong></td>
                  <td>€ ${lead.budget}</td>
                </tr>
                <tr>
                  <td><strong>Score:</strong></td>
                  <td>${lead.score} / 100</td>
                </tr>
                <tr>
                  <td><strong>Perfil:</strong></td>
                  <td><strong>${lead.profile_type.toUpperCase()}</strong></td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- MOTIVAÇÃO -->
          <tr>
            <td style="padding:0 32px 24px;">
              <h3 style="margin:0 0 8px;font-size:16px;color:#111;">
                Motivação
              </h3>
              <p style="margin:0;font-size:14px;color:#555;">
                ${lead.motivation || "Não informada"}
              </p>
            </td>
          </tr>

          <!-- FOTO -->
          ${
            lead.photo_url
              ? `
          <tr>
            <td style="padding:0 32px 24px;">
              <h3 style="margin:0 0 8px;font-size:16px;color:#111;">
                Foto do sorriso
              </h3>
              <a href="${lead.photo_url}" target="_blank">
                <img src="${lead.photo_url}" alt="Foto do sorriso" style="width:100%;border-radius:8px;border:1px solid #ddd;" />
              </a>
            </td>
          </tr>
          `
              : ""
          }

          <!-- CTA -->
          <tr>
            <td style="padding:32px;">
              <a href="tel:${lead.phone}" style="display:inline-block;padding:14px 20px;background:#0fb9b1;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:bold;">
                Contactar este lead
              </a>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:16px 32px;background:#f4f6f8;font-size:12px;color:#777;text-align:center;">
              Lead recebido em ${new Date(lead.created_at).toLocaleString("pt-PT")}
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}
