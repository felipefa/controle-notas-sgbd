$(() => {
	let pathname = window.document.location.pathname;
	let tipo = pathname.replace('/', '');

	if (pathname === '/alunos' || pathname === '/disciplinas') {
		montarTabelaPorTipo(tipo);
	} else if (pathname === '/notas') {
		montarSeletorPorTipo('alunos');
		montarSeletorPorTipo('disciplinas');
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

function calcularMedia() {
	let n1 = parseFloat($('#n1').val());
	let n2 = parseFloat($('#n2').val());
	let media = (n1 + n2) / 2;
	$('#media').val(media);
}

function exibirFormularioNotas() {
	let idAluno = $('#seletor_alunos').val();
	let idDisciplina = $('#seletor_disciplinas').val();

	if (idAluno && idDisciplina) {
		$('#media').val('');
		$('#n1').val('');
		$('#n2').val('');
		$('#editando_notas').val('false');
		let url = `${urlBaseApi}/notas/idAluno/${idAluno}`;
		$.get(url, ({resultado}) => {
			if (resultado) {
				resultado.forEach(dado => {
					if (idDisciplina == dado.idDisciplina) {
						$('#media').val(dado.media);
						$('#n1').val(dado.n1);
						$('#n2').val(dado.n2);
						$('#editando_notas').val('true');
					}
				});
			}
		});
		$('#linha_notas').show();
	}
}

function montarTabelaPorTipo(tipo) {
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

function montarSeletorPorTipo(tipo) {
	let url = `${urlBaseApi}/${tipo}`;

	$.get(url, (resultado) => {
		if (resultado.resultados) {
			listaJson = resultado.resultados;
			let html = '<option disabled selected>Selecione um item...</option>';

			listaJson.forEach((dado) => {
				if (tipo === 'alunos') {
					html += `
						<option value="${dado.id}">${dado.matricula} - ${dado.nome}</option>
					`;
				} else if (tipo === 'disciplinas') {
					html += `
						<option value="${dado.id}">${dado.codigo} - ${dado.nome}</option>
					`;
				}
			});

			$(`#seletor_${tipo}`).html(html);
		}
	});
}

function buscarDadosPorId(id) {
	let dados = null;

	listaJson.forEach(dado => {
		if (dado.id === id) {
			dados = dado;
		}
	});

	return dados;
}

function limparFormulario(tipo) {
	$(`.dados_${tipo}`).find('input').each(function () {
		$(this).val('');
	});
}

function editar(tipo, id) {
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

function remover(tipo, id) {
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

function salvar(tipo) {
	let url = `${urlBaseApi}/${tipo}`;
	let dados = {};

	$(`.dados_${tipo}`).find('input').each(function () {
		let elementoInput = $(this);
		let elementoName = elementoInput.prop('name');
		if (elementoInput.prop('type') === 'number') {
			dados[elementoName] = elementoInput.val() ? elementoInput.val() : 0;
		} else {
			dados[elementoName] = elementoInput.val() ? elementoInput.val() : '';
		}
	});

	if (tipo === 'notas') {
	}


	let metodo = null;
	if (dados.id) {
		metodo = 'PUT';
		url += `/${dados.id}`;
	} else if (tipo === 'notas') {
		dados['idAluno'] = $('#seletor_alunos').val();
		dados['idDisciplina'] = $('#seletor_disciplinas').val();
		if ($('#editando_notas').val() == 'true') {
			metodo = 'PUT';
			url += `/${dados.idAluno}/${dados.idDisciplina}`;
		} else {
			metodo = 'POST';
		}
	} else {
		metodo = 'POST';
	}

	console.log('Dados que serão salvos:', dados);
	dados = JSON.stringify(dados);

	$.ajax({
		method: metodo,
		url: url,
		headers: {
			"Content-Type": "application/json"
		},
		data: dados
	}).done(function () {
		if (tipo !== 'notas') {
			montarTabelaPorTipo(tipo);
			$(`#modal_${tipo}`).modal('hide');
			limparFormulario(tipo);
		}
	}).fail(function () {
		alert('Erro ao salvar');
	});

}