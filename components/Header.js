import { getProdutos } from "../services/api.js";

export function Header() {
    const header = document.createElement('header');
    header.className = 'app-header';
    header.innerHTML = `
    <nav>
        <a class="logo" href="#/home" data-route="/home">Fake E-Commerce</a>

        <div id="search-container" class="search-container" aria-live="polite"></div>

        <div class="mobile-menu" role="button" aria-label="Abrir menu" aria-expanded="false" tabindex="0">
            <div class="line1"></div>
            <div class="line2"></div>
            <div class="line3"></div>
        </div>

        <ul class="nav-list">
            <li><a href="#/home" data-route="/home" class="nav-link">Início</a></li>
            <li><a href="#/favorites" data-route="/favorites" class="nav-link">Favoritos</a></li>
            <li><a href="#/carrinho" data-route="/carrinho" class="nav-link">Carrinho</a></li>
        </ul>
    </nav>
    `;

    class MobileNavbar {
        constructor(header, mobileMenu, navList, navLinks) {
            this.header = header;
            this.mobileMenu = header.querySelector(mobileMenu);
            this.navList = header.querySelector(navList);
            this.navLinks = header.querySelectorAll(navLinks);
            this.activeClass = "active";
            this.handleClick = this.handleClick.bind(this);
        }

        animateLinks() {
            this.navLinks.forEach((link, index) => {
                link.style.animation
                    ? (link.style.animation = "")
                    : (link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`);
            });
        }

        handleClick() {
            this.navList.classList.toggle(this.activeClass);
            this.mobileMenu.classList.toggle(this.activeClass);
            this.animateLinks();
        }

        addClickEvent() {
            this.mobileMenu.addEventListener("click", this.handleClick);
        }

        init() {
            if (this.mobileMenu) this.addClickEvent();
            return this;
        }
    }

    new MobileNavbar(header, ".mobile-menu", ".nav-list", ".nav-list li").init();

    const links = header.querySelectorAll("a[data-route]");
    links.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const route = link.getAttribute("data-route");
            window.dispatchEvent(new CustomEvent("routechange", { detail: { path: route } }));
        });
    });

    //Barra de busca
    async function setupSearch(header) {
        const container = header.querySelector("#search-container");

        const inputWrapper = document.createElement("div");
        inputWrapper.className = "input-wrapper";

        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "O que você procura?";
        input.id = "inputBusca";

        const searchButton = document.createElement("button");
        searchButton.id = "search-button";
        searchButton.innerHTML = "🔍";

        inputWrapper.appendChild(input);
        inputWrapper.appendChild(searchButton);
        container.appendChild(inputWrapper);

        //Cria a lista de pré-visualização
        const ul = document.createElement("ul");
        ul.id = "listaProdutos";
        ul.style.display = "none";
        container.appendChild(ul);

        let produtos = [];
        try {
            produtos = await getProdutos();
            produtos.forEach(item => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <a href="#/product/${item.id}" data-route="/product/${item.id}">
                        <img src="${item.image}" alt="${item.title}">
                        <span class="item-name">${item.title}</span>
                    </a>
                `;
                ul.appendChild(li);
            });

            //SPA nos links do dropdown
            const dropLinks = ul.querySelectorAll("a[data-route]");
            dropLinks.forEach(link => {
                link.addEventListener("click", (e) => {
                    e.preventDefault();
                    const route = link.getAttribute("data-route");
                    window.dispatchEvent(new CustomEvent("routechange", { detail: { path: route } }));
                    ul.style.display = "none";
                    input.value = "";
                });
            });

        } catch (erro) {
            console.error("Erro ao carregar produtos: ", erro);
        }

        //Função de filtragem e pré-visualização
        input.addEventListener("keyup", () => {
            const filter = input.value.toUpperCase();
            const li = ul.getElementsByTagName("li");
            let count = 0;

            for (let i = 0; i < li.length; i++) {
                const a = li[i].getElementsByTagName("a")[0];
                const txtValue = a.textContent || a.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    li[i].style.display = "";
                    count++;
                    const span = li[i].querySelector(".item-name");
                    if (span) {
                        span.innerHTML = txtValue.replace(new RegExp(filter, "gi"), (match) => `<strong>${match}</strong>`);
                    }
                } else {
                    li[i].style.display = "none";
                }
            }

            ul.style.display = count > 0 ? "block" : "none";

            //Se não encontrar nada, mostra mensagem
            const main = document.querySelector("main");
            if (filter && count === 0) {
                main.innerHTML = `
                    <div class="empty-title">Oops!</div>
                    <p class="empty-message">
                        Nenhum resultado encontrado.<br>
                        Tente verificar a ortografia ou usar termos mais genéricos.<br>
                        Consulte a página inicial contendo todos os produtos para ver as opções de compra.
                    </p>
                `;
            } else if (!filter) {
                main.innerHTML = ""; //limpa se input vazio
            }
        });

        //Fecha dropdown ao perder foco
        input.addEventListener("blur", () => {
            setTimeout(() => {
                ul.style.display = "none";
            }, 150);
        });

        //Busca ao clicar no botão
        searchButton.addEventListener("click", () => {
            input.dispatchEvent(new KeyboardEvent('keyup'));
        });
    }

    setupSearch(header);

    return header;
}

export default Header;
