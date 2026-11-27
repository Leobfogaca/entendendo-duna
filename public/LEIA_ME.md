# Entendendo Duna | Versão com teste de personalidade

Esta versão mantém a home e as jornadas Antes/Depois do pacote anterior e integra o teste **Quem você seria em Arrakis?**.

## Para executar

1. Mantenha a estrutura de pastas (todos os arquivos HTML/CSS/JS e a pasta `assets` juntos).
2. Abra `index.html` no navegador. Você também pode usar **Live Server** no VS Code.
3. Entre em **Experiência** pelo menu ou pela chamada depois da seção de temas da home.
4. Responda às sete perguntas e veja a foto e a descrição do personagem. Em seguida, abra **Painel**.

No pacote de atualização, copie os arquivos sobre sua pasta anterior `Entendendo_Duna`, substituindo os existentes. O arquivo `dados-quiz.js` da versão antiga não é mais usado e pode ser removido.

**Observação de recursos:** a fonte já existente na versão anterior deve ser mantida em `assets/fontes/`. Não foi incluída nos downloads desta versão. As imagens da home permanecem as mesmas do pacote anterior e vêm junto no projeto completo. A foto do cabeçalho do teste é carregada por um endereço externo, como no protótipo aprovado, e depende da conexão e da disponibilidade dessa imagem.

## Arquivos do site

| Arquivo | Função |
| --- | --- |
| `index.html` e `styles.css` | Home original, agora com uma seção e link para o teste. |
| `experiencia.html` | Tela do teste integrada à navegação. |
| `experiencia.css` | Visual do teste aprovado. |
| `experiencia.js` | As mesmas sete perguntas e os quatro resultados do protótipo; registra contagens temporárias. |
| `dashboard.html`, `dashboard.css`, `dashboard.js` | Painel atualizado para os resultados de personalidade. |
| `antes.html` e `depois.html` | Jornadas originais, agora com acesso ao teste. |
| `login.html` | Prévia visual original do login. |
| `identidade.css` | Paleta e referência à fonte da versão anterior. |
| `assets` | Imagens já usadas na home. |

## Como funciona o cálculo

Cada pergunta tem quatro alternativas. A alternativa A representa Paul, B representa Chani, C representa Jessica e D representa Stilgar. O JavaScript percorre o vetor de respostas e soma os pontos de cada personagem. Vence quem recebeu mais pontos. Havendo empate, vence o perfil cuja alternativa foi escolhida mais recentemente entre os empatados. Não há nota ou resposta errada.

O teste já funciona sem servidor e não precisa de bibliotecas. O resultado aparece imediatamente na tela.

## O que o painel consegue mostrar agora

Ao concluir, o navegador guarda temporariamente apenas quatro contagens e o último perfil em `sessionStorage`. O painel consulta esses mesmos dados e calcula:

- Quantidade de conclusões nesta sessão do navegador.
- Personagem mais frequente e perfis diferentes encontrados.
- Distribuição percentual dos quatro personagens.
- Último personagem obtido.

Os dados são **locais da sessão**, não equivalem a usuários reais, não são enviados para nenhum servidor e são apagados quando a sessão termina. Repetir o teste gera uma nova conclusão. O navegador precisa permitir armazenamento de sessão; se não permitir, o resultado ainda aparece no teste, mas o painel ficará sem contagens.

## O que ainda não está implementado

O login continua apenas visual. Não existe cadastro funcional, API Node.js, MySQL ou dashboard com dados de visitantes reais. A autenticação e o banco continuam sendo as próximas etapas para cumprir todos os requisitos acadêmicos. O teste já pode ser apresentado como demonstração funcional de frontend, mas **não** como sistema integrado ao backend.

## O que mudou em relação à versão anterior

- Uma única experiência de personalidade entrou no lugar da proposta de quiz de acertos.
- Não foram adicionados os testes de Casas ou sobrevivência, conforme o escopo definido.
- O painel saiu do modelo fictício de acertos por filme e passou a mostrar as conclusões temporárias do teste de personagem.
- A estrutura da home, as imagens, o login visual e as páginas de leitura foram preservados.
- A documentação V1 em PDF ainda registra o escopo antigo e precisará ser revisada para refletir a troca do RF04 e dos indicadores da dashboard.

## Ajustes da interface (23/11/2026)

- O header de `experiencia.html` agora segue o mesmo logo, ordem de links, altura e comportamento responsivo da página inicial.
- O resultado mostra a fotografia do personagem ao lado do texto, com ajuste para celular.
- As fotografias são stills reais dos filmes, carregados de fontes externas. O funcionamento das fotos depende de internet e da disponibilidade das fontes; se uma delas falhar, aparece uma imagem genérica já existente em `assets`. Para ter as quatro fotos disponíveis offline, substitua as URLs do atributo `foto` em `experiencia.js` pelos caminhos de imagens locais de uso autorizado.

Créditos das imagens de personagens: divulgação dos filmes (Warner Bros. / Legendary), reproduzida em Empire (Paul e Chani), SlashFilm (Lady Jessica) e AARP (Stilgar).
