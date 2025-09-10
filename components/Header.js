import { getProdutos } from "../services/api.js"

export function Header() {
    const header = document.createElement('header')
    header.className = 'app-header'
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

    // Mobile Navbar
    class MobileNavbar {
        constructor(header, mobileMenu, navList, navLinks) {
            this.header = header
            this.mobileMenu = header.querySelector(mobileMenu)
            this.navList = header.querySelector(navList)
            this.navLinks = header.querySelectorAll(navLinks)
            this.activeClass = "active"
            this.handleClick = this.handleClick.bind(this)
        }
        animateLinks() {
            this.navLinks.forEach((link, index) => {
                link.style.animation
                    ? (link.style.animation = "")
                    : (link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`)
            })
        }
        handleClick() {
            this.navList.classList.toggle(this.activeClass)
            this.mobileMenu.classList.toggle(this.activeClass)
            this.animateLinks()
        }
        addClickEvent() {
            this.mobileMenu.addEventListener("click", this.handleClick)
        }
        init() {
            if (this.mobileMenu) this.addClickEvent()
            return this
        }
    }

    new MobileNavbar(header, ".mobile-menu", ".nav-list", ".nav-list li").init()

    // Navegação SPA
    const links = header.querySelectorAll("a[data-route]")
    links.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault()
            const route = link.getAttribute("data-route")
            window.dispatchEvent(new CustomEvent("routechange", { detail: { path: route } }))
        })
    })

    // Barra de busca
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
        searchButton.innerHTML = `<img src="./assets/images/lupa2.png" alt="Buscar" width=25>`;

        inputWrapper.appendChild(input);
        inputWrapper.appendChild(searchButton);
        container.appendChild(inputWrapper);

        let produtos = [];
        try {
            produtos = await getProdutos();
        } catch (erro) {
            console.error("Erro ao carregar produtos: ", erro);
        }

        function buscarProdutos() {
            const main = document.querySelector("main");
            main.innerHTML = ""; // limpa o main

            const filter = input.value.toUpperCase();
            const resultados = produtos.filter(p => p.title.toUpperCase().includes(filter));

            if (resultados.length === 0) {
                const p = document.createElement("p");
                main.innerHTML = `
                    <div class="empty-title">Oops!</div>
                    <p class="empty-message">
                        Nenhum resultado encontrado.<br>
                        Tente verificar a ortografia ou usar termos mais genéricos.<br>
                        Consulte a página inicial contendo todos os produtos para ver as opções de compra.
                    </p>                
                `
            } else {
                resultados.forEach(item => {
                    const div = document.createElement("div");
                    div.className = "produto-card";
                    div.innerHTML = `
                        <img src="${item.image}" alt="${item.title}">
                        <h3>${item.title}</h3>
                        <p>$${item.price}</p>
                    `;
                    main.appendChild(div);
                });
            }
        }

        searchButton.addEventListener("click", buscarProdutos);
        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") buscarProdutos();
        });
    }

    setupSearch(header);

    return header;
}

export default Header;
