const express = require('express');
const router = express.Router();
const alunosController = require('../controllers/alunos.controller');

// Adiciona um novo aluno ao BD
router.post('/', alunosController.adicionarAluno);

// Busca todos os alunos
router.get('/', alunosController.buscarTodosAlunos);

// Busca um aluno por ID
router.get('/:id', alunosController.buscarAlunoPorId);

// Atualiza os dados de um aluno
router.put('/:id', alunosController.atualizarAluno);

// Remove um aluno do BD
router.delete('/:id', alunosController.removerAluno);

module.exports = router;