const { randomUUID } = require("node:crypto")
const sessoes = new Map()
const duracao = 8 * 60 * 60 * 1000

function identificar(req) {
    const cookie = (req.headers.cookie || "").split(";").map(item => item.trim())
        .find(item => item.startsWith("duna_sessao="))
    return cookie?.slice("duna_sessao=".length)
}

function iniciar(req, res, idUsuario, tipoUsuario, nome) {
    sessoes.delete(identificar(req))
    const chave = randomUUID()
    sessoes.set(chave, { idUsuario, tipoUsuario, nome, expira: Date.now() + duracao, tentativas: new Map() })
    res.cookie("duna_sessao", chave, { httpOnly: true, sameSite: "lax", maxAge: duracao, secure: req.secure })
}

function obter(req) {
    const sessao = sessoes.get(identificar(req))
    if (sessao && sessao.expira > Date.now()) return sessao
}

setInterval(() => {
    for (const [chave, sessao] of sessoes) {
        if (sessao.expira <= Date.now()) sessoes.delete(chave)
    }
}, 60000).unref()

function sair(req, res) {
    sessoes.delete(identificar(req))
    res.clearCookie("duna_sessao", { path: "/" })
    res.sendStatus(204)
}
module.exports = { iniciar, obter, sair }
