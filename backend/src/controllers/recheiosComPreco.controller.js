import { pool } from "../config/db.js";

// Controlador para buscar recheios com preço
// Este endpoint retorna os recheios disponíveis com seus respectivos preços por kg
// A consulta junta as tabelas recheios_bolo e precos_recheio_bolo para obter os dados necessários
// Retorna um JSON com os detalhes dos recheios e seus preços

export const getRecheiosComPreco = async (req, res) => {
  try {
    const query = `
      SELECT 
        r.id AS recheio_id,
        r.recheio AS nome_recheio,
        r.tipo,
        p.preco_por_kg
      FROM recheios_bolo r
      JOIN precos_recheio_bolo p
        ON r.tipo = p.tipo
      ORDER BY r.tipo, r.recheio;
    `;

    const result = await pool.query(query);

    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar recheios com preço:", error);
    res.status(500).json({ error: "Erro ao buscar recheios com preço" });
  }
};
