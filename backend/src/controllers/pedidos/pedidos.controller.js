import { pool } from "../../config/db.js";

// FUNÇÃO PARA CRIAR UM NOVO PEDIDO
export async function criarPedido(req, res) {
  console.log("REQ BODY:", req.body);
  // Extrai os dados do corpo da requisição
  const {
    cliente_nome,
    cliente_email,
    cliente_telefone,
    endereco_entrega,
    observacoes,
    total,
    itens,
  } = req.body;

  // Abre uma conexão com o banco
  const client = await pool.connect();

  try {
    // Inicia uma transação para garantir que tudo será salvo junto ou nada será salvo
    await client.query("BEGIN");

    // Query para inserir dados do pedido na tabela "pedidos"
    const insertPedidoQuery = `
      INSERT INTO pedidos (cliente_nome, cliente_email, cliente_telefone, endereco_entrega, observacoes, total)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
    `;
    // Executa a query e obtém o id do pedido criado
    const result = await client.query(insertPedidoQuery, [
      cliente_nome,
      cliente_email,
      cliente_telefone,
      endereco_entrega,
      observacoes,
      total,
    ]);
    const pedidoId = result.rows[0].id;

    // Query para inserir os itens relacionados ao pedido na tabela "itens_pedido"
    const insertItemQuery = `
      INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario, nome_produto, sabor)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;

    // Para cada item enviado, insere um registro na tabela "itens_pedido"
    for (const item of itens) {
      await client.query(insertItemQuery, [
        pedidoId,
        item.id,
        item.quantidade,
        item.preco,
        item.nome,
        item.sabor || null, // sabor pode ser nulo
      ]);
    }

    // Se tudo ocorreu bem, confirma a transação no banco
    await client.query("COMMIT");

    // Retorna sucesso com o id do pedido criado
    res.status(201).json({ sucesso: true, pedidoId });
  } catch (erro) {
    // Em caso de erro, desfaz qualquer alteração feita na transação
    await client.query("ROLLBACK");
    console.error("Erro ao salvar pedido:", erro);
    res.status(500).json({ erro: "Erro ao salvar pedido" });
  } finally {
    // Libera a conexão com o banco, independente do resultado
    client.release();
  }
}

// FUNÇÃO PARA LISTAR PEDIDOS, COM OPÇÃO DE FILTRAR PELO STATUS
export async function listarPedidos(req, res) {
  try {
    const status = req.query.status; // captura o status passado como query string

    // Query para buscar pedidos com seus itens associados (json agregados)
    let query = `
      SELECT 
        p.*,
        json_agg(
          json_build_object(
            'produto_id', i.produto_id,
            'quantidade', i.quantidade,
            'preco_unitario', i.preco_unitario,
            'nome_produto', i.nome_produto,
            'sabor', i.sabor
          )
        ) AS itens
      FROM pedidos p
      LEFT JOIN itens_pedido i ON i.pedido_id = p.id
    `;

    const params = [];
    // Se foi passado filtro de status, adiciona condição WHERE
    if (status) {
      query += ` WHERE p.status = $1`;
      params.push(status);
    }

    // Agrupa os resultados pelo pedido para agregar os itens e ordena por data de criação decrescente
    query += `
      GROUP BY p.id
      ORDER BY p.criado_em DESC;
    `;

    // Executa a query com os parâmetros (se houver)
    const result = await pool.query(query, params);

    // Retorna os pedidos com os itens agregados
    res.json(result.rows);
  } catch (erro) {
    console.error("Erro ao buscar pedidos:", erro);
    res.status(500).json({ erro: "Erro ao buscar pedidos" });
  }
}

// FUNÇÃO PARA ATUALIZAR O STATUS DE UM PEDIDO ESPECÍFICO
export async function atualizarStatusPedido(req, res) {
  const id = req.params.id; // id do pedido na URL
  const { status } = req.body; // novo status vindo no corpo da requisição

  try {
    // Atualiza o status do pedido e retorna o pedido atualizado
    const resultado = await pool.query(
      "UPDATE pedidos SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );

    // Se nenhum pedido foi atualizado, retorna erro 404 (pedido não encontrado)
    if (resultado.rowCount === 0) {
      return res.status(404).json({ erro: "Pedido não encontrado" });
    }

    // Retorna os dados do pedido atualizado
    res.json(resultado.rows[0]);
  } catch (erro) {
    console.error("Erro ao atualizar status do pedido:", erro);
    res.status(500).json({ erro: "Erro ao atualizar status do pedido" });
  }
}



