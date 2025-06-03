// Implementação da lógica de cálculo integrada com a interface aprimorada
document.addEventListener('DOMContentLoaded', function() {
    // Função principal de cálculo
    function calcularCustoImpressao() {
        // Obter dados da impressora selecionada
        const impressoraSelecionada = document.querySelector('.impressora-item.selected');
        if (!impressoraSelecionada) {
            mostrarErro('Selecione uma impressora');
            return;
        }
        
        const impressoraId = impressoraSelecionada.getAttribute('data-id');
        const impressoras = JSON.parse(localStorage.getItem('impressoras')) || [];
        const impressora = impressoras.find(imp => imp.id === impressoraId);
        
        if (!impressora) {
            mostrarErro('Impressora não encontrada');
            return;
        }
        
        // Obter dados do material selecionado
        const materialId = document.getElementById('material').value;
        if (!materialId) {
            mostrarErro('Selecione um material');
            return;
        }
        
        const materiais = JSON.parse(localStorage.getItem('materiais')) || [];
        const material = materiais.find(mat => mat.id === materialId);
        
        if (!material) {
            mostrarErro('Material não encontrado');
            return;
        }
        
        // Obter configurações globais
        const config = JSON.parse(localStorage.getItem('config')) || {};
        
        // Obter dados específicos da impressão
        const pesoPeca = parseFloat(document.getElementById('peso-peca').dataset.valor || document.getElementById('peso-peca').value.replace(',', '.'));
        const comprimentoFilamento = parseFloat(document.getElementById('comprimento-filamento').dataset.valor || document.getElementById('comprimento-filamento').value.replace(',', '.'));
        const horasImpressao = parseInt(document.getElementById('horas-impressao').value) || 0;
        const minutosImpressao = parseInt(document.getElementById('minutos-impressao').value) || 0;
        const tempoImpressaoHoras = horasImpressao + (minutosImpressao / 60);
        const tempoPosProcHoras = parseFloat(document.getElementById('tempo-pos-processamento').value) / 60 || 0;
        const percentualLucro = parseFloat(document.getElementById('percentual-lucro').value) / 100 || 2.0;
        const alturaLayer = document.getElementById('layer-height').value;
        
        // Validar dados
        if (isNaN(pesoPeca) || pesoPeca <= 0) {
            mostrarErro('Peso da peça inválido');
            return;
        }
        
        if (isNaN(comprimentoFilamento) || comprimentoFilamento <= 0) {
            mostrarErro('Comprimento do filamento inválido');
            return;
        }
        
        if (tempoImpressaoHoras <= 0) {
            mostrarErro('Tempo de impressão inválido');
            return;
        }
        
        // Ajustar tempo de impressão com base na altura da camada
        const tempoMultiplicador = window.getTempoMultiplicador ? window.getTempoMultiplicador(alturaLayer) : 1.0;
        const tempoImpressaoAjustado = tempoImpressaoHoras * tempoMultiplicador;
        
        // Calcular custo do filamento
        const custoFilamento = (pesoPeca / 1000) * material.valor;
        
        // Calcular custo de energia
        const custoEnergia = tempoImpressaoAjustado * (impressora.potencia) * (config.custoEnergia || 1.0);
        
        // Calcular custo de depreciação
        const horasMensais = impressora.horasDia * impressora.diasMes;
        const horasRetorno = horasMensais * impressora.tempoRetorno;
        const custoDepreciacao = (impressora.valor / horasRetorno) * tempoImpressaoAjustado;
        
        // Calcular custo de mão de obra
        const custoMaoDeObra = tempoPosProcHoras * (config.custoModelagem || 50);
        
        // Calcular custo de manutenção
        const custoManutencao = tempoImpressaoAjustado * (config.custoManutencao || 20) / 100;
        
        // Calcular custos operacionais por hora
        let custoOperacionalHora = 0;
        if (config.custoOperacional) {
            const custoOperacionalMensal = 
                (config.custoOperacional.aluguel || 0) +
                (config.custoOperacional.agua || 0) +
                (config.custoOperacional.internet || 0) +
                (config.custoOperacional.salarios || 0) +
                (config.custoOperacional.depreciacao || 0) +
                (config.custoOperacional.marketing || 0) +
                (config.custoOperacional.outros || 0);
            
            // Calcular total de horas operacionais mensais de todas as impressoras
            let totalHorasMensais = 0;
            impressoras.forEach(imp => {
                totalHorasMensais += (imp.horasDia || 0) * (imp.diasMes || 0);
            });
            
            if (totalHorasMensais > 0) {
                custoOperacionalHora = custoOperacionalMensal / totalHorasMensais;
            }
        }
        
        const custoOperacional = custoOperacionalHora * tempoImpressaoAjustado;
        
        // Calcular custo total sem taxa de falha
        const custoSemTaxaFalha = 
            custoFilamento + 
            custoEnergia + 
            custoDepreciacao + 
            custoMaoDeObra + 
            custoManutencao +
            custoOperacional;
        
        // Aplicar taxa de falha
        const taxaFalha = impressora.taxaFalha / 100 || 0.15;
        const custoTotal = custoSemTaxaFalha * (1 + taxaFalha);
        
        // Calcular lucro e preço de venda
        const lucro = custoTotal * percentualLucro;
        const precoVenda = custoTotal + lucro;
        
        // Exibir resultados
        exibirResultados({
            impressora: impressora.nome,
            material: material.nome,
            alturaLayer: alturaLayer,
            qualidade: window.getQualidadeLabel ? window.getQualidadeLabel(alturaLayer) : alturaLayer + 'mm',
            pesoPeca: pesoPeca,
            comprimentoFilamento: comprimentoFilamento,
            tempoImpressao: {
                horas: horasImpressao,
                minutos: minutosImpressao,
                ajustado: {
                    horas: Math.floor(tempoImpressaoAjustado),
                    minutos: Math.round((tempoImpressaoAjustado - Math.floor(tempoImpressaoAjustado)) * 60)
                }
            },
            tempoPosProcHoras: tempoPosProcHoras,
            custoFilamento: custoFilamento,
            custoEnergia: custoEnergia,
            custoDepreciacao: custoDepreciacao,
            custoMaoDeObra: custoMaoDeObra,
            custoManutencao: custoManutencao,
            custoOperacional: custoOperacional,
            custoSemTaxaFalha: custoSemTaxaFalha,
            taxaFalha: taxaFalha,
            custoTotal: custoTotal,
            percentualLucro: percentualLucro,
            lucro: lucro,
            precoVenda: precoVenda
        });
        
        // Atualizar gráficos
        if (window.atualizarGraficos) {
            window.atualizarGraficos({
                custoFilamento: custoFilamento,
                custoEnergia: custoEnergia,
                custoDepreciacao: custoDepreciacao,
                custoMaoDeObra: custoMaoDeObra,
                custoManutencao: custoManutencao,
                custoOperacional: custoOperacional,
                custoTotal: custoTotal,
                lucro: lucro,
                precoVenda: precoVenda
            });
        }
        
        // Mostrar seção de resultados
        document.getElementById('resultados-container').style.display = 'block';
        
        // Rolar para os resultados
        document.getElementById('resultados-container').scrollIntoView({ behavior: 'smooth' });
        
        return {
            impressora: impressora.nome,
            material: material.nome,
            alturaLayer: alturaLayer,
            qualidade: window.getQualidadeLabel ? window.getQualidadeLabel(alturaLayer) : alturaLayer + 'mm',
            pesoPeca: pesoPeca,
            comprimentoFilamento: comprimentoFilamento,
            tempoImpressao: {
                horas: horasImpressao,
                minutos: minutosImpressao,
                ajustado: {
                    horas: Math.floor(tempoImpressaoAjustado),
                    minutos: Math.round((tempoImpressaoAjustado - Math.floor(tempoImpressaoAjustado)) * 60)
                }
            },
            tempoPosProcHoras: tempoPosProcHoras,
            custoFilamento: custoFilamento,
            custoEnergia: custoEnergia,
            custoDepreciacao: custoDepreciacao,
            custoMaoDeObra: custoMaoDeObra,
            custoManutencao: custoManutencao,
            custoOperacional: custoOperacional,
            custoSemTaxaFalha: custoSemTaxaFalha,
            taxaFalha: taxaFalha,
            custoTotal: custoTotal,
            percentualLucro: percentualLucro,
            lucro: lucro,
            precoVenda: precoVenda
        };
    }
    
    // Função para exibir resultados na interface
    function exibirResultados(resultados) {
        const resultadosContainer = document.getElementById('resultados-detalhados');
        if (!resultadosContainer) return;
        
        // Formatar valores para exibição
        const formatarValor = valor => `R$ ${valor.toFixed(2)}`;
        const formatarTempo = (horas, minutos) => `${horas}h ${minutos}min`;
        
        // Construir HTML dos resultados
        let html = `
            <div class="resultados-header">
                <h3>Resultados do Cálculo</h3>
                <p><strong>Impressora:</strong> ${resultados.impressora}</p>
                <p><strong>Material:</strong> ${resultados.material}</p>
                <p><strong>Qualidade:</strong> ${resultados.qualidade}</p>
            </div>
            
            <div class="resultados-dados">
                <p><strong>Peso da Peça:</strong> ${resultados.pesoPeca.toFixed(2)}g</p>
                <p><strong>Comprimento do Filamento:</strong> ${resultados.comprimentoFilamento.toFixed(2)}m</p>
                <p><strong>Tempo de Impressão Original:</strong> ${formatarTempo(resultados.tempoImpressao.horas, resultados.tempoImpressao.minutos)}</p>
                <p><strong>Tempo de Impressão Ajustado:</strong> ${formatarTempo(resultados.tempoImpressao.ajustado.horas, resultados.tempoImpressao.ajustado.minutos)}</p>
                <p><strong>Tempo de Pós-Processamento:</strong> ${(resultados.tempoPosProcHoras * 60).toFixed(0)} minutos</p>
            </div>
            
            <div class="resultados-custos">
                <h4>Detalhamento de Custos</h4>
                <div class="resultado-secundario">
                    <p><strong>Custo do Filamento:</strong> ${formatarValor(resultados.custoFilamento)}</p>
                </div>
                <div class="resultado-secundario">
                    <p><strong>Custo de Energia:</strong> ${formatarValor(resultados.custoEnergia)}</p>
                </div>
                <div class="resultado-secundario">
                    <p><strong>Custo de Depreciação:</strong> ${formatarValor(resultados.custoDepreciacao)}</p>
                </div>
                <div class="resultado-secundario">
                    <p><strong>Custo de Pós-Processamento:</strong> ${formatarValor(resultados.custoMaoDeObra)}</p>
                </div>
                <div class="resultado-secundario">
                    <p><strong>Custo de Manutenção:</strong> ${formatarValor(resultados.custoManutencao)}</p>
                </div>
                <div class="resultado-secundario">
                    <p><strong>Custos Operacionais:</strong> ${formatarValor(resultados.custoOperacional)}</p>
                </div>
                <div class="resultado-secundario">
                    <p><strong>Subtotal:</strong> ${formatarValor(resultados.custoSemTaxaFalha)}</p>
                </div>
                <div class="resultado-secundario">
                    <p><strong>Taxa de Falha (${(resultados.taxaFalha * 100).toFixed(0)}%):</strong> ${formatarValor(resultados.custoSemTaxaFalha * resultados.taxaFalha)}</p>
                </div>
            </div>
            
            <div class="resultados-principais">
                <div class="resultado-principal custo-total highlight-animation">
                    <p><strong>CUSTO TOTAL:</strong> ${formatarValor(resultados.custoTotal)}</p>
                </div>
                <div class="resultado-principal lucro highlight-animation">
                    <p><strong>LUCRO (${(resultados.percentualLucro * 100).toFixed(0)}%):</strong> ${formatarValor(resultados.lucro)}</p>
                </div>
                <div class="resultado-principal preco-venda highlight-animation">
                    <p><strong>PREÇO DE VENDA:</strong> ${formatarValor(resultados.precoVenda)}</p>
                </div>
            </div>
            
            <div class="resultados-acoes">
                <button id="salvar-historico-btn" class="btn-primary">Salvar no Histórico</button>
                <button id="exportar-pdf-btn" class="btn-secondary">Exportar Orçamento (PDF)</button>
                <button id="comparar-materiais-btn" class="btn-secondary">Comparar Materiais</button>
                <button id="compare-quality-btn" class="btn-secondary">Comparar Qualidades</button>
            </div>
        `;
        
        resultadosContainer.innerHTML = html;
        
        // Adicionar event listeners para os botões
        document.getElementById('salvar-historico-btn').addEventListener('click', function() {
            salvarNoHistorico(resultados);
        });
        
        document.getElementById('exportar-pdf-btn').addEventListener('click', function() {
            exportarPDF(resultados);
        });
        
        document.getElementById('comparar-materiais-btn').addEventListener('click', function() {
            if (window.abrirComparacaoMateriais) {
                window.abrirComparacaoMateriais(resultados.material);
            }
        });
        
        document.getElementById('compare-quality-btn').addEventListener('click', function() {
            if (window.abrirComparacaoQualidade) {
                window.abrirComparacaoQualidade();
            }
        });
    }
    
    // Função para salvar no histórico
    function salvarNoHistorico(resultados) {
        // Obter histórico existente
        const historico = JSON.parse(localStorage.getItem('historico')) || [];
        
        // Adicionar data e ID ao resultado
        const resultado = {
            ...resultados,
            id: 'hist_' + Date.now(),
            data: new Date().toISOString()
        };
        
        // Adicionar ao histórico
        historico.unshift(resultado);
        
        // Limitar tamanho do histórico (opcional)
        if (historico.length > 50) {
            historico.pop();
        }
        
        // Salvar no localStorage
        localStorage.setItem('historico', JSON.stringify(historico));
        
        // Mostrar confirmação
        alert('Orçamento salvo no histórico com sucesso!');
        
        // Atualizar visualização do histórico se estiver aberta
        if (window.atualizarHistorico) {
            window.atualizarHistorico();
        }
    }
    
    // Função para exportar PDF
    function exportarPDF(resultados) {
        // Verificar se a função de exportação está disponível
        if (window.prepararExportacaoPDF) {
            window.prepararExportacaoPDF(resultados);
        } else {
            alert('Funcionalidade de exportação PDF não está disponível');
        }
    }
    
    // Função para mostrar mensagens de erro
    function mostrarErro(mensagem) {
        const errorContainer = document.getElementById('error-container');
        if (errorContainer) {
            errorContainer.innerHTML = `<div class="error-message">${mensagem}</div>`;
            errorContainer.style.display = 'block';
            
            // Esconder após 5 segundos
            setTimeout(() => {
                errorContainer.style.display = 'none';
            }, 5000);
        } else {
            alert(mensagem);
        }
    }
    
    // Adicionar event listener para o botão de calcular
    const calcularBtn = document.getElementById('calcular-btn');
    if (calcularBtn) {
        calcularBtn.addEventListener('click', function(e) {
            e.preventDefault();
            calcularCustoImpressao();
        });
    }
    
    // Expor funções para uso em outros módulos
    window.calcularCustoImpressao = calcularCustoImpressao;
    window.exibirResultados = exibirResultados;
    window.salvarNoHistorico = salvarNoHistorico;
    window.exportarPDF = exportarPDF;
});
