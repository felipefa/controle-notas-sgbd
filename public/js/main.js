$(() => {
	let pathname = window.document.location.pathname;
	let tipo = pathname.replace('/', '');

	if (pathname === '/alunos' || pathname === '/disciplinas') {
		montarTabelaPorTipo(tipo);
		$('#buscar').on('keypress', function (e) {
			if (e.keyCode === 13) {
				buscar(tipo);
			}
		});		
	} else if (pathname === '/notas') {
		montarSeletorPorTipo('alunos');
		montarSeletorPorTipo('disciplinas');
	} else if (pathname === '/relatorios') {
		montarSeletorPorTipo('disciplinas');
	}

	$(`#adicionar_${tipo}, #adicionar_${tipo}_link`).on('click', () => {
		limparFormulario(tipo);
		$(`#modal_${tipo}`).modal('show');
	});

	$(`#form_${tipo}`).submit(() => {
		salvar(tipo);
		return false;
	});

	$(`#form_usuarios`).submit(() => {
		salvar('usuarios');
		return false;
	});
	
	$(`#modal_${tipo}`).on('shown.bs.modal', () => {
		aplicarMascara();
	});

	let administrador = $('#administrador');

	if (administrador.val() == 1) {
		administrador.prop('checked', true);
		$('#nav_alunos').show();
		$('#nav_disciplinas').show();
		$('#row_alunos_disciplinas').show();
	} else {
		$('#nav_alunos').hide();
		$('#nav_disciplinas').hide();
		$('#row_alunos_disciplinas').hide();
	}
});

// Variáveis globais
const urlBaseApi = `${window.location.origin}/api`;
let listaJson = null;

function buscar(tipo) {
	if (listaJson) {
		let resultados = [];
		let buscar = $('#buscar').val().toUpperCase();

		listaJson.forEach(dado => {
			if (tipo === 'alunos') {
				if (dado.nome.toUpperCase().indexOf(buscar) > -1 ||
					dado.matricula.toUpperCase().indexOf(buscar) > -1 ||
					dado.cpf.toUpperCase().indexOf(buscar) > -1 ||
					dado.email.toUpperCase().indexOf(buscar) > -1) {
					resultados.push(dado);
				}
			} else if (tipo === 'disciplinas') {
				if (dado.nome.toUpperCase().indexOf(buscar) > -1 ||
					dado.codigo.toUpperCase().indexOf(buscar) > -1) {
					resultados.push(dado);
				}
			}
		});

		if (resultados.length > 0) {
			$(`#sem_${tipo}_busca`).hide();
		} else {
			$(`#sem_${tipo}_busca`).show();
		}
		montarTabelaPorTipo(tipo, resultados);
	}
}

