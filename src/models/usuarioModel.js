let database = require("../database/config")

function cadastrar(nome, email, senhaHash) {
    let sql = "INSERT INTO usuario (nome, email, senhaHash) VALUES (?, ?, ?)"

    return database.executar(sql, [nome, email, senhaHash])
}

function buscarPorEmail(email) {
    let sql = "SELECT idUsuario, nome, email, senhaHash, tipoUsuario FROM usuario WHERE email = ?"

    return database.executar(sql, [email])
}

module.exports = {
    cadastrar,
    buscarPorEmail
}