export function Card(produto) {
    const card = document.createElement("div")
    card.classList.add("card")

    card.innerHTML = `
        <button class="fav-btn" aria-label="Favoritar">
            <img src="./assets/images/heart2.png" alt="Favoritar">
        </button>

        <img src="${produto.image}" alt="${produto.title}" class="card-img">

        <h3 class="card-title">${produto.title}</h3>

        <div class="card-actions">
            <span class="price">R$ ${produto.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <button class="cart-btn" aria-label="Adicionar o carrinho">
                <img src="./assets/images/cart.png" alt = "Carrinho">
            </button>
        </div>
        
        <a href="#/product/${produto.id}" data-route="/product/${produto.id}" class="detalhes-btn">Ver Detalhes</a>
    `
    // Botão de favoritar
    const favBtn = card.querySelector(".fav-btn")
    favBtn.addEventListener("click", () => {
        let favoritos = JSON.parse(localStorage.getItem("favoritos")) || []

        const itemExistente = favoritos.find(p => p.id === produto.id)

        if (itemExistente) {
            favoritos = favoritos.filter(p => p.id !== produto.id)
            favBtn.classList.remove("favorito")
        } else {
            favoritos.push(produto)
            favBtn.classList.add("favorito")
        }
        localStorage.setItem("favoritos", JSON.stringify(favoritos))
    })

    // SPA para detalhes
    const detalhesBtn = card.querySelector(".detalhes-btn")
    detalhesBtn.addEventListener("click", (e) => {
        e.preventDefault() // impede o navegador de carregar
        window.dispatchEvent(new CustomEvent("routechange", {
            detail: { path: `/product/${produto.id}`}
        }))
    })

    const cartBtn = card.querySelector(".cart-btn")
    cartBtn.addEventListener("click", () => {
        //Pega carrinho do localStorage
        let carrinho = JSON.parse(localStorage.getItem("carrinho")) || []

        const itemExistente = carrinho.find(p => p.id === produto.id)

        if (itemExistente) {
            itemExistente.quantidade += 1
            alert(`Produto "${produto.title}" adicionado novamente ao carrinho!`)
        } else {
            carrinho.push({...produto, quantidade: 1})
            alert(`Produto "${produto.title}" adicionado ao carrinho!`)
        }
        localStorage.setItem("carrinho", JSON.stringify(carrinho))
    })

    return card
}


