export function errorHandler(err, req, res, next) {
  console.error("ERRO:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Erro interno do servidor";

  res.status(statusCode).json({ error: message });
}
