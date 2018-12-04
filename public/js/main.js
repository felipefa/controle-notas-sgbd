$(() => {
	let pathname = window.document.location.pathname;
	let tipo = pathname.replace('/', '');

	if (pathname === '/alunos' || pathname === '/disciplinas') {
		montarTabelaPorTipo(tipo);
	} else if (pathname === '/notas') {
		montarSeletorDisciplinas();
	}

	$(`#adicionar_${tipo}`).on('click', () => {
		$(`#modal_${tipo}`).modal('show');
	});

	$(`#form_${tipo}`).submit(() => {
		salvar(tipo);
		return false;
	});
	
});

// Variáveis globais
const urlBaseApi = `${window.location.origin}/api`;
let listaJson = null;

montarTabelaPorTipo = (tipo) => {
	let url = `${urlBaseApi}/${tipo}`;
	$(`#tabela_${tipo}`).hide();
	$(`#carregando_${tipo}`).show();

	$.get(url, (resultado) => {
		if (resultado.resultados) {
			listaJson = resultado.resultados;
			let html = '';

			listaJson.forEach((dado, index) => {
				if (tipo === 'alunos') {
					html += `
						<tr>
							<th onClick="editar('${tipo}', ${dado.id})" scope="row">${index+1}</th>
							<td onClick="editar('${tipo}', ${dado.id})">${dado.nome}</td>
							<td onClick="editar('${tipo}', ${dado.id})">${dado.matricula}</td>
							<td onClick="editar('${tipo}', ${dado.id})">${dado.cpf}</td>
							<td onClick="editar('${tipo}', ${dado.id})">${dado.email}</td>
							<td class="text-center"><button class="btn btn-danger" onClick="remover('${tipo}', ${dado.id})"><i class="fas fa-trash-alt"></i></button></td>
						</tr>
					`;
				} else if (tipo === 'disciplinas') {
					html += `
						<tr>
							<th onClick="editar('${tipo}', ${dado.id})" scope="row">${index+1}</th>
							<td onClick="editar('${tipo}', ${dado.id})">${dado.codigo}</td>
							<td onClick="editar('${tipo}', ${dado.id})">${dado.nome}</td>
							<td class="text-center"><button class="btn btn-danger" onClick="remover('${tipo}', ${dado.id})"><i class="fas fa-trash-alt"></i></button></td>
						</tr>
					`;
				}
			});

			$(`#tbody_${tipo}`).html(html);
			$(`#tabela_${tipo}`).show();
		} else {
			$(`#sem_${tipo}`).show();
		}
	}).fail(() => {
		$(`#sem_${tipo}`).show();
	}).always(() => {
		$(`#carregando_${tipo}`).hide();
	});
}

montarSeletorDisciplinas = () => {
	let url = `${urlBaseApi}/disciplinas`;

	$.get(url, (resultado) => {
		if (resultado.resultados) {
			listaJson = resultado.resultados;
			let html = '<option disabled selected>Selecione uma disciplina...</option>';

			listaJson.forEach((dado) => {
				html += `
					<option value="${dado.id}">${dado.codigo} - ${dado.nome}</option>
				`;
			});

			$(`#seletorDisciplina`).html(html);
		}
	});
}

buscarDadosPorId = (id) => {
	let dados = null;

	listaJson.forEach(dado => {
		if (dado.id === id) {
			dados = dado;
		}
	});

	return dados;
}

limparFormulario = (tipo) => {
	$(`.dados_${tipo}`).find('input').each(function () {
		$(this).val('');
	});
}

editar = (tipo, id) => {
	let dados = buscarDadosPorId(id);

	if (dados) {
		$(`.dados_${tipo}`).find('input').each(function () {
			let elementoInput = $(this);
			let elementoName = elementoInput.prop('name');
			let nomesCamposObjeto = Object.keys(dados);
			nomesCamposObjeto.forEach(nomeCampo => {
				if (nomeCampo === elementoName) {
					elementoInput.val(dados[nomeCampo]);
				}
			});
		});

		$(`#modal_${tipo}`).modal('show');
	} else {
		alert('Dados não encontrados!');
	}
}

remover = (tipo, id) => {
	let url = `${urlBaseApi}/${tipo}/${id}`;

	$.ajax({
		method: 'DELETE',
		url: url
	}).done(function () {
		montarTabelaPorTipo(tipo);		
	}).fail(function () {
		alert('Erro ao remover');
	});
}

salvar = (tipo) => {
	let url = `${urlBaseApi}/${tipo}`;
	let dados = {};

	$(`.dados_${tipo}`).find('input').each(function () {
		let elementoInput = $(this);
		let elementoName = elementoInput.prop('name');
		if (elementoInput.val()) {
			dados[elementoName] = elementoInput.val();
		}
	});

	// console.log('Dados que serão salvos:', dados);
	
	let metodo = null;
	if (dados.id) {
		metodo = 'PUT';
		url += `/${dados.id}`;
	} else {
		metodo = 'POST';
	}
	dados = JSON.stringify(dados);

	$.ajax({
		method: metodo,
		url: url,
		headers: { "Content-Type": "application/json" },
		data: dados
	}).done(function () {
		montarTabelaPorTipo(tipo);		
		$(`#modal_${tipo}`).modal('hide');
		limparFormulario(tipo);
	}).fail(function () {
		alert('Erro ao salvar');
	});
	
}