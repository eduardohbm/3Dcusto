// Implementação da validação e testes do aplicativo
document.addEventListener('DOMContentLoaded', function() {
    // Função para validar o funcionamento completo do aplicativo
    function validarAplicativo() {
        console.log('Iniciando validação do aplicativo...');
        
        // Array para armazenar resultados dos testes
        const resultadosTestes = [];
        
        // Função para registrar resultado de teste
        function registrarTeste(nome, resultado, mensagem) {
            resultadosTestes.push({
                nome: nome,
                resultado: resultado,
                mensagem: mensagem
            });
            
            console.log(`Teste: ${nome} - ${resultado ? 'PASSOU' : 'FALHOU'} - ${mensagem}`);
        }
        
        // 1. Validar carregamento de dados iniciais
        try {
            const impressoras = JSON.parse(localStorage.getItem('impressoras')) || [];
            const materiais = JSON.parse(localStorage.getItem('materiais')) || [];
            const config = JSON.parse(localStorage.getItem('config')) || {};
            
            registrarTeste(
                'Carregamento de dados iniciais', 
                impressoras.length > 0 && materiais.length > 0 && Object.keys(config).length > 0,
                `Impressoras: ${impressoras.length}, Materiais: ${materiais.length}, Config: ${Object.keys(config).length} chaves`
            );
        } catch (e) {
            registrarTeste('Carregamento de dados iniciais', false, `Erro: ${e.message}`);
        }
        
        // 2. Validar seleção de impressora
        try {
            const impressoraItems = document.querySelectorAll('.impressora-item');
            const temSeletor = impressoraItems.length > 0;
            
            registrarTeste(
                'Seleção de impressora', 
                temSeletor,
                `Encontrados ${impressoraItems.length} itens de impressora`
            );
            
            // Testar clique na primeira impressora
            if (temSeletor) {
                impressoraItems[0].click();
                const selecionada = document.querySelector('.impressora-item.selected');
                registrarTeste(
                    'Clique em impressora', 
                    selecionada !== null,
                    `Seleção de impressora ${selecionada ? 'funcionou' : 'falhou'}`
                );
            }
        } catch (e) {
            registrarTeste('Seleção de impressora', false, `Erro: ${e.message}`);
        }
        
        // 3. Validar seleção de material
        try {
            const materialSelect = document.getElementById('material');
            const temSeletor = materialSelect !== null && materialSelect.options.length > 1;
            
            registrarTeste(
                'Seleção de material', 
                temSeletor,
                `Seletor de material ${temSeletor ? 'encontrado' : 'não encontrado'} com ${materialSelect ? materialSelect.options.length : 0} opções`
            );
            
            // Selecionar primeiro material
            if (temSeletor && materialSelect.options.length > 1) {
                materialSelect.selectedIndex = 1;
                registrarTeste(
                    'Seleção de opção de material', 
                    materialSelect.selectedIndex === 1,
                    `Seleção de material ${materialSelect.selectedIndex === 1 ? 'funcionou' : 'falhou'}`
                );
            }
        } catch (e) {
            registrarTeste('Seleção de material', false, `Erro: ${e.message}`);
        }
        
        // 4. Validar campos de entrada
        try {
            const camposEntrada = [
                { id: 'peso-peca', valor: '100' },
                { id: 'comprimento-filamento', valor: '4.5' },
                { id: 'horas-impressao', valor: '2' },
                { id: 'minutos-impressao', valor: '30' },
                { id: 'tempo-pos-processamento', valor: '15' },
                { id: 'percentual-lucro', valor: '200' }
            ];
            
            let camposValidos = true;
            let mensagem = '';
            
            camposEntrada.forEach(campo => {
                const elemento = document.getElementById(campo.id);
                if (elemento) {
                    elemento.value = campo.valor;
                    if (elemento.value !== campo.valor) {
                        camposValidos = false;
                        mensagem += `Campo ${campo.id} falhou; `;
                    }
                } else {
                    camposValidos = false;
                    mensagem += `Campo ${campo.id} não encontrado; `;
                }
            });
            
            registrarTeste(
                'Campos de entrada', 
                camposValidos,
                mensagem || 'Todos os campos de entrada funcionaram corretamente'
            );
        } catch (e) {
            registrarTeste('Campos de entrada', false, `Erro: ${e.message}`);
        }
        
        // 5. Validar seleção de altura de camada
        try {
            const layerHeightSelect = document.getElementById('layer-height');
            const temSeletor = layerHeightSelect !== null;
            
            registrarTeste(
                'Seleção de altura de camada', 
                temSeletor,
                `Seletor de altura de camada ${temSeletor ? 'encontrado' : 'não encontrado'}`
            );
            
            // Selecionar uma altura de camada
            if (temSeletor) {
                layerHeightSelect.value = '0.16';
                const evento = new Event('change');
                layerHeightSelect.dispatchEvent(evento);
                
                registrarTeste(
                    'Mudança de altura de camada', 
                    layerHeightSelect.value === '0.16',
                    `Seleção de altura de camada ${layerHeightSelect.value === '0.16' ? 'funcionou' : 'falhou'}`
                );
            }
        } catch (e) {
            registrarTeste('Seleção de altura de camada', false, `Erro: ${e.message}`);
        }
        
        // 6. Validar cálculo
        try {
            const calcularBtn = document.getElementById('calcular-btn');
            const temBotao = calcularBtn !== null;
            
            registrarTeste(
                'Botão de cálculo', 
                temBotao,
                `Botão de cálculo ${temBotao ? 'encontrado' : 'não encontrado'}`
            );
            
            // Simular clique no botão de calcular
            if (temBotao && window.calcularCustoImpressao) {
                const resultado = window.calcularCustoImpressao();
                
                registrarTeste(
                    'Execução do cálculo', 
                    resultado !== undefined,
                    `Cálculo ${resultado !== undefined ? 'executado com sucesso' : 'falhou'}`
                );
                
                if (resultado) {
                    registrarTeste(
                        'Resultados do cálculo', 
                        resultado.custoTotal > 0 && resultado.precoVenda > 0,
                        `Custo total: ${resultado.custoTotal}, Preço de venda: ${resultado.precoVenda}`
                    );
                }
            }
        } catch (e) {
            registrarTeste('Cálculo', false, `Erro: ${e.message}`);
        }
        
        // 7. Validar exibição de resultados
        try {
            const resultadosContainer = document.getElementById('resultados-container');
            const resultadosDetalhados = document.getElementById('resultados-detalhados');
            
            const temResultados = resultadosContainer !== null && resultadosDetalhados !== null;
            const resultadosVisiveis = temResultados && resultadosContainer.style.display !== 'none';
            
            registrarTeste(
                'Exibição de resultados', 
                temResultados && resultadosVisiveis,
                `Containers de resultados ${temResultados ? 'encontrados' : 'não encontrados'} e ${resultadosVisiveis ? 'visíveis' : 'não visíveis'}`
            );
            
            if (temResultados && resultadosVisiveis) {
                const resultadosPrincipais = resultadosDetalhados.querySelectorAll('.resultado-principal');
                
                registrarTeste(
                    'Resultados principais destacados', 
                    resultadosPrincipais.length === 3,
                    `Encontrados ${resultadosPrincipais.length} resultados principais destacados`
                );
            }
        } catch (e) {
            registrarTeste('Exibição de resultados', false, `Erro: ${e.message}`);
        }
        
        // 8. Validar navegação entre abas
        try {
            const abas = [
                { id: 'nav-principal', container: 'principal-container' },
                { id: 'nav-config', container: 'config-container' },
                { id: 'nav-historico', container: 'historico-container' }
            ];
            
            let navegacaoValida = true;
            let mensagem = '';
            
            abas.forEach(aba => {
                const abaElement = document.getElementById(aba.id);
                const containerElement = document.getElementById(aba.container);
                
                if (!abaElement || !containerElement) {
                    navegacaoValida = false;
                    mensagem += `Aba ${aba.id} ou container ${aba.container} não encontrado; `;
                    return;
                }
                
                // Clicar na aba
                abaElement.click();
                
                // Verificar se o container está visível
                const visivel = containerElement.style.display !== 'none';
                if (!visivel) {
                    navegacaoValida = false;
                    mensagem += `Container ${aba.container} não ficou visível após clique em ${aba.id}; `;
                }
            });
            
            registrarTeste(
                'Navegação entre abas', 
                navegacaoValida,
                mensagem || 'Navegação entre todas as abas funcionou corretamente'
            );
            
            // Voltar para a aba principal
            document.getElementById('nav-principal').click();
        } catch (e) {
            registrarTeste('Navegação entre abas', false, `Erro: ${e.message}`);
        }
        
        // 9. Validar botões de ação nos resultados
        try {
            const botoesAcao = [
                'salvar-historico-btn',
                'exportar-pdf-btn',
                'comparar-materiais-btn',
                'compare-quality-btn'
            ];
            
            let botoesValidos = true;
            let mensagem = '';
            
            botoesAcao.forEach(botaoId => {
                const botao = document.getElementById(botaoId);
                if (!botao) {
                    botoesValidos = false;
                    mensagem += `Botão ${botaoId} não encontrado; `;
                }
            });
            
            registrarTeste(
                'Botões de ação nos resultados', 
                botoesValidos,
                mensagem || 'Todos os botões de ação nos resultados estão presentes'
            );
        } catch (e) {
            registrarTeste('Botões de ação nos resultados', false, `Erro: ${e.message}`);
        }
        
        // 10. Validar nota explicativa de custo de energia
        try {
            // Ir para a aba de configurações
            document.getElementById('nav-config').click();
            
            // Selecionar aba de custos
            const abaCustos = document.querySelector('.config-tab[data-target="custos-config"]');
            if (abaCustos) {
                abaCustos.click();
            }
            
            // Verificar se a nota explicativa existe
            const notaExplicativa = document.querySelector('.nota-explicativa-energia');
            const temNota = notaExplicativa !== null;
            
            registrarTeste(
                'Nota explicativa de custo de energia', 
                temNota,
                `Nota explicativa ${temNota ? 'encontrada' : 'não encontrada'}`
            );
            
            // Voltar para a aba principal
            document.getElementById('nav-principal').click();
        } catch (e) {
            registrarTeste('Nota explicativa de custo de energia', false, `Erro: ${e.message}`);
        }
        
        // Resumo dos testes
        const totalTestes = resultadosTestes.length;
        const testesPassed = resultadosTestes.filter(t => t.resultado).length;
        
        console.log(`Validação concluída: ${testesPassed}/${totalTestes} testes passaram`);
        
        return {
            total: totalTestes,
            passed: testesPassed,
            resultados: resultadosTestes
        };
    }
    
    // Executar validação quando o aplicativo estiver completamente carregado
    setTimeout(validarAplicativo, 1000);
    
    // Expor função para uso manual
    window.validarAplicativo = validarAplicativo;
});
