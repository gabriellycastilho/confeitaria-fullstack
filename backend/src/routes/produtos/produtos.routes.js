import { Router } from "express";
import {
  getProdutos,
  getProdutosPorCategoria,
  criarProduto,
  atualizarProduto,
  deletarProduto,
} from "../../controllers/produtos/produtos.controller.js";

import { autenticarToken } from "../../middlewares/authMiddleware.js";
import { upload } from "../../middlewares/upload.js";

const router = Router();

// LISTAR (público)
router.get("/", getProdutos);
router.get("/:categoria", getProdutosPorCategoria);

// CRIAR (só admin)
router.post("/", autenticarToken, upload.single("imagem"), criarProduto);

// ATUALIZAR (só admin)
router.put("/:id", autenticarToken, atualizarProduto);

// DELETAR (só admin)
router.delete("/:id", autenticarToken, deletarProduto);

export default router;
// O código acima define as rotas para gerenciar produtos, incluindo listagem, criação, atualização e deleção, com autenticação necessária para ações que modificam dados. As funções correspondentes são importadas do controlador de produtos.
