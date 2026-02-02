import { NextRequest, NextResponse } from 'next/server'

// Ratios Snapdesk pour le calcul de surface de bureaux (en m²)
const RATIOS = {
  POSTE_TRAVAIL: 5.5,
  SALLE_REUNION: 25,
  ESPACES_COMMUNS: 2.5,
}

const BUREAUX_PRIVATIFS: Record<number, number> = {
  0: 0,
  1: 10,
  2: 15,
  3: 20,
  4: 25,
}

const MAX_BUREAUX_PRIVATIFS = 4

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { postesTravail, sallesReunion, bureauxFermes } = body

    // Validation
    if (postesTravail === undefined || sallesReunion === undefined || bureauxFermes === undefined) {
      return NextResponse.json(
        { success: false, error: 'Veuillez renseigner tous les champs' },
        { status: 400 }
      )
    }

    const postes = Number(postesTravail)
    const salles = Number(sallesReunion)
    const bureaux = Number(bureauxFermes)

    if (postes < 0 || salles < 0 || bureaux < 0) {
      return NextResponse.json(
        { success: false, error: 'Les valeurs ne peuvent pas être négatives' },
        { status: 400 }
      )
    }

    if (bureaux > MAX_BUREAUX_PRIVATIFS) {
      return NextResponse.json(
        { success: false, error: `Le nombre de bureaux privatifs ne peut pas dépasser ${MAX_BUREAUX_PRIVATIFS}` },
        { status: 400 }
      )
    }

    // Calcul
    const surfacePostes = postes * RATIOS.POSTE_TRAVAIL
    const surfaceSalles = salles * RATIOS.SALLE_REUNION
    const surfaceBureaux = BUREAUX_PRIVATIFS[bureaux] ?? 0
    const nombrePersonnes = postes + bureaux
    const surfaceCommuns = nombrePersonnes * RATIOS.ESPACES_COMMUNS
    const surfaceTotale = surfacePostes + surfaceSalles + surfaceBureaux + surfaceCommuns

    return NextResponse.json({
      success: true,
      details: {
        postesTravail: { nombre: postes, surface: surfacePostes },
        sallesReunion: { nombre: salles, surface: surfaceSalles },
        bureauxFermes: { nombre: bureaux, surface: surfaceBureaux },
        espacesCommuns: { nombrePersonnes, surface: surfaceCommuns }
      },
      surfaceTotale: Math.round(surfaceTotale)
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}
