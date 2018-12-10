/** 
 *	@name usuarios.controller
 *
 *  @file Arquivo responsável pelo CRUD dos usuários da aplicação. Assim como o login e a verificação de senha.
 * 
 *  @author Felipe Araujo e Gabriel Ázara
 *
 *  @requires NPM:bcryptjs
 *  @requires models/usuarios.model
 */

const bcryptjs = require('bcryptjs');
let Usuario = require('../models/usuarios.model');

/**
 * Registra um novo usuário de acordo com os dados recebidos.
 * 
 * @param {Object} req - Requisição recebida com os dados a serem gravados (atributo body).
 * @param {Object} res - Resposta que será retornada pelo servidor contendo um JSON.
 */
exports.registrar = (req, res) => {
	let atributos = Object.keys(Usuario);

	atributos.forEach(atributo => {
		if (req.body[atributo] || atributo == 'administrador') {
			Usuario[atributo] = req.body[atributo];
		} else {
			console.log(`Erro ao criar usuário.\nAtributo ${atributo} vazio.`);
			res.status(400).redirect('/registrar');
		}
	});

	bcryptjs.genSalt(10, (erroSalt, salt) => {
		bcryptjs.hash(Usuario.senha, salt, (erroHash, hash) => {
			if (erroHash) {
				console.log('Erro ao criar hash da senha', erroHash);
				res.status(400).redirect('/registrar');
			} else {
				Usuario.senha = hash;
				conexao.query('INSERT INTO usuarios SET ?', Usuario, (erro) => {
					if (erro) {
						console.log('Erro ao inserir novo usuário', erro);
						res.status(400).redirect('/registrar');
					} else {
						res.redirect('/entrar');
					}
				});
			}
		});
	});
}


/**
 * Compara a possível senha com o hash informado.
 * 
 * @param {String} possivelSenha - Possível senha que deve ser comparada.
 * @param {String} hash - Hash que deve ser usado na comparação.
 * @param {resultadoCompararSenha} resultado - Callback que gerencia a resposta obtida.
 */
exports.compararSenha = (possivelSenha, hash, resultado) => {
	bcryptjs.compare(possivelSenha, hash, (erro, sucesso) => {
		if (erro) throw erro;
		resultado(null, sucesso);
	});
}
/**
 * Callback usada para retornar o resultado da comparação entre possível senha e hash.
 * 
 * @callback resultadoCompararSenha
 * @param {Error} erro - Erro obtido durante a execução da comparação.
 * @param {boolean} sucesso - Valor obtido através da comparação.
 */


 /**
 * Busca os dados de um usuário de acordo com os parametros passado.
 * 
 * @param {String} email - email obtido pela entrada do usuario 
 * @param {resultadoGetUsuarioPorEmail} resultado - Callback que gerencia a resposta obtida.
 */
exports.getUsuarioPorEmail = (email, resultado) => {
	conexao.query('SELECT * FROM usuarios WHERE email = ?', [email], (erro, resultados) => {
		if (erro) {
			console.log('Erro ao buscar usuário por email', erro);
			resultado(erro, null);
		} else {
			if (resultados.length > 0) {
				resultado(null, resultados[0]);
			} else {
				resultado('Email não registrado', null);
			}
		}
	});
}
/**
 * Callback usada para retornar o resultado da entrada do email do usuario.
 * 
 * @callback resultadoGetUsuarioPorEmail
 * @param {Error} erro - Erro obtido durante a execução da consulta ao email.
 * @param {Object} resultado - Valor obtido através da consulta.
 */


 /**
 * Busca os dados de um usuário de acordo com os parametros passado.
 * 
 * @param {String} id - email obtido pela entrada do usuario 
 * @param {resultadoGetUsuarioPorId} resultado - Callback que gerencia a resposta obtida.
 */
exports.getUsuarioPorId = (id, resultado) => {
	conexao.query('SELECT * FROM usuarios WHERE id = ?', [id], (erro, resultados) => {
		if (erro) {
			console.log('Erro ao buscar usuário por id', erro);
			resultado(erro, null);
		} else {
			if (resultados.length > 0) {
				resultado(null, resultados[0]);
			} else {
				console.log('Id não encontrada');
				resultado('Id não encontrada', null);
			}
		}
	});
}
/**
 * Callback usada para retornar o resultado da entrada do id do usuario.
 * 
 * @callback resultadoGetUsuarioPorId
 * @param {Error} erro - Erro obtido durante a execução da consulta ao id.
 * @param {Object} resultado - Valor obtido através da consulta.
 */

/**
 * Busca os dados de um usuário de acordo com os parametros passado.
 * 
 * @param {Object} req - Requisição recebida com os dados a serem gravados (atributo body).
 * @param {Object} res - Resposta que será retornada pelo servidor contendo um JSON.
 */
exports.buscarUsuarioPorAtributo = (req, res) => {
	let atributo = req.params.atributo ? req.params.atributo : 'id';
	let valor = req.params.valor;
	let query = `SELECT * FROM usuarios WHERE ${atributo} `;

	if (atributo === 'id') {
		query += `= ${valor}`;
	} else {
		query += `like "${valor}%"`;
	}

	conexao.query(query, (erro, resultado) => {
		if (erro) {
			console.log(`Erro ao buscar usuário por ${atributo}`, erro);
			res.status(500).json({
				erro,
				mensagem: `Erro ao buscar usuário por ${atributo}.\n ${erro.sqlMessage.replace('/','')}.`
			});
		} else {
			if (resultado.length > 0) {
				res.status(200).json({
					resultado,
					mensagem: `Usuário encontrado com sucesso`
				});
			} else {
				res.status(404).json({
					resultado,
					mensagem: `Usuário com ${atributo} = ${valor} não encontrado`
				});
			}
		}
	});
}

/**
 * Atualiza os dados de um usuário de acordo com o id passado na URL.
 * 
 * @param {Object} req - Requisição recebida com os dados a serem gravados (atributo body) e os ids de usuario do item que deve ser alterado.
 * @param {Object} res - Resposta que será retornada pelo servidor contendo um JSON.
 */
exports.atualizarUsuario = (req, res) => {
	if (req.params.id) {
		let atributos = Object.keys(Usuario);
		let query = `UPDATE usuarios SET `;

		atributos.forEach((atributo) => {
			if (req.body[atributo] || atributo == 'administrador') {
				query += `${atributo} = "${req.body[ atributo ]}", `;
			}
		});
		// Remove a última vígula da lista de atributos definida no forEach
		query = query.replace(/,\s*$/, '');
		query += ` WHERE id = ${req.params.id}`;
		// console.log(query);

		conexao.query(query, (erro, resultado) => {
			if (erro) {
				res.status(500).json({
					erro,
					mensagem: `Erro ao atualizar usuário.\n ${erro.sqlMessage.replace('/','')}.`
				});
			} else {
				res.status(200).json({
					resultado,
					mensagem: 'Usuário atualizado com sucesso'
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
 * Remove um usuario de acordo com o id passado na requisição.
 * 
 * @param {Object} req - Requisição recebida pelo servidor com o id do usuario que deve ser removido.
 * @param {Object} res - Resposta que será retornada pelo servidor contendo um JSON.
 */
exports.removerUsuario = (req, res) => {
	if (req.params.id) {
		conexao.query(`DELETE FROM usuarios WHERE id = ${req.params.id}`, (erro, resultado) => {
			if (erro) {
				res.status(500).json({
					erro,
					mensagem: `Erro ao remover usuário.\n ${erro.sqlMessage.replace('/','')}.`
				});
			} else {
				res.status(200).json({
					resultado,
					mensagem: `Usuário removido com sucesso`
				});
			}
		});
	} else {
		res.status(404).json({
			mensagem: 'Id não informado'
		});
	}
}