import { pool } from "../../config/db.js";

export const salvarCesta = async (req, res) => {
  try {
    const { nome, descricao, preco, tipo } = req.body;
    const imagem = req.file ? `/uploads/cestas/${req.file.filename}` : null;

    const result = await pool.query(
      "INSERT INTO cestas (nome, descricao, preco, imagem, tipo) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [nome, descricao, preco, imagem, tipo]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao salvar cesta:", err);
    res.status(500).json({ erro: "Erro interno no servidor" });
  }
};

export const buscarCestas = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM cestas ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar cestas:", err);
    res.status(500).json({ erro: "Erro interno no servidor" });
  }
};

export const atualizarCesta = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, preco, tipo } = req.body;
    const imagem = req.file ? `/uploads/cestas/${req.file.filename}` : null;

    let query = "UPDATE cestas SET nome=$1, descricao=$2, preco=$3, tipo=$4";
    let params = [nome, descricao, preco, tipo];

    if (imagem) {
      query += ", imagem=$5 WHERE id=$6 RETURNING *";
      params.push(imagem, id);
    } else {
      query += " WHERE id=$5 RETURNING *";
      params.push(id);
    }

    const result = await pool.query(query, params);

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao atualizar cesta:", err);
    res.status(500).json({ erro: "Erro interno no servidor" });
  }
};

export const deletarCesta = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM cestas WHERE id = $1", [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error("Erro ao deletar cesta:", err);
    res.status(500).json({ erro: "Erro interno no servidor" });
  }
};



