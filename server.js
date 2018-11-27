const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/db');
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const PORT = process.env.PORT || 5000;
const session = require('express-session');
const passport = require('passport');

// Conexão com o Banco de Dados
function handleDisconnect() {
  let conexao = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
  });

  conexao.connect((err) => {
    if (err) {
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000);
    }
  });

  conexao.on('error', (err) => {
    console.log('db error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });

  global.conexao = conexao;
}

handleDisconnect();

// Rotas
const apiRoute = require('./routes/routes');
// const alunosRoute = require('./routes/alunos.route');
// const disciplinasRoute = require('./routes/disciplinas.route');
// const notasRoute = require('./routes/notas.route');

const app = express();

// Libera o CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Permite reconhecer o JSON recebido
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
  secret: 'sgbd-secret',
  saveUninitialized: true,
  resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

app.use('/', apiRoute);

// Inicia routes da API
// app.use('/api/alunos', alunosRoute);
// app.use('/api/disciplinas', disciplinasRoute);
// app.use('/api/notas', notasRoute);

// Direciona para as páginas
// app.get('/', (req, res) => res.render('pages/index'));
// app.get('/alunos', (req, res) => res.render('pages/alunos'));
// app.get('/disciplinas', (req, res) => res.render('pages/disciplinas'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
