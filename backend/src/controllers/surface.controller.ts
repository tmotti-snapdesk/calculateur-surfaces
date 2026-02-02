import { Router, Request, Response } from 'express'
import { calculateSurface } from '../services/surface.service'

const router = Router()

router.post('/calculate', (req: Request, res: Response) => {
  try {
    const { shape, dimensions } = req.body
    const result = calculateSurface(shape, dimensions)
    res.json({ success: true, result })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Une erreur est survenue'
    res.status(400).json({ success: false, error: message })
  }
})

router.get('/shapes', (req: Request, res: Response) => {
  res.json({
    shapes: [
      { id: 'rectangle', name: 'Rectangle', params: ['longueur', 'largeur'] },
      { id: 'circle', name: 'Cercle', params: ['rayon'] },
      { id: 'triangle', name: 'Triangle', params: ['base', 'hauteur'] },
      { id: 'trapeze', name: 'Trapèze', params: ['grandeBase', 'petiteBase', 'hauteur'] }
    ]
  })
})

export default router
