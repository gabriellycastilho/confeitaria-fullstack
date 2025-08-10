import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { errorHandler } from "./src/middlewares/errorHandler.js";
import produtosRoutes from "./src/routes/produtos.routes.js";
import pedidosRoutes from "./src/routes/pedidos.routes.js";
import recheiosBoloRoutes from "./src/routes/recheiosBolo.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import cestasRoutes from "./src/routes/cestas.routes.js";
import precosRecheioRoutes from "./src/routes/precosRecheio.routes.js";
import recheiosComPrecoRoutes from "./src/routes/recheiosComPreco.routes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors());
app.use(express.json());

// Middleware para servir arquivos estáticos da pasta "uploads"
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rotas
app.use("/produtos", produtosRoutes);
app.use("/pedidos", pedidosRoutes);
app.use("/cestas", cestasRoutes);
app.use("/auth", authRoutes);

app.use("/recheios-bolo", recheiosBoloRoutes);
app.use("/precos-recheio", precosRecheioRoutes);
app.use("/recheios", recheiosComPrecoRoutes);

// Middleware de erro SEMPRE depois das rotas
app.use(errorHandler);

export default app;
// O código acima configura o servidor Express, define as rotas e inclui o middleware de tratamento de erros.
