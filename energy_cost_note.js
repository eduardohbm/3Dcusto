// Implementação da nota explicativa sobre custo de energia
document.addEventListener('DOMContentLoaded', function() {
    // Função para adicionar nota explicativa detalhada sobre custo de energia
    function adicionarNotaExplicativaCustoEnergia() {
        // Localizar o container do campo de custo de energia
        const custoEnergiaContainer = document.querySelector('.custo-energia-container');
        if (!custoEnergiaContainer) return;
        
        // Verificar se a nota já existe
        if (custoEnergiaContainer.querySelector('.nota-explicativa-energia')) return;
        
        // Criar a nota explicativa
        const notaExplicativa = document.createElement('div');
        notaExplicativa.className = 'nota-explicativa nota-explicativa-energia';
        notaExplicativa.innerHTML = `
            <h4>Como encontrar o valor do kWh na sua conta de energia:</h4>
            <ol>
                <li>Localize o valor total cobrado em reais (R$) na sua conta de energia</li>
                <li>Encontre o consumo total em kWh (geralmente na primeira página)</li>
                <li>Divida o valor total pelo consumo para obter o custo aproximado por kWh</li>
                <li>Considere a bandeira tarifária atual (verde, amarela ou vermelha)</li>
                <li>Para maior precisão, verifique a seção "Detalhamento da Fatura" onde o valor do kWh é discriminado</li>
            </ol>
            <p><strong>Exemplo:</strong> Se sua conta total é R$ 250,00 para 250 kWh, o custo é aproximadamente R$ 1,00 por kWh</p>
            <p><strong>Referência regional:</strong> Em Goiânia-GO (Setor Leste Vila Nova), o valor aproximado é de R$ 1,00 por kWh</p>
            <p><em>Nota: O valor pode variar conforme sua localidade, distribuidora e bandeira tarifária vigente</em></p>
        `;
        
        // Adicionar a nota ao container
        custoEnergiaContainer.appendChild(notaExplicativa);
        
        // Adicionar botão para expandir/recolher a nota
        const custoEnergiaLabel = custoEnergiaContainer.querySelector('label');
        if (custoEnergiaLabel) {
            const infoButton = document.createElement('button');
            infoButton.type = 'button';
            infoButton.className = 'info-button';
            infoButton.innerHTML = '<i class="fas fa-info-circle"></i>';
            infoButton.title = 'Como encontrar o valor do kWh na sua conta de energia';
            
            // Inicialmente esconder a nota
            notaExplicativa.style.display = 'none';
            
            // Adicionar evento para mostrar/esconder a nota
            infoButton.addEventListener('click', function(e) {
                e.preventDefault();
                if (notaExplicativa.style.display === 'none') {
                    notaExplicativa.style.display = 'block';
                    infoButton.innerHTML = '<i class="fas fa-times-circle"></i>';
                } else {
                    notaExplicativa.style.display = 'none';
                    infoButton.innerHTML = '<i class="fas fa-info-circle"></i>';
                }
            });
            
            custoEnergiaLabel.appendChild(infoButton);
        }
    }
    
    // Executar a função quando a página carregar
    adicionarNotaExplicativaCustoEnergia();
    
    // Também executar quando a aba de configurações for aberta
    const navConfig = document.getElementById('nav-config');
    if (navConfig) {
        navConfig.addEventListener('click', function() {
            // Pequeno delay para garantir que os elementos estejam carregados
            setTimeout(adicionarNotaExplicativaCustoEnergia, 100);
        });
    }
    
    // Executar quando a aba de custos for selecionada nas configurações
    const abaCustos = document.querySelector('.config-tab[data-target="custos-config"]');
    if (abaCustos) {
        abaCustos.addEventListener('click', function() {
            // Pequeno delay para garantir que os elementos estejam carregados
            setTimeout(adicionarNotaExplicativaCustoEnergia, 100);
        });
    }
});
