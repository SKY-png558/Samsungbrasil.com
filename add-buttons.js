// Script para adicionar botões de carrinho dinamicamente aos produtos que não têm
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach((card, index) => {
        // Verificar se o card já tem um botão de adicionar ao carrinho
        if (card.querySelector('.btn-adicionar')) {
            return; // Já tem o botão, pular
        }

        // Obter informações do produto do card
        const img = card.querySelector('img');
        const h3 = card.querySelector('h3');
        const precoDiv = card.querySelector('.preco');

        if (!h3 || !precoDiv) return; // Card inválido

        const nome = h3.textContent.trim();
        let preco = precoDiv.textContent.trim();
        
        // Limpar o preço (remover "R$" e converter)
        preco = preco.replace('R$', '').replace(/\s+/g, '').replace(',', '.');
        
        // Gerar ID único baseado no nome e índice
        const id = `produto-${index}-${Date.now()}`;
        const imagem = img ? img.src : 'Imagens/default.png';

        // Criar o botão
        const botao = document.createElement('button');
        botao.className = 'btn-adicionar';
        botao.dataset.id = id;
        botao.dataset.nome = nome;
        botao.dataset.preco = preco;
        botao.dataset.imagem = imagem;
        botao.textContent = '🛒 Adicionar ao Carrinho';
        botao.style.cssText = `
            width: 100%;
            padding: 10px;
            margin-top: 10px;
            background: linear-gradient(135deg, #0078ff 0%, #00a8ff 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.3s ease;
        `;

        // Adicionar ao final do card
        card.appendChild(botao);

        console.log(`✅ Botão adicionado ao produto: ${nome}`);
    });

    console.log(`✅ Total de botões adicionados: ${document.querySelectorAll('.btn-adicionar').length}`);
});
