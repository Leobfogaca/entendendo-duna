const router = require("express").Router()
const database = require("../database/config")
const sessoes = require("../sessao")

router.post("/", async (req, res) => {
    const sessao = sessoes.obter(req)
    if (!sessao) return res.status(401).send("Entre novamente para salvar o resultado.")
    const { personagem, chave } = req.body
    if (typeof chave !== "string" || !/^[a-zA-Z0-9-]{8,64}$/.test(chave) ||
        !["Paul Atreides", "Chani", "Lady Jessica", "Stilgar"].includes(personagem)) {
        return res.status(400).send("Resultado inválido.")
    }

    // Duas requisições da mesma tentativa aguardam a mesma gravação.
    if (!sessao.tentativas.has(chave)) {
        const sql = `INSERT INTO tentativa (fkUsuario, fkPersonagem)
                     SELECT ?, idPersonagem FROM personagem WHERE nome = ?`
        sessao.tentativas.set(chave, database.executar(sql, [sessao.idUsuario, personagem]))
    }
    try {
        const resultado = await sessao.tentativas.get(chave)
        if (resultado.affectedRows !== 1) throw new Error("Personagem ausente")
        res.sendStatus(201)
    } catch {
        sessao.tentativas.delete(chave)
        res.status(500).send("O resultado não foi salvo. Confira a conexão e os personagens no banco.")
    }
})

module.exports = router
