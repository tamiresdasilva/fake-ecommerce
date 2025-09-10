import { getProdutoById } from "../services/api.js"

export async function ProdutoDetalhes(id) {
    console.log("Buscando produto com id:", id) // <-- Aqui, para debugar

    const main = document.createElement("main")
    main.classList.add("produto-detalhes")

    try {
        const produto = await getProdutoById(id)

        main.innerHTML = `
            <div class="detalhes-card">
                <img src= "${produto.image}" alt="${produto.title}" class="detalhes-img"/>
                <div class="detalhes-info">
                    <h2 class="detalhes-title">${produto.title}</h2>
                    <p class="detalhes-category"><strong>Categoria:</strong> ${produto.category}</p>
                    <p class="detalhes-description">${produto.description}</p>
                    <p class="detalhes-price">R$ ${produto.price.toFixed(2)}</p>
                    <p class="detalhes-rating">⭐ ${produto.rating.rate} (${produto.rating.count} avaliações)</p>
                    <div class="detalhes-buttons">
                        <button class="detalhes-cart-btn">Adicionar ao carrinho de compras</button>
                        <button class="detalhes-fav-btn">Adicionar a lista de favoritos</button>
                    </div>
                </div>
            </div>
        `
        //Logica de adicionar o carrinho
        const cartBtn = main.querySelector(".detalhes-cart-btn")
        cartBtn.addEventListener("click", () => {
            let carrinho = JSON.parse(localStorage.getItem("carrinho")) || []

            const itemExistente = carrinho.find(p => p.id === produto.id)

            if (itemExistente) {
                itemExistente.quantidade += 1
                alert(`Produto "${produto.title}" adicionado novamente ao carrinho!`)

            } else {
                carrinho.push({ ...produto, quantidade: 1 })
                alert(`Produto "${produto.title}" adicionado ao carrinho!`)
            }
            localStorage.setItem("carrinho", JSON.stringify(carrinho))
        })

        //Botão de favoritos
        const favBtn = main.querySelector(".detalhes-fav-btn")
        favBtn.addEventListener("click", () => {
            let favoritos = JSON.parse(localStorage.getItem("favoritos")) || []
            const existe = favoritos.find(p => p.id === produto.id)

            if (!existe) {
                favoritos.push(produto)
                localStorage.setItem("favoritos", JSON.stringify(favoritos))
                alert(`Produto "${produto.title}" adicionado aos favoritos!`)
                favBtn.classList.add("favorito")
            } else {
                alert(`Produto "${produto.title}" já está nos favoritos!`)
            }
        })


    } catch (erro) {
        main.innerHTML = `<p>Produto não foi encontrado.</p>`
        console.error("Erro ao carregar detalhes:", erro)
    }

    return main
}