const AlunoDisciplina = require('../models/aluno_disciplina.model');

// Adiciona um novo aluno caso a matrícula e o cpf não existam no banco.
exports.adicionarAlunoDisciplina = (req, res) => {
	let atributos = Object.keys(AlunoDisciplina);

	atributos.forEach(atributo => {
		AlunoDisciplina[ atributo ] = req.body[ atributo ] ? req.body[ atributo ] : null;
	});

	let query = `INSERT INTO aluno_disciplina (idAluno, idDisciplina) 
	SELECT alunos.id, disciplinas.id FROM alunos INNER JOIN disciplinas 
	WHERE alunos.id = ${AlunoDisciplina.idAluno} 
	AND disciplinas.id = ${AlunoDisciplina.idDisciplina}`;

	console.log(query)

	conexao.query(query, (erro, resultado) => {
		if (erro) {
			res.status(500).json({ erro, mensagem: 'Erro ao adicionar em aluno_disciplina' });
		} else {
			res.status(200).json({ resultado, mensagem: 'aluno_disciplina adicionado com sucesso' });
		}
	});
}

// Busca todos os dados de aluno_disciplina
exports.buscarTodosAlunoDisciplina = (req, res) => {
	let query = `SELECT * FROM aluno_disciplina ORDER BY idAluno`;

	conexao.query(query, (erro, resultados) => {
		if (erro) {
			res.status(500).json({ erro, mensagem: 'Erro ao buscar todos os aluno_disciplina' });
		} else if (resultados.length > 0) {
			res.status(200).json({ resultados, mensagem: 'Busca por todos aluno_disciplina realizada com sucesso' });
		} else {
			res.status(404).json({ resultados, mensagem: 'Nenhum aluno_disciplina encontrado' });
		}
	});
}

// Busca os dados de aluno_disciplina de acordo com o atributo passado na URL
// Caso nenhum atributo tenha sido passado, busca pelo possível id contido no final da URL
exports.buscarAlunoDisciplinaPorAtributo = (req, res) => {
	let atributo = req.params.atributo ? req.params.atributo : 'idAluno';
	let valor = req.params.valor ? req.params.valor : req.params.atributo;
	let query = `SELECT * FROM aluno_disciplina WHERE ${atributo} = ${valor}`;
	
	// console.log(query)

	conexao.query(query, (erro, resultado) => {
		if (erro) {
			res.status(500).json({ erro, mensagem: `Erro ao buscar aluno_disciplina por ${atributo}` });
		} else if (resultado.length > 0) {
			res.status(200).json({ resultado, mensagem: 'Aluno_disciplina encontrado com sucesso' });
		} else {
			res.status(404).json({ resultado, mensagem: 'Nenhum aluno_disciplina encontrado' });
		}
	});
}

// Atualiza os dados de um aluno_disciplina de acordo com os ids passados na URL
exports.atualizarAlunoDisciplina = (req, res) => {
	let atributos = Object.keys(AlunoDisciplina);
	let query = `UPDATE aluno_disciplina SET `;

	atributos.forEach((atributo) => {
		if (req.body[ atributo ]) {
			query += `${atributo} = ${req.body[ atributo ]},`;
		}
	});

	query = query.replace(/,\s*$/, '');

	query += ` WHERE idAluno = ${req.params.idAluno} AND idDisciplina = ${req.params.idDisciplina}`;

	conexao.query(query, (erro, resultado) => {
		if (erro) {
			res.status(500).json({erro, mensagem: 'Erro ao atualizar aluno_disciplina'});
		} else {
			res.status(200).json({resultado, mensagem: 'aluno_disciplina atualizado com sucesso'});
		}		
	});	
}

// Remove um aluno de acordo com o id passado na URL
exports.removerAlunoDisciplina = (req, res) => {
	let query = `DELETE FROM aluno_disciplina WHERE idAluno = ${req.params.idAluno} AND idDisciplina = ${req.params.idDisciplina}`;

	// console.log(query)

	conexao.query(query, (erro, resultado) => {
		if (erro) {
			res.status(500).json({ erro, mensagem: `Erro ao excluir aluno` });
		} else {
			res.status(200).json({ resultado, mensagem: `AlunoDisciplina excluído com sucesso` });
		}
	});
}