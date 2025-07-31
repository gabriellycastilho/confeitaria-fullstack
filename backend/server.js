import dotenv from "dotenv";
dotenv.config();

import app from "./app.js"; 
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Backend rodando na porta ${PORT}`));
// O código acima inicia o servidor Express definido no app.js

