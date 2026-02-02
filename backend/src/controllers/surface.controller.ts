import { Router, Request, Response } from 'express'
import { calculateSurfaceBureaux, RATIOS } from '../services/surface.service'

const router = Router()

router.post('/calculate', (req: Request, res: Response) => {
  try {
    const { postesTravail, sallesReunion, bureauxFermes } = req.body

    // Validation des entrées
    if (postesTravail === undefined || sallesReunion === undefined || bureauxFermes === undefined) {
      res.status(400).json({
        success: false,
        error: 'Veuillez renseigner tous les champs: postesTravail, sallesReunion, bureauxFermes'
      })
      return
    }

    const result = calculateSurfaceBureaux({
      postesTravail: Number(postesTravail),
      sallesReunion: Number(sallesReunion),
      bureauxFermes: Number(bureauxFermes)
    })

    res.json({ success: true, ...result })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Une erreur est survenue'
    res.status(400).json({ success: false, error: message })
  }
})

router.get('/ratios', (req: Request, res: Response) => {
  res.json({
    ratios: RATIOS,
    descriptions: {
      POSTE_TRAVAIL: 'Surface par poste de travail en open space (m²)',
      SALLE_REUNION: 'Surface par salle de réunion 6-8 personnes (m²)',
      BUREAU_FERME: 'Surface par bureau fermé dirigeant (m²)',
      COEFFICIENT_COMMUNS: 'Coefficient pour espaces communs (circulation, accueil, sanitaires)'
    }
  })
})

export default router
