// As quatro opções de cada pergunta correspondem, nessa ordem, aos quatro personagens.
    let perguntas = [
      { texto: 'Quando tudo muda de repente, qual é sua primeira reação?', opcoes: [
        'Tento entender o que pode acontecer depois',
        'Questiono decisões que prejudicam as pessoas',
        'Analiso a situação antes de revelar meu plano',
        'Procuro unir as pessoas para enfrentarmos o problema'
      ]},
      { texto: 'O que você mais valoriza em um líder?', opcoes: [
        'Visão para tomar decisões difíceis',
        'Respeito à liberdade de cada pessoa',
        'Capacidade de agir com estratégia',
        'Compromisso com a comunidade'
      ]},
      { texto: 'Se tivesse influência sobre uma grande decisão, você...', opcoes: [
        'Pensaria em suas consequências para o futuro',
        'Garantiria que todos pudessem discordar',
        'Estudaria os interesses envolvidos',
        'Consultaria quem seria diretamente afetado'
      ]},
      { texto: 'Ao chegar a um lugar desconhecido, você prefere...', opcoes: [
        'Observar as possibilidades à sua frente',
        'Conhecer as pessoas sem impor suas ideias',
        'Entender as regras e as relações de poder',
        'Aprender os costumes de quem vive ali'
      ]},
      { texto: 'Qual destas dificuldades você enfrentaria?', opcoes: [
        'Assumir a responsabilidade por uma escolha incerta',
        'Discordar mesmo quando estiver sozinho',
        'Ter paciência até encontrar o momento certo',
        'Abrir mão de algo para ajudar seu grupo'
      ]},
      { texto: 'Em uma equipe, seu papel costuma ser...', opcoes: [
        'Encontrar caminhos que ninguém percebeu',
        'Apontar decisões que precisam ser questionadas',
        'Antecipar problemas e preparar alternativas',
        'Fazer com que todos se sintam parte da equipe'
      ]},
      { texto: 'Qual frase melhor representa suas escolhas?', opcoes: [
        'Nem todo caminho está claro, mas preciso decidir',
        'Nenhuma causa deve apagar a minha voz',
        'Antes de agir, preciso compreender o jogo',
        'Ninguém atravessa o deserto sozinho'
      ]}
    ]

    let perfis = [
      { nome: 'Paul Atreides', foto: 'https://images.bauerhosting.com/legacy/media/6132/095c/f234/ffdc/0a67/7d4e/dune-rev-main.jpg?ar=16%3A9&auto=format&crop=top&fit=crop&q=80&w=1200', subtitulo: 'Visão, destino e responsabilidade', descricao: 'Suas escolhas apontam para quem procura enxergar além do momento presente. Você tende a valorizar possibilidades, consequências e a responsabilidade de decidir, mesmo diante de dúvidas.', conexao: 'Tema para explorar: destino ou livre-arbítrio? Nos filmes, a trajetória de Paul convida a pensar sobre o peso das expectativas e o perigo de confundir poder com certeza.' },
      { nome: 'Chani', foto: 'https://images.bauerhosting.com/legacy/media/6123/929b/e39a/a111/4c7b/baca/dune-3.jpg?ar=16%3A9&auto=format&crop=top&fit=crop&q=80&w=1440', subtitulo: 'Autonomia, coragem e pensamento crítico', descricao: 'Suas respostas se aproximam de alguém que valoriza a liberdade, a sinceridade e o direito de questionar autoridades. Para você, a voz das pessoas importa tanto quanto qualquer grande plano.', conexao: 'Tema para explorar: quem tem o direito de decidir por um povo? Chani ajuda a discutir autonomia, pertencimento e a relação entre liderança e liberdade.' },
      { nome: 'Lady Jessica', foto: 'https://www.slashfilm.com/img/gallery/what-happens-to-rebecca-fergusons-lady-jessica-in-the-dune-books/l-intro-1739203231.jpg', subtitulo: 'Estratégia, observação e influência', descricao: 'Você priorizou compreender os interesses de cada situação antes de agir. Suas decisões sugerem afinidade com a capacidade de analisar conflitos, perceber oportunidades e pensar vários passos à frente.', conexao: 'Tema para explorar: como a influência molda decisões? A trajetória de Jessica abre discussões sobre estratégia, crença e estruturas de poder.' },
      { nome: 'Stilgar', foto: 'https://aarp.widen.net/content/n8kef2rqmd/jpeg/1140-08-dune-javier-bardem.jpg?anchor=0%2C0&color=ffffffff&crop=true&h=655&q=80&u=ovnylx&w=1140', subtitulo: 'Comunidade, tradição e confiança', descricao: 'Suas respostas indicam valorização do coletivo, da lealdade e do conhecimento adquirido com a experiência. Você prefere construir confiança antes de tomar decisões que atingem outras pessoas.', conexao: 'Tema para explorar: tradição e crença podem fortalecer ou limitar uma comunidade? Stilgar permite refletir sobre pertencimento e a força das convicções.' }
    ]

    let tentativaAtual
    async function salvarResultado() {
      const tentativa = tentativaAtual
      const aviso = document.getElementById('registro')
      const repetir = document.getElementById('repetir-envio')
      const refazer = document.getElementById('refazer')
      repetir.hidden = true
      refazer.disabled = true
      aviso.textContent = 'Salvando resultado...'
      try {
        const resposta = await fetch('/tentativas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tentativa)
        })
        if (!resposta.ok) throw new Error(await resposta.text())
        aviso.textContent = 'Resultado salvo na sua conta.'
      } catch (erro) {
        aviso.textContent = erro.message || 'Falha ao salvar o resultado.'
        repetir.hidden = false
      } finally {
        refazer.disabled = false
      }
    }

    let indice = 0
    let respostas = []

    function mostrarPergunta() {
      document.getElementById('contador').innerText = String(indice + 1).padStart(2, '0') + ' / 07'
      document.getElementById('numero-lateral').innerText = String(indice + 1).padStart(2, '0')
      document.getElementById('barra').style.width = (indice / perguntas.length * 100) + '%'
      document.getElementById('pergunta').innerText = perguntas[indice].texto
      document.getElementById('opcoes').innerHTML = ''
      document.getElementById('voltar').style.visibility = indice == 0 ? 'hidden' : 'visible'

      for (let i = 0; i < 4; i++) {
        let botao = document.createElement('button')
        botao.className = 'opcao'
        botao.innerHTML = '<span class="letra">' + ['A','B','C','D'][i] + '</span><span>' + perguntas[indice].opcoes[i] + '</span>'
        botao.onclick = function() { responder(i) }
        document.getElementById('opcoes').appendChild(botao)
      }
    }

    function responder(opcao) {
      respostas[indice] = opcao
      indice++
      if (indice < perguntas.length) {
        mostrarPergunta()
      } else {
        mostrarResultado()
      }
    }

    function voltar() {
      if (indice > 0) {
        indice--
        mostrarPergunta()
      }
    }

    function mostrarResultado() {
      let pontos = [0, 0, 0, 0]
      for (let i = 0; i < respostas.length; i++) {
        pontos[respostas[i]]++
      }
      let vencedor = 0
      for (let i = 1; i < pontos.length; i++) {
        if (pontos[i] > pontos[vencedor]) vencedor = i
      }
      // Se houver empate, prevalece o perfil escolhido mais recentemente entre os empatados.
      for (let i = respostas.length - 1; i >= 0; i--) {
        if (pontos[respostas[i]] == pontos[vencedor]) {
          vencedor = respostas[i]
          break
        }
      }
      registrarSessao(vencedor)
      let perfil = perfis[vencedor]
      tentativaAtual = { personagem: perfil.nome, chave: Array.from(crypto.getRandomValues(new Uint32Array(4))).join('-') }
      salvarResultado()
      document.getElementById('tela-perguntas').classList.add('oculto')
      document.getElementById('tela-resultado').classList.remove('oculto')
      document.getElementById('numero-lateral').innerText = '07'
      let foto = document.getElementById('foto-resultado')
      foto.src = perfil.foto
      foto.alt = 'Imagem de ' + perfil.nome + ' nos filmes de Duna'
      // Se a fonte deixar de disponibilizar a imagem, exibe uma foto do acervo do site.
      foto.onerror = function() {
        foto.onerror = null
        foto.src = 'assets/arrakis-inicio.jpg'
        foto.alt = 'Paisagem de Arrakis, imagem alternativa'
      }
      document.getElementById('nome-resultado').innerText = perfil.nome
      document.getElementById('subtitulo-resultado').innerText = perfil.subtitulo
      document.getElementById('descricao-resultado').innerText = perfil.descricao
      document.getElementById('conexao').innerText = perfil.conexao
    }

    function reiniciar() {
      indice = 0
      respostas = []
      document.getElementById('tela-perguntas').classList.remove('oculto')
      document.getElementById('tela-resultado').classList.add('oculto')
      mostrarPergunta()
    }


    // Guarda somente contagens nesta sessão do navegador, sem dados pessoais.
    // O login e o banco serão conectados em outra etapa do projeto.
    function registrarSessao(indicePerfil) {
      try {
        let dados = sessionStorage.getItem('duna_resultados_sessao')
        let resultados = dados ? JSON.parse(dados) : [0, 0, 0, 0]
        resultados[indicePerfil]++
        sessionStorage.setItem('duna_resultados_sessao', JSON.stringify(resultados))
        sessionStorage.setItem('duna_ultimo_perfil', String(indicePerfil))
      } catch (erro) {
        // Mesmo sem armazenamento disponível, o resultado aparece na tela.
      }
    }

    mostrarPergunta()
