# Sistema de Controle de Notas N1 e N2 - CMP1097 - SGBD

Aplicação criada para o trabalho final da disciplina CMP1097 de Sistemas Gerenciadores de Bancos de Dados (SGBD) da PUC Goiás cursada em 2018-2.

## Funcionalidades

A aplicação contém as seguintes funcionalidades.

- Cadastro e login de usuários em dois tipos de perfis (administrador e padrão);
- Cadastro de alunos, disciplinas e lançamento de notas em banco de dados MySQL;
- As páginas de cada item devem possuir uma opção de cadastro e de pesquisa sobre esse item;
- Lançamento de notas depende do aluno e disciplina, selecionados através de uma combobox (select);
- As informações pesquisadas devem ser mostradas em uma tabela;
- Quando um item da tabela for selecionado, seus dados devem ser apresentados de forma que o usuário possa atualizá-los;
- Criar relatório de notas (n1, n2 e média final) em PDF, de todas ou apenas uma disciplina específica, ordenando-as por ordem alfabética;
- Página contendo a documentação das principais funções desenvolvidas.

## Instruções

- Baixar e instalar o Node.js LTS do site: https://nodejs.org/en/

- Configurar, caso ainda não esteja configurado, o git pelo terminal

- Clonar e executar o projeto:
``` sh
$ git clone https://github.com/felipefa/controle-notas-sgbd.git
$ cd controle-notas-sgbd
$ npm install

# Executar usando node:
$ node server.js

# Ou usando nodemon:
$ npm install -g nodemon
$ nodemon start
```
