const express = require('express');
const router = express.Router();
const usuariosCtrl = require('../controllers/usuarios.controller');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const alunosRoute = require('./alunos.route');
const disciplinasRoute = require('./disciplinas.route');
const notasRoute = require('./notas.route');

express().use('/api/alunos', alunosRoute);

// Redireciona para a página de login
router.get('/entrar', (req, res) => {
  res.render('pages/entrar');
});

// Redireciona para a página de cadastro de usuário
router.get('/registrar', (req, res) => {
  res.render('pages/registrar');
});

// Redireciona para a página inicial caso esteja logado, senão vai para a página de login
router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('pages/index', {usuario: req.user});
  } else {
    res.redirect('/entrar');
  }
});

// Redireciona para a página inicial caso esteja logado, senão vai para a página de login
router.get('/alunos', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('pages/alunos', {usuario: req.user});
  } else {
    res.redirect('/entrar');
  }
});

// Redireciona para a página inicial caso esteja logado, senão vai para a página de login
router.get('/disciplinas', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('pages/disciplinas', {usuario: req.user});
  } else {
    res.redirect('/entrar');
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

passport.serializeUser((usuario, done) => {
  done(null, usuario.id);
});

passport.deserializeUser((id, done) => {
  usuariosCtrl.getUsuarioPorId(id, (err, usuario) => {
    done(err, usuario);
  });
});

// Recebe os dados enviados para registrar novo usuário
router.post('/registrar', usuariosCtrl.registrar);

// Recebe os dados enviados para fazer login
router.post('/entrar',
  passport.authenticate('local', { successRedirect: '/', failureRedirect: '/entrar' }),
  (req, res) => {
    res.redirect('/');
  });

// Sai da conta logada e redireciona para a página de login
router.get('/sair', (req, res) => {
  req.logout();

  res.redirect('/entrar');
});

module.exports = router;