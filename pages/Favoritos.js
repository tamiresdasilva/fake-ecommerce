import { Card } from "../components/Card.js"

export function Favoritos() {
    const main = document.createElement("main")
    main.classList.add("favoritos-page")

    const titulo = document.createElement("h2")
    titulo.className = "page-title"
    titulo.textContent = "Meus Favoritos"
    main.appendChild(titulo)

    const containerProdutos = document.createElement("div")
    containerProdutos.className = "container-produtos"
    main.appendChild(containerProdutos)

    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || []

    if (favoritos.length === 0) {
        const mensagem = document.createElement("p")
        mensagem.textContent = "Você ainda não adicionou nenhum produto aos favoritos."
        containerProdutos.appendChild(mensagem)
    } else {
        favoritos.forEach(produto => {
            const card = Card(produto)
            containerProdutos.appendChild(card)

            const favBtn = card.querySelector(".fav-btn")
            if (favBtn) favBtn.classList.add("favorito")

            favBtn.addEventListener("click", () => {
                let fav = JSON.parse(localStorage.getItem("favoritos")) || []
                fav = fav.filter(p => p.id !== produto.id)
                localStorage.setItem("favoritos", JSON.stringify(fav))
                card.remove()

                if (fav.length === 0) {
                    containerProdutos.innerHTML = ''
                    const mensagem = document.createElement("p")
                    mensagem.textContent = "Você ainda não adicionou nenhum produto aos favoritos."
                    containerProdutos.appendChild(mensagem)
                }
            })
        })
    }
    
    return main
}