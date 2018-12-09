/** 
 *	@name disciplinas.controller
 *
 *  @file Arquivo responsável pelo CRUD da tabela disciplinas.
 * 
 *  @author Felipe Araujo e Gabriel Ázara
 *
 *  @requires models/disciplinas.model
 */

const Disciplina = require('../models/disciplinas.model');

/**
 * Adiciona uma nova entrada (disciplina) na tabela disciplina com base nos dados recebidos na requisição.
 * 
 * @param {Object} req - Requisição recebida com os dados a serem gravados (atributo body).
 * @param {Object} res - Resposta que será retornada pelo servidor contendo um JSON.
 */
exports.adicionarDisciplina = (req, res) => {
	let atributos = Object.keys(Disciplina);

	atributos.forEach(atributo => {
		Disciplina[atributo] = req.body[atributo];
	});

	let query = `INSERT INTO disciplinas (${atributos}) VALUES ("${Disciplina.codigo}", "${Disciplina.nome}")`;

	//console.log(query)

	conexao.query(query, (erro, resultado) => {
		if (erro) {
			res.status(500).json({
				erro,
				mensagem: 'Erro ao adicionar disciplina'
			});
		} else {
			res.status(200).json({
				resultado,
				mensagem: 'Disciplina adicionada com sucesso'
			});
		}
	});
}

/**
 * Busca todos os dados da tabela disciplina.
 * 
 * @param {Object} req - Requisição recebida pelo servidor.
 * @param {Object} res - Resposta que será retornada pelo servidor contendo um JSON.
 */
exports.buscarTodosDisciplinas = (req, res) => {
	let query = `SELECT * FROM disciplinas ORDER BY nome ASC`;

	conexao.query(query, (erro, resultados) => {
		if (erro) {
			res.status(500).json({
				erro,
				mensagem: 'Erro ao buscar todas as disciplinas'
			});
		}
		res.status(200).json({
			resultados,
			mensagem: 'Busca por todas as disciplinas realizada com sucesso'
		});
	});
}

/**
 * Busca os dados da tabela disciplina de acordo com os parâmetros passados na requisição.
 * 
 * @param {Object} req - Requisição recebida pelo servidor, contendo no atributo params, a chave e o valor que deverão ser usados na busca.
 * @param {Object} res - Resposta que será retornada pelo servidor contendo um JSON.
 */
exports.buscarDisciplinaPorAtributo = (req, res) => {
	let atributo = req.params.atributo ? req.params.atributo : 'id';
	let valor = req.params.valor ? req.params.valor : req.params.atributo;
	let query = '';

	if (atributo === 'nome' || atributo === 'codigo') {
		query = `SELECT * FROM disciplinas WHERE ${atributo} like "${valor}%" ORDER BY ${atributo}`;
	} else {
		query = `SELECT * FROM disciplinas WHERE id = ${valor}`;
	}

	//console.log(query)

	conexao.query(query, (erro, resultado) => {
		let mensagem = '';
		if (erro) {
			res.status(500).json({
				erro,
				mensagem: `Erro ao buscar disciplina por ${atributo}`
			});
		} else {
			if (resultado.length <= 0) {
				mensagem = 'Nenhuma disciplina encontrada';
			} else {
				mensagem = 'Disciplina encontrada com sucesso';
			}
			res.status(200).json({
				resultado,
				mensagem: mensagem
			});
		}
	});
}

/**
 * Atualiza os dados da tabela disciplina de acordo com os ids passados na requisição.
 * 
 * @param {Object} req - Requisição recebida com os dados a serem gravados (atributo body) e o id da disciplina do item que deve ser alterado.
 * @param {Object} res - Resposta que será retornada pelo servidor contendo um JSON.
 */
exports.atualizarDisciplina = (req, res) => {
	if (req.params.id) {
		let atributos = Object.keys(Disciplina);
		let query = `UPDATE disciplinas SET `;

		atributos.forEach((atributo) => {
			if (req.body[atributo]) {
				query += `${atributo} = "${req.body[ atributo ]}", `;
			}
		});
		query = query.replace(/,\s*$/, '');
		query += ` WHERE id = ${req.params.id}`;

		//console.log(query)

		conexao.query(query, (erro, resultado) => {
			if (erro) {
				res.status(500).json({
					erro,
					mensagem: 'Erro ao atualizar disciplina'
				});
			} else {
				res.status(200).json({
					resultado,
					mensagem: 'Disciplina atualizada com sucesso'
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
 * Remove uma disciplina de acordo com o id passado na requisição.
 * 
 * @param {Object} req - Requisição recebida pelo servidor com o id do disciplina que deve ser removido.
 * @param {Object} res - Resposta que será retornada pelo servidor contendo um JSON.
 */
exports.removerDisciplina = (req, res) => {
	if (req.params.id) {
		let query = `DELETE FROM disciplinas WHERE id = ${req.params.id}`;
		let queryAlunoDisciplina = `DELETE FROM aluno_disciplina WHERE idDisciplina = ${req.params.id}`;

		conexao.query(queryAlunoDisciplina, (erro, resultado) => {
			if (erro) {
				console.log(`Erro ao remover notas associadas a disciplina com id = ${req.params.id}`, erro);
			} else {
				console.log(`Notas associadas a disciplina com id = ${req.params.id}, removidas com sucesso!`);
			}
		});

		conexao.query(query, (erro, resultado) => {
			if (erro) {
				console.log(`Erro ao remover disciplina com id = ${req.params.id}`, erro);
				res.status(500).json({
					erro,
					mensagem: `Erro ao excluir disciplina`
				});
			} else {
				console.log(`Disciplina com id = ${req.params.id} removida com sucesso!`);
				res.status(200).json({
					resultado,
					mensagem: `Disciplina excluída com sucesso`
				});
			}
		});
	} else {
		res.status(404).json({
			mensagem: 'Id não informado'
		});
	}
}