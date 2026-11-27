# Alteração de escopo | 20/11/2026

**Decisão:** substituir o quiz de conhecimento por um teste narrativo de personalidade chamado **Quem você seria em Arrakis?**.

**Escopo atual:** um teste com 7 perguntas e 4 resultados: Paul Atreides, Chani, Lady Jessica e Stilgar. Os perfis são interpretações criativas inspiradas nos dois filmes de Denis Villeneuve, sem spoilers importantes.

**Novo RF04 proposto:** permitir que o visitante responda a 7 perguntas com 4 alternativas e apresente um perfil com base nas escolhas. O resultado deve ser armazenado para o usuário autenticado quando a API estiver pronta.

**Novos indicadores propostos:** testes concluídos, distribuição dos quatro perfis, personagem mais frequente e último resultado pessoal. Acertos e pontuações deixam de se aplicar à experiência.

**Situação da implementação:** formulário e cálculo concluídos em HTML/CSS/JS, com visualização temporária por sessão no painel. Cadastro, API e banco ainda não conectados.

## Ajuste visual (23/11/2026)

- Cabeçalho da página **Experiência** alinhado com o cabeçalho da home, com o mesmo logo, links, ordem e comportamento responsivo.
- Adicionada imagem associada ao personagem na tela final (Paul, Chani, Jessica ou Stilgar). As imagens são divulgadas por fontes externas e têm fallback para uma imagem já existente no projeto caso fiquem indisponíveis.
- Perguntas, cálculo de perfis e dashboard mantidos sem alteração de regras.
