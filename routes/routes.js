const express = require('express');
const router = express.Router();
const usuariosCtrl = require('../controllers/usuarios.controller');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const verificaAutenticado = require('../utils/verificaAutenticado');

// Insere as rotas dos alunos, disciplinas e notas
const alunosRoute = require('./alunos.route');
const disciplinasRoute = require('./disciplinas.route');
const alunoDisciplinaRoute = require('./aluno_disciplina.route');

// Carrega a página de login
router.get('/entrar', (req, res) => {
  res.render('pages/entrar');
});

// Carrega a página de cadastro de usuário
router.get('/registrar', (req, res) => {
  res.render('pages/registrar');
});

// Sai da conta logada e carrega a página de login
router.get('/sair', (req, res) => {
  req.logout();

  res.redirect('/entrar');
});

// Redireciona para as apis dos alunos, disciplinas e notas
router.use('/api/alunos', verificaAutenticado, alunosRoute);
router.use('/api/disciplinas', verificaAutenticado, disciplinasRoute);
router.use('/api/notas', verificaAutenticado, alunoDisciplinaRoute);

// Carrega a página inicial caso esteja logado
router.get('/', verificaAutenticado, (req, res) => {
  let usuario = req.user ? req.user : {nome: 'Sem usuário'};
  res.render('pages/index', { usuario: usuario });
});

router.get('/docs', (req, res) => {
  res.render('../public/docs');
});

// Carrega a página solicitada na URL caso exista, senão exibe erro
// TODO: Criar página de erro 404
router.get('/:pagina', verificaAutenticado, (req, res) => {
  try {
    let pagina = req.params.pagina;
    let usuario = req.user ? req.user : {nome: 'Sem usuário'};
    if ((pagina == 'alunos' || pagina == 'disciplinas') && usuario.administrador != 1) {
		  res.status(403).redirect('/');
    } else {
      res.render('pages/' + pagina, { usuario: usuario });
    }
  } catch (e) {
    res.send(404, 'Página não encontrada: ' + e);
  }
});

// Faz a validação do login
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'senha'
},
  (username, password, done) => {
    usuariosCtrl.getUsuarioPorEmail(username, (err, usuario) => {
      if (err) throw err;
      if (!usuario) {
        return done(null, false);
      }
      usuariosCtrl.compararSenha(password, usuario.senha, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, usuario);
        } else {
          return done(null, false);
        }
      });
    });
  })
);

// Serializa usuário
passport.serializeUser((usuario, done) => {
  done(null, usuario.id);
});

// Desserializa usuário
passport.deserializeUser((id, done) => {
  usuariosCtrl.getUsuarioPorId(id, (err, usuario) => {
    done(err, usuario);
  });
});

// Recebe os dados enviados para registrar novo usuário
router.post('/registrar', usuariosCtrl.registrar);

// Recebe os dados enviados para fazer login
router.post('/entrar',
  passport.authenticate('local', { successRedirect: '/', failureRedirect: '/entrar' }));

router.get(['/api/usuarios/:atributo/:valor', '/api/usuarios/:valor'], verificaAutenticado, usuariosCtrl.buscarUsuarioPorAtributo);

router.put('/api/usuarios/:id', verificaAutenticado, usuariosCtrl.atualizarUsuario);

router.delete('/api/usuarios/:id', verificaAutenticado, usuariosCtrl.removerUsuario);

module.exports = router;