import express from "express";
import cors from "cors";
import path from "path"; 
import { fileURLToPath } from "url"; 
import { dirname } from "path"; 
import { errorHandler } from "./src/middlewares/errorHandler.js";
import produtosRoutes from "./src/routes/produtos.routes.js";
import pedidosRoutes from "./src/routes/pedidos.routes.js";
import authRoutes from "./src/routes/auth.routes.js"; 

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors()); 
app.use(express.json()); 

// Middleware para servir arquivos estáticos da pasta "uploads"
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas
app.use("/produtos", produtosRoutes);
app.use("/pedidos", pedidosRoutes);
app.use("/auth", authRoutes); 


// Middleware de erro SEMPRE depois das rotas
app.use(errorHandler);

export default app;
// O código acima configura o servidor Express, define as rotas e inclui o middleware de tratamento de erros.