import { Header } from "../../components/Header.js"
import { ProdutoDetalhes } from "../../components/ProdutoDetalhes.js"
import { Home } from "../../pages/Home.js"
import { Favoritos } from "../../pages/Favoritos.js"
import { Carrinho } from "../../pages/Carrinho.js"

const app = document.getElementById("app")

// Renderiza a Header uma vez
app.prepend(Header())

let isRendering = false // flag para evitar múltiplas chamadas simultâneas

// Função que troca de página
async function mostrarPagina(rota) {
    if (isRendering) return // evita duplicar renderizações
    isRendering = true

    // Remove a main atual, se existir
    const mainExistente = app.querySelector("main")
    if (mainExistente) mainExistente.remove()

    // Renderiza a página certa
    let pagina
    if (rota.startsWith("/product/")) {
        const id = rota.split("/")[2]
        pagina = await ProdutoDetalhes(id)
    } else {
        switch (rota) {
            case "/favorites":
                pagina = Favoritos()
                break
            case "/carrinho":
                pagina = Carrinho()
                break
            default:
                pagina = await Home()
                break;
        }
    }

    app.appendChild(pagina)
    isRendering = false
}
//Inicializa com a Home
mostrarPagina("/home")

// Inicializa a rota ao carregar a página
function inicializarRota() {
    const route = window.location.hash.replace("#", "") || "/home"
    mostrarPagina(route)
}

//Evento custom para links SPA
window.addEventListener("routechange", async (e) => {
    const path = e.detail.path
    if (window.location.hash !== path) {
        window.location.hash = path // atualiza a URL
    }
    await mostrarPagina(path)
})

// Escuta mudanças no hash (botões voltar/avançar do navegador)
window.addEventListener("hashchange", () => {
    const route = window.location.hash.replace("#", "") || "/home"
    window.dispatchEvent(new CustomEvent("routechange", { detail: { path: route } }))
})

// Inicializa SPA
inicializarRota()