// Implementação do fluxo de onboarding e personalização inicial
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se é o primeiro acesso
    const primeiroAcesso = localStorage.getItem('primeiroAcesso') !== 'false';
    
    // Função para inicializar dados padrão
    function inicializarDadosPadrao() {
        // Impressoras padrão
        const impressorasPadrao = [
            {
                id: 'imp_k1c',
                nome: 'Creality K1C',
                valor: 3800,
                tempoRetorno: 12,
                horasDia: 18,
                diasMes: 20,
                potencia: 0.35,
                taxaFalha: 15,
                imagem: 'images/printer_k1c.jpg'
            },
            {
                id: 'imp_a1',
                nome: 'A1 COMBO',
                valor: 5400,
                tempoRetorno: 12,
                horasDia: 18,
                diasMes: 20,
                potencia: 0.5,
                taxaFalha: 15,
                imagem: 'images/printer_a1.jpg'
            },
            {
                id: 'imp_k2',
                nome: 'K2 PLUS',
                valor: 13300,
                tempoRetorno: 12,
                horasDia: 10,
                diasMes: 20,
                potencia: 0.8,
                taxaFalha: 15,
                imagem: 'images/printer_k2.jpg'
            }
        ];
        
        // Materiais padrão
        const materiaisPadrao = [
            {
                id: 'mat_pla',
                nome: 'PLA',
                valor: 120,
                densidade: 1.24,
                comprimento: 330,
                descricao: 'Plástico biodegradável feito de amido de milho.',
                aplicacoes: 'Peças decorativas, protótipos, objetos que não serão expostos ao sol ou calor.',
                vantagens: 'Fácil de imprimir, boa precisão dimensional, acabamento brilhante, biodegradável.',
                desvantagens: 'Baixa resistência ao calor (amolece a 60°C), quebradiço, difícil de lixar.'
            },
            {
                id: 'mat_abs',
                nome: 'ABS',
                valor: 100,
                densidade: 1.04,
                comprimento: 380,
                descricao: 'Plástico derivado do petróleo, mesmo material dos blocos LEGO.',
                aplicacoes: 'Peças mecânicas, de engenharia e expostas a intempéries (chuva, sol).',
                vantagens: 'Resistente ao calor (até 105°C), durável, fácil de lixar e pintar.',
                desvantagens: 'Tende a empenar durante impressão, odor forte, não biodegradável.'
            },
            {
                id: 'mat_petg',
                nome: 'PETG',
                valor: 150,
                densidade: 1.27,
                comprimento: 380,
                descricao: 'Versão modificada do PET, material das garrafas plásticas.',
                aplicacoes: 'Meio termo entre ABS e PLA, bom para peças funcionais com exposição moderada ao sol.',
                vantagens: 'Resistente a impactos, boa resistência química, pouco empeno, resistência térmica moderada.',
                desvantagens: 'Acabamento menos bonito que PLA, pode apresentar stringing (fios).'
            },
            {
                id: 'mat_pla_silk',
                nome: 'PLA SILK',
                valor: 160,
                densidade: 1.22,
                comprimento: 335,
                descricao: 'PLA com aditivos que dão aparência metálica e sedosa.',
                aplicacoes: 'Peças decorativas ou de amostragem final sem acabamento.',
                vantagens: 'Acabamento brilhante e sedoso sem pós-processamento, fácil de imprimir.',
                desvantagens: 'Mesmas limitações do PLA regular, preço mais elevado.'
            },
            {
                id: 'mat_pla_cf',
                nome: 'PLA-CF',
                valor: 220,
                densidade: 1.18,
                comprimento: 380,
                descricao: 'PLA com fibras de carbono para maior resistência.',
                aplicacoes: 'Peças que precisam de resistência mecânica mas mantendo a facilidade de impressão do PLA.',
                vantagens: 'Combina qualidade visual do PLA com propriedades mecânicas próximas ao ABS, não sofre warping.',
                desvantagens: 'Preço elevado, pode ser abrasivo para o bico da impressora.'
            }
        ];
        
        // Configurações padrão
        const configPadrao = {
            custoEnergia: 1.0,
            custoModelagem: 50,
            custoMontagem: 30,
            custoManutencao: 20,
            percentualLucro: 200,
            custoOperacional: {
                aluguel: 1000,
                agua: 100,
                internet: 150,
                salarios: 2000,
                depreciacao: 200,
                marketing: 300,
                outros: 500
            }
        };
        
        // Salvar no localStorage apenas se não existirem dados
        if (!localStorage.getItem('impressoras')) {
            localStorage.setItem('impressoras', JSON.stringify(impressorasPadrao));
        }
        
        if (!localStorage.getItem('materiais')) {
            localStorage.setItem('materiais', JSON.stringify(materiaisPadrao));
        }
        
        if (!localStorage.getItem('config')) {
            localStorage.setItem('config', JSON.stringify(configPadrao));
        }
    }
    
    // Função para mostrar o modal de onboarding
    function mostrarOnboarding() {
        const modal = document.getElementById('onboarding-modal');
        if (!modal) return;
        
        modal.style.display = 'block';
        
        // Configurar passos do onboarding
        const passos = [
            {
                titulo: 'Bem-vindo à Calculadora de Custos para Impressão 3D!',
                conteudo: 'Este aplicativo ajudará você a calcular com precisão os custos e preços de venda para seus trabalhos de impressão 3D. Vamos configurar algumas coisas básicas para começar.',
                imagem: 'images/welcome.jpg'
            },
            {
                titulo: 'Escolha sua impressora',
                conteudo: 'Já incluímos algumas impressoras populares. Você pode usar uma delas ou adicionar sua própria impressora nas configurações.',
                imagem: 'images/printers.jpg'
            },
            {
                titulo: 'Materiais disponíveis',
                conteudo: 'Incluímos os materiais mais comuns com suas propriedades. Você pode personalizar ou adicionar novos materiais a qualquer momento.',
                imagem: 'images/materials.jpg'
            },
            {
                titulo: 'Custos operacionais',
                conteudo: 'Para um cálculo preciso, configure seus custos operacionais como aluguel, energia, internet, etc. nas configurações.',
                imagem: 'images/costs.jpg'
            },
            {
                titulo: 'Personalize sua marca',
                conteudo: 'Adicione o logo da sua empresa para personalizar os orçamentos em PDF que você enviará aos clientes.',
                imagem: 'images/branding.jpg'
            },
            {
                titulo: 'Pronto para começar!',
                conteudo: 'Tudo configurado! Agora você pode começar a calcular os custos das suas impressões 3D. Acesse as configurações a qualquer momento para personalizar mais opções.',
                imagem: 'images/ready.jpg'
            }
        ];
        
        let passoAtual = 0;
        
        // Elementos do modal
        const titulo = document.getElementById('onboarding-titulo');
        const conteudo = document.getElementById('onboarding-conteudo');
        const imagem = document.getElementById('onboarding-imagem');
        const btnAnterior = document.getElementById('onboarding-anterior');
        const btnProximo = document.getElementById('onboarding-proximo');
        const indicadores = document.getElementById('onboarding-indicadores');
        
        // Função para atualizar o conteúdo do passo
        function atualizarPasso() {
            const passo = passos[passoAtual];
            
            titulo.textContent = passo.titulo;
            conteudo.textContent = passo.conteudo;
            imagem.src = passo.imagem;
            imagem.alt = passo.titulo;
            
            // Atualizar botões
            btnAnterior.style.display = passoAtual > 0 ? 'block' : 'none';
            btnProximo.textContent = passoAtual < passos.length - 1 ? 'Próximo' : 'Começar';
            
            // Atualizar indicadores
            indicadores.innerHTML = '';
            for (let i = 0; i < passos.length; i++) {
                const indicador = document.createElement('div');
                indicador.className = 'onboarding-indicador' + (i === passoAtual ? ' ativo' : '');
                indicadores.appendChild(indicador);
            }
        }
        
        // Inicializar primeiro passo
        atualizarPasso();
        
        // Event listeners para navegação
        btnAnterior.addEventListener('click', function() {
            if (passoAtual > 0) {
                passoAtual--;
                atualizarPasso();
            }
        });
        
        btnProximo.addEventListener('click', function() {
            if (passoAtual < passos.length - 1) {
                passoAtual++;
                atualizarPasso();
            } else {
                // Último passo, fechar onboarding
                modal.style.display = 'none';
                localStorage.setItem('primeiroAcesso', 'false');
                
                // Redirecionar para configurações se for o primeiro acesso
                if (primeiroAcesso) {
                    document.querySelector('a[href="#configuracoes"]').click();
                }
            }
        });
    }
    
    // Inicializar dados padrão
    inicializarDadosPadrao();
    
    // Mostrar onboarding se for o primeiro acesso
    if (primeiroAcesso) {
        // Pequeno delay para garantir que a página carregou completamente
        setTimeout(mostrarOnboarding, 500);
    }
    
    // Adicionar botão para mostrar onboarding novamente
    const btnAjuda = document.getElementById('btn-ajuda');
    if (btnAjuda) {
        btnAjuda.addEventListener('click', mostrarOnboarding);
    }
});
