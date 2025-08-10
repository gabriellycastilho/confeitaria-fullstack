import { pool } from "../config/db.js";

// Controlador para atualizar o preço por tipo de recheio
// Este endpoint recebe o tipo de recheio e o novo preço por kg
// Atualiza o preço na tabela precos_recheio_bolo
// Retorna uma mensagem de sucesso ou erro

export const updatePrecoPorTipo = async (req, res) => {
  const { tipo, preco_por_kg } = req.body;

  if (!tipo || preco_por_kg === undefined) {
    return res.status(400).json({ error: "Tipo e preço são obrigatórios" });
  }

  try {
    const result = await pool.query(
      "UPDATE precos_recheio_bolo SET preco_por_kg = $1 WHERE tipo = $2 RETURNING *",
      [preco_por_kg, tipo]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Tipo não encontrado" });
    }

    res.json({ message: "Preço atualizado com sucesso", data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar preço" });
  }
};
