const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/db');
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const PORT = process.env.PORT || 5000;
const session = require('express-session');
const passport = require('passport');

/**
 * Gerencia a conexão com o Banco de Dados, fazendo com que ela seja reestabelecida sempre que for perdida.
 */
function gerenciarConexao() {
  let conexao = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
  });

  conexao.connect((err) => {
    if (err) {
      // console.log('\n\nErro ao conectar ao BD\n', err);
      setTimeout(gerenciarConexao, 2000);
    }
    // console.log('\n\nConexão com o BD estabelecida com sucesso!');
  });

  conexao.on('error', (err) => {
    // console.log('\n\nErro na conexão com o BD\n', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      gerenciarConexao();
    } else {
      throw err;
    }
  });

  global.conexao = conexao;
}

gerenciarConexao();

const app = express();
global.app = app;

// Define as rotas do servidor.
const rotas = require('./routes/routes');

// Libera o CORS.
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Define a engine que carrega a visão para o EJS.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Permite reconhecer o JSON recebido no corpo (body) da requisição.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Permite o uso dos cookies.
app.use(cookieParser());

// Define o caminho padrão dos conteúdos (imagens, CSS e JS) no browser para a pasta public.
app.use(express.static(path.join(__dirname, 'public')));

// Habilita o Express Session.
app.use(session({
  secret: 'sgbd-secret',
  saveUninitialized: true,
  resave: true
}));

// Inicializa o Passport
app.use(passport.initialize());
app.use(passport.session());

// Inicia as rotas
app.use('/', rotas);

// Captura erro 404 e encaminha para o gerenciador de erros
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Cuida de possíveis erros na rota
app.use((err, req, res, next) => {
  // define variáveis locais de erro
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // carrega página de erro
  res.status(err.status || 500);
  res.send('error');
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
