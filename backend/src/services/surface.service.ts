interface Dimensions {
  longueur?: number
  largeur?: number
  rayon?: number
  base?: number
  hauteur?: number
  grandeBase?: number
  petiteBase?: number
}

export function calculateSurface(shape: string, dimensions: Dimensions): number {
  switch (shape) {
    case 'rectangle':
      if (!dimensions.longueur || !dimensions.largeur) {
        throw new Error('Longueur et largeur requises pour un rectangle')
      }
      return dimensions.longueur * dimensions.largeur

    case 'circle':
      if (!dimensions.rayon) {
        throw new Error('Rayon requis pour un cercle')
      }
      return Math.PI * Math.pow(dimensions.rayon, 2)

    case 'triangle':
      if (!dimensions.base || !dimensions.hauteur) {
        throw new Error('Base et hauteur requises pour un triangle')
      }
      return (dimensions.base * dimensions.hauteur) / 2

    case 'trapeze':
      if (!dimensions.grandeBase || !dimensions.petiteBase || !dimensions.hauteur) {
        throw new Error('Grande base, petite base et hauteur requises pour un trapèze')
      }
      return ((dimensions.grandeBase + dimensions.petiteBase) * dimensions.hauteur) / 2

    default:
      throw new Error(`Forme inconnue: ${shape}`)
  }
}
