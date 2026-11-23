// O painel mostra apenas os resultados desta sessão.
// Os dados reais exigirão login, API e banco de dados.
let nomes = ['Paul Atreides', 'Chani', 'Lady Jessica', 'Stilgar']
let descricoes = [
  'Visão, destino e responsabilidade.',
  'Autonomia, coragem e pensamento crítico.',
  'Estratégia, observação e influência.',
  'Comunidade, tradição e confiança.'
]

function atualizarPainel() {
  let dados = null
  try {
    dados = sessionStorage.getItem('duna_resultados_sessao')
  } catch (erro) {
    dados = null
  }
  let quantidades = dados ? JSON.parse(dados) : [0, 0, 0, 0]
  let total = 0
  let diferentes = 0
  let maior = 0

  for (let i = 0; i < quantidades.length; i++) {
    total += quantidades[i]
    if (quantidades[i] > 0) diferentes++
    if (quantidades[i] > quantidades[maior]) maior = i
  }

  document.getElementById('total-testes').innerText = total
  document.getElementById('total-perfis').innerHTML = diferentes + ' <small>/ 4</small>'
  document.getElementById('mais-frequente').innerText = total == 0 ? 'Nenhum' : nomes[maior]

  let html = ''
  for (let i = 0; i < nomes.length; i++) {
    let porcentagem = total == 0 ? 0 : quantidades[i] / total * 100
    html += '<div class="barline">' +
      '<span>' + nomes[i] + '</span>' +
      '<div class="track"><div class="fill" style="width:' + porcentagem + '%"></div></div>' +
      '<strong>' + porcentagem.toFixed(0) + '%</strong></div>'
  }
  document.getElementById('personagens').innerHTML = html

  let ultimo = null
  try {
    ultimo = sessionStorage.getItem('duna_ultimo_perfil')
  } catch (erro) {
    ultimo = null
  }
  if (ultimo !== null && total > 0) {
    document.getElementById('ultimo-perfil').innerText = nomes[Number(ultimo)]
    document.getElementById('texto-perfil').innerText = descricoes[Number(ultimo)]
  }
}

function trocarSecao(secao) {
  document.body.setAttribute('data-view', secao)
  let botoes = document.querySelectorAll('.sidebar nav button')
  for (let i = 0; i < botoes.length; i++) {
    if (botoes[i].getAttribute('data-view') == secao) {
      botoes[i].setAttribute('aria-current', 'page')
    } else {
      botoes[i].removeAttribute('aria-current')
    }
  }
}

atualizarPainel()
