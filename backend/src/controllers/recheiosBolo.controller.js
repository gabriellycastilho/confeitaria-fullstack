import { pool } from "../config/db.js";

// LISTAR SABORES DE BOLOS
export async function getRecheiosBolo(req, res, next) {
  try {
    const result = await pool.query(
      "SELECT id, recheio, tipo, imagem FROM recheios_bolo ORDER BY tipo, recheio"
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
}

// CRIAR RECHEIO DE BOLO
export async function criarRecheioBolo(req, res, next) {
  const { recheio, tipo } = req.body;
  const imagem = req.file ? `/uploads/${req.file.filename}` : null;

  if (!recheio || !tipo) {
    const err = new Error("Recheio e tipo são obrigatórios");
    err.statusCode = 400;
    return next(err);
  }

  try {
    const result = await pool.query(
      "INSERT INTO recheios_bolo (recheio, tipo, imagem) VALUES ($1, $2, $3) RETURNING *",
      [recheio, tipo, imagem]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
}

// ATUALIZAR RECHEIO DE BOLO
export async function atualizarRecheioBolo(req, res, next) {
  const { id } = req.params;
  const { nome, tipo, preco_por_kg } = req.body;
  const imagem = req.file ? req.file.filename : null;

  try {
    const result = await pool.query(
      `UPDATE recheios_bolo SET nome=$1, tipo=$2, preco_por_kg=$3, imagem=COALESCE($4, imagem) WHERE id=$5 RETURNING *`,
      [nome, tipo, preco_por_kg, imagem, id]
    );
    if (result.rows.length === 0) {
      const err = new Error("Recheio não encontrado");
      err.statusCode = 404;
      return next(err);
    }
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
}

// DELETAR RECHEIO DE BOLO
export async function deletarRecheioBolo(req, res, next) {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM recheios_bolo WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      const err = new Error("Recheio não encontrado");
      err.statusCode = 404;
      return next(err);
    }
    res.json({ message: "Recheio removido com sucesso" });
  } catch (error) {
    next(error);
  }
}

