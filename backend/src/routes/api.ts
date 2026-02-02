import { Router, Request, Response } from 'express'
import surfaceController from '../controllers/surface.controller'

const router = Router()

router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Calculateur de Surfaces API' })
})

router.use('/surfaces', surfaceController)

export default router
