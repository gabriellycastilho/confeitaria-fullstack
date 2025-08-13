import express from 'express';
import { updatePrecoPorTipo } from '../../controllers/bolos-confeitados/precosRecheio.controller.js';

const router = express.Router();

router.put('/atualizar-por-tipo', updatePrecoPorTipo);

export default router;


