var mysql = require("mysql2");

// CONEXÃO DO BANCO MYSQL SERVER
var mySqlConfig = {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
};

function executar(instrucao, valores = []) {
    let ambiente = process.env.AMBIENTE_PROCESSO

    if (ambiente !== "producao" && ambiente !== "desenvolvimento") {
        return Promise.reject(new Error("Ambiente do banco não configurado"))
    }

    return new Promise(function (resolve, reject) {
        let conexao = mysql.createConnection(mySqlConfig)

        conexao.query(instrucao, valores, function (erro, resultados) {
            conexao.end()

            if (erro) {
                reject(erro)
            } else {
                resolve(resultados)
            }
        })
    })
}

module.exports = {
    executar
};