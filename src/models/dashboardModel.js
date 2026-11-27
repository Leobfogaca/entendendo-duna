const banco = require("../database/config")

async function carregar() {
    const sql = `
        SELECT contagem.conclusoes, personagem.nome AS personagem,
               primeira.fkPersonagem = ultima.fkPersonagem AS mesmoPersonagem
        FROM (
            SELECT tentativa.fkUsuario, COUNT(*) AS conclusoes
            FROM tentativa
            JOIN usuario ON usuario.idUsuario = tentativa.fkUsuario
            WHERE usuario.tipoUsuario = ?
            GROUP BY tentativa.fkUsuario
        ) AS contagem
        JOIN tentativa AS ultima ON ultima.idTentativa = (
            SELECT t.idTentativa
            FROM tentativa AS t
            WHERE t.fkUsuario = contagem.fkUsuario
            ORDER BY t.dataHora DESC, t.idTentativa DESC
            LIMIT 1
        )
        LEFT JOIN tentativa AS primeira ON primeira.idTentativa = (
            SELECT t.idTentativa
            FROM tentativa AS t
            WHERE t.fkUsuario = contagem.fkUsuario
              AND contagem.conclusoes >= 2
            ORDER BY t.dataHora ASC, t.idTentativa ASC
            LIMIT 1
        )
        JOIN personagem ON personagem.idPersonagem = ultima.fkPersonagem
    `

    const leitores = await banco.executar(sql, ["leitor"])
    const personagens = { "Paul Atreides": 0, Chani: 0, "Lady Jessica": 0, Stilgar: 0 }
    const frequencias = { "Uma vez": 0, "Duas vezes": 0, "Três ou mais vezes": 0 }
    const mudancas = { "Mesmo personagem": 0, "Personagem diferente": 0 }
    let total = 0
    let leitoresQueRefizeram = 0

    for (const leitor of leitores) {
        const conclusoes = Number(leitor.conclusoes)
        total += conclusoes
        if (conclusoes >= 2) {
            leitoresQueRefizeram++
            const faixa = Number(leitor.mesmoPersonagem) === 1
                ? "Mesmo personagem"
                : "Personagem diferente"
            mudancas[faixa]++
        }

        if (conclusoes === 1) frequencias["Uma vez"]++
        else if (conclusoes === 2) frequencias["Duas vezes"]++
        else frequencias["Três ou mais vezes"]++
        personagens[leitor.personagem] = (personagens[leitor.personagem] || 0) + 1
    }

    return { total, participantes: leitores.length, leitoresQueRefizeram, personagens, frequencias, mudancas }
}

module.exports = { carregar }
