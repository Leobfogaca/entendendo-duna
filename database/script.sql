-- ENTENDENDO DUNA | Banco de dados do site
CREATE DATABASE entendendo_duna;
USE entendendo_duna;

CREATE TABLE usuario (
    idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(254) NOT NULL UNIQUE,
    senhaHash VARCHAR(255) NOT NULL,
    tipoUsuario VARCHAR(10) NOT NULL DEFAULT 'leitor' CHECK (tipoUsuario IN ('leitor', 'admin'))
);

CREATE TABLE personagem (
    idPersonagem INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(80) NOT NULL UNIQUE
);

-- Cada linha representa um teste terminado.
CREATE TABLE tentativa (
    idTentativa INT PRIMARY KEY AUTO_INCREMENT,
    fkUsuario INT NOT NULL,
    fkPersonagem INT NOT NULL,
    dataHora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fkUsuario) REFERENCES usuario(idUsuario),
    FOREIGN KEY (fkPersonagem) REFERENCES personagem(idPersonagem)
);

-- Cadastre os quatro personagens uma vez.
INSERT INTO personagem (nome)
VALUES ('Paul Atreides'), ('Chani'), ('Lady Jessica'), ('Stilgar');

-- Exemplo: se o usuário 1 terminou o teste e tirou o personagem 2,
-- a API grava a linha abaixo. Os dois IDs precisam existir.
-- INSERT INTO tentativa (fkUsuario, fkPersonagem) VALUES (1, 2);

-- CONSULTAS DA DASH
-- Exemplo de 7 dias: 17 a 23 de novembro, incluindo os dois dias.
-- DATE(dataHora) pega só a data. Na integração, a API informa as datas
-- dos últimos 7 ou 30 dias e repete a consulta 1 para o período anterior.

-- 1. Os dois primeiros cards: quantos leitores e quantos testes?
-- DISTINCT conta uma vez cada leitor. COUNT(*) conta todas as tentativas.
SELECT COUNT(DISTINCT fkUsuario) AS participantes,
       COUNT(*) AS testesConcluidos
FROM tentativa
JOIN usuario ON idUsuario = fkUsuario
WHERE tipoUsuario = 'leitor'
  AND DATE(dataHora) BETWEEN '2026-11-17' AND '2026-11-23';

-- 2. Terceiro card: quem fez dois ou mais testes no período?
-- Cada linha retornada vale uma pessoa que refez o teste.
SELECT fkUsuario, COUNT(*) AS quantidadeTestes
FROM tentativa
JOIN usuario ON idUsuario = fkUsuario
WHERE tipoUsuario = 'leitor'
  AND DATE(dataHora) BETWEEN '2026-11-17' AND '2026-11-23'
GROUP BY fkUsuario
HAVING COUNT(*) >= 2;

-- 3. Gráfico dos personagens: resultados do mais recente ao mais antigo.
-- No JavaScript, conte só a primeira linha de cada leitor.
-- Se o horário for igual, o maior idTentativa vem primeiro.
SELECT fkUsuario, personagem.nome AS personagemObtido
FROM tentativa
JOIN usuario ON idUsuario = fkUsuario
JOIN personagem ON idPersonagem = fkPersonagem
WHERE tipoUsuario = 'leitor'
  AND DATE(dataHora) BETWEEN '2026-11-17' AND '2026-11-23'
ORDER BY dataHora DESC, idTentativa DESC;

-- 4. Gráfico por dia: cada grupo reúne os testes feitos na mesma data.
-- No gráfico, dias sem linha recebem zero.
SELECT DATE(dataHora) AS dia, COUNT(*) AS testesConcluidos
FROM tentativa
JOIN usuario ON idUsuario = fkUsuario
WHERE tipoUsuario = 'leitor'
  AND DATE(dataHora) BETWEEN '2026-11-17' AND '2026-11-23'
GROUP BY DATE(dataHora)
ORDER BY dia;
