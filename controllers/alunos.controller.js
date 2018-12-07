const Aluno = require('../models/alunos.model');

// Adiciona um novo aluno caso a matrícula e o cpf não existam no banco.
exports.adicionarAluno = (req, res) => {
	let atributos = Object.keys(Aluno);
	let query = `INSERT INTO alunos (${atributos}) VALUES (`;

	atributos.forEach(atributo => {
		if (req.body[atributo]) {
			Aluno[atributo] = req.body[atributo];
			query += `"${Aluno[atributo]}",`;
		} else {			
			res.status(400).json({
				mensagem: `Erro ao adicionar aluno. Atributo ${atributo} não informado.`
			});
		}
	});
	query = query.replace(/,\s*$/, '');
	query += ')';

	// console.log(query);

	conexao.query(query, (erro, resultado) => {
		if (erro) {
			res.status(500).json({
				erro,
				mensagem: 'Erro ao adicionar aluno'
			});
		} else {
			res.status(200).json({
				resultado,
				mensagem: 'Aluno adicionado com sucesso'
			});
		}
	});
}

// Busca todos os alunos
exports.buscarTodosAlunos = (req, res) => {
	let query = `SELECT * FROM alunos ORDER BY nome ASC`;

	conexao.query(query, (erro, resultados) => {
		if (erro) {
			res.status(500).json({
				erro,
				mensagem: 'Erro ao buscar todos os alunos'
			});
		}
		res.status(200).json({
			resultados,
			mensagem: 'Busca por todos os alunos realizada com sucesso'
		});
	});
}

// Busca alunos de acordo com o atributo passado na URL
// Caso nenhum atributo tenha sido passado, busca pelo possível id contido no final da URL
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
				mensagem: `Erro ao buscar aluno por ${atributo}`
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

// Atualiza os dados de um aluno de acordo com o id passado na URL
// TODO: verficar quais dados foram alterados antes de fazer update para evitar erro de coluna unica de CPF e matricula 
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
					mensagem: 'Erro ao atualizar aluno'
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
					mensagem: `Erro ao excluir aluno`
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