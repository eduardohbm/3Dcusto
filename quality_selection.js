// Implementação da seleção visual de qualidade de impressão
document.addEventListener('DOMContentLoaded', function() {
    // Mapeamento de altura de camada para rótulos
    const qualidadeLabels = {
        '0.08': 'Ultra Fino (0.08mm)',
        '0.12': 'Fino (0.12mm)',
        '0.16': 'Padrão (0.16mm)',
        '0.20': 'Normal (0.20mm)',
        '0.24': 'Áspero (0.24mm)'
    };
    
    // Mapeamento de altura de camada para multiplicadores de tempo
    const tempoMultiplicadores = {
        '0.08': 2.0,  // Dobro do tempo padrão
        '0.12': 1.4,  // 40% mais tempo que o padrão
        '0.16': 1.0,  // Tempo padrão
        '0.20': 0.8,  // 20% menos tempo que o padrão
        '0.24': 0.6   // 40% menos tempo que o padrão
    };
    
    // Função para atualizar a visualização de qualidade
    function atualizarVisualizacaoQualidade() {
        const alturaLayer = document.getElementById('layer-height').value;
        const qualidadeLabel = document.getElementById('qualidade-label');
        
        if (qualidadeLabel) {
            qualidadeLabel.textContent = qualidadeLabels[alturaLayer] || alturaLayer + 'mm';
        }
        
        // Atualizar imagem de preview
        const previewImg = document.getElementById('qualidade-preview-img');
        if (previewImg) {
            previewImg.src = `images/quality_${alturaLayer.replace('.', '')}.jpg`;
            previewImg.alt = `Qualidade ${qualidadeLabels[alturaLayer] || alturaLayer + 'mm'}`;
        }
    }
    
    // Função para abrir modal de comparação de qualidade
    function abrirComparacaoQualidade() {
        const modal = document.getElementById('quality-comparison-modal');
        if (!modal) return;
        
        modal.style.display = 'block';
        
        // Preencher conteúdo do modal
        const container = document.querySelector('.quality-comparison-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        // Adicionar cada opção de qualidade
        Object.keys(qualidadeLabels).forEach(altura => {
            const div = document.createElement('div');
            div.className = 'quality-item';
            
            div.innerHTML = `
                <h3>${qualidadeLabels[altura]}</h3>
                <img src="images/quality_${altura.replace('.', '')}.jpg" alt="${qualidadeLabels[altura]}">
                <p><strong>Tempo:</strong> ${tempoMultiplicadores[altura] === 1.0 ? 
                    'Padrão' : 
                    (tempoMultiplicadores[altura] > 1.0 ? 
                        `+${Math.round((tempoMultiplicadores[altura] - 1) * 100)}%` : 
                        `-${Math.round((1 - tempoMultiplicadores[altura]) * 100)}%`
                    )
                }</p>
                <p><strong>Custo:</strong> ${tempoMultiplicadores[altura] === 1.0 ? 
                    'Padrão' : 
                    (tempoMultiplicadores[altura] > 1.0 ? 
                        `+${Math.round((tempoMultiplicadores[altura] - 1) * 100)}%` : 
                        `-${Math.round((1 - tempoMultiplicadores[altura]) * 100)}%`
                    )
                }</p>
                <p><strong>Acabamento:</strong> ${
                    altura === '0.08' ? 'Excelente' :
                    altura === '0.12' ? 'Muito Bom' :
                    altura === '0.16' ? 'Bom' :
                    altura === '0.20' ? 'Regular' :
                    'Básico'
                }</p>
            `;
            
            container.appendChild(div);
        });
        
        // Adicionar tabela comparativa
        const tableContainer = document.querySelector('.quality-comparison-table');
        if (!tableContainer) return;
        
        tableContainer.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Qualidade</th>
                        <th>Altura da Camada</th>
                        <th>Tempo</th>
                        <th>Custo</th>
                        <th>Acabamento</th>
                        <th>Recomendado para</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Ultra Fino</td>
                        <td>0.08mm</td>
                        <td>+100%</td>
                        <td>+100%</td>
                        <td>Excelente</td>
                        <td>Miniaturas detalhadas, peças com detalhes finos</td>
                    </tr>
                    <tr>
                        <td>Fino</td>
                        <td>0.12mm</td>
                        <td>+40%</td>
                        <td>+40%</td>
                        <td>Muito Bom</td>
                        <td>Peças decorativas, protótipos de apresentação</td>
                    </tr>
                    <tr>
                        <td>Padrão</td>
                        <td>0.16mm</td>
                        <td>Padrão</td>
                        <td>Padrão</td>
                        <td>Bom</td>
                        <td>Maioria das peças, bom equilíbrio</td>
                    </tr>
                    <tr>
                        <td>Normal</td>
                        <td>0.20mm</td>
                        <td>-20%</td>
                        <td>-20%</td>
                        <td>Regular</td>
                        <td>Peças funcionais, protótipos rápidos</td>
                    </tr>
                    <tr>
                        <td>Áspero</td>
                        <td>0.24mm</td>
                        <td>-40%</td>
                        <td>-40%</td>
                        <td>Básico</td>
                        <td>Peças grandes, protótipos de baixo custo</td>
                    </tr>
                </tbody>
            </table>
        `;
    }
    
    // Adicionar event listener para mudança de altura de camada
    const layerHeightSelect = document.getElementById('layer-height');
    if (layerHeightSelect) {
        layerHeightSelect.addEventListener('change', atualizarVisualizacaoQualidade);
        
        // Inicializar visualização
        atualizarVisualizacaoQualidade();
    }
    
    // Adicionar event listener para botão de comparação de qualidade
    const compareQualityBtn = document.getElementById('compare-quality-btn');
    if (compareQualityBtn) {
        compareQualityBtn.addEventListener('click', abrirComparacaoQualidade);
    }
    
    // Função para obter rótulo da qualidade
    window.getQualidadeLabel = function(altura) {
        return qualidadeLabels[altura] || altura + 'mm';
    };
    
    // Função para obter multiplicador de tempo
    window.getTempoMultiplicador = function(altura) {
        return tempoMultiplicadores[altura] || 1.0;
    };
});
