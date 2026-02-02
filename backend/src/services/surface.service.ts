// Ratios Snapdesk pour le calcul de surface de bureaux (en m²)
export const RATIOS = {
  POSTE_TRAVAIL: 5.5,      // m² par poste de travail en open space
  SALLE_REUNION: 25,       // m² par salle de réunion
  ESPACES_COMMUNS: 2.5,    // m² par personne pour espaces communs
}

// Surface des bureaux privatifs selon le nombre (max 4)
export const BUREAUX_PRIVATIFS: Record<number, number> = {
  0: 0,
  1: 10,
  2: 15,
  3: 20,
  4: 25,
}

export const MAX_BUREAUX_PRIVATIFS = 4

export interface BesoinsInput {
  postesTravail: number
  sallesReunion: number
  bureauxFermes: number
}

export interface CalculResult {
  details: {
    postesTravail: { nombre: number; surface: number }
    sallesReunion: { nombre: number; surface: number }
    bureauxFermes: { nombre: number; surface: number }
    espacesCommuns: { nombrePersonnes: number; surface: number }
  }
  surfaceTotale: number
}

export function calculateSurfaceBureaux(besoins: BesoinsInput): CalculResult {
  // Validation des entrées
  if (besoins.postesTravail < 0 || besoins.sallesReunion < 0 || besoins.bureauxFermes < 0) {
    throw new Error('Les valeurs ne peuvent pas être négatives')
  }

  if (besoins.bureauxFermes > MAX_BUREAUX_PRIVATIFS) {
    throw new Error(`Le nombre de bureaux privatifs ne peut pas dépasser ${MAX_BUREAUX_PRIVATIFS}`)
  }

  // Calcul des surfaces par type d'espace
  const surfacePostes = besoins.postesTravail * RATIOS.POSTE_TRAVAIL
  const surfaceSalles = besoins.sallesReunion * RATIOS.SALLE_REUNION
  const surfaceBureaux = BUREAUX_PRIVATIFS[besoins.bureauxFermes] ?? 0

  // Nombre total de personnes (postes + bureaux privatifs)
  const nombrePersonnes = besoins.postesTravail + besoins.bureauxFermes

  // Espaces communs (2,5 m² par personne)
  const surfaceCommuns = nombrePersonnes * RATIOS.ESPACES_COMMUNS

  // Surface totale
  const surfaceTotale = surfacePostes + surfaceSalles + surfaceBureaux + surfaceCommuns

  return {
    details: {
      postesTravail: { nombre: besoins.postesTravail, surface: surfacePostes },
      sallesReunion: { nombre: besoins.sallesReunion, surface: surfaceSalles },
      bureauxFermes: { nombre: besoins.bureauxFermes, surface: surfaceBureaux },
      espacesCommuns: { nombrePersonnes, surface: surfaceCommuns }
    },
    surfaceTotale: Math.round(surfaceTotale)
  }
}
