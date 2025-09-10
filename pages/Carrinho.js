import { CarrinhoCard } from "../components/CarrinhoCard.js";

export function Carrinho() {
    const main = document.createElement("main");
    main.classList.add("carrinho-page");

    function getCarrinhoAtualizado() {
        return JSON.parse(localStorage.getItem("carrinho")) || [];
    }

    let carrinho = getCarrinhoAtualizado();

    main.innerHTML = `
        <div class="page-title">Meu Carrinho</div>
        <div class="content">
            <section>
                <table>
                    <thead>
                        <tr>
                            <th>Produto</th>
                            <th>Preço</th>
                            <th>Quantidade</th>
                            <th>Total</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody class="carrinho-body"></tbody>
                </table>
            </section>
            <aside>
                <div class="box">
                    <header>Resumo da Compra</header>
                    <div class="details">
                        <div>
                            <span>Subtotal</span>
                            <span class="subtotal">R$ 0,00</span>
                        </div>
                        <div>
                            <span>Frete</span>
                            <span>Gratuito</span>
                        </div>
                    </div>
                    <footer>
                        <span>Total</span>
                        <span class="total">R$ 0,00</span>
                    </footer>
                    <button class="finalizar">Finalizar Compra</button>
                </div>
            </aside>
        </div>
    `;

    const tbody = main.querySelector(".carrinho-body");
    const subtotalSpan = main.querySelector(".subtotal");
    const totalSpan = main.querySelector(".total");

    function atualizarSubtotal() {
        let subtotal = 0;
        carrinho.forEach(p => subtotal += p.price * p.quantidade);
        subtotalSpan.textContent = `R$ ${subtotal.toFixed(2)}`;
        totalSpan.textContent = `R$ ${subtotal.toFixed(2)}`;
    }

    function removerProduto(id) {
        carrinho = carrinho.filter(p => p.id !== id);
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
        renderizarCarrinho();
    }

    function renderizarCarrinho() {
        tbody.innerHTML = "";
        carrinho.forEach(produto => {
            const linha = CarrinhoCard(produto, carrinho, removerProduto, atualizarSubtotal);
            tbody.appendChild(linha);
        });
        atualizarSubtotal();
    }

    renderizarCarrinho();

    return main;
}
