// const Alunos = require('../models/alunos.model');

exports.adicionarAluno = (req, res) => {
	res.send('adicionou aluno'+req.body);
}

exports.buscarTodosAlunos = (req, res) => {
	res.send('retornou todos os alunos');
}

exports.buscarAlunoPorId = (req, res) => {
	res.send('retornou aluno específico');
}

exports.atualizarAluno = (req, res) => {
	res.send('atualizou aluno');
}

exports.removerAluno = (req, res) => {
	res.send('removeu aluno');
}