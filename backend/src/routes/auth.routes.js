    import { Router } from "express";
    import { login } from "../controllers/auth.controller.js";

    const router = Router();

    router.post("/login", login);

    export default router;
    // O código acima define uma rota de autenticação para login, que chama a função de login do controlador de autenticação.