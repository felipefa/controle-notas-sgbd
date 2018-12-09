/** 
 *	@name aluno_disciplina.route
 *
 *  @file Arquivo responsável pelas rotas da tabela aluno_disciplina.
 * 
 *  @author Felipe Araujo e Gabriel Ázara
 *
 * 	@requires NPM:express
 *  @requires controllers/aluno_disciplina.controller
 */

const express = require('express');
const router = express.Router();
const alunoDisciplinaController = require('../controllers/aluno_disciplina.controller');

// Adiciona um novo aluno
router.post('/', alunoDisciplinaController.adicionarAlunoDisciplina);

// Busca todos os alunos
router.get('/', alunoDisciplinaController.buscarTodosAlunoDisciplina);

// Busca alunos por atributo
router.get(['/:atributo/:valor', '/:atributo'], alunoDisciplinaController.buscarAlunoDisciplinaPorAtributo);

// Atualiza os dados de um aluno
router.put('/:idAluno/:idDisciplina', alunoDisciplinaController.atualizarAlunoDisciplina);

// Remove um aluno
router.delete('/:idAluno/:idDisciplina', alunoDisciplinaController.removerAlunoDisciplina);

module.exports = router;