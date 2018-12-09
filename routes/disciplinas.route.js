/** 
 *	@name disciplinas.route
 *
 *  @file Arquivo responsável pelas rotas da tabela disciplinas.
 * 
 *  @author Felipe Araujo e Gabriel Ázara
 *
 * 	@requires NPM:express
 *  @requires controllers/disciplinas.controller
 */

const express = require('express');
const router = express.Router();
const disciplinasController = require('../controllers/disciplinas.controller');

// Adiciona uma nova disciplina
router.post('/', disciplinasController.adicionarDisciplina);

// Busca todas as disciplinas
router.get('/', disciplinasController.buscarTodosDisciplinas);

// Busca disciplinas por atributo
router.get(['/:atributo/:valor', '/:atributo'], disciplinasController.buscarDisciplinaPorAtributo);

// Atualiza os dados de uma disciplinas
router.put('/:id', disciplinasController.atualizarDisciplina);

// Remove uma disciplina
router.delete('/:id', disciplinasController.removerDisciplina);

module.exports = router;