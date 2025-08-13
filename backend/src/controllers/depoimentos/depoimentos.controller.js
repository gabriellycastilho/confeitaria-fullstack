import { pool } from '../../config/db.js'; 

// Buscar depoimentos públicos (apenas >= 3 estrelas)
export const getDepoimentos = async (req, res) => {
  try {
    const query = `
      SELECT * 
      FROM depoimentos 
      WHERE estrelas >= 3 
      ORDER BY criado_em DESC
    `;
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar depoimentos' });
  }
};

// Buscar TODOS os depoimentos (admin)
export const getDepoimentosAdmin = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT * 
      FROM depoimentos 
      ORDER BY criado_em DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar depoimentos (admin)' });
  }
};

// Adicionar novo depoimento
export const postDepoimento = async (req, res) => {
  try {
    const { nome, texto, estrelas } = req.body;

    if (!nome || !texto || !estrelas || estrelas < 1 || estrelas > 5) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const query = `
      INSERT INTO depoimentos (nome, texto, estrelas) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `;
    const params = [nome, texto, estrelas];

    const { rows } = await pool.query(query, params);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao adicionar depoimento' });
  }
};

// Apagar depoimento pelo id (admin)
export const deleteDepoimento = async (req, res) => {
  try {
    const { id } = req.params;

    const { rowCount } = await pool.query(
      'DELETE FROM depoimentos WHERE id = $1', 
      [id]
    );

    if (rowCount === 0) return res.status(404).json({ error: 'Depoimento não encontrado' });

    res.json({ message: 'Depoimento apagado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao apagar depoimento' });
  }
};

