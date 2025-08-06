import { pool } from "../config/db.js";

// LISTAR TODOS OS PRODUTOS
export async function getProdutos(req, res, next) {
  try {
    const result = await pool.query("SELECT * FROM produtos");
    res.json(result.rows);
  } catch (error) {
    next(error); // passa pro middleware de erro
  }
}

// LISTAR POR CATEGORIA
export async function getProdutosPorCategoria(req, res, next) {
  const { categoria } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM produtos WHERE categoria = $1",
      [categoria]
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
}

// CRIAR PRODUTO
export async function criarProduto(req, res, next) {
  const { nome, categoria, preco } = req.body;
  const imagem = req.file ? req.file.filename : null;

  let sabores = req.body.sabores;

  if (!nome || !categoria || !preco) {
    const err = new Error("Nome, categoria e preço são obrigatórios");
    err.statusCode = 400;
    return next(err);
  }

  try {
    // Normaliza sabores: sempre array, mesmo que só tenha 1 item
    const saboresFormatados = Array.isArray(sabores)
      ? sabores.map((s) => s.trim()).filter((s) => s)
      : typeof sabores === "string"
      ? [sabores.trim()]
      : [];

    const result = await pool.query(
      "INSERT INTO produtos (nome, categoria, preco, imagem, sabores) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [nome, categoria, preco, imagem || null, saboresFormatados]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
}


// ATUALIZAR PRODUTO
export async function atualizarProduto(req, res, next) {
  const { id } = req.params;
  const { nome, categoria, preco, imagem, sabores } = req.body;

  try {
    // Converte a string de sabores em um array também na atualização
    const saboresFormatados = Array.isArray(sabores)
      ? sabores.map((s) => s.trim()).filter((s) => s)
      : typeof sabores === "string"
      ? [sabores.trim()]
      : [];

    const result = await pool.query(
      `UPDATE produtos 
       SET nome = $1, categoria = $2, preco = $3, imagem = $4, sabores = $5 
       WHERE id = $6 RETURNING *`,
      [nome, categoria, preco, imagem || null, saboresFormatados, id]
    );

    if (result.rows.length === 0) {
      const err = new Error("Produto não encontrado");
      err.statusCode = 404;
      return next(err);
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
}

// DELETAR PRODUTO
export async function deletarProduto(req, res, next) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM produtos WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      const err = new Error("Produto não encontrado");
      err.statusCode = 404;
      return next(err);
    }

    res.json({ message: "Produto removido com sucesso" });
  } catch (error) {
    next(error);
  }
}
