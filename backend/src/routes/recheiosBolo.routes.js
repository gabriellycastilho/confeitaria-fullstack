import { Router } from "express";
import {
  getRecheiosBolo,
  criarRecheioBolo,
  atualizarRecheioBolo,
  deletarRecheioBolo,
} from "../controllers/recheiosBolo.controller.js";
import multer from "multer";

const router = Router();
const upload = multer({ dest: "uploads/" });

// Listar recheios
router.get("/", getRecheiosBolo);

// Criar recheio (com upload imagem)
router.post("/", upload.single("imagem"), criarRecheioBolo);

// Atualizar recheio (com upload imagem opcional)
router.put("/:id", upload.single("imagem"), atualizarRecheioBolo);

// Deletar recheio
router.delete("/:id", deletarRecheioBolo);

export default router;
// O código acima define as rotas para gerenciar recheios de bolo, incluindo listagem, criação, atualização e deleção. As funções correspondentes são importadas do controlador de recheios de bolo. O Multer é utilizado para lidar com o upload de imagens dos recheios.
