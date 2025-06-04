// Implementação dos gráficos de distribuição de custos
document.addEventListener('DOMContentLoaded', function() {
    // Referências aos elementos canvas
    const costDistributionChart = document.getElementById('cost-distribution-chart');
    const costVsProfitChart = document.getElementById('cost-vs-profit-chart');
    
    // Instâncias de gráficos
    let costDistributionChartInstance = null;
    let costVsProfitChartInstance = null;
    
    // Event listener para o botão de mostrar gráficos
    document.getElementById('show-charts-btn').addEventListener('click', function() {
        if (!window.calculoAtual) {
            mostrarToast('Faça um cálculo primeiro');
            return;
        }
        
        document.querySelector('.charts-container').style.display = 'block';
        
        // Criar/atualizar gráficos
        criarGraficoCustos();
        criarGraficoLucro();
        
        // Scroll para os gráficos
        document.querySelector('.charts-container').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Função para criar o gráfico de distribuição de custos
    function criarGraficoCustos() {
        const calculo = window.calculoAtual;
        
        // Preparar dados
        const labels = [
            'Filamento', 
            'Energia', 
            'Depreciação', 
            'Pós-processamento', 
            'Modelagem',
            'Manutenção',
            'Operacionais'
        ];
        
        const data = [
            calculo.custoFilamento,
            calculo.custoEnergia,
            calculo.custoDepreciacao,
            calculo.custoTrabalho,
            calculo.custoModelagem,
            calculo.custoManutencao,
            calculo.custoOperacional
        ];
        
        // Calcular percentuais para exibição
        const total = data.reduce((a, b) => a + b, 0);
        const percentuais = data.map(valor => ((valor / total) * 100).toFixed(1) + '%');
        
        // Cores para o gráfico
        const backgroundColors = [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(199, 199, 199, 0.7)'
        ];
        
        // Destruir gráfico anterior se existir
        if (costDistributionChartInstance) {
            costDistributionChartInstance.destroy();
        }
        
        // Criar novo gráfico
        costDistributionChartInstance = new Chart(costDistributionChart, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Distribuição de Custos',
                    data: data,
                    backgroundColor: backgroundColors,
                    borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw.toFixed(2);
                                const percentage = percentuais[context.dataIndex];
                                return `${label}: R$ ${value} (${percentage})`;
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Distribuição de Custos',
                        font: {
                            size: 16
                        }
                    }
                }
            }
        });
    }
    
    // Função para criar o gráfico de custo vs lucro
    function criarGraficoLucro() {
        const calculo = window.calculoAtual;
        
        // Preparar dados
        const data = {
            labels: ['Composição do Preço Final'],
            datasets: [
                {
                    label: 'Custo',
                    data: [calculo.custoComFalha],
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Lucro',
                    data: [calculo.lucro],
                    backgroundColor: 'rgba(75, 192, 192, 0.7)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }
            ]
        };
        
        // Destruir gráfico anterior se existir
        if (costVsProfitChartInstance) {
            costVsProfitChartInstance.destroy();
        }
        
        // Criar novo gráfico
        costVsProfitChartInstance = new Chart(costVsProfitChart, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + value.toFixed(2);
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.dataset.label || '';
                                const value = context.raw.toFixed(2);
                                return `${label}: R$ ${value}`;
                            },
                            footer: function(tooltipItems) {
                                const total = tooltipItems.reduce((a, b) => a + b.raw, 0);
                                return `Total: R$ ${total.toFixed(2)}`;
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Custo vs Lucro',
                        font: {
                            size: 16
                        }
                    }
                }
            }
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
});
