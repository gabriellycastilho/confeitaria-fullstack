import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

export async function login(req, res, next) {
  const { email, senha } = req.body;
    
  if (!email || !senha) {
    return res.status(400).json({ error: "Email e senha são obrigatórios" });
  }

  try {
    // Buscar usuário no banco
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const usuario = result.rows[0];

    // Comparar senha digitada com o hash do banco
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaCorreta) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { id: usuario.id, role: usuario.role },
      process.env.JWT_SECRET, // chave secreta definir no .env
      { expiresIn: "8h" } // expira em 8 horas
    );

    // Responder com token
    res.json({
      message: "Login realizado com sucesso",
      token,
    });
  } catch (error) {
    next(error); // passa para o middleware de erro
  }
}