function gerarRelatorio(tipo) {
	let notas = null;
	let alunos = null;
	let disciplinas = null;
	let idDisciplina = $('#seletor_disciplinas').val();

	if (tipo == 'geral' ||
		(idDisciplina && tipo == 'disciplina')) {
		$.get(`${urlBaseApi}/disciplinas`, ({resultados}) => {
			if (resultados.length > 0) {
				disciplinas = resultados;

				$.get(`${urlBaseApi}/notas`, ({resultados}) => {
					if (resultados.length > 0) {
						notas = resultados;

						$.get(`${urlBaseApi}/alunos`, ({resultados}) => {
							if (resultados.length > 0) {
								alunos = resultados;

								let conteudoRelatorio = [];
								conteudoRelatorio.push({
										text: 'Controle de Notas - SGBD',
										fontSize: 18,
										bold: true,
										margin: [0, 20, 0, 8]
									},
									'Relatório gerado pelo Sistema de Controle de Notas N1 e N2.');

								disciplinas.forEach(disciplina => {
									if (tipo == 'geral' ||
										(idDisciplina == disciplina.id && tipo == 'disciplina')) {
										let nomeDisciplina = {
											text: `${disciplina.codigo} - ${disciplina.nome}`,
											fontSize: 14,
											bold: true,
											margin: [0, 20, 0, 8]
										};

										let bodyTabela = [];
										bodyTabela.push(
											[{
												text: 'Matrícula',
												style: 'tableHeader'
											}, {
												text: 'Aluno',
												style: 'tableHeader'
											}, {
												text: 'N1',
												style: 'tableHeader'
											}, {
												text: 'N2',
												style: 'tableHeader'
											}, {
												text: 'Média',
												style: 'tableHeader'
											}]
										);

										notas.forEach(nota => {
											if ((disciplina.id == nota.idDisciplina && tipo == 'geral') ||
												($('#seletor_disciplinas').val() == nota.idDisciplina && tipo == 'disciplina')) {
												let linha = [];
												alunos.forEach(aluno => {
													if (aluno.id == nota.idAluno) {
														linha.push(aluno.matricula);
														linha.push(aluno.nome);
													}
												});
												linha.push(nota.n1 ? nota.n1 : '-');
												linha.push(nota.n2 ? nota.n2 : '-');
												linha.push(nota.media ? nota.media : '-');
												bodyTabela.push(linha);
											}
										});

										let tabela = {
											style: 'tableExample',
											table: {
												widths: ['25%', '55%', '5%', '5%', '10%'],
												headerRows: 1,
												body: bodyTabela
											},
											layout: 'lightHorizontalLines'
										}
										conteudoRelatorio.push(nomeDisciplina);
										conteudoRelatorio.push(tabela);
									}
								});

								let relatorio = {
									content: [conteudoRelatorio]
								};

								pdfMake.createPdf(relatorio).download(`relatorio_de_notas_${tipo}.pdf`);
							} else {
								mostrarMensagemUsuario('alert-warning', `Nenhum aluno encontrado. Cadastre um na página Alunos.`);
							}
						}).fail(function(e) {
							mostrarMensagemUsuario('alert-danger', `Erro ao buscar alunos: ${e.statusText}`);
						});
					} else {
						mostrarMensagemUsuario('alert-warning', `Nenhuma nota encontrada. Cadastre uma na página Notas.`);
					}
				}).fail(function(e) {
					mostrarMensagemUsuario('alert-danger', `Erro ao buscar notas: ${e.statusText}`);
				});
			} else {
				mostrarMensagemUsuario('alert-warning', `Nenhuma disciplina encontrada. Cadastre uma na página Disciplinas.`);
			}
		}).fail(function(e) {
			mostrarMensagemUsuario('alert-danger', `Erro ao buscar disciplinas: ${e.statusText}`);
		});
	} else {
		mostrarMensagemUsuario('alert-info', `Por favor, selecione uma disciplina para gerar seu relatório de notas.`);
	}
}

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
		$.get(url, ({
			resultado
		}) => {
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

function gerarHtmlLinhasTabela(tipo, dados) {
	let html = '';

	dados.forEach((dado, index) => {
		if (tipo === 'alunos') {
			html += `
				<tr>
					<th onClick="editar('${tipo}', ${dado.id})" scope="row">${index+1}</th>
					<td onClick="editar('${tipo}', ${dado.id})">${dado.nome}</td>
					<td onClick="editar('${tipo}', ${dado.id})" data-mask="0000.0.0000.0000-0">${dado.matricula}</td>
					<td onClick="editar('${tipo}', ${dado.id})" data-mask="000.000.000-00">${dado.cpf}</td>
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

	return html;
}

function montarTabelaPorTipo(tipo, dados) {
	$(`#tabela_${tipo}`).hide();
	$(`#carregando_${tipo}`).show();
	$(`#sem_${tipo}`).hide();

	if (dados) {
		let html = gerarHtmlLinhasTabela(tipo, dados);
		$(`#tbody_${tipo}`).html(html);
		$(`#tabela_${tipo}`).show();	
	} else {
		let url = `${urlBaseApi}/${tipo}`;

		$.get(url, ({
			resultados
		}) => {
			if (resultados.length > 0) {
				listaJson = resultados;
				let html = gerarHtmlLinhasTabela(tipo, resultados);
				$(`#tbody_${tipo}`).html(html);
				$(`#tabela_${tipo}`).show();
			} else {
				$(`#sem_${tipo}`).show();
			}
		}).fail(() => {
			$(`#sem_${tipo}`).show();
		});
	}

	$(`#carregando_${tipo}`).hide();
	setTimeout(()=>{
		aplicarMascara();
	}, 800);	
}

function montarSeletorPorTipo(tipo) {
	let url = `${urlBaseApi}/${tipo}`;

	$.get(url, ({
		resultados
	}) => {
		if (resultados.length > 0) {
			listaJson = resultados;
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
		mostrarMensagemUsuario('alert-success', `Dados removidos de ${tipo} com sucesso!`);
		montarTabelaPorTipo(tipo);
	}).fail(function (e) {
		mostrarMensagemUsuario('alert-danger', `Erro ao remover dados de ${tipo}: ${e.statusText}`);
	});
}

function salvar(tipo) {
	let url = `${urlBaseApi}/${tipo}`;
	let dados = {};

	$(`.dados_${tipo}`).find('input').each(function () {
		let elementoInput = $(this);
		let elementoName = elementoInput.prop('name');
		if (elementoInput.prop('type') === 'checkbox') {
			if (elementoInput.prop('checked')) {
				dados[elementoName] = 1;
			} else if (elementoName == 'administrador') {
				dados[elementoName] = 0;
			}
		} else if (elementoInput.prop('type') === 'number') {
			dados[elementoName] = elementoInput.val() ? elementoInput.val() : 0;
		} else {
			if (elementoName === 'cpf' || elementoName === 'matricula') {
				dados[elementoName] = elementoInput.cleanVal();
			} else {
				dados[elementoName] = elementoInput.val() ? elementoInput.val() : '';
			}
		}
	});

	if (tipo === 'usuarios') {
		dados['id'] = $('#idUsuario').val();
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

	// console.log('Dados que serão salvos:', dados);
	let nomeDados = dados.nome;
	dados = JSON.stringify(dados);


	$.ajax({
		method: metodo,
		url: url,
		headers: {
			"Content-Type": "application/json"
		},
		data: dados
	}).done(function () {
		if (tipo === 'usuarios') {
			location.reload();
		} else if (tipo === 'notas') {
			mostrarMensagemUsuario('alert-success', `Notas salvas com sucesso!`);
		} else {			
			mostrarMensagemUsuario('alert-success', `${nomeDados} salvo com sucesso!`);
			montarTabelaPorTipo(tipo);
			$(`#modal_${tipo}`).modal('hide');
			limparFormulario(tipo);
		}
	}).fail(function (e) {
		if (tipo === 'notas') {
			mostrarMensagemUsuario('alert-danger', `Erro ao salvar notas: ${e.statusText}`);
		} else {
			mostrarMensagemUsuario('alert-danger', `Erro ao salvar ${nomeDados}: ${e.statusText}`);
		}
	});
}

function mostrarMensagemUsuario(classe, mensagem) {	
	let alerta = $('[role=alert]');
	alerta.prop('class', `alert ${classe}`);
	alerta.html(mensagem);
	alerta.show();	
	setTimeout(() => {
		alerta.hide();
	}, 3500);
}

function aplicarMascara() {
	$('.cpf, .matricula, .codigo').unmask();
	$('.cpf').mask('000.000.000-00');
	$('.matricula').mask('0000.0.0000.0000-0');
	$('.codigo').mask('MMM0000', 
		{'translation': {M: {pattern: /[A-Z]/}}});
	$.applyDataMask();
}