// Script para inicializar botões de adicionar ao carrinho
document.addEventListener('DOMContentLoaded', function() {
    // Garantir que CarrinhoManager está disponível
    if (typeof carrinhoManager === 'undefined') {
        console.warn('CarrinhoManager não foi carregado antes deste script');
        return;
    }

    // Encontrar todos os botões de adicionar ao carrinho
    const botoesAdicionar = document.querySelectorAll('.btn-adicionar');
    
    console.log(`📦 Encontrados ${botoesAdicionar.length} botões de adicionar ao carrinho`);

    botoesAdicionar.forEach((botao, index) => {
        // Se o botão já tem listener, não adicionar novamente
        if (botao.dataset.listeners === 'true') return;

        botao.addEventListener('click', function(e) {
            e.preventDefault();
            
            const id = this.dataset.id;
            const nome = this.dataset.nome;
            const preco = this.dataset.preco;
            const imagem = this.dataset.imagem || 'Imagens/default.png';

            console.log(`✅ Adicionando ao carrinho: ${nome} (R$ ${preco})`);

            if (carrinhoManager && typeof carrinhoManager.adicionarProduto === 'function') {
                carrinhoManager.adicionarProduto(id, nome, preco, imagem);
            } else {
                console.error('❌ CarrinhoManager ou método adicionarProduto não disponível');
                alert('❌ Erro ao adicionar ao carrinho. Tente recarregar a página.');
            }
        });

        botao.dataset.listeners = 'true';
    });

    // Adicionar estilo visual ao passar o mouse
    botoesAdicionar.forEach(botao => {
        botao.style.transition = 'all 0.3s ease';
        
        botao.addEventListener('mouseover', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 5px 15px rgba(0, 120, 255, 0.3)';
        });

        botao.addEventListener('mouseout', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
});

console.log('✅ Script de carrinho inicializado');
