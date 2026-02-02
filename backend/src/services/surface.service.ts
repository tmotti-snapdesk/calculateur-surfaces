// Ratios standards pour le calcul de surface de bureaux (en m²)
export const RATIOS = {
  POSTE_TRAVAIL: 8,        // m² par poste de travail en open space
  SALLE_REUNION: 15,       // m² par salle de réunion (6-8 personnes)
  BUREAU_FERME: 12,        // m² par bureau fermé (dirigeant)
  COEFFICIENT_COMMUNS: 0.3 // 30% pour les espaces communs (circulation, accueil, sanitaires)
}

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
    espacesCommuns: { coefficient: number; surface: number }
  }
  surfaceUtile: number
  surfaceTotale: number
  ratiosUtilises: typeof RATIOS
}

export function calculateSurfaceBureaux(besoins: BesoinsInput): CalculResult {
  // Validation des entrées
  if (besoins.postesTravail < 0 || besoins.sallesReunion < 0 || besoins.bureauxFermes < 0) {
    throw new Error('Les valeurs ne peuvent pas être négatives')
  }

  // Calcul des surfaces par type d'espace
  const surfacePostes = besoins.postesTravail * RATIOS.POSTE_TRAVAIL
  const surfaceSalles = besoins.sallesReunion * RATIOS.SALLE_REUNION
  const surfaceBureaux = besoins.bureauxFermes * RATIOS.BUREAU_FERME

  // Surface utile (sans les espaces communs)
  const surfaceUtile = surfacePostes + surfaceSalles + surfaceBureaux

  // Espaces communs (30% de la surface utile)
  const surfaceCommuns = surfaceUtile * RATIOS.COEFFICIENT_COMMUNS

  // Surface totale
  const surfaceTotale = surfaceUtile + surfaceCommuns

  return {
    details: {
      postesTravail: { nombre: besoins.postesTravail, surface: surfacePostes },
      sallesReunion: { nombre: besoins.sallesReunion, surface: surfaceSalles },
      bureauxFermes: { nombre: besoins.bureauxFermes, surface: surfaceBureaux },
      espacesCommuns: { coefficient: RATIOS.COEFFICIENT_COMMUNS, surface: surfaceCommuns }
    },
    surfaceUtile: Math.round(surfaceUtile),
    surfaceTotale: Math.round(surfaceTotale),
    ratiosUtilises: RATIOS
  }
}
