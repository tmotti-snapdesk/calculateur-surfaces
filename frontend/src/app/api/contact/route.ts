import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

interface ContactData {
  entreprise: string
  nom: string
  email: string
  telephone: string
  surface: number
  quartier: string
  prixMensuel: number
  delai: string
  details: {
    bureauxPrivatifs: number
    postesTravail: number
    sallesReunion: number
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: ContactData = await request.json()

    // Vérifier si la clé API est configurée
    if (!process.env.RESEND_API_KEY) {
      console.log('RESEND_API_KEY non configurée - Lead reçu:', data)
      // En mode dev/sans clé, on simule le succès
      return NextResponse.json({ success: true, message: 'Mode test - email non envoyé' })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    // Email de notification à Snapdesk
    await resend.emails.send({
      from: 'Calculateur Snapdesk <onboarding@resend.dev>',
      to: 'tmotti@snapdesk.co',
      subject: `🏢 Nouveau lead - ${data.entreprise} - ${data.surface}m²`,
      html: `
        <h2>Nouveau lead depuis le calculateur de surface</h2>

        <h3>Contact</h3>
        <ul>
          <li><strong>Entreprise :</strong> ${data.entreprise}</li>
          <li><strong>Nom :</strong> ${data.nom}</li>
          <li><strong>Email :</strong> ${data.email}</li>
          <li><strong>Téléphone :</strong> ${data.telephone || 'Non renseigné'}</li>
        </ul>

        <h3>Besoins</h3>
        <ul>
          <li><strong>Surface totale :</strong> ${data.surface} m²</li>
          <li><strong>Bureaux privatifs :</strong> ${data.details.bureauxPrivatifs}</li>
          <li><strong>Postes open space :</strong> ${data.details.postesTravail}</li>
          <li><strong>Salles de réunion :</strong> ${data.details.sallesReunion}</li>
        </ul>

        <h3>Préférences</h3>
        <ul>
          <li><strong>Quartier :</strong> ${data.quartier || 'Non précisé'}</li>
          <li><strong>Budget estimé :</strong> ${data.prixMensuel ? data.prixMensuel.toLocaleString() + '€/mois' : 'Non calculé'}</li>
          <li><strong>Délai :</strong> ${data.delai || 'Non précisé'}</li>
        </ul>
      `,
    })

    // Email de confirmation au prospect
    await resend.emails.send({
      from: 'Snapdesk <onboarding@resend.dev>',
      to: data.email,
      subject: `Votre estimation de bureaux - ${data.surface}m²`,
      html: `
        <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <img src="https://www.snapdesk.co/wp-content/uploads/2023/08/logo-snapdesk.png" alt="Snapdesk" style="height: 40px; margin-bottom: 20px;" />

          <h2 style="color: #1a1a1a;">Bonjour ${data.nom},</h2>

          <p>Merci pour votre intérêt ! Voici le récapitulatif de votre estimation :</p>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #e590A1; margin-top: 0;">Vos besoins</h3>
            <ul style="list-style: none; padding: 0;">
              <li>📋 Bureaux privatifs : <strong>${data.details.bureauxPrivatifs}</strong></li>
              <li>👥 Postes open space : <strong>${data.details.postesTravail}</strong></li>
              <li>🚪 Salles de réunion : <strong>${data.details.sallesReunion}</strong></li>
            </ul>

            <h3 style="color: #e590A1;">Estimation</h3>
            <p style="font-size: 24px; font-weight: bold; color: #1a1a1a;">
              Surface : ${data.surface} m²
            </p>
            ${data.prixMensuel ? `
            <p style="font-size: 18px; color: #666;">
              Budget estimé : <strong>${data.prixMensuel.toLocaleString()}€/mois</strong><br/>
              <span style="font-size: 14px;">(${data.quartier})</span>
            </p>
            ` : ''}
          </div>

          <p>Un expert Snapdesk vous contactera dans les 24h pour vous présenter une sélection de bureaux correspondant à vos critères.</p>

          <p>Vous pouvez également réserver un créneau directement :</p>

          <a href="https://calendar.app.google/qgcSXuaYUbm2C5Xh8" style="display: inline-block; background: #e590A1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
            Réserver un RDV
          </a>

          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            À très vite,<br/>
            L'équipe Snapdesk
          </p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />

          <p style="color: #999; font-size: 12px;">
            Snapdesk - Opérateur de bureaux à Paris<br/>
            <a href="https://www.snapdesk.co" style="color: #e590A1;">www.snapdesk.co</a>
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'envoi de l\'email' },
      { status: 500 }
    )
  }
}
