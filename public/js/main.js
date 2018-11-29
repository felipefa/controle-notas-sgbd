$(() => {
	let pathname = window.document.location.pathname;
	montarTabela(pathname);
});

// Variáveis globais
const urlBaseApi = `${window.location.origin}/api`;
let dados = null;

montarTabela = (tipo) => {
	let url = urlBaseApi + tipo;
	tipo = tipo.replace('/', '');
	$(`#carregando_${tipo}`).show();

	$.get(url, (resultado) => {
		dados = resultado.resultados ? resultado.resultados : null;
		if (dados.length > 0) {
			let html = '';

			dados.forEach((dado, index) => {
				if (tipo === 'alunos') {
					html += `
						<tr onClick="editar('${tipo}', ${dado.id})">
							<th scope="row">${index+1}</th>
							<td>${dado.nome}</td>
							<td>${dado.matricula}</td>
							<td>${dado.cpf}</td>
							<td>${dado.email}</td>
							<td class="text-center"><button class="btn btn-danger" onClick="remover('${tipo}', ${dado.id})"><i class="fas fa-trash-alt"></i></button></td>
						</tr>
					`;
				} else if (tipo === 'disciplinas') {
					html += `
						<tr onClick="editar('${tipo}', ${dado.id})">
							<th scope="row">${index+1}</th>
							<td>${dado.codigo}</td>
							<td>${dado.nome}</td>
							<td class="text-center"><button class="btn btn-danger" onClick="remover('${tipo}', ${dado.id})"><i class="fas fa-trash-alt"></i></button></td>
						</tr>
					`;
				}
			});

			$(`#tbody_${tipo}`).html(html);
			$(`#tabela_${tipo}`).show();
		} else {
			$(`#nenhum_${tipo}`).show();
		}
	}).fail(() => {
		$(`#nenhum_${tipo}`).show();
	}).always(() => {
		$(`#carregando_${tipo}`).hide();
	});
}

editar = (tipo, id) => {
	console.log(`editou ${tipo} com id=${id}`)
}

remover = (tipo, id) => {
	console.log(`removeu ${tipo} com id=${id}`)
}