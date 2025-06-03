// Integração com o servidor Flask para geração de PDF
function setupPdfGeneration() {
    // Modificar a função exportToPDF para usar o servidor local
    generatePdfBtn.addEventListener("click", function() {
        if (!calculoAtual) {
            showToast("Calcule um orçamento primeiro para exportar.", 3000);
            return;
        }

        // Obter dados do formulário de exportação
        const cliente = pdfClienteInput.value.trim();
        const descricao = pdfDescricaoInput.value.trim();
        const observacoes = pdfObservacoesInput.value.trim();
        const prazo = getNumVal(pdfPrazoInput);
        const incluirDetalhes = pdfIncluirDetalhesCheckbox.checked;
        const incluirInfo = pdfIncluirInfoCheckbox.checked;

        // Obter dados da configuração
        const empresa = pdfEmpresaInput.value.trim();
        const cnpj = pdfCnpjInput.value.trim();
        const responsavel = pdfResponsavelInput.value.trim();
        const contato = pdfContatoInput.value.trim();
        const prazoMaterial = getNumVal(pdfPrazoMaterialInput);
        const textoPadrao = pdfTextoPadraoInput.value.trim();

        // Obter dados do material
        let materialInfo = null;
        if (materialSelect.value !== "custom") {
            const materialIndex = parseInt(materialSelect.value);
            if (!isNaN(materialIndex) && materialIndex >= 0 && materialIndex < materiais.length) {
                materialInfo = materiais[materialIndex];
            }
        }

        // Preparar dados para o PDF
        const data = {
            empresa: empresa,
            cnpj: cnpj,
            responsavel: responsavel,
            contato: contato,
            data: new Date().toLocaleDateString('pt-BR'),
            numero: "ORÇ-" + new Date().toISOString().slice(0,10).replace(/-/g,"") + "-" + Math.floor(Math.random()*1000),
            cliente: cliente,
            descricao: descricao || calculoAtual.materialNome,
            material: materialInfo ? {
                nome: materialInfo.nome,
                valor_kg: materialInfo.valor,
                descricao: materialInfo.descricao,
                aplicacoes: materialInfo.aplicacoes,
                vantagens: materialInfo.vantagens,
                desvantagens: materialInfo.desvantagens
            } : {
                nome: calculoAtual.materialNome,
                valor_kg: 0,
                descricao: "",
                aplicacoes: "",
                vantagens: "",
                desvantagens: ""
            },
            impressora: calculoAtual.impressoraNome,
            peso_gramas: calculoAtual.inputs.pesoGramas,
            tempo_impressao: calculoAtual.inputs.tempoImpressaoHoras,
            custos: {
                filamento: calculoAtual.resultados.custoFilamento,
                energia: calculoAtual.resultados.custoEnergia,
                depreciacao: calculoAtual.resultados.custoDepreciacao,
                trabalho: calculoAtual.resultados.custoTrabalho,
                modelagem: calculoAtual.resultados.custoModelagem,
                manutencao: calculoAtual.resultados.custoManutencao,
                subtotal: calculoAtual.resultados.custoBase,
                taxa_falha: calculoAtual.resultados.taxaFalha,
                com_falha: calculoAtual.resultados.custoComFalha
            },
            custo_total: calculoAtual.resultados.custoTotal,
            percentual_lucro: calculoAtual.resultados.percentualLucro,
            lucro: calculoAtual.resultados.lucroValor,
            preco_venda: calculoAtual.resultados.precoVenda,
            prazo: prazo,
            prazo_material_especial: prazoMaterial,
            observacoes: observacoes,
            texto_adicional: textoPadrao,
            pix: cnpj,
            incluir_detalhes: incluirDetalhes,
            incluir_info_material: incluirInfo
        };

        // Como estamos em um ambiente PWA sem servidor backend integrado,
        // vamos gerar um PDF simplificado usando a biblioteca jsPDF
        generateSimplePDF(data);
        pdfExportModal.style.display = "none";
    });

    // Função para gerar PDF simplificado usando jsPDF
    function generateSimplePDF(data) {
        // Carregar a biblioteca jsPDF dinamicamente
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = function() {
            const fontScript = document.createElement('script');
            fontScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js';
            fontScript.onload = function() {
                createPDF(data);
            };
            document.head.appendChild(fontScript);
        };
        document.head.appendChild(script);
    }

    function createPDF(data) {
        // Criar instância do jsPDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Configurações
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        const contentWidth = pageWidth - 2 * margin;
        let y = margin;
        
        // Funções auxiliares
        function addText(text, size = 12, style = 'normal', align = 'left') {
            doc.setFontSize(size);
            doc.setFont('helvetica', style);
            doc.text(text, align === 'center' ? pageWidth / 2 : margin, y, { align });
            y += size / 3;
        }
        
        function addSpace(space = 10) {
            y += space;
        }
        
        function addLine() {
            doc.setDrawColor(200, 200, 200);
            doc.line(margin, y, pageWidth - margin, y);
            y += 5;
        }
        
        // Cabeçalho
        addText('ORÇAMENTO DE IMPRESSÃO 3D', 18, 'bold', 'center');
        addSpace();
        addText(`Orçamento Nº: ${data.numero}`, 10);
        addText(`Data: ${data.data}`, 10);
        if (data.empresa) addText(`Empresa: ${data.empresa}`, 10);
        if (data.cnpj) addText(`CNPJ: ${data.cnpj}`, 10);
        if (data.responsavel) addText(`Responsável: ${data.responsavel}`, 10);
        if (data.contato) addText(`Contato: ${data.contato}`, 10);
        addSpace();
        addLine();
        
        // Dados do cliente
        addText('DADOS DO CLIENTE', 14, 'bold');
        addSpace(5);
        addText(`Cliente: ${data.cliente || 'Não informado'}`, 10);
        addSpace();
        addLine();
        
        // Detalhes do projeto
        addText('DETALHES DO PROJETO', 14, 'bold');
        addSpace(5);
        addText(`Descrição: ${data.descricao}`, 10);
        addText(`Material: ${data.material.nome}`, 10);
        addText(`Impressora: ${data.impressora}`, 10);
        addText(`Peso: ${data.peso_gramas}g`, 10);
        addText(`Tempo de Impressão: ${data.tempo_impressao} horas`, 10);
        addSpace();
        addLine();
        
        // Detalhamento de custos
        if (data.incluir_detalhes) {
            addText('DETALHAMENTO DE CUSTOS', 14, 'bold');
            addSpace(5);
            
            // Tabela de custos
            const custoHeaders = [['Item', 'Valor']];
            const custoRows = [
                ['Custo do Filamento', `R$ ${data.custos.filamento.toFixed(2)}`],
                ['Custo de Energia', `R$ ${data.custos.energia.toFixed(2)}`],
                ['Custo de Depreciação', `R$ ${data.custos.depreciacao.toFixed(2)}`],
                ['Custo de Mão de Obra', `R$ ${data.custos.trabalho.toFixed(2)}`],
                ['Custo de Modelagem', `R$ ${data.custos.modelagem.toFixed(2)}`],
                ['Custo de Manutenção', `R$ ${data.custos.manutencao.toFixed(2)}`],
                ['Subtotal', `R$ ${data.custos.subtotal.toFixed(2)}`],
                [`Taxa de Falha (${data.custos.taxa_falha}%)`, `R$ ${(data.custos.com_falha - data.custos.subtotal).toFixed(2)}`],
                ['Custo Total', `R$ ${data.custo_total.toFixed(2)}`],
                [`Lucro (${data.percentual_lucro}%)`, `R$ ${data.lucro.toFixed(2)}`],
                ['Preço de Venda', `R$ ${data.preco_venda.toFixed(2)}`]
            ];
            
            doc.autoTable({
                head: custoHeaders,
                body: custoRows,
                startY: y,
                margin: { left: margin },
                theme: 'grid',
                styles: { fontSize: 10 },
                headStyles: { fillColor: [52, 152, 219], textColor: 255 },
                alternateRowStyles: { fillColor: [240, 240, 240] },
                rowStyles: { 7: { fontStyle: 'bold' }, 10: { fontStyle: 'bold' } }
            });
            
            y = doc.lastAutoTable.finalY + 10;
        } else {
            addText('VALOR TOTAL', 14, 'bold');
            addSpace(5);
            addText(`R$ ${data.preco_venda.toFixed(2)}`, 16, 'bold');
            addSpace();
        }
        
        addLine();
        
        // Prazo de entrega
        addText('PRAZO DE ENTREGA', 14, 'bold');
        addSpace(5);
        addText(`O tempo para finalização será de ${data.prazo} dias corridos após o pagamento.`, 10);
        addText(`Caso tenha feito opção por alguma cor que não temos, acrescentaremos ${data.prazo_material_especial} dias ou mais se necessário.`, 10);
        addSpace();
        addLine();
        
        // Observações
        if (data.observacoes) {
            addText('OBSERVAÇÕES', 14, 'bold');
            addSpace(5);
            
            // Quebrar texto longo em múltiplas linhas
            const splitObservacoes = doc.splitTextToSize(data.observacoes, contentWidth);
            doc.text(splitObservacoes, margin, y);
            y += splitObservacoes.length * 7;
            addSpace();
            addLine();
        }
        
        // Texto adicional
        if (data.texto_adicional) {
            const splitTexto = doc.splitTextToSize(data.texto_adicional, contentWidth);
            doc.text(splitTexto, margin, y);
            y += splitTexto.length * 7;
            addSpace();
            addLine();
        }
        
        // Informações do material
        if (data.incluir_info_material && data.material.descricao) {
            // Verificar se precisa de nova página
            if (y > doc.internal.pageSize.getHeight() - 100) {
                doc.addPage();
                y = margin;
            }
            
            addText(`INFORMAÇÕES SOBRE O MATERIAL: ${data.material.nome}`, 14, 'bold');
            addSpace(5);
            
            if (data.material.descricao) {
                addText(`Descrição: ${data.material.descricao}`, 10);
            }
            if (data.material.aplicacoes) {
                addText(`Aplicações Recomendadas: ${data.material.aplicacoes}`, 10);
            }
            if (data.material.vantagens) {
                addText(`Vantagens: ${data.material.vantagens}`, 10);
            }
            if (data.material.desvantagens) {
                addText(`Desvantagens: ${data.material.desvantagens}`, 10);
            }
            
            addSpace();
            addLine();
        }
        
        // Informações de pagamento
        addText('INFORMAÇÕES DE PAGAMENTO', 14, 'bold');
        addSpace(5);
        if (data.pix) {
            addText(`PIX: ${data.pix}`, 10);
        }
        addText('O pagamento deve ser realizado integralmente antes do início da impressão.', 10);
        addSpace();
        addLine();
        
        // Rodapé
        addText('Qualquer dúvida estou à disposição!', 10);
        addText('Este orçamento é válido por 15 dias.', 10);
        
        // Salvar o PDF
        doc.save(`Orcamento_${data.numero}.pdf`);
        showToast("PDF gerado com sucesso!");
    }

    // Configurar botão de exportação do histórico
    historyExportPdfBtn.addEventListener("click", function() {
        if (currentHistoryIndex >= 0 && currentHistoryIndex < historico.length) {
            // Carregar dados do histórico para o formulário de exportação
            const item = historico[currentHistoryIndex];
            pdfClienteInput.value = "";
            pdfDescricaoInput.value = item.nome;
            pdfObservacoesInput.value = "";
            pdfPrazoInput.value = pdfPrazoPadraoInput.value || 5;
            pdfIncluirDetalhesCheckbox.checked = true;
            pdfIncluirInfoCheckbox.checked = true;
            
            // Mostrar modal de exportação
            historyDetailModal.style.display = "none";
            pdfExportModal.style.display = "block";
            
            // Definir calculoAtual para o item do histórico
            calculoAtual = {
                inputs: item.inputs,
                materialNome: item.materialNome,
                impressoraNome: item.impressoraNome,
                resultados: item.resultados
            };
        }
    });
}

// Adicionar a função de setup ao carregamento da página
document.addEventListener("DOMContentLoaded", function() {
    setupPdfGeneration();
});
