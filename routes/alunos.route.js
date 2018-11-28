const express = require('express');
const router = express.Router();
const alunosController = require('../controllers/alunos.controller');

// Adiciona um novo aluno
router.post('/', alunosController.adicionarAluno);

// Busca todos os alunos
router.get('/', alunosController.buscarTodosAlunos);

// Busca alunos por atributo
router.get(['/:atributo/:valor', '/:atributo'], alunosController.buscarAlunoPorAtributo);

// Atualiza os dados de um aluno
router.put('/:id', alunosController.atualizarAluno);

// Remove um aluno
router.delete('/:id', alunosController.removerAluno);

module.exports = router;