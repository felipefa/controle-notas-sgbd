# Sistema de Controle de Notas N1 e N2

Aplicação criada para o trabalho final da disciplina de Sistemas Gerenciadores de Bancos de Dados (SGBD) da PUC Goiás cursada em 2018-2.

## Instruções

- Baixar e instalar o Node.js LTS do site: https://nodejs.org/en/

- Configurar usuário e senha do git pelo terminal...

- Clonar e executar o projeto:
``` sh
$ git clone https://github.com/felipefa/controle-notas-sgbd.git
$ cd controle-notas-sgbd
$ npm install
$ npm install -g nodemon
$ nodemon start
```

## Funcionalidades

Conforme informado pelo professor, a aplicação deve conter as seguintes funcionalidades.

- Cadastro de alunos, turmas, disciplinas e lançamento de notas;
- Todas as janelas de cadastro devem possuir uma aba de cadastro e outra de pesquisa;
- Lançamento de notas depende do aluno, sua turma e a disciplina, todos selecionados através de uma combobox;
- A pesquisa do cadastro de notas pode ser realizada pelo nome do aluno (ou parte do nome), pelo nome da disciplina (ou parte do nome) e pelo nome da turma;
- As informações pesquisadas devem ser mostradas em uma tableview;
- Quando um dado da pesquisa for selecionado, suas informações devem ser apresentadas na aba cadastro para que o usuário possa efetuar a atualização;
- Os outros cadastros podem ter pesquisa usando combobox;
- Ao selecionar um item na combobox de pesquisa, os dados da pesquisa devem ser apresentados na aba de cadastro;
- Criar relatório geral de notas (com as notas n1, n2 e média final), ordenando por turma e aluno (considerar filtragem por uma determinada turma).
