const bodyParser = require('body-parser');
const config = require('./config/db');
const cors = require('cors');
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const PORT = process.env.PORT || 5000;

const app = express();

// Rotas
const alunosRoute = require('./routes/alunos.route');
// const disciplinasRoute = require('./routes/disciplinas.route');
// const notasRoute = require('./routes/notas.route');
// const turmasRoute = require('./routes/turmas.route');

// Conexão com o Banco de Dados
// const conexao = mysql.createConnection({  
//   host: config.host,
//   user: config.user,
//   password: config.password,
//   database: config.database
// });

// conexao.connect(err => {
//   if (err) console.log('Erro na conexão', err);
//   console.log('Conectou ao BD');
//   conexao.end();
// });

// Opções do CORS
var corsOptions = {
  origin: 'https://controle-notas-sgbd.herokuapp.com/',
  optionsSuccessStatus: 200
}

// Libera o CORS
app.use(cors(corsOptions));

// Permite reconhecer o JSON recebido
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Inicia routes
app.use('/api/alunos', alunosRoute);
// app.use('/api/disciplinas', disciplinasRoute);
// app.use('/api/notas', notasRoute);
// app.use('/api/turmas', turmasRoute);

// Direciona para a página inicial
app.get('/', (req, res) => res.render('pages/index'));

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
