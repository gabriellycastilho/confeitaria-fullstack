import express from "express";
import { criarPedido, listarPedidos, atualizarStatusPedido } from "../controllers/pedidos.controller.js";

const router = express.Router();

router.post("/", criarPedido);
router.get("/", listarPedidos); 
router.put("/:id/status", atualizarStatusPedido);

export default router;


