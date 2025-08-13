import { pool } from "../../config/db.js";

// Controlador para gerenciar recheios de bolo
// Este controlador permite listar, criar, atualizar e deletar recheios de bolo
// As operações são realizadas na tabela recheios_bolo
// Retorna mensagens de sucesso ou erro conforme a operação

// GET - LISTAR SABORES DE BOLO
export async function getRecheiosBolo(req, res, next) {
  try {
    const result = await pool.query(
      "SELECT id, recheio, tipo, imagens FROM recheios_bolo ORDER BY tipo, recheio"
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
}

// POST - CRIAR NOVO RECHEIO DE BOLO
export async function postRecheioBolo(req, res, next) {
  const { recheio, tipo } = req.body;
  const imagem = req.file ? `/uploads/${req.file.filename}` : null;

  if (!recheio || !tipo) {
    const err = new Error("Recheio e tipo são obrigatórios");
    err.statusCode = 400;
    return next(err);
  }

  try {
    const result = await pool.query(
      "INSERT INTO recheios_bolo (recheio, tipo, imagens) VALUES ($1, $2, $3) RETURNING *",
      [recheio, tipo, imagem]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
}

// UPDATE - ATUALIZAR RECHEIO DE BOLO
export async function updateRecheioBolo(req, res, next) {
  const { id } = req.params;
  const { recheio, tipo } = req.body;
  const imagem = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const result = await pool.query(
      `UPDATE recheios_bolo 
       SET recheio = $1, 
           tipo = $2, 
           imagens = COALESCE($3, imagens)
       WHERE id = $4 
       RETURNING *`,
      [recheio, tipo, imagem, id]
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

// DELETE - DELETAR RECHEIO DE BOLO
export async function deleteRecheioBolo(req, res, next) {
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
