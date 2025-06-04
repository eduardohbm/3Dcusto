// Implementação de melhorias nos campos de entrada para usabilidade
document.addEventListener('DOMContentLoaded', function() {
    // Função para formatar campos de entrada
    function configurarCamposEntrada() {
        // Campo de tempo de impressão (formato H:MM)
        const horasInput = document.getElementById('horas-impressao');
        const minutosInput = document.getElementById('minutos-impressao');
        
        if (horasInput && minutosInput) {
            // Limitar entrada de horas a números
            horasInput.addEventListener('input', function() {
                this.value = this.value.replace(/[^0-9]/g, '');
            });
            
            // Limitar entrada de minutos a números e máximo 59
            minutosInput.addEventListener('input', function() {
                this.value = this.value.replace(/[^0-9]/g, '');
                if (parseInt(this.value) > 59) {
                    this.value = '59';
                }
            });
            
            // Adicionar tooltip de ajuda
            const tempoContainer = document.querySelector('.tempo-container');
            if (tempoContainer) {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip-info';
                tooltip.innerHTML = '<i class="fas fa-info-circle"></i><span class="tooltip-text">Insira o tempo exatamente como aparece no Orca Slicer (ex: para 4h 39m, digite 4 em horas e 39 em minutos)</span>';
                tempoContainer.appendChild(tooltip);
            }
        }
        
        // Campo de comprimento do filamento (aceitar ponto e vírgula)
        const comprimentoInput = document.getElementById('comprimento-filamento');
        if (comprimentoInput) {
            comprimentoInput.addEventListener('input', function() {
                // Permitir apenas números, ponto e vírgula
                this.value = this.value.replace(/[^0-9.,]/g, '');
                
                // Converter vírgula para ponto (para cálculos)
                this.dataset.valor = this.value.replace(',', '.');
            });
            
            // Adicionar tooltip de ajuda
            const comprimentoContainer = document.querySelector('.comprimento-container');
            if (comprimentoContainer) {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip-info';
                tooltip.innerHTML = '<i class="fas fa-info-circle"></i><span class="tooltip-text">Insira o comprimento em metros como mostrado no Orca Slicer. Você pode usar ponto ou vírgula como separador decimal (ex: 4.09 ou 4,09)</span>';
                comprimentoContainer.appendChild(tooltip);
            }
        }
        
        // Campo de peso da peça (aceitar ponto e vírgula)
        const pesoInput = document.getElementById('peso-peca');
        if (pesoInput) {
            pesoInput.addEventListener('input', function() {
                // Permitir apenas números, ponto e vírgula
                this.value = this.value.replace(/[^0-9.,]/g, '');
                
                // Converter vírgula para ponto (para cálculos)
                this.dataset.valor = this.value.replace(',', '.');
            });
            
            // Adicionar tooltip de ajuda
            const pesoContainer = document.querySelector('.peso-container');
            if (pesoContainer) {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip-info';
                tooltip.innerHTML = '<i class="fas fa-info-circle"></i><span class="tooltip-text">Insira o peso em gramas como mostrado no Orca Slicer. Você pode usar ponto ou vírgula como separador decimal</span>';
                pesoContainer.appendChild(tooltip);
            }
        }
        
        // Campo de pós-processamento (renomeado de "Tempo de mão de obra")
        const posProcessamentoInput = document.getElementById('tempo-pos-processamento');
        if (posProcessamentoInput) {
            // Adicionar tooltip de ajuda
            const posProcessamentoContainer = document.querySelector('.pos-processamento-container');
            if (posProcessamentoContainer) {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip-info';
                tooltip.innerHTML = '<i class="fas fa-info-circle"></i><span class="tooltip-text">Tempo estimado em minutos para ajuste do arquivo, montagem das peças, acabamento, etc.</span>';
                posProcessamentoContainer.appendChild(tooltip);
            }
        }
        
        // Campo de percentual de lucro (valor padrão 200%)
        const lucroInput = document.getElementById('percentual-lucro');
        if (lucroInput && lucroInput.value === '100') {
            lucroInput.value = '200';
        }
        
        // Campos de custo de energia
        const custoEnergiaInput = document.getElementById('custo-energia');
        if (custoEnergiaInput) {
            custoEnergiaInput.addEventListener('input', function() {
                // Permitir apenas números, ponto e vírgula
                this.value = this.value.replace(/[^0-9.,]/g, '');
                
                // Converter vírgula para ponto (para cálculos)
                this.dataset.valor = this.value.replace(',', '.');
            });
            
            // Adicionar nota explicativa mais detalhada
            const custoEnergiaContainer = document.querySelector('.custo-energia-container');
            if (custoEnergiaContainer) {
                const nota = document.createElement('div');
                nota.className = 'nota-explicativa';
                nota.innerHTML = `
                    <p><strong>Como encontrar o valor do kWh na sua conta de energia:</strong></p>
                    <ol>
                        <li>Localize o valor total cobrado em reais (R$)</li>
                        <li>Encontre o consumo total em kWh</li>
                        <li>Divida o valor total pelo consumo para obter o custo por kWh</li>
                        <li>Considere a bandeira tarifária atual (verde, amarela ou vermelha)</li>
                    </ol>
                    <p><em>Exemplo: Se sua conta total é R$ 250,00 para 250 kWh, o custo é R$ 1,00 por kWh</em></p>
                `;
                custoEnergiaContainer.appendChild(nota);
            }
        }
    }
    
    // Função para melhorar a usabilidade dos seletores
    function melhorarSeletores() {
        // Seletor de impressora
        const impressoraContainer = document.querySelector('.impressora-selector');
        if (impressoraContainer) {
            // Adicionar instruções
            const instrucao = document.createElement('div');
            instrucao.className = 'selector-instruction';
            instrucao.textContent = 'Clique em uma impressora para selecioná-la';
            impressoraContainer.prepend(instrucao);
        }
        
        // Seletor de material
        const materialSelect = document.getElementById('material');
        if (materialSelect) {
            // Adicionar instruções
            const materialContainer = materialSelect.parentElement;
            if (materialContainer) {
                const instrucao = document.createElement('div');
                instrucao.className = 'selector-instruction';
                instrucao.textContent = 'Selecione o material utilizado na impressão';
                materialContainer.prepend(instrucao);
            }
        }
        
        // Seletor de altura de camada
        const layerHeightSelect = document.getElementById('layer-height');
        if (layerHeightSelect) {
            // Adicionar instruções
            const layerContainer = layerHeightSelect.parentElement;
            if (layerContainer) {
                const instrucao = document.createElement('div');
                instrucao.className = 'selector-instruction';
                instrucao.textContent = 'Selecione a qualidade de impressão desejada';
                layerContainer.prepend(instrucao);
            }
        }
    }
    
    // Função para adicionar validação de formulário
    function adicionarValidacaoFormulario() {
        const calcularBtn = document.getElementById('calcular-btn');
        if (!calcularBtn) return;
        
        calcularBtn.addEventListener('click', function(e) {
            // Verificar campos obrigatórios
            const impressoraSelecionada = document.querySelector('.impressora-item.selected');
            const material = document.getElementById('material').value;
            const peso = document.getElementById('peso-peca').value;
            const comprimento = document.getElementById('comprimento-filamento').value;
            const horas = document.getElementById('horas-impressao').value;
            const minutos = document.getElementById('minutos-impressao').value;
            
            let mensagensErro = [];
            
            if (!impressoraSelecionada) {
                mensagensErro.push('Selecione uma impressora');
            }
            
            if (!material) {
                mensagensErro.push('Selecione um material');
            }
            
            if (!peso) {
                mensagensErro.push('Informe o peso da peça');
            }
            
            if (!comprimento) {
                mensagensErro.push('Informe o comprimento do filamento');
            }
            
            if (!horas && !minutos) {
                mensagensErro.push('Informe o tempo de impressão');
            }
            
            if (mensagensErro.length > 0) {
                e.preventDefault();
                
                // Mostrar mensagens de erro
                const errorContainer = document.getElementById('error-container');
                if (errorContainer) {
                    errorContainer.innerHTML = '';
                    mensagensErro.forEach(msg => {
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'error-message';
                        errorDiv.textContent = msg;
                        errorContainer.appendChild(errorDiv);
                    });
                    
                    errorContainer.style.display = 'block';
                    
                    // Esconder após 5 segundos
                    setTimeout(() => {
                        errorContainer.style.display = 'none';
                    }, 5000);
                }
                
                return false;
            }
            
            return true;
        });
    }
    
    // Executar funções de melhoria
    configurarCamposEntrada();
    melhorarSeletores();
    adicionarValidacaoFormulario();
});
