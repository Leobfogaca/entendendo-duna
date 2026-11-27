function formatarPorcentagem(quantidade, participantes) {
  const porcentagem = participantes ? quantidade / participantes * 100 : 0
  return porcentagem.toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + '%'
}

function desenharGrafico(id, contagens, participantes, mostrarPorcentagem, mensagemVazio = 'Ainda não há participantes.') {
  const grafico = document.getElementById(id)
  const status = document.getElementById('status-' + id)
  grafico.replaceChildren()
  if (!contagens || typeof contagens !== 'object') {
    status.textContent = 'Dados do gráfico indisponíveis. Confira se o servidor está rodando a versão atualizada.'
    return
  }

  status.textContent = participantes ? '' : mensagemVazio
  if (!participantes) return

  for (const [nome, quantidade] of Object.entries(contagens)) {
    const linha = document.createElement('label')
    linha.className = 'grafico-linha'

    const titulo = document.createElement('span')
    titulo.textContent = nome

    const barra = document.createElement('meter')
    barra.max = participantes || 1
    barra.value = quantidade

    const valor = document.createElement('strong')
    valor.textContent = mostrarPorcentagem
      ? quantidade + ' de ' + participantes + ' leitores · ' + formatarPorcentagem(quantidade, participantes)
      : quantidade + (quantidade === 1 ? ' leitor' : ' leitores')

    linha.append(titulo, barra, valor)
    grafico.append(linha)
  }
}

async function carregarPainel() {
  const status = document.getElementById('status-indicadores')

  try {
    const resposta = await fetch('/dashboard/testes-concluidos')
    const dados = await resposta.json()
    if (!resposta.ok) {
      status.textContent = dados.mensagem || 'Não foi possível carregar os indicadores.'
      return
    }

    if (![dados.total, dados.participantes, dados.leitoresQueRefizeram].every(Number.isFinite)) {
      status.textContent = 'Dados dos indicadores indisponíveis. Confira a versão do servidor.'
      return
    }

    document.getElementById('total-testes').textContent = dados.total
    document.getElementById('total-participantes').textContent = dados.participantes
    document.getElementById('total-repetiram').textContent = dados.leitoresQueRefizeram
    document.getElementById('taxa-repeticao').textContent = dados.participantes
      ? formatarPorcentagem(dados.leitoresQueRefizeram, dados.participantes)
      : '—'

    if (dados.participantes) {
      document.getElementById('contexto-repeticao').textContent =
        dados.leitoresQueRefizeram + ' de ' + dados.participantes + ' participantes refizeram o teste.'
    }

    desenharGrafico('personagens', dados.personagens, dados.participantes, true)
    desenharGrafico('frequencias', dados.frequencias, dados.participantes, false)
    desenharGrafico('mudancas', dados.mudancas, dados.leitoresQueRefizeram, true,
      'Ainda não há leitores que concluíram o teste mais de uma vez.')
    status.textContent = dados.participantes ? '' : 'Ainda não há testes concluídos por leitores.'
  } catch {
    status.textContent = 'Não foi possível carregar o painel. Atualize a página para tentar novamente.'
  }
}

carregarPainel()
