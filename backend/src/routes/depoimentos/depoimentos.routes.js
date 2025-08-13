// src/routes/depoimentos.routes.js
import { Router } from "express";
import {
  getDepoimentos,
  postDepoimento,
  getDepoimentosAdmin,
  deleteDepoimento,
} from "../../controllers/depoimentos/depoimentos.controller.js";

const router = Router();

/* ROTAS PÚBLICAS */
router.get("/depoimentos", getDepoimentos);
router.post("/depoimentos", postDepoimento);

/* ROTAS ADMIN */
router.get("/admin/depoimentos", getDepoimentosAdmin);
router.delete("/admin/depoimentos/:id", deleteDepoimento);

export default router;
