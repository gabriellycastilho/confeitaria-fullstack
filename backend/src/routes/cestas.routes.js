// src/routes/cestas.routes.js
import multer from "multer";
import express from "express";
import { salvarCesta, buscarCestas, atualizarCesta, deletarCesta } from "../controllers/cestas.controller.js";

const router = express.Router();

// Configurações do Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/cestas");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Rotas
router.post("/cestas", upload.single("imagem"), salvarCesta);
router.get("/cestas", buscarCestas);
router.put("/cestas/:id", upload.single("imagem"), atualizarCesta);
router.delete("/cestas/:id", deletarCesta);

export default router;
// O código acima define as rotas para listar, criar, atualizar e deletar cestas, utilizando as funções correspondentes do controlador de cestas. O Multer é configurado para lidar com o upload de imagens das cestas.

