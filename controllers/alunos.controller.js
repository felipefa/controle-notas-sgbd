/** 
 *	@name alunos.controller
 *
 *  @file Arquivo responsável pelo CRUD da tabela alunos.
 * 
 *  @author Felipe Araujo e Gabriel Ázara
 *
 *  @requires models/alunos.model
 */

const Aluno = require('../models/alunos.model');

/**
 * Adiciona uma nova entrada (aluno) na tabela aluno com base nos dados recebidos na requisição.
 * 
 * @param {Object} req - Requisição recebida com os dados a serem gravados (atributo body).
 * @param {Object} res - Resposta que será retornada pelo servidor contendo um JSON.
 */
exports.adicionarAluno = (req, res) => {
	let atributos = Object.keys(Aluno);
	let query = `INSERT INTO alunos (${atributos}) VALUES (`;

	atributos.forEach(atributo => {
		if (req.body[atributo]) {
			Aluno[atributo] = req.body[atributo];
			query += `"${Aluno[atributo]}",`;
		}
	});
	query = query.replace(/,\s*$/, '');
	query += ')';

	// console.log(query);

	conexao.query(query, (erro, resultado) => {
		if (erro) {
			res.status(500).json({
				erro,
				mensagem: `Erro ao adicionar aluno.\n ${erro.sqlMessage.replace('/','')}.`
			});
		} else {
			res.status(200).json({
				resultado,
				mensagem: 'Aluno adicionado com sucesso'
			});
		}
	});
}

/**
 * Busca todos os dados da tabela aluno.
 * 
 * @param {Object} req - Requisição recebida pelo servidor.
 * @param {Object} res - Resposta que será retornada pelo servidor contendo um JSON.
 */
exports.buscarTodosAlunos = (req, res) => {
	let query = `SELECT * FROM alunos ORDER BY nome ASC`;

	conexao.query(query, (erro, resultados) => {
		if (erro) {
			res.status(500).json({
				erro,
				mensagem: `Erro ao buscar todos os alunos.\n ${erro.sqlMessage.replace('/','')}.`
			});
		}
		res.status(200).json({
			resultados,
			mensagem: 'Busca por todos os alunos realizada com sucesso'
		});
	});
}

/**
 * Busca os dados da tabela aluno de acordo com os parâmetros passados na requisição.
 * Caso nenhum atributo tenha sido passado, busca pelo possível id contido no final da URL.
 * 
 * @param {Object} req - Requisição recebida pelo servidor, contendo no atributo params, a chave e o valor que deverão ser usados na busca.
 * @param {Object} res - Resposta que será retornada pelo servidor contendo um JSON.
 */
exports.buscarAlunoPorAtributo = (req, res) => {
	let atributo = req.params.atributo ? req.params.atributo : 'id';
	let valor = req.params.valor ? req.params.valor : req.params.atributo;
	let query = 'SELECT * FROM alunos WHERE ';

	if (atributo === 'nome' || atributo === 'email') {
		query = `${atributo} like "${valor}%" ORDER BY ${atributo}`;
	} else if (atributo === 'id' || atributo === 'matricula' || atributo === 'cpf') {
		query = `${atributo} = ${valor}`;
	} else {
		query = `id = ${valor}`;
	}

	// console.log(query)

	conexao.query(query, (erro, resultado) => {
		if (erro) {
			res.status(500).json({
				erro,
				mensagem: `Erro ao buscar aluno por ${atributo}.\n ${erro.sqlMessage.replace('/','')}.`
			});
		} else {
			if (resultado.length > 0) {
				res.status(200).json({
					resultado,
					mensagem: 'Aluno encontrado com sucesso'
				});
			} else {
				res.status(404).json({
					mensagem: `Aluno com ${atributo} = ${valor} não encontrado`
				});
			}
		}
	});
}

/**
 * Atualiza os dados da tabela aluno de acordo com os ids passados na requisição.
 * 
 * @param {Object} req - Requisição recebida com os dados a serem gravados (atributo body) e o id do aluno do item que deve ser alterado.
 * @param {Object} res - Resposta que será retornada pelo servidor contendo um JSON.
 */
exports.atualizarAluno = (req, res) => {
	if (req.params.id) {
		let atributos = Object.keys(Aluno);
		let query = `UPDATE alunos SET `;

		atributos.forEach((atributo) => {
			if (req.body[atributo]) {
				query += `${atributo} = "${req.body[ atributo ]}", `;
			}
		});
		query = query.replace(/,\s*$/, '');
		query += ` WHERE id = ${req.params.id}`;

		// console.log(query);

		conexao.query(query, (erro, resultado) => {
			if (erro) {
				res.status(500).json({
					erro,
					mensagem: `Erro ao atualizar aluno.\n ${erro.sqlMessage.replace('/','')}.`
				});
			} else {
				res.status(200).json({
					resultado,
					mensagem: 'Aluno atualizado com sucesso'
				});
			}
		});
	} else {
		res.status(404).json({
			mensagem: 'Id não informado'
		});
	}
}

/**
 * Remove um aluno de acordo com o id passado na requisição.
 * 
 * @param {Object} req - Requisição recebida pelo servidor com o id do aluno que deve ser removido.
 * @param {Object} res - Resposta que será retornada pelo servidor contendo um JSON.
 */
exports.removerAluno = (req, res) => {
	if (req.params.id) {
		let query = `DELETE FROM alunos WHERE id = ${req.params.id}`;
		let queryAlunoDisciplina = `DELETE FROM aluno_disciplina WHERE idAluno = ${req.params.id}`;

		// Remove notas associadas ao aluno
		conexao.query(queryAlunoDisciplina, (erro, resultado) => {
			if (erro) {
				console.log(`Erro ao remover notas associadas ao aluno com id = ${req.params.id}`, erro);
			} else {
				console.log(`Notas associadas ao aluno com id = ${req.params.id}, removidas com sucesso!`);
			}
		});

		// Remove aluno após remover notas
		conexao.query(query, (erro, resultado) => {
			if (erro) {
				console.log(`Erro ao remover aluno com id = ${req.params.id}`, erro);
				res.status(500).json({
					erro,
					mensagem: `Erro ao excluir aluno.\n ${erro.sqlMessage.replace('/','')}.`
				});
			} else {
				console.log(`Aluno com id = ${req.params.id} removido com sucesso!`);
				res.status(200).json({
					resultado,
					mensagem: `Aluno excluído com sucesso`
				});
			}
		});
	} else {
		res.status(404).json({
			mensagem: 'Id não informado'
		});
	}
}