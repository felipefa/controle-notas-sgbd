// Verifica se usuário está logado e encaminha para a próxima rota
module.exports = (req, res, next) => {
	if (req.isAuthenticated()) {
		console.log('Usuario logado: ' + req.user.nome);
		next();
	} else {
		res.redirect('/entrar');
	}
}