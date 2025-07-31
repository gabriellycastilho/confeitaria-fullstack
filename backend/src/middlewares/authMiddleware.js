import jwt from "jsonwebtoken";

export function autenticarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  // Verifica se o header existe
  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  // Espera algo como "Bearer token_aqui"
  const [bearer, token] = authHeader.split(" ");

  if (bearer !== "Bearer" || !token) {
    return res.status(401).json({ error: "Token mal formatado" });
  }

  try {
    // Verifica o token com a mesma chave do login
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Coloca o usuário decodificado no req para as rotas usarem
    req.user = decoded;

    // Segue para a rota
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}
// O código acima define um middleware de autenticação que verifica se o token JWT está presente e é válido. Se o token for válido, ele decodifica as informações do usuário e as adiciona ao objeto `req` para que possam ser usadas nas rotas subsequentes. Se o token não for fornecido ou for inválido, retorna um erro 401 (não autorizado).