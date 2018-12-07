const AlunoDisciplina = require('../models/aluno_disciplina.model');

/**
 * Adiciona uma nova entrada (nota) na tabela aluno_disciplina com base nos dados recebidos na requisição.
 * 
 * @param {Object} req - Requisição recebida com os dados a serem gravados (atributo body).
 * @param {Object} res - Resposta que será retornada pelo servidor contendo um JSON.
 */
exports.adicionarAlunoDisciplina = (req, res) => {
	let atributos = Object.keys(AlunoDisciplina);

	let query = `INSERT INTO aluno_disciplina (idAluno, idDisciplina) 
	SELECT alunos.id, disciplinas.id FROM alunos INNER JOIN disciplinas 
	WHERE alunos.id = ${req.body['idAluno']} 
	AND disciplinas.id = ${req.body['idDisciplina']}`;

	// console.log(query)

	conexao.query(query, (erro, resultado) => {
		if (erro) {
			res.status(500).json({
				erro,
				mensagem: 'Erro ao adicionar em aluno_disciplina'
			});
		} else {
			query = `UPDATE aluno_disciplina SET `;

			atributos.forEach((atributo) => {
				let valor = req.body[atributo] ? req.body[atributo] : 0;
				query += `${atributo} = ${valor}, `;
			});

			query = query.replace(/,\s*$/, '');

			query += ` WHERE idAluno = ${req.body['idAluno']} AND idDisciplina = ${req.body['idDisciplina']}`;

			// console.log(query);

			conexao.query(query, (erro, resultado) => {
				if (erro) {
					res.status(500).json({
						erro,
						mensagem: 'Erro ao atualizar aluno_disciplina'
					});
				} else {
					res.status(200).json({
						resultado,
						mensagem: 'aluno_disciplina salvo com sucesso'
					});
				}
			});
			// res.status(200).json({ resultado, mensagem: 'aluno_disciplina adicionado com sucesso' });
		}
	});
}

/**
 * Busca todos os dados da tabela aluno_disciplina.
 * 
 * @param {Object} req - Requisição recebida pelo servidor.
 * @param {Object} res - Resposta que será retornada pelo servidor contendo um JSON.
 */
exports.buscarTodosAlunoDisciplina = (req, res) => {
	let query = `SELECT * FROM aluno_disciplina ORDER BY idAluno`;

	conexao.query(query, (erro, resultados) => {
		if (erro) {
			res.status(500).json({
				erro,
				mensagem: 'Erro ao buscar todos os aluno_disciplina'
			});
		} else if (resultados.length > 0) {
			res.status(200).json({
				resultados,
				mensagem: 'Busca por todos aluno_disciplina realizada com sucesso'
			});
		} else {
			res.status(404).json({
				resultados,
				mensagem: 'Nenhum aluno_disciplina encontrado'
			});
		}
	});
}

/**
 * Busca os dados da tabela aluno_disciplina de acordo com os parâmetros passados na requisição.
 * 
 * @param {Object} req - Requisição recebida pelo servidor, contendo no atributo params, a chave e o valor que deverão ser usados na busca.
 * @param {Object} res - Resposta que será retornada pelo servidor contendo um JSON.
 */
exports.buscarAlunoDisciplinaPorAtributo = (req, res) => {
	let atributo = req.params.atributo ? req.params.atributo : 'idAluno';
	let valor = req.params.valor ? req.params.valor : req.params.atributo;
	let query = `SELECT * FROM aluno_disciplina WHERE ${atributo} = ${valor}`;

	// console.log(query)

	conexao.query(query, (erro, resultado) => {
		if (erro) {
			res.status(500).json({
				erro,
				mensagem: `Erro ao buscar aluno_disciplina por ${atributo}`
			});
		} else if (resultado.length > 0) {
			res.status(200).json({
				resultado,
				mensagem: 'Aluno_disciplina encontrado com sucesso'
			});
		} else {
			res.status(404).json({
				resultado,
				mensagem: 'Nenhum aluno_disciplina encontrado'
			});
		}
	});
}

/**
 * Atualiza os dados da tabela aluno_disciplina de acordo com os ids (do aluno e da disciplina) passados na requisição.
 * 
 * @param {Object} req - Requisição recebida com os dados a serem gravados (atributo body) e os ids (do aluno e da disciplina) do item que deve ser alterado.
 * @param {Object} res - Resposta que será retornada pelo servidor contendo um JSON.
 */
exports.atualizarAlunoDisciplina = (req, res) => {
	let atributos = Object.keys(AlunoDisciplina);
	let query = `UPDATE aluno_disciplina SET `;

	atributos.forEach((atributo) => {
		if (req.body[atributo] !== 'idAluno' && req.body[atributo] !== 'idDisciplina') {
			query += `${atributo} = ${req.body[ atributo ]}, `;
		}
	});

	query = query.replace(/,\s*$/, '');

	query += ` WHERE idAluno = ${req.params.idAluno} AND idDisciplina = ${req.params.idDisciplina}`;

	// console.log(query);

	conexao.query(query, (erro, resultado) => {
		if (erro) {
			res.status(500).json({
				erro,
				mensagem: 'Erro ao atualizar aluno_disciplina'
			});
		} else {
			res.status(200).json({
				resultado,
				mensagem: 'aluno_disciplina atualizado com sucesso'
			});
		}
	});
}

/**
 * Remove uma nota de acordo com os ids (do aluno e da disciplina) passados na requisição.
 * 
 * @param {Object} req - Requisição recebida pelo servidor com os ids (do aluno e da disciplina) do item que deve ser removido.
 * @param {Object} res - Resposta que será retornada pelo servidor contendo um JSON.
 */
exports.removerAlunoDisciplina = (req, res) => {
	let query = `DELETE FROM aluno_disciplina WHERE idAluno = ${req.params.idAluno} AND idDisciplina = ${req.params.idDisciplina}`;

	// console.log(query)

	conexao.query(query, (erro, resultado) => {
		if (erro) {
			res.status(500).json({
				erro,
				mensagem: `Erro ao excluir aluno`
			});
		} else {
			res.status(200).json({
				resultado,
				mensagem: `AlunoDisciplina excluído com sucesso`
			});
		}
	});
}