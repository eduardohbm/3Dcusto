// Implementação da separação clara entre configurações globais e dados de uso diário
document.addEventListener('DOMContentLoaded', function() {
    // Função para garantir que a navegação entre abas funcione corretamente
    function configurarNavegacaoAbas() {
        // Elementos de navegação principal
        const navPrincipal = document.getElementById('nav-principal');
        const navConfig = document.getElementById('nav-config');
        const navHistorico = document.getElementById('nav-historico');
        
        // Containers de conteúdo
        const principalContainer = document.getElementById('principal-container');
        const configContainer = document.getElementById('config-container');
        const historicoContainer = document.getElementById('historico-container');
        
        // Função para alternar entre as abas principais
        function alternarAbaPrincipal(aba) {
            // Remover classe ativa de todas as abas
            navPrincipal.classList.remove('active');
            navConfig.classList.remove('active');
            navHistorico.classList.remove('active');
            
            // Esconder todos os containers
            principalContainer.style.display = 'none';
            configContainer.style.display = 'none';
            historicoContainer.style.display = 'none';
            
            // Ativar aba selecionada
            if (aba === 'principal') {
                navPrincipal.classList.add('active');
                principalContainer.style.display = 'block';
            } else if (aba === 'config') {
                navConfig.classList.add('active');
                configContainer.style.display = 'block';
            } else if (aba === 'historico') {
                navHistorico.classList.add('active');
                historicoContainer.style.display = 'block';
            }
            
            // Salvar preferência do usuário
            localStorage.setItem('abaAtiva', aba);
        }
        
        // Adicionar event listeners para navegação principal
        if (navPrincipal) {
            navPrincipal.addEventListener('click', function(e) {
                e.preventDefault();
                alternarAbaPrincipal('principal');
            });
        }
        
        if (navConfig) {
            navConfig.addEventListener('click', function(e) {
                e.preventDefault();
                alternarAbaPrincipal('config');
            });
        }
        
        if (navHistorico) {
            navHistorico.addEventListener('click', function(e) {
                e.preventDefault();
                alternarAbaPrincipal('historico');
            });
        }
        
        // Configurar navegação dentro das configurações
        const abas = document.querySelectorAll('.config-tab');
        const conteudos = document.querySelectorAll('.config-content');
        
        abas.forEach(aba => {
            aba.addEventListener('click', function() {
                // Remover classe ativa de todas as abas
                abas.forEach(a => a.classList.remove('active'));
                
                // Adicionar classe ativa à aba clicada
                this.classList.add('active');
                
                // Esconder todos os conteúdos
                conteudos.forEach(c => c.style.display = 'none');
                
                // Mostrar conteúdo correspondente
                const target = this.getAttribute('data-target');
                document.getElementById(target).style.display = 'block';
                
                // Salvar preferência do usuário
                localStorage.setItem('configAbaAtiva', target);
            });
        });
        
        // Restaurar última aba ativa
        const ultimaAba = localStorage.getItem('abaAtiva') || 'principal';
        alternarAbaPrincipal(ultimaAba);
        
        const ultimaConfigAba = localStorage.getItem('configAbaAtiva');
        if (ultimaConfigAba) {
            const abaConfig = document.querySelector(`.config-tab[data-target="${ultimaConfigAba}"]`);
            if (abaConfig) {
                abaConfig.click();
            }
        }
    }
    
    // Função para adicionar indicadores visuais de separação
    function adicionarIndicadoresVisuais() {
        // Adicionar banner na tela principal
        const principalContainer = document.getElementById('principal-container');
        if (principalContainer) {
            const banner = document.createElement('div');
            banner.className = 'principal-banner';
            banner.innerHTML = `
                <h2>Cálculo Rápido</h2>
                <p>Preencha apenas os dados específicos desta impressão. As configurações gerais podem ser ajustadas na aba "Configurações".</p>
                <button id="ir-para-config" class="btn-secondary">Ajustar Configurações</button>
            `;
            principalContainer.prepend(banner);
            
            // Adicionar event listener para o botão
            const irParaConfigBtn = document.getElementById('ir-para-config');
            if (irParaConfigBtn) {
                irParaConfigBtn.addEventListener('click', function() {
                    document.getElementById('nav-config').click();
                });
            }
        }
        
        // Adicionar banner na tela de configurações
        const configContainer = document.getElementById('config-container');
        if (configContainer) {
            const banner = document.createElement('div');
            banner.className = 'config-banner';
            banner.innerHTML = `
                <h2>Configurações Globais</h2>
                <p>Ajuste as configurações que raramente são alteradas. Estas configurações serão salvas e aplicadas a todos os cálculos futuros.</p>
                <button id="voltar-para-principal" class="btn-primary">Voltar para Cálculo</button>
            `;
            configContainer.prepend(banner);
            
            // Adicionar event listener para o botão
            const voltarBtn = document.getElementById('voltar-para-principal');
            if (voltarBtn) {
                voltarBtn.addEventListener('click', function() {
                    document.getElementById('nav-principal').click();
                });
            }
        }
    }
    
    // Função para adicionar atalhos e dicas de uso
    function adicionarAtalhosDicas() {
        // Adicionar dicas flutuantes
        const dicas = [
            {
                elemento: '#nav-principal',
                texto: 'Tela principal para cálculos diários'
            },
            {
                elemento: '#nav-config',
                texto: 'Configurações globais raramente alteradas'
            },
            {
                elemento: '#nav-historico',
                texto: 'Histórico de orçamentos salvos'
            },
            {
                elemento: '#calcular-btn',
                texto: 'Calcular com base nos dados atuais'
            },
            {
                elemento: '#salvar-historico-btn',
                texto: 'Salvar este orçamento no histórico'
            },
            {
                elemento: '#exportar-pdf-btn',
                texto: 'Exportar orçamento em PDF para o cliente'
            }
        ];
        
        dicas.forEach(dica => {
            const elemento = document.querySelector(dica.elemento);
            if (elemento) {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = dica.texto;
                
                elemento.addEventListener('mouseenter', function() {
                    tooltip.style.display = 'block';
                    
                    // Posicionar tooltip
                    const rect = elemento.getBoundingClientRect();
                    tooltip.style.top = rect.bottom + 5 + 'px';
                    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
                });
                
                elemento.addEventListener('mouseleave', function() {
                    tooltip.style.display = 'none';
                });
                
                document.body.appendChild(tooltip);
            }
        });
    }
    
    // Executar funções
    configurarNavegacaoAbas();
    adicionarIndicadoresVisuais();
    adicionarAtalhosDicas();
});
