// Traz todos os produtos
export async function getProdutos(){
    try {
        const resposta = await fetch(`https://fakestoreapi.com/products`)
        if (!resposta.ok) throw new Error ("Erro ao buscar produtos na API!")
        return await resposta.json()
    } catch (erro) {
        console.error("Erro na API: ", erro)
        return []
    }
}

// Busca um produto individual com base no ID
export async function getProdutoById(id) {
    try {
        const resposta = await fetch(`https://fakestoreapi.com/products/${id}`)
        if (!resposta.ok) throw new Error("Erro ao buscar produto na API!")
        const produto = await resposta.json()
        console.log("Produto carregado:", produto) // <-- debug
        return produto
    } catch (erro) {
        console.error("Erro na API (getProdutoById):", erro)
        return null
    }
}