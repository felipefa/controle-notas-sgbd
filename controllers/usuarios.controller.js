const bcryptjs = require('bcryptjs');

exports.registrar = (req, res) => {
	// console.log("req",req.body);
	let dados = {
		'nome': req.body.nome,
		'sobrenome': req.body.sobrenome,
		'email': req.body.email,
		'senha': req.body.senha,
	}

	bcryptjs.genSalt(10, (err, salt) => {
		bcryptjs.hash(dados.senha, salt, (err, hash) => {
			if (err) {
				console.log("error ocurred", err);
				res.status(400).redirect('/registrar');
			} else {
				dados.senha = hash;
				conexao.query('INSERT INTO usuarios SET ?', dados, (error, results, fields) => {
					if (error) {
						console.log("error ocurred", error);
						res.status(400).redirect('/registrar');
					} else {
						res.redirect('/entrar');
					}
				});
			}
		});
	});
}

exports.compararSenha = (possivelSenha, hash, resultado) => {
	// console.log('compararSenha')
	bcryptjs.compare(possivelSenha, hash, (err, isMatch) => {
		if (err) throw err;
		resultado(null, isMatch);
	});
}

exports.getUsuarioPorEmail = (email, resultado) => {
	// console.log('getUsuarioPorEmail')
	conexao.query('SELECT * FROM usuarios WHERE email = ?', [ email ], (error, results, fields) => {
		if (error) {
			console.log("erro ao buscar usuário por email", error);
			resultado(error, null);
		} else {
			// console.log('The solution is: ', results);
			if (results.length > 0) {
				resultado(null, results[ 0 ]);
			} else {
				console.log('Email não registrado');
				resultado(error, null);
			}
		}
	});
}

exports.getUsuarioPorId = (id, resultado) => {
	// console.log('getUsuarioPorId')
	conexao.query('SELECT * FROM usuarios WHERE id = ?', [ id ], (error, results, fields) => {
		if (error) {
			console.log("erro ao buscar usuário por email", error);
			resultado(error, null);
		} else {
			if (results.length > 0) {
				resultado(null, results[ 0 ]);
			} else {
				resultado(error, null);
			}
		}
	});
}