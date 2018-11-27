// const Alunos = require('../models/alunos.model');

exports.adicionarAluno = (req, res) => {
	res.send('adicionou aluno' + req.body);
}

exports.buscarTodosAlunos = (req, res) => {
	let query = "SELECT * FROM `alunos` ORDER BY nome ASC"; // query database to get all the players
	console.log(query)
	// execute query
	db.query(query, (err, result) => {
		if (err) {
			res.redirect('/');
		}
		console.log(result)
		// res.render('alunos.ejs', {
		// 	alunos: result
		// });
	});
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