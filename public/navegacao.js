async function atualizarMenu() {
    const resposta = await fetch("/usuarios/sessao", { cache: "no-store" })
    if (!resposta.ok) return
    const { autenticado, administrador, nome } = await resposta.json()
    const conta = document.querySelector(".conta-atual")
    conta.hidden = !autenticado
    conta.querySelector("span").textContent = autenticado ? "Conectado como " + nome : ""
    conta.querySelector("button").onclick = async () => {
        try {
            const saida = await fetch("/usuarios/sair", { method: "POST" })
            if (!saida.ok) throw new Error()
            location.replace("/index.html")
        } catch {
            conta.querySelector("span").textContent = "Não foi possível sair. Tente novamente."
        }
    }
    for (const elemento of document.querySelectorAll("[data-acesso]")) {
        elemento.hidden = elemento.dataset.acesso === "admin" ? !administrador : !autenticado
    }
    for (const link of document.querySelectorAll('nav a[href="login.html"]')) {
        link.hidden = autenticado
    }
}
window.addEventListener("pageshow", () => atualizarMenu().catch(() => {}))
