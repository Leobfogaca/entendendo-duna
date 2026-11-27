-- ENTENDENDO DUNA | MySQL 8
-- Banco novo: execute o arquivo inteiro.
-- Banco já configurado: execute o USE e somente os SELECTs da seção 3.

-- 1. Estrutura do banco
CREATE DATABASE entendendo_duna;
USE entendendo_duna;

CREATE TABLE usuario (
    idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(254) NOT NULL UNIQUE,
    senhaHash VARCHAR(255) NOT NULL,
    tipoUsuario VARCHAR(10) NOT NULL DEFAULT 'leitor',
    CHECK (tipoUsuario IN ('leitor', 'admin'))
);

CREATE TABLE personagem (
    idPersonagem INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE tentativa (
    idTentativa INT PRIMARY KEY AUTO_INCREMENT,
    fkUsuario INT NOT NULL,
    fkPersonagem INT NOT NULL,
    dataHora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fkUsuario) REFERENCES usuario(idUsuario),
    FOREIGN KEY (fkPersonagem) REFERENCES personagem(idPersonagem)
);

-- 2. Dados iniciais
INSERT INTO personagem (nome)
VALUES ('Paul Atreides'), ('Chani'), ('Lady Jessica'), ('Stilgar');

-- 3. Consultas para conferir a dashboard
-- Todos os indicadores consideram o histórico completo das contas de leitor.

-- 3.1 Quatro indicadores
-- Primeiro contamos as conclusões de cada leitor.
-- Depois contamos os participantes e quantos concluíram mais de uma vez.
WITH conclusoesPorLeitor AS (
    SELECT tentativa.fkUsuario, COUNT(*) AS conclusoes
    FROM tentativa
    JOIN usuario ON usuario.idUsuario = tentativa.fkUsuario
    WHERE usuario.tipoUsuario = 'leitor'
    GROUP BY tentativa.fkUsuario
)
SELECT COALESCE(SUM(conclusoes), 0) AS testesConcluidos,
       COUNT(*) AS participantesUnicos,
       COUNT(CASE WHEN conclusoes >= 2 THEN 1 END) AS leitoresQueRefizeram,
       ROUND(100.0 * COUNT(CASE WHEN conclusoes >= 2 THEN 1 END)
             / NULLIF(COUNT(*), 0), 1) AS taxaRepeticaoPercentual
FROM conclusoesPorLeitor;

-- 3.2 Gráfico de personagens
-- Cada leitor entra com seu último resultado.
-- Quando o horário é igual, o maior idTentativa fica por último.
WITH ultimosResultados AS (
    SELECT ultima.fkPersonagem
    FROM usuario
    JOIN tentativa AS ultima ON ultima.idTentativa = (
        SELECT t.idTentativa
        FROM tentativa AS t
        WHERE t.fkUsuario = usuario.idUsuario
        ORDER BY t.dataHora DESC, t.idTentativa DESC
        LIMIT 1
    )
    WHERE usuario.tipoUsuario = 'leitor'
)
SELECT personagem.nome AS personagem,
       COUNT(ultimosResultados.fkPersonagem) AS leitores,
       COALESCE(ROUND(100.0 * COUNT(ultimosResultados.fkPersonagem)
                      / NULLIF((SELECT COUNT(*) FROM ultimosResultados), 0), 1), 0)
           AS percentual
FROM personagem
LEFT JOIN ultimosResultados ON ultimosResultados.fkPersonagem = personagem.idPersonagem
GROUP BY personagem.idPersonagem, personagem.nome
ORDER BY personagem.idPersonagem;

-- 3.3 Gráfico de frequência de participação
WITH conclusoesPorLeitor AS (
    SELECT tentativa.fkUsuario, COUNT(*) AS conclusoes
    FROM tentativa
    JOIN usuario ON usuario.idUsuario = tentativa.fkUsuario
    WHERE usuario.tipoUsuario = 'leitor'
    GROUP BY tentativa.fkUsuario
)
SELECT COUNT(CASE WHEN conclusoes = 1 THEN 1 END) AS umaVez,
       COUNT(CASE WHEN conclusoes = 2 THEN 1 END) AS duasVezes,
       COUNT(CASE WHEN conclusoes >= 3 THEN 1 END) AS tresOuMaisVezes
FROM conclusoesPorLeitor;

-- 3.4 Gráfico de mudança de personagem
-- Entram apenas leitores com duas ou mais conclusões.
WITH leitoresQueRefizeram AS (
    SELECT tentativa.fkUsuario
    FROM tentativa
    JOIN usuario ON usuario.idUsuario = tentativa.fkUsuario
    WHERE usuario.tipoUsuario = 'leitor'
    GROUP BY tentativa.fkUsuario
    HAVING COUNT(*) >= 2
),
comparacao AS (
    SELECT primeira.fkPersonagem AS primeiroPersonagem,
           ultima.fkPersonagem AS ultimoPersonagem
    FROM leitoresQueRefizeram AS leitor
    JOIN tentativa AS primeira ON primeira.idTentativa = (
        SELECT t.idTentativa
        FROM tentativa AS t
        WHERE t.fkUsuario = leitor.fkUsuario
        ORDER BY t.dataHora, t.idTentativa
        LIMIT 1
    )
    JOIN tentativa AS ultima ON ultima.idTentativa = (
        SELECT t.idTentativa
        FROM tentativa AS t
        WHERE t.fkUsuario = leitor.fkUsuario
        ORDER BY t.dataHora DESC, t.idTentativa DESC
        LIMIT 1
    )
)
SELECT COUNT(CASE WHEN primeiroPersonagem = ultimoPersonagem THEN 1 END)
           AS mesmoPersonagem,
       COUNT(CASE WHEN primeiroPersonagem <> ultimoPersonagem THEN 1 END)
           AS personagemDiferente,
       COUNT(*) AS totalQueRefizeram
FROM comparacao;
