// Função para normalizar preços no formato brasileiro
function normalizarPreco(precoStr) {
    // Remove "R$" e espaços
    let valor = precoStr.replace("R$", "").trim();
    // Remove pontos de milhar (ex: 4.199,00 → 4199,00)
    valor = valor.replace(/\./g, "");
    // Troca vírgula por ponto (4199,00 → 4199.00)
    valor = valor.replace(",", ".");
    // Converte para número
    return parseFloat(valor);
}

document.addEventListener('DOMContentLoaded', function() {
    if (typeof carrinhoManager === 'undefined') {
        console.warn('CarrinhoManager não foi carregado antes deste script');
        return;
    }

    const botoesAdicionar = document.querySelectorAll('.btn-adicionar');
    console.log(`📦 Encontrados ${botoesAdicionar.length} botões de adicionar ao carrinho`);

    botoesAdicionar.forEach(botao => {
        botao.onclick = function(e) {
            e.preventDefault();

            const id = this.dataset.id;
            const nome = this.dataset.nome;
            const preco = normalizarPreco(this.dataset.preco);
            const imagem = this.dataset.imagem || 'Imagens/default.png';

            console.log(`✅ Adicionando ao carrinho: ${nome} (R$ ${preco.toFixed(2)})`);

            if (carrinhoManager && typeof carrinhoManager.adicionarProduto === 'function') {
                carrinhoManager.adicionarProduto(id, nome, preco, imagem);
            } else {
                console.error('❌ CarrinhoManager ou método adicionarProduto não disponível');
                alert('❌ Erro ao adicionar ao carrinho. Tente recarregar a página.');
            }
        };

        // Estilo visual
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

console.log('✅ Script de carrinho ajustado e preços normalizados');