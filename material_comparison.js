// Implementação da comparação entre materiais
document.addEventListener('DOMContentLoaded', function() {
    // Event listener para o botão de comparar materiais
    document.getElementById('compare-materials-btn').addEventListener('click', function() {
        abrirModalCompararMateriais();
    });
    
    // Função para abrir o modal de comparação de materiais
    function abrirModalCompararMateriais() {
        const container = document.querySelector('.material-selection-container');
        container.innerHTML = '';
        
        // Obter materiais do escopo global
        const materiais = JSON.parse(localStorage.getItem('materiais')) || [];
        
        materiais.forEach((material, index) => {
            const div = document.createElement('div');
            div.className = 'material-checkbox';
            div.innerHTML = `
                <input type="checkbox" id="material-check-${index}" value="${index}">
                <label for="material-check-${index}">${material.nome}</label>
            `;
            container.appendChild(div);
        });
        
        document.getElementById('material-comparison-results').style.display = 'none';
        document.getElementById('material-comparison-modal').style.display = 'block';
    }
    
    // Event listener para o botão de comparar materiais selecionados
    document.getElementById('compare-materials-btn').addEventListener('click', function() {
        const checkboxes = document.querySelectorAll('.material-checkbox input:checked');
        if (checkboxes.length < 2) {
            mostrarToast('Selecione pelo menos 2 materiais para comparar');
            return;
        }
        
        const materiais = JSON.parse(localStorage.getItem('materiais')) || [];
        const materiaisSelecionados = Array.from(checkboxes).map(cb => materiais[parseInt(cb.value)]);
        
        compararMateriaisSelecionados(materiaisSelecionados);
    });
    
    // Função para comparar materiais selecionados
    function compararMateriaisSelecionados(materiaisSelecionados) {
        // Criar tabela de comparação
        const header = document.getElementById('comparison-header');
        const body = document.getElementById('comparison-body');
        
        header.innerHTML = '<th>Propriedade</th>';
        materiaisSelecionados.forEach(material => {
            header.innerHTML += `<th>${material.nome}</th>`;
        });
        
        body.innerHTML = '';
        
        // Adicionar linhas para cada propriedade
        const propriedades = [
            { nome: 'Valor (R$/kg)', prop: 'valor', formato: valor => `R$ ${valor.toFixed(2)}` },
            { nome: 'Densidade (g/cm³)', prop: 'densidade', formato: valor => valor.toFixed(2) },
            { nome: 'Comprimento (m/kg)', prop: 'comprimento', formato: valor => valor.toFixed(0) },
            { nome: 'Descrição', prop: 'descricao', formato: valor => valor || '-' },
            { nome: 'Aplicações', prop: 'aplicacoes', formato: valor => valor || '-' },
            { nome: 'Vantagens', prop: 'vantagens', formato: valor => valor || '-' },
            { nome: 'Desvantagens', prop: 'desvantagens', formato: valor => valor || '-' }
        ];
        
        propriedades.forEach(prop => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td><strong>${prop.nome}</strong></td>`;
            
            materiaisSelecionados.forEach(material => {
                const valor = material[prop.prop];
                tr.innerHTML += `<td>${valor ? prop.formato(valor) : '-'}</td>`;
            });
            
            body.appendChild(tr);
        });
        
        // Adicionar linha para custo estimado de uma peça padrão
        const tr = document.createElement('tr');
        tr.innerHTML = `<td><strong>Custo estimado (peça de 100g)</strong></td>`;
        
        materiaisSelecionados.forEach(material => {
            const custoPeca = (100 / 1000) * material.valor;
            tr.innerHTML += `<td>R$ ${custoPeca.toFixed(2)}</td>`;
        });
        
        body.appendChild(tr);
        
        document.getElementById('material-comparison-results').style.display = 'block';
    }
    
    // Função para criar biblioteca de informações sobre materiais
    function criarBibliotecaMateriais() {
        const container = document.querySelector('.material-info-cards-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        const materiais = JSON.parse(localStorage.getItem('materiais')) || [];
        
        materiais.forEach(material => {
            const card = document.createElement('div');
            card.className = 'material-card';
            
            card.innerHTML = `
                <h3>${material.nome}</h3>
                <p><span class="material-property">Valor:</span> R$ ${material.valor.toFixed(2)}/kg</p>
                <p><span class="material-property">Densidade:</span> ${material.densidade.toFixed(2)} g/cm³</p>
                <p><span class="material-property">Comprimento:</span> ${material.comprimento.toFixed(0)} m/kg</p>
                <p><span class="material-property">Descrição:</span> ${material.descricao || '-'}</p>
                <p><span class="material-property">Aplicações:</span> ${material.aplicacoes || '-'}</p>
                <p><span class="material-property">Vantagens:</span> ${material.vantagens || '-'}</p>
                <p><span class="material-property">Desvantagens:</span> ${material.desvantagens || '-'}</p>
            `;
            
            container.appendChild(card);
        });
    }
    
    // Função utilitária para exibir toast (replicada do script.js)
    function mostrarToast(mensagem) {
        const toast = document.getElementById('toast');
        toast.textContent = mensagem;
        toast.className = 'toast show';
        
        setTimeout(function() {
            toast.className = toast.className.replace('show', '');
        }, 3000);
    }
    
    // Inicializar biblioteca de materiais quando o modal for aberto
    document.querySelector('.material-info-cards-container') && 
    document.querySelector('.material-info-cards-container').closest('.modal').addEventListener('click', function(e) {
        if (e.target === this || e.target.classList.contains('close-modal')) {
            this.style.display = 'none';
        } else if (this.style.display === 'block') {
            criarBibliotecaMateriais();
        }
    });
});
