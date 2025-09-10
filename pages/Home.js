import { Card } from "../components/Card.js"
import { getProdutos } from "../services/api.js"


export async function Home() {
    const main = document.createElement("main")
    main.className = "home"

    const containerProdutos = document.createElement("div")
    containerProdutos.className = "container-produtos"
    main.appendChild(containerProdutos)

    try {
        const produtos = await getProdutos()

        produtos.forEach(produto => {
            const cardProduto = Card(produto)
            containerProdutos.appendChild(cardProduto)
        })
    } catch (erro) {
        console.error("Erro ao carregar produtos na Home:", erro)
        const mensagemErro = document.createElement("p")
        mensagemErro.textContent = "Não foi possível carregar os produtos!"
        main.appendChild(mensagemErro)
    }

    return main
}