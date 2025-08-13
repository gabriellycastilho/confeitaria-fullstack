import express from "express";
import { getRecheiosComPreco } from "../../controllers/bolos-confeitados/recheiosComPreco.controller.js";

const router = express.Router();

router.get("/com-preco", getRecheiosComPreco);


export default router;
// O código acima define uma rota para obter recheios de bolo com seus preços associados. A função `getRecheiosComPreco` é importada do controlador correspondente, que deve implementar a lógica para buscar os dados necessários do banco de dados. Essa rota pode ser utilizada para exibir recheios com seus preços em uma interface de usuário, por exemplo.
