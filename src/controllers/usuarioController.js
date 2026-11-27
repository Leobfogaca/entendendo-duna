let usuarioModel = require("../models/usuarioModel")
let bcrypt = require("bcryptjs")

async function cadastrar(req, res) {
    let { nomeServer, emailServer, senhaServer } = req.body

    if (typeof nomeServer !== "string" || typeof emailServer !== "string" ||
        typeof senhaServer !== "string") {
        return res.status(400).send("Preencha nome, e-mail e senha.")
    }

    let nome = nomeServer.trim()
    let email = emailServer.trim()

    if (!nome || !email || !senhaServer) {
        return res.status(400).send("Preencha nome, e-mail e senha.")
    }

    if (nome.length > 100 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).send("Confira o nome e o e-mail informados.")
    }

    if (Buffer.byteLength(senhaServer, "utf8") > 72) {
        return res.status(400).send("A senha é muito longa.")
    }

    try {
        let senhaHash = await bcrypt.hash(senhaServer, 12)
        await usuarioModel.cadastrar(nome, email, senhaHash)
        return res.status(201).send("Conta criada com sucesso!")
    } catch (erro) {
        if (erro.code === "ER_DUP_ENTRY") {
            return res.status(409).send("Este e-mail já está cadastrado.")
        }

        return res.status(500).send("Erro ao cadastrar usuário.")
    }
}

async function autenticar(req, res) {
    let { emailServer, senhaServer } = req.body

    if (typeof emailServer !== "string" || typeof senhaServer !== "string" ||
        !emailServer.trim() || !senhaServer) {
        return res.status(400).send("Preencha e-mail e senha.")
    }

    try {
        let usuarios = await usuarioModel.buscarPorEmail(emailServer.trim())
        let usuario = usuarios[0]

        if (!usuario || Buffer.byteLength(senhaServer, "utf8") > 72 ||
            !(await bcrypt.compare(senhaServer, usuario.senhaHash))) {
            return res.status(401).send("E-mail ou senha incorretos.")
        }

        require("../sessao").iniciar(req, res, usuario.idUsuario, usuario.tipoUsuario, usuario.nome)
        return res.json({
            id: usuario.idUsuario,
            nome: usuario.nome,
            email: usuario.email
        })
    } catch (erro) {
        return res.status(500).send("Erro ao realizar login.")
    }
}

module.exports = {
    cadastrar,
    autenticar
}