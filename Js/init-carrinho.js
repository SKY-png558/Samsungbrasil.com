document.addEventListener('DOMContentLoaded', function() {
    if (typeof carrinhoManager === 'undefined') {
        console.warn('CarrinhoManager não foi carregado antes deste script');
        return;
    }

    // Encontrar todos os botões de adicionar ao carrinho
    const botoesAdicionar = document.querySelectorAll('.btn-adicionar');
    
    console.log(`📦 Encontrados ${botoesAdicionar.length} botões de adicionar ao carrinho`);

    botoesAdicionar.forEach(botao => {
        // Normalizar preço direto do atributo data-preco
        const precoNormalizado = parseFloat(
            botao.dataset.preco
                .replace("R$", "")
                .replace(",", ".")
                .trim()
        );

        // Substituir o onclick do HTML por uma função que chama carrinhoManager
        botao.onclick = function(e) {
            e.preventDefault();

            const id = this.dataset.id;
            const nome = this.dataset.nome;
            const imagem = this.dataset.imagem || 'Imagens/default.png';

            console.log(`✅ Adicionando ao carrinho: ${nome} (R$ ${precoNormalizado.toFixed(2)})`);

            if (carrinhoManager && typeof carrinhoManager.adicionarProduto === 'function') {
                carrinhoManager.adicionarProduto(id, nome, precoNormalizado, imagem);
            } else {
                console.error('❌ CarrinhoManager ou método adicionarProduto não disponível');
                alert('❌ Erro ao adicionar ao carrinho. Tente recarregar a página.');
            }
        };

        // Estilo visual ao passar o mouse
        botao.style.transition = 'all 0.3s ease';
        botao.onmouseover = function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 5px 15px rgba(0, 120, 255, 0.3)';
        };
        botao.onmouseout = function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        };
    });
});

console.log('✅ Script de carrinho ajustado');