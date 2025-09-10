export function CarrinhoCard(produto, carrinho, removerProduto, atualizarSubtotal) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td>
            <div class="product">
                <img src="${produto.image}" alt="${produto.title}" height="80" width="80">
                <div class="info">
                    <div class="name">${produto.title}</div>
                    <div class="category">${produto.category}</div>
                </div>
            </div>
        </td>
        <td>R$ ${produto.price.toFixed(2)}</td>
        <td>
            <div class="quantity">
                <button class="minus">-</button>
                <span>${produto.quantidade}</span>
                <button class="plus">+</button>
            </div>
        </td>
        <td class="total">R$ ${(produto.price * produto.quantidade).toFixed(2)}</td>
        <td>
            <button class="remove">x</button>
        </td>
    `;

    const btnMinus = tr.querySelector(".minus");
    const btnPlus = tr.querySelector(".plus");
    const qtySpan = tr.querySelector(".quantity span");
    const totalTd = tr.querySelector(".total");

    function atualizarTotalLocal() {
        const quantidade = parseInt(qtySpan.textContent);
        totalTd.textContent = `R$ ${(produto.price * quantidade).toFixed(2)}`;

        const itemIndex = carrinho.findIndex(p => p.id === produto.id);
        if (itemIndex > -1) {
            carrinho[itemIndex].quantidade = quantidade;
            localStorage.setItem("carrinho", JSON.stringify(carrinho));
        }

        atualizarSubtotal();
    }

    btnMinus.addEventListener("click", () => {
        let quantidade = parseInt(qtySpan.textContent);
        if (quantidade > 1) {
            qtySpan.textContent = quantidade - 1;
            atualizarTotalLocal();
        }
    });

    btnPlus.addEventListener("click", () => {
        let quantidade = parseInt(qtySpan.textContent);
        qtySpan.textContent = quantidade + 1;
        atualizarTotalLocal();
    });

    tr.querySelector(".remove").addEventListener("click", () => {
        removerProduto(produto.id);
    });

    return tr;
}
