document.addEventListener("DOMContentLoaded", function() {
    // Variáveis globais
    let impressoras = [];
    let materiais = [];
    let calculoAtual = null;
    let historico = [];
    
    // Inicialização
    carregarConfiguracoes();
    inicializarEventListeners();
    
    // Função para carregar configurações salvas
    function carregarConfiguracoes() {
        // Carregar impressoras
        impressoras = JSON.parse(localStorage.getItem('impressoras')) || [];
        if (impressoras.length === 0) {
            // Adicionar impressoras padrão se não existirem
            impressoras = [
                {
                    id: 'creality_k1c',
                    nome: 'Creality K1C',
                    valor: 3800,
                    tempoRetorno: 12,
                    horasDia: 18,
                    diasMes: 20,
                    potencia: 0.35,
                    taxaFalha: 15,
                    imagem: 'images/creality_k1c.jpg'
                },
                {
                    id: 'bambu_a1',
                    nome: 'Bambu A1 Combo',
                    valor: 5400,
                    tempoRetorno: 12,
                    horasDia: 18,
                    diasMes: 20,
                    potencia: 0.5,
                    taxaFalha: 15,
                    imagem: 'images/bambu_a1.jpg'
                },
                {
                    id: 'creality_k2',
                    nome: 'Creality K2 Plus',
                    valor: 13300,
                    tempoRetorno: 12,
                    horasDia: 10,
                    diasMes: 20,
                    potencia: 0.8,
                    taxaFalha: 15,
                    imagem: 'images/creality_k2.jpg'
                }
            ];
            localStorage.setItem('impressoras', JSON.stringify(impressoras));
        }
        
        // Carregar materiais
        materiais = JSON.parse(localStorage.getItem('materiais')) || [];
        if (materiais.length === 0) {
            // Adicionar materiais padrão se não existirem
            materiais = [
                {
                    id: 'abs_national',
                    nome: 'ABS NATIONAL',
                    valor: 100,
                    densidade: 1.04,
                    comprimento: 380,
                    descricao: 'ABS é um dos mais indicados para peças mecânicas, de engenharia e que poderão ser expostas às intempéries.',
                    aplicacoes: 'Peças mecânicas, peças de engenharia, uso externo.',
                    vantagens: 'Fácil acabamento com lixa e pintura, resistente a temperaturas mais altas.',
                    desvantagens: 'Pode empenar ou delaminar com peças muito altas na mesa da impressora.'
                },
                {
                    id: 'pla_duo',
                    nome: 'PLA DUO',
                    valor: 140,
                    densidade: 1.24,
                    comprimento: 333,
                    descricao: 'PLA é o mais indicado para peças decorativas que não serão expostas ao sol.',
                    aplicacoes: 'Peças decorativas, protótipos, uso interno.',
                    vantagens: 'Fácil de imprimir, baixo odor, boa qualidade visual.',
                    desvantagens: 'Difícil de lixar, baixa resistência térmica, não recomendado para uso externo.'
                },
                {
                    id: 'abs_premium',
                    nome: 'ABS PREMIUM',
                    valor: 90,
                    densidade: 1.04,
                    comprimento: 335,
                    descricao: 'Versão premium do ABS com melhor acabamento e menos empenamento.',
                    aplicacoes: 'Peças mecânicas, peças de engenharia, uso externo.',
                    vantagens: 'Melhor acabamento que o ABS comum, menos empenamento.',
                    desvantagens: 'Ainda pode apresentar problemas de delaminação em peças grandes.'
                },
                {
                    id: 'pla_vsilk',
                    nome: 'PLA V-SILK',
                    valor: 130,
                    densidade: 1.24,
                    comprimento: 333,
                    descricao: 'PLA com acabamento sedoso, ideal para peças decorativas.',
                    aplicacoes: 'Peças decorativas, protótipos visuais, uso interno.',
                    vantagens: 'Acabamento sedoso sem necessidade de pós-processamento.',
                    desvantagens: 'Mesmas limitações do PLA comum.'
                },
                {
                    id: 'petg_3dlab',
                    nome: 'PETG 3DLab',
                    valor: 150,
                    densidade: 1.27,
                    comprimento: 380,
                    descricao: 'PETG é um meio termo entre o ABS e o PLA, bom para peças de engenharia com exposição moderada ao calor.',
                    aplicacoes: 'Peças funcionais, uso semi-externo, peças que precisam de flexibilidade.',
                    vantagens: 'Mais resistente que PLA, menos empenamento que ABS, boa resistência química.',
                    desvantagens: 'Acabamento menos bonito, pode apresentar stringing.'
                },
                {
                    id: 'flexivel',
                    nome: 'FLEXÍVEL',
                    valor: 160,
                    densidade: 1.22,
                    comprimento: 335,
                    descricao: 'Filamento flexível para peças que precisam de elasticidade.',
                    aplicacoes: 'Peças flexíveis, juntas, protetores, amortecedores.',
                    vantagens: 'Alta elasticidade, resistente a impactos.',
                    desvantagens: 'Difícil de imprimir, requer configurações especiais.'
                },
                {
                    id: 'pla_velvet',
                    nome: 'PLA VELVET',
                    valor: 120,
                    densidade: 1.24,
                    comprimento: 333,
                    descricao: 'PLA com acabamento aveludado, ideal para peças decorativas.',
                    aplicacoes: 'Peças decorativas, protótipos visuais, uso interno.',
                    vantagens: 'Acabamento aveludado sem necessidade de pós-processamento.',
                    desvantagens: 'Mesmas limitações do PLA comum.'
                },
                {
                    id: 'pla_hyper',
                    nome: 'PLA HYPER CREALITY',
                    valor: 220,
                    densidade: 1.18,
                    comprimento: 380,
                    descricao: 'PLA de alta performance da Creality, com melhor resistência mecânica.',
                    aplicacoes: 'Peças funcionais, protótipos, uso interno com requisitos mecânicos.',
                    vantagens: 'Melhor resistência mecânica que o PLA comum, fácil de imprimir.',
                    desvantagens: 'Preço mais elevado, ainda com limitações térmicas do PLA.'
                },
                {
                    id: 'wood',
                    nome: 'WOOD',
                    valor: 130,
                    densidade: 0.8,
                    comprimento: 335,
                    descricao: 'Filamento com partículas de madeira, para peças com aparência de madeira.',
                    aplicacoes: 'Peças decorativas, objetos com aparência de madeira.',
                    vantagens: 'Aparência e textura semelhantes à madeira, pode ser lixado.',
                    desvantagens: 'Abrasivo para o bico, requer configurações especiais.'
                },
                {
                    id: 'soluvel',
                    nome: 'Solúvel HIPS + SOLVENTE',
                    valor: 225,
                    densidade: 1.05,
                    comprimento: 335,
                    descricao: 'Filamento solúvel para suportes removíveis com solvente.',
                    aplicacoes: 'Suportes para peças complexas em impressoras de dupla extrusão.',
                    vantagens: 'Permite geometrias complexas sem marcas de suporte.',
                    desvantagens: 'Requer impressora de dupla extrusão e solvente específico.'
                },
                {
                    id: 'pla_cf',
                    nome: 'PLA-CF',
                    valor: 250,
                    densidade: 1.3,
                    comprimento: 330,
                    descricao: 'PLA com fibra de carbono, combinando a facilidade de impressão do PLA com maior resistência mecânica.',
                    aplicacoes: 'Peças de engenharia, protótipos funcionais, peças que exigem rigidez.',
                    vantagens: 'Mais robusto que o PLA comum, mantém a facilidade de impressão, não sofre warping.',
                    desvantagens: 'Preço elevado, abrasivo para o bico da impressora.'
                },
                {
                    id: 'pla_silk',
                    nome: 'PLA SILK',
                    valor: 160,
                    densidade: 1.24,
                    comprimento: 333,
                    descricao: 'PLA com acabamento metálico brilhante, ideal para peças decorativas ou de amostragem final.',
                    aplicacoes: 'Peças decorativas, protótipos visuais, objetos de exibição.',
                    vantagens: 'Acabamento brilhante sem necessidade de pós-processamento, visual premium.',
                    desvantagens: 'Preço mais elevado, mesmas limitações térmicas do PLA comum.'
                }
            ];
            localStorage.setItem('materiais', JSON.stringify(materiais));
        }
        
        // Carregar histórico
        historico = JSON.parse(localStorage.getItem('historico')) || [];
        
        // Carregar configurações de custos
        const custos = JSON.parse(localStorage.getItem('custos')) || {
            energia: 1.00,
            manutencao: 0.50,
            trabalho: 30.00,
            aluguel: 1200.00,
            agua: 100.00,
            internet: 150.00,
            funcionario: 1500.00,
            computador: 100.00,
            outros: 200.00
        };
        
        document.getElementById('custo_energia').value = custos.energia;
        document.getElementById('custo_manutencao').value = custos.manutencao;
        document.getElementById('custo_trabalho').value = custos.trabalho;
        document.getElementById('custo_aluguel').value = custos.aluguel;
        document.getElementById('custo_agua').value = custos.agua;
        document.getElementById('custo_internet').value = custos.internet;
        document.getElementById('custo_funcionario').value = custos.funcionario;
        document.getElementById('custo_computador').value = custos.computador;
        document.getElementById('custo_outros').value = custos.outros;
        
        // Calcular custo operacional por hora
        calcularCustoOperacionalHora();
        
        // Carregar configurações da empresa
        const empresa = JSON.parse(localStorage.getItem('empresa')) || {
            nome: '',
            logo: 'images/default-logo.png',
            contato: '',
            email: '',
            pix: '',
            textoPadrao: 'Impressão 3D em plástico PLA (nas cores disponíveis).\nObservação: Devido às limitações da área de impressão e altura das peças, elas poderão ser produzidas em partes, portanto todos terão uma linha de junção em algum lugar. O tempo para finalização será de 5 dias corridos após o pagamento.\n\nCaso tenha feito opção por alguma cor que não temos, acrescentaremos 4 dias ou mais se necessário, tempo para que chegue o material na cor desejada.\n\nQualquer dúvida estou à disposição!'
        };
        
        document.getElementById('nome_empresa').value = empresa.nome;
        document.getElementById('contato_empresa').value = empresa.contato;
        document.getElementById('email_empresa').value = empresa.email;
        document.getElementById('pix_empresa').value = empresa.pix;
        document.getElementById('texto_padrao').value = empresa.textoPadrao;
        
        // Exibir logo da empresa
        const companyLogo = document.getElementById('company-logo');
        if (companyLogo) {
            companyLogo.src = empresa.logo;
        }
        
        // Exibir preview da logo
        const previewLogo = document.getElementById('preview-logo');
        if (previewLogo) {
            previewLogo.innerHTML = `<img src="${empresa.logo}" alt="Logo da Empresa">`;
        }
        
        // Atualizar seletores
        atualizarSeletorImpressora();
        atualizarSeletorMaterial();
        atualizarSeletorImpressoraConfig();
        atualizarSeletorMaterialConfig();
        atualizarHistorico();
    }
    
    // Função para inicializar event listeners
    function inicializarEventListeners() {
        // Event listeners para navegação de abas
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const tab = this.getAttribute('data-tab');
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                document.getElementById(tab).classList.add('active');
            });
        });
        
        // Event listeners para navegação de abas de configuração
        document.querySelectorAll('.config-tab-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const tab = this.getAttribute('data-config-tab');
                document.querySelectorAll('.config-tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.config-tab-content').forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                document.getElementById(tab + '-config').classList.add('active');
            });
        });
        
        // Event listener para seleção de impressora
        document.querySelectorAll('.printer-option').forEach(option => {
            option.addEventListener('click', function() {
                const printerId = this.getAttribute('data-printer');
                document.querySelectorAll('.printer-option').forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                document.getElementById('impressora').value = printerId;
            });
        });
        
        // Event listener para seleção de impressora nas configurações
        document.getElementById('impressora_config').addEventListener('change', function() {
            const impressoraId = this.value;
            const impressoraPersonalizadaContainer = document.getElementById('impressora-personalizada-container');
            
            if (impressoraId === 'personalizada') {
                impressoraPersonalizadaContainer.style.display = 'block';
                // Limpar campos
                document.getElementById('nome_impressora').value = '';
                document.getElementById('valor_impressora').value = '';
                document.getElementById('tempo_retorno').value = '12';
                document.getElementById('horas_dia').value = '15';
                document.getElementById('dias_mes').value = '20';
                document.getElementById('potencia_impressora').value = '0.35';
                document.getElementById('taxa_falha').value = '15';
                document.getElementById('valor_depreciacao').value = '';
                document.getElementById('preview-impressora').innerHTML = '';
            } else {
                impressoraPersonalizadaContainer.style.display = 'none';
                // Preencher campos com dados da impressora selecionada
                const impressora = impressoras.find(imp => imp.id === impressoraId);
                if (impressora) {
                    document.getElementById('valor_impressora').value = impressora.valor;
                    document.getElementById('tempo_retorno').value = impressora.tempoRetorno;
                    document.getElementById('horas_dia').value = impressora.horasDia;
                    document.getElementById('dias_mes').value = impressora.diasMes;
                    document.getElementById('potencia_impressora').value = impressora.potencia;
                    document.getElementById('taxa_falha').value = impressora.taxaFalha;
                    
                    // Calcular valor de depreciação
                    calcularValorDepreciacao();
                }
            }
        });
        
        // Event listener para upload de imagem da impressora
        document.getElementById('imagem_impressora').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    document.getElementById('preview-impressora').innerHTML = `<img src="${event.target.result}" alt="Preview da Impressora">`;
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Event listener para upload de logo da empresa
        document.getElementById('logo_empresa').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    document.getElementById('preview-logo').innerHTML = `<img src="${event.target.result}" alt="Preview da Logo">`;
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Event listeners para cálculo de depreciação
        document.getElementById('valor_impressora').addEventListener('input', calcularValorDepreciacao);
        document.getElementById('tempo_retorno').addEventListener('input', calcularValorDepreciacao);
        document.getElementById('horas_dia').addEventListener('input', calcularValorDepreciacao);
        document.getElementById('dias_mes').addEventListener('input', calcularValorDepreciacao);
        
        // Event listeners para cálculo de custo operacional
        document.getElementById('custo_aluguel').addEventListener('input', calcularCustoOperacionalHora);
        document.getElementById('custo_agua').addEventListener('input', calcularCustoOperacionalHora);
        document.getElementById('custo_internet').addEventListener('input', calcularCustoOperacionalHora);
        document.getElementById('custo_funcionario').addEventListener('input', calcularCustoOperacionalHora);
        document.getElementById('custo_computador').addEventListener('input', calcularCustoOperacionalHora);
        document.getElementById('custo_outros').addEventListener('input', calcularCustoOperacionalHora);
        
        // Event listener para seleção de material nas configurações
        document.getElementById('material_config').addEventListener('change', function() {
            const materialId = this.value;
            
            if (materialId === 'novo') {
                // Limpar campos
                document.getElementById('nome_material').value = '';
                document.getElementById('valor_material').value = '';
                document.getElementById('densidade_material').value = '';
                document.getElementById('comprimento_material').value = '';
                document.getElementById('descricao_material').value = '';
                document.getElementById('aplicacoes_material').value = '';
                document.getElementById('vantagens_material').value = '';
                document.getElementById('desvantagens_material').value = '';
                document.getElementById('excluir-material-btn').style.display = 'none';
            } else {
                // Preencher campos com dados do material selecionado
                const material = materiais.find(mat => mat.id === materialId);
                if (material) {
                    document.getElementById('nome_material').value = material.nome;
                    document.getElementById('valor_material').value = material.valor;
                    document.getElementById('densidade_material').value = material.densidade;
                    document.getElementById('comprimento_material').value = material.comprimento;
                    document.getElementById('descricao_material').value = material.descricao || '';
                    document.getElementById('aplicacoes_material').value = material.aplicacoes || '';
                    document.getElementById('vantagens_material').value = material.vantagens || '';
                    document.getElementById('desvantagens_material').value = material.desvantagens || '';
                    document.getElementById('excluir-material-btn').style.display = 'block';
                }
            }
        });
        
        // Event listener para botão de salvar impressora
        document.getElementById('salvar-impressora-btn').addEventListener('click', function() {
            const impressoraId = document.getElementById('impressora_config').value;
            const valor = parseFloat(document.getElementById('valor_impressora').value);
            const tempoRetorno = parseInt(document.getElementById('tempo_retorno').value);
            const horasDia = parseInt(document.getElementById('horas_dia').value);
            const diasMes = parseInt(document.getElementById('dias_mes').value);
            const potencia = parseFloat(document.getElementById('potencia_impressora').value);
            const taxaFalha = parseFloat(document.getElementById('taxa_falha').value);
            
            if (!valor || !tempoRetorno || !horasDia || !diasMes || !potencia || isNaN(taxaFalha)) {
                mostrarToast('Preencha todos os campos obrigatórios');
                return;
            }
            
            if (impressoraId === 'personalizada') {
                const nome = document.getElementById('nome_impressora').value.trim();
                if (!nome) {
                    mostrarToast('Informe um nome para a impressora personalizada');
                    return;
                }
                
                // Verificar se já existe uma impressora com este nome
                const impressoraExistente = impressoras.find(imp => 
                    imp.id !== 'personalizada' && 
                    imp.nome.toLowerCase() === nome.toLowerCase()
                );
                
                if (impressoraExistente) {
                    mostrarToast('Já existe uma impressora com este nome');
                    return;
                }
                
                // Gerar ID único para a impressora
                const novoId = 'imp_' + Date.now();
                
                // Obter imagem da impressora
                let imagem = 'images/custom_printer.jpg'; // Imagem padrão
                const previewImg = document.querySelector('#preview-impressora img');
                if (previewImg) {
                    imagem = previewImg.src;
                }
                
                // Adicionar nova impressora
                impressoras.push({
                    id: novoId,
                    nome: nome,
                    valor: valor,
                    tempoRetorno: tempoRetorno,
                    horasDia: horasDia,
                    diasMes: diasMes,
                    potencia: potencia,
                    taxaFalha: taxaFalha,
                    imagem: imagem
                });
                
                // Atualizar seletores
                atualizarSeletorImpressora();
                atualizarSeletorImpressoraConfig();
                
                // Selecionar a nova impressora
                document.getElementById('impressora_config').value = novoId;
                
                mostrarToast('Impressora personalizada adicionada com sucesso');
            } else {
                // Atualizar impressora existente
                const index = impressoras.findIndex(imp => imp.id === impressoraId);
                if (index !== -1) {
                    impressoras[index].valor = valor;
                    impressoras[index].tempoRetorno = tempoRetorno;
                    impressoras[index].horasDia = horasDia;
                    impressoras[index].diasMes = diasMes;
                    impressoras[index].potencia = potencia;
                    impressoras[index].taxaFalha = taxaFalha;
                    
                    mostrarToast('Configurações da impressora atualizadas com sucesso');
                }
            }
            
            // Salvar no localStorage
            localStorage.setItem('impressoras', JSON.stringify(impressoras));
        });
        
        // Event listener para botão de salvar material
        document.getElementById('salvar-material-btn').addEventListener('click', function() {
            const materialId = document.getElementById('material_config').value;
            const nome = document.getElementById('nome_material').value.trim();
            const valor = parseFloat(document.getElementById('valor_material').value);
            const densidade = parseFloat(document.getElementById('densidade_material').value);
            const comprimento = parseFloat(document.getElementById('comprimento_material').value);
            const descricao = document.getElementById('descricao_material').value.trim();
            const aplicacoes = document.getElementById('aplicacoes_material').value.trim();
            const vantagens = document.getElementById('vantagens_material').value.trim();
            const desvantagens = document.getElementById('desvantagens_material').value.trim();
            
            if (!nome || !valor || !densidade || !comprimento) {
                mostrarToast('Preencha todos os campos obrigatórios');
                return;
            }
            
            if (materialId === 'novo') {
                // Verificar se já existe um material com este nome
                const materialExistente = materiais.find(mat => 
                    mat.nome.toLowerCase() === nome.toLowerCase()
                );
                
                if (materialExistente) {
                    mostrarToast('Já existe um material com este nome');
                    return;
                }
                
                // Gerar ID único para o material
                const novoId = 'mat_' + Date.now();
                
                // Adicionar novo material
                materiais.push({
                    id: novoId,
                    nome: nome,
                    valor: valor,
                    densidade: densidade,
                    comprimento: comprimento,
                    descricao: descricao,
                    aplicacoes: aplicacoes,
                    vantagens: vantagens,
                    desvantagens: desvantagens
                });
                
                // Atualizar seletores
                atualizarSeletorMaterial();
                atualizarSeletorMaterialConfig();
                
                // Selecionar o novo material
                document.getElementById('material_config').value = novoId;
                
                mostrarToast('Material adicionado com sucesso');
            } else {
                // Atualizar material existente
                const index = materiais.findIndex(mat => mat.id === materialId);
                if (index !== -1) {
                    materiais[index].nome = nome;
                    materiais[index].valor = valor;
                    materiais[index].densidade = densidade;
                    materiais[index].comprimento = comprimento;
                    materiais[index].descricao = descricao;
                    materiais[index].aplicacoes = aplicacoes;
                    materiais[index].vantagens = vantagens;
                    materiais[index].desvantagens = desvantagens;
                    
                    mostrarToast('Material atualizado com sucesso');
                }
            }
            
            // Salvar no localStorage
            localStorage.setItem('materiais', JSON.stringify(materiais));
        });
        
        // Event listener para botão de excluir material
        document.getElementById('excluir-material-btn').addEventListener('click', function() {
            const materialId = document.getElementById('material_config').value;
            
            if (materialId === 'novo') {
                return;
            }
            
            // Confirmar exclusão
            if (!confirm('Tem certeza que deseja excluir este material?')) {
                return;
            }
            
            // Remover material
            const index = materiais.findIndex(mat => mat.id === materialId);
            if (index !== -1) {
                materiais.splice(index, 1);
                
                // Atualizar seletores
                atualizarSeletorMaterial();
                atualizarSeletorMaterialConfig();
                
                // Selecionar "Adicionar novo material"
                document.getElementById('material_config').value = 'novo';
                document.getElementById('material_config').dispatchEvent(new Event('change'));
                
                mostrarToast('Material excluído com sucesso');
                
                // Salvar no localStorage
                localStorage.setItem('materiais', JSON.stringify(materiais));
            }
        });
        
        // Event listener para botão de ver biblioteca de materiais
        document.getElementById('ver-biblioteca-btn').addEventListener('click', function() {
            document.getElementById('material-info-modal').style.display = 'block';
            
            // Criar cards de materiais
            const container = document.querySelector('.material-info-cards-container');
            container.innerHTML = '';
            
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
        });
        
        // Event listener para botão de salvar custos
        document.getElementById('salvar-custos-btn').addEventListener('click', function() {
            const energia = parseFloat(document.getElementById('custo_energia').value);
            const manutencao = parseFloat(document.getElementById('custo_manutencao').value);
            const trabalho = parseFloat(document.getElementById('custo_trabalho').value);
            const aluguel = parseFloat(document.getElementById('custo_aluguel').value);
            const agua = parseFloat(document.getElementById('custo_agua').value);
            const internet = parseFloat(document.getElementById('custo_internet').value);
            const funcionario = parseFloat(document.getElementById('custo_funcionario').value);
            const computador = parseFloat(document.getElementById('custo_computador').value);
            const outros = parseFloat(document.getElementById('custo_outros').value);
            
            if (isNaN(energia) || isNaN(manutencao) || isNaN(trabalho)) {
                mostrarToast('Preencha os campos obrigatórios');
                return;
            }
            
            // Salvar custos
            const custos = {
                energia: energia,
                manutencao: manutencao,
                trabalho: trabalho,
                aluguel: aluguel || 0,
                agua: agua || 0,
                internet: internet || 0,
                funcionario: funcionario || 0,
                computador: computador || 0,
                outros: outros || 0
            };
            
            localStorage.setItem('custos', JSON.stringify(custos));
            
            // Calcular custo operacional por hora
            calcularCustoOperacionalHora();
            
            mostrarToast('Configurações de custos salvas com sucesso');
        });
        
        // Event listener para botão de salvar empresa
        document.getElementById('salvar-empresa-btn').addEventListener('click', function() {
            const nome = document.getElementById('nome_empresa').value.trim();
            const contato = document.getElementById('contato_empresa').value.trim();
            const email = document.getElementById('email_empresa').value.trim();
            const pix = document.getElementById('pix_empresa').value.trim();
            const textoPadrao = document.getElementById('texto_padrao').value.trim();
            
            // Obter logo da empresa
            let logo = 'images/default-logo.png'; // Logo padrão
            const previewImg = document.querySelector('#preview-logo img');
            if (previewImg) {
                logo = previewImg.src;
            }
            
            // Salvar empresa
            const empresa = {
                nome: nome,
                logo: logo,
                contato: contato,
                email: email,
                pix: pix,
                textoPadrao: textoPadrao
            };
            
            localStorage.setItem('empresa', JSON.stringify(empresa));
            
            // Atualizar logo na interface
            const companyLogo = document.getElementById('company-logo');
            if (companyLogo) {
                companyLogo.src = logo;
            }
            
            mostrarToast('Configurações da empresa salvas com sucesso');
        });
        
        // Event listener para botão de calcular
        document.getElementById('calcular-btn').addEventListener('click', function() {
            // Obter valores dos campos
            const impressoraId = document.getElementById('impressora').value;
            const materialId = document.getElementById('material').value;
            const pesoPeca = parseFloat(document.getElementById('peso_peca').value);
            const comprimentoFilamento = parseFloat(document.getElementById('comprimento_filamento').value.replace(',', '.'));
            
            // Obter tempo de impressão
            const tempoHoras = parseInt(document.getElementById('tempo_horas').value) || 0;
            const tempoMinutos = parseInt(document.getElementById('tempo_minutos').value) || 0;
            const tempoImpressao = tempoHoras + (tempoMinutos / 60);
            
            const custoModelagem = parseFloat(document.getElementById('custo_modelagem').value) || 0;
            const tempoTrabalho = parseFloat(document.getElementById('tempo_trabalho').value) || 0;
            const percentualLucro = parseFloat(document.getElementById('percentual_lucro').value) || 100;
            const alturaLayer = document.getElementById('layer-height').value;
            
            // Validar campos obrigatórios
            if (!impressoraId || !materialId || (!pesoPeca && !comprimentoFilamento) || !tempoImpressao) {
                mostrarToast('Preencha os campos obrigatórios');
                return;
            }
            
            // Obter impressora e material
            const impressora = impressoras.find(imp => imp.id === impressoraId);
            const material = materiais.find(mat => mat.id === materialId);
            
            if (!impressora || !material) {
                mostrarToast('Impressora ou material não encontrado');
                return;
            }
            
            // Obter custos
            const custos = JSON.parse(localStorage.getItem('custos')) || {
                energia: 1.00,
                manutencao: 0.50,
                trabalho: 30.00
            };
            
            // Calcular custo do filamento
            let custoFilamento = 0;
            if (comprimentoFilamento) {
                // Calcular com base no comprimento
                const pesoKg = comprimentoFilamento / material.comprimento;
                custoFilamento = pesoKg * material.valor;
            } else {
                // Calcular com base no peso
                const pesoKg = pesoPeca / 1000;
                custoFilamento = pesoKg * material.valor;
            }
            
            // Calcular custo de energia
            const custoEnergia = tempoImpressao * impressora.potencia * custos.energia;
            
            // Calcular custo de depreciação
            const horasMensais = impressora.horasDia * impressora.diasMes;
            const custoDepreciacao = (impressora.valor / (impressora.tempoRetorno * horasMensais)) * tempoImpressao;
            
            // Calcular custo de mão de obra
            const custoTrabalho = tempoTrabalho * custos.trabalho;
            
            // Calcular custo de manutenção
            const custoManutencao = tempoImpressao * custos.manutencao;
            
            // Calcular custo operacional
            const custoOperacional = tempoImpressao * parseFloat(document.getElementById('custo_operacional_hora').value || 0);
            
            // Calcular custo total sem taxa de falha
            const custoTotal = custoFilamento + custoEnergia + custoDepreciacao + custoTrabalho + custoModelagem + custoManutencao + custoOperacional;
            
            // Aplicar taxa de falha
            const custoComFalha = custoTotal * (1 + (impressora.taxaFalha / 100));
            
            // Calcular lucro
            const lucro = custoComFalha * (percentualLucro / 100);
            
            // Calcular preço de venda
            const precoVenda = custoComFalha + lucro;
            
            // Armazenar cálculo atual
            calculoAtual = {
                data: new Date(),
                impressora: impressora.nome,
                material: material.nome,
                pesoPeca: pesoPeca,
                comprimentoFilamento: comprimentoFilamento,
                tempoImpressao: tempoImpressao,
                custoModelagem: custoModelagem,
                tempoTrabalho: tempoTrabalho,
                percentualLucro: percentualLucro,
                alturaLayer: alturaLayer,
                custoFilamento: custoFilamento,
                custoEnergia: custoEnergia,
                custoDepreciacao: custoDepreciacao,
                custoTrabalho: custoTrabalho,
                custoModelagem: custoModelagem,
                custoManutencao: custoManutencao,
                custoOperacional: custoOperacional,
                taxaFalha: impressora.taxaFalha,
                custoTotal: custoTotal,
                custoComFalha: custoComFalha,
                lucro: lucro,
                precoVenda: precoVenda
            };
            
            // Exibir resultados
            document.getElementById('resultado-material').textContent = material.nome;
            document.getElementById('resultado-qualidade').textContent = getQualidadeLabel(alturaLayer);
            document.getElementById('resultado-filamento').textContent = `R$ ${custoFilamento.toFixed(2)}`;
            document.getElementById('resultado-energia').textContent = `R$ ${custoEnergia.toFixed(2)}`;
            document.getElementById('resultado-depreciacao').textContent = `R$ ${custoDepreciacao.toFixed(2)}`;
            document.getElementById('resultado-trabalho').textContent = `R$ ${custoTrabalho.toFixed(2)}`;
            document.getElementById('resultado-modelagem').textContent = `R$ ${custoModelagem.toFixed(2)}`;
            document.getElementById('resultado-manutencao').textContent = `R$ ${custoManutencao.toFixed(2)}`;
            document.getElementById('resultado-operacional').textContent = `R$ ${custoOperacional.toFixed(2)}`;
            document.getElementById('resultado-taxa-falha').textContent = `${impressora.taxaFalha}% (R$ ${(custoTotal * (impressora.taxaFalha / 100)).toFixed(2)})`;
            document.getElementById('resultado-custo-total').textContent = `R$ ${custoComFalha.toFixed(2)}`;
            document.getElementById('resultado-lucro').textContent = `R$ ${lucro.toFixed(2)} (${percentualLucro}%)`;
            document.getElementById('resultado-preco-venda').textContent = `R$ ${precoVenda.toFixed(2)}`;
            
            // Exibir card de resultados
            document.getElementById('resultado-card').style.display = 'block';
            
            // Scroll para os resultados
            document.getElementById('resultado-card').scrollIntoView({ behavior: 'smooth' });
            
            // Disponibilizar calculoAtual para outros scripts
            window.calculoAtual = calculoAtual;
        });
        
        // Event listener para botão de limpar
        document.getElementById('limpar-btn').addEventListener('click', function() {
            document.getElementById('peso_peca').value = '';
            document.getElementById('comprimento_filamento').value = '';
            document.getElementById('tempo_horas').value = '';
            document.getElementById('tempo_minutos').value = '';
            document.getElementById('custo_modelagem').value = '';
            document.getElementById('tempo_trabalho').value = '';
            document.getElementById('layer-height').value = '0.16';
            document.getElementById('layer-height').dispatchEvent(new Event('change'));
            document.getElementById('resultado-card').style.display = 'none';
            calculoAtual = null;
        });
        
        // Event listener para botão de salvar no histórico
        document.getElementById('save-history-btn').addEventListener('click', function() {
            if (!calculoAtual) {
                mostrarToast('Nenhum cálculo para salvar');
                return;
            }
            
            // Adicionar ao histórico
            historico.unshift({
                id: Date.now(),
                ...calculoAtual
            });
            
            // Limitar tamanho do histórico
            if (historico.length > 100) {
                historico = historico.slice(0, 100);
            }
            
            // Salvar no localStorage
            localStorage.setItem('historico', JSON.stringify(historico));
            
            // Atualizar histórico
            atualizarHistorico();
            
            mostrarToast('Cálculo salvo no histórico');
        });
        
        // Event listener para botão de exportar orçamento
        document.getElementById('export-pdf-btn').addEventListener('click', function() {
            if (!calculoAtual) {
                mostrarToast('Faça um cálculo primeiro');
                return;
            }
            
            // Exibir modal de exportação
            document.getElementById('pdf-modal').style.display = 'block';
        });
        
        // Event listener para botão de gerar PDF
        document.getElementById('generate-pdf-btn').addEventListener('click', function() {
            const cliente = document.getElementById('pdf-cliente').value.trim();
            const projeto = document.getElementById('pdf-projeto').value.trim();
            const observacoes = document.getElementById('pdf-observacoes').value.trim();
            const incluirMaterialInfo = document.getElementById('pdf-incluir-material-info').checked;
            const incluirQualidadeInfo = document.getElementById('pdf-incluir-qualidade-info').checked;
            
            if (!cliente || !projeto) {
                mostrarToast('Preencha o nome do cliente e do projeto');
                return;
            }
            
            // Obter dados da empresa
            const empresa = JSON.parse(localStorage.getItem('empresa')) || {
                nome: '',
                logo: 'images/default-logo.png',
                contato: '',
                email: '',
                pix: '',
                textoPadrao: ''
            };
            
            // Obter material
            const material = materiais.find(mat => mat.nome === calculoAtual.material);
            
            // Preparar dados para o PDF
            const dadosPDF = {
                cliente: cliente,
                projeto: projeto,
                observacoes: observacoes,
                incluirMaterialInfo: incluirMaterialInfo,
                incluirQualidadeInfo: incluirQualidadeInfo,
                empresa: empresa,
                material: material,
                calculo: calculoAtual
            };
            
            // Gerar PDF
            gerarPDF(dadosPDF);
            
            // Fechar modal
            document.getElementById('pdf-modal').style.display = 'none';
        });
        
        // Event listener para botão de comparar materiais
        document.getElementById('compare-materials-btn').addEventListener('click', function() {
            // Exibir modal de comparação
            document.getElementById('material-comparison-modal').style.display = 'block';
            
            // Preencher checkboxes de materiais
            const container = document.querySelector('.material-selection-container');
            container.innerHTML = '';
            
            materiais.forEach((material, index) => {
                const div = document.createElement('div');
                div.className = 'material-checkbox';
                div.innerHTML = `
                    <input type="checkbox" id="material-check-${index}" value="${index}">
                    <label for="material-check-${index}">${material.nome}</label>
                `;
                container.appendChild(div);
            });
        });
        
        // Event listener para botão de comparar materiais selecionados
        document.getElementById('compare-selected-btn').addEventListener('click', function() {
            const checkboxes = document.querySelectorAll('.material-checkbox input:checked');
            if (checkboxes.length < 2) {
                mostrarToast('Selecione pelo menos 2 materiais para comparar');
                return;
            }
            
            const materiaisSelecionados = Array.from(checkboxes).map(cb => materiais[parseInt(cb.value)]);
            
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
        });
        
        // Event listeners para fechar modais
        document.querySelectorAll('.modal .close-modal').forEach(closeBtn => {
            closeBtn.addEventListener('click', function() {
                this.closest('.modal').style.display = 'none';
            });
        });
        
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.style.display = 'none';
                }
            });
        });
        
        // Event listener para busca no histórico
        document.getElementById('search-history').addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const historyItems = document.querySelectorAll('.history-item');
            
            historyItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
    
    // Função para atualizar seletor de impressora
    function atualizarSeletorImpressora() {
        const container = document.querySelector('.printer-selection');
        if (!container) return;
        
        container.innerHTML = '';
        
        impressoras.forEach(impressora => {
            const div = document.createElement('div');
            div.className = 'printer-option';
            div.setAttribute('data-printer', impressora.id);
            div.innerHTML = `
                <img src="${impressora.imagem}" alt="${impressora.nome}">
                <span>${impressora.nome}</span>
            `;
            container.appendChild(div);
        });
        
        // Adicionar opção personalizada
        const div = document.createElement('div');
        div.className = 'printer-option';
        div.setAttribute('data-printer', 'personalizada');
        div.innerHTML = `
            <img src="images/custom_printer.jpg" alt="Personalizada">
            <span>PERSONALIZADA</span>
        `;
        container.appendChild(div);
        
        // Adicionar event listeners
        document.querySelectorAll('.printer-option').forEach(option => {
            option.addEventListener('click', function() {
                const printerId = this.getAttribute('data-printer');
                document.querySelectorAll('.printer-option').forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                document.getElementById('impressora').value = printerId;
            });
        });
        
        // Selecionar primeira impressora por padrão
        if (impressoras.length > 0) {
            const firstOption = document.querySelector('.printer-option');
            if (firstOption) {
                firstOption.classList.add('selected');
                document.getElementById('impressora').value = firstOption.getAttribute('data-printer');
            }
        }
    }
    
    // Função para atualizar seletor de material
    function atualizarSeletorMaterial() {
        const select = document.getElementById('material');
        if (!select) return;
        
        // Limpar opções
        select.innerHTML = '<option value="" disabled selected>Selecione um material</option>';
        
        // Adicionar opções
        materiais.forEach(material => {
            const option = document.createElement('option');
            option.value = material.id;
            option.textContent = material.nome;
            select.appendChild(option);
        });
    }
    
    // Função para atualizar seletor de impressora nas configurações
    function atualizarSeletorImpressoraConfig() {
        const select = document.getElementById('impressora_config');
        if (!select) return;
        
        // Salvar seleção atual
        const selectedValue = select.value;
        
        // Limpar opções
        select.innerHTML = '';
        
        // Adicionar opções
        impressoras.forEach(impressora => {
            const option = document.createElement('option');
            option.value = impressora.id;
            option.textContent = impressora.nome;
            select.appendChild(option);
        });
        
        // Adicionar opção personalizada
        const option = document.createElement('option');
        option.value = 'personalizada';
        option.textContent = 'Adicionar Nova Impressora';
        select.appendChild(option);
        
        // Restaurar seleção
        if (selectedValue && select.querySelector(`option[value="${selectedValue}"]`)) {
            select.value = selectedValue;
        } else {
            select.value = impressoras.length > 0 ? impressoras[0].id : 'personalizada';
        }
        
        // Disparar evento change
        select.dispatchEvent(new Event('change'));
    }
    
    // Função para atualizar seletor de material nas configurações
    function atualizarSeletorMaterialConfig() {
        const select = document.getElementById('material_config');
        if (!select) return;
        
        // Salvar seleção atual
        const selectedValue = select.value;
        
        // Limpar opções
        select.innerHTML = '';
        
        // Adicionar opções
        materiais.forEach(material => {
            const option = document.createElement('option');
            option.value = material.id;
            option.textContent = material.nome;
            select.appendChild(option);
        });
        
        // Adicionar opção para novo material
        const option = document.createElement('option');
        option.value = 'novo';
        option.textContent = 'Adicionar Novo Material';
        select.appendChild(option);
        
        // Restaurar seleção
        if (selectedValue && select.querySelector(`option[value="${selectedValue}"]`)) {
            select.value = selectedValue;
        } else {
            select.value = materiais.length > 0 ? materiais[0].id : 'novo';
        }
        
        // Disparar evento change
        select.dispatchEvent(new Event('change'));
    }
    
    // Função para atualizar histórico
    function atualizarHistorico() {
        const container = document.querySelector('.history-list');
        if (!container) return;
        
        if (historico.length === 0) {
            container.innerHTML = '<div class="empty-history">Nenhum cálculo salvo no histórico</div>';
            return;
        }
        
        container.innerHTML = '';
        
        historico.forEach(item => {
            const div = document.createElement('div');
            div.className = 'history-item';
            div.setAttribute('data-id', item.id);
            
            const data = new Date(item.data);
            const dataFormatada = `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')}/${data.getFullYear()} ${data.getHours().toString().padStart(2, '0')}:${data.getMinutes().toString().padStart(2, '0')}`;
            
            div.innerHTML = `
                <div class="history-item-title">${item.material} - ${item.pesoPeca || '?'}g</div>
                <div class="history-item-date">${dataFormatada}</div>
                <div class="history-item-details">
                    Impressora: ${item.impressora} | 
                    Tempo: ${Math.floor(item.tempoImpressao)}h${Math.round((item.tempoImpressao % 1) * 60)}m | 
                    Preço: R$ ${item.precoVenda.toFixed(2)}
                </div>
            `;
            
            div.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                const item = historico.find(h => h.id === id);
                
                if (item) {
                    exibirDetalhesHistorico(item);
                }
            });
            
            container.appendChild(div);
        });
    }
    
    // Função para exibir detalhes do histórico
    function exibirDetalhesHistorico(item) {
        const container = document.getElementById('history-details-content');
        container.innerHTML = '';
        
        const data = new Date(item.data);
        const dataFormatada = `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')}/${data.getFullYear()} ${data.getHours().toString().padStart(2, '0')}:${data.getMinutes().toString().padStart(2, '0')}`;
        
        const div = document.createElement('div');
        div.className = 'history-details';
        
        div.innerHTML = `
            <div class="result-item">
                <span class="result-label">Data:</span>
                <span class="result-value">${dataFormatada}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Impressora:</span>
                <span class="result-value">${item.impressora}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Material:</span>
                <span class="result-value">${item.material}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Peso da Peça:</span>
                <span class="result-value">${item.pesoPeca ? item.pesoPeca + 'g' : '-'}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Comprimento do Filamento:</span>
                <span class="result-value">${item.comprimentoFilamento ? item.comprimentoFilamento + 'm' : '-'}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Tempo de Impressão:</span>
                <span class="result-value">${Math.floor(item.tempoImpressao)}h${Math.round((item.tempoImpressao % 1) * 60)}m</span>
            </div>
            <div class="result-item">
                <span class="result-label">Qualidade:</span>
                <span class="result-value">${getQualidadeLabel(item.alturaLayer)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Custo do Filamento:</span>
                <span class="result-value">R$ ${item.custoFilamento.toFixed(2)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Custo de Energia:</span>
                <span class="result-value">R$ ${item.custoEnergia.toFixed(2)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Custo de Depreciação:</span>
                <span class="result-value">R$ ${item.custoDepreciacao.toFixed(2)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Custo de Pós-processamento:</span>
                <span class="result-value">R$ ${item.custoTrabalho.toFixed(2)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Custo de Modelagem:</span>
                <span class="result-value">R$ ${item.custoModelagem.toFixed(2)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Custo de Manutenção:</span>
                <span class="result-value">R$ ${item.custoManutencao.toFixed(2)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Custo Operacional:</span>
                <span class="result-value">R$ ${item.custoOperacional.toFixed(2)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Taxa de Falha:</span>
                <span class="result-value">${item.taxaFalha}% (R$ ${(item.custoTotal * (item.taxaFalha / 100)).toFixed(2)})</span>
            </div>
            <div class="result-item highlight">
                <span class="result-label">CUSTO TOTAL:</span>
                <span class="result-value">R$ ${item.custoComFalha.toFixed(2)}</span>
            </div>
            <div class="result-item highlight">
                <span class="result-label">LUCRO:</span>
                <span class="result-value">R$ ${item.lucro.toFixed(2)} (${item.percentualLucro}%)</span>
            </div>
            <div class="result-item highlight">
                <span class="result-label">PREÇO DE VENDA:</span>
                <span class="result-value">R$ ${item.precoVenda.toFixed(2)}</span>
            </div>
        `;
        
        container.appendChild(div);
        
        // Exibir detalhes
        document.querySelector('.history-list').style.display = 'none';
        document.getElementById('history-details').style.display = 'block';
        
        // Event listener para botão de usar este cálculo
        document.getElementById('use-history-btn').addEventListener('click', function() {
            // Preencher campos com dados do histórico
            document.getElementById('impressora').value = impressoras.find(imp => imp.nome === item.impressora)?.id || '';
            document.getElementById('material').value = materiais.find(mat => mat.nome === item.material)?.id || '';
            document.getElementById('peso_peca').value = item.pesoPeca || '';
            document.getElementById('comprimento_filamento').value = item.comprimentoFilamento || '';
            document.getElementById('tempo_horas').value = Math.floor(item.tempoImpressao);
            document.getElementById('tempo_minutos').value = Math.round((item.tempoImpressao % 1) * 60);
            document.getElementById('custo_modelagem').value = item.custoModelagem || '';
            document.getElementById('tempo_trabalho').value = item.tempoTrabalho || '';
            document.getElementById('percentual_lucro').value = item.percentualLucro || '';
            document.getElementById('layer-height').value = item.alturaLayer || '0.16';
            document.getElementById('layer-height').dispatchEvent(new Event('change'));
            
            // Selecionar impressora na interface visual
            document.querySelectorAll('.printer-option').forEach(opt => opt.classList.remove('selected'));
            const printerOption = document.querySelector(`.printer-option[data-printer="${impressoras.find(imp => imp.nome === item.impressora)?.id || ''}"]`);
            if (printerOption) {
                printerOption.classList.add('selected');
            }
            
            // Mudar para aba principal
            document.querySelector('.tab-btn[data-tab="principal"]').click();
            
            // Calcular
            document.getElementById('calcular-btn').click();
        });
        
        // Event listener para botão de excluir do histórico
        document.getElementById('delete-history-btn').addEventListener('click', function() {
            if (!confirm('Tem certeza que deseja excluir este item do histórico?')) {
                return;
            }
            
            const id = item.id;
            const index = historico.findIndex(h => h.id === id);
            
            if (index !== -1) {
                historico.splice(index, 1);
                localStorage.setItem('historico', JSON.stringify(historico));
                atualizarHistorico();
                document.getElementById('back-to-history-btn').click();
                mostrarToast('Item excluído do histórico');
            }
        });
        
        // Event listener para botão de voltar
        document.getElementById('back-to-history-btn').addEventListener('click', function() {
            document.querySelector('.history-list').style.display = 'block';
            document.getElementById('history-details').style.display = 'none';
        });
    }
    
    // Função para calcular valor de depreciação
    function calcularValorDepreciacao() {
        const valor = parseFloat(document.getElementById('valor_impressora').value);
        const tempoRetorno = parseInt(document.getElementById('tempo_retorno').value);
        const horasDia = parseInt(document.getElementById('horas_dia').value);
        const diasMes = parseInt(document.getElementById('dias_mes').value);
        
        if (!valor || !tempoRetorno || !horasDia || !diasMes) {
            document.getElementById('valor_depreciacao').value = '';
            return;
        }
        
        const horasMensais = horasDia * diasMes;
        const valorDepreciacao = valor / (tempoRetorno * horasMensais);
        
        document.getElementById('valor_depreciacao').value = valorDepreciacao.toFixed(2);
    }
    
    // Função para calcular custo operacional por hora
    function calcularCustoOperacionalHora() {
        const aluguel = parseFloat(document.getElementById('custo_aluguel').value) || 0;
        const agua = parseFloat(document.getElementById('custo_agua').value) || 0;
        const internet = parseFloat(document.getElementById('custo_internet').value) || 0;
        const funcionario = parseFloat(document.getElementById('custo_funcionario').value) || 0;
        const computador = parseFloat(document.getElementById('custo_computador').value) || 0;
        const outros = parseFloat(document.getElementById('custo_outros').value) || 0;
        
        // Calcular total mensal
        const totalMensal = aluguel + agua + internet + funcionario + computador + outros;
        
        // Calcular horas totais de operação mensal
        let horasTotaisMensal = 0;
        impressoras.forEach(impressora => {
            horasTotaisMensal += impressora.horasDia * impressora.diasMes;
        });
        
        // Se não houver impressoras ou horas, usar valor padrão
        if (horasTotaisMensal === 0) {
            horasTotaisMensal = 360; // 15 horas x 24 dias
        }
        
        // Calcular custo por hora
        const custoPorHora = totalMensal / horasTotaisMensal;
        
        document.getElementById('custo_operacional_hora').value = custoPorHora.toFixed(2);
    }
    
    // Função para gerar PDF
    function gerarPDF(dados) {
        // Esta função será implementada no arquivo pdf_client.js
        // Aqui apenas mostramos um toast informativo
        mostrarToast('Gerando PDF...');
        
        // Verificar se a função exportarPDF existe (definida em pdf_client.js)
        if (typeof exportarPDF === 'function') {
            exportarPDF(dados);
        } else {
            console.error('Função exportarPDF não encontrada');
            mostrarToast('Erro ao gerar PDF. Verifique o console.');
        }
    }
    
    // Função para obter rótulo da qualidade
    function getQualidadeLabel(altura) {
        switch(altura) {
            case '0.08': return '0.08mm (Ultra Fino)';
            case '0.12': return '0.12mm (Fino)';
            case '0.16': return '0.16mm (Padrão)';
            case '0.20': return '0.20mm (Normal)';
            case '0.24': return '0.24mm (Áspero)';
            default: return altura + 'mm';
        }
    }
    
    // Função para exibir toast
    function mostrarToast(mensagem) {
        const toast = document.getElementById('toast');
        toast.textContent = mensagem;
        toast.className = 'toast show';
        
        setTimeout(function() {
            toast.className = toast.className.replace('show', '');
        }, 3000);
    }
    
    // Disponibilizar funções globalmente
    window.mostrarToast = mostrarToast;
    window.getQualidadeLabel = getQualidadeLabel;
});
