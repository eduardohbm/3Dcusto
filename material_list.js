// Implementação da exibição e gerenciamento de materiais
document.addEventListener('DOMContentLoaded', function() {
    // Função para atualizar a lista de materiais na interface
    function atualizarListaMateriais() {
        // Obter materiais do localStorage
        const materiais = JSON.parse(localStorage.getItem('materiais')) || [];
        
        // Atualizar seletor de material na tela principal
        const materialSelect = document.getElementById('material');
        if (materialSelect) {
            // Preservar seleção atual
            const selectedValue = materialSelect.value;
            
            // Limpar opções
            materialSelect.innerHTML = '<option value="" disabled selected>Selecione um material</option>';
            
            // Adicionar opções
            materiais.forEach(material => {
                const option = document.createElement('option');
                option.value = material.id;
                option.textContent = material.nome;
                materialSelect.appendChild(option);
            });
            
            // Restaurar seleção se possível
            if (selectedValue && materialSelect.querySelector(`option[value="${selectedValue}"]`)) {
                materialSelect.value = selectedValue;
            }
        }
        
        // Atualizar seletor de material nas configurações
        const materialConfigSelect = document.getElementById('material_config');
        if (materialConfigSelect) {
            // Preservar seleção atual
            const selectedValue = materialConfigSelect.value;
            
            // Limpar opções
            materialConfigSelect.innerHTML = '';
            
            // Adicionar opções
            materiais.forEach(material => {
                const option = document.createElement('option');
                option.value = material.id;
                option.textContent = material.nome;
                materialConfigSelect.appendChild(option);
            });
            
            // Adicionar opção para novo material
            const option = document.createElement('option');
            option.value = 'novo';
            option.textContent = 'Adicionar Novo Material';
            materialConfigSelect.appendChild(option);
            
            // Restaurar seleção se possível
            if (selectedValue && materialConfigSelect.querySelector(`option[value="${selectedValue}"]`)) {
                materialConfigSelect.value = selectedValue;
            } else {
                // Selecionar primeiro material ou opção "novo" se não houver materiais
                materialConfigSelect.value = materiais.length > 0 ? materiais[0].id : 'novo';
            }
            
            // Disparar evento change para atualizar campos
            materialConfigSelect.dispatchEvent(new Event('change'));
        }
        
        // Atualizar lista de materiais na biblioteca
        const materiaisContainer = document.querySelector('.material-info-cards-container');
        if (materiaisContainer) {
            materiaisContainer.innerHTML = '';
            
            if (materiais.length === 0) {
                materiaisContainer.innerHTML = '<div class="empty-materials">Nenhum material cadastrado</div>';
                return;
            }
            
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
                
                materiaisContainer.appendChild(card);
            });
        }
    }
    
    // Função para carregar detalhes do material selecionado
    function carregarDetalhesMaterial() {
        const materialId = document.getElementById('material_config').value;
        
        if (materialId === 'novo') {
            // Limpar campos para novo material
            document.getElementById('nome_material').value = '';
            document.getElementById('valor_material').value = '';
            document.getElementById('densidade_material').value = '';
            document.getElementById('comprimento_material').value = '';
            document.getElementById('descricao_material').value = '';
            document.getElementById('aplicacoes_material').value = '';
            document.getElementById('vantagens_material').value = '';
            document.getElementById('desvantagens_material').value = '';
            document.getElementById('excluir-material-btn').style.display = 'none';
            return;
        }
        
        // Obter materiais do localStorage
        const materiais = JSON.parse(localStorage.getItem('materiais')) || [];
        
        // Encontrar material selecionado
        const material = materiais.find(m => m.id === materialId);
        if (!material) return;
        
        // Preencher campos com dados do material
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
    
    // Adicionar event listener para mudança de material nas configurações
    const materialConfigSelect = document.getElementById('material_config');
    if (materialConfigSelect) {
        materialConfigSelect.addEventListener('change', carregarDetalhesMaterial);
    }
    
    // Adicionar event listener para salvar material
    const salvarMaterialBtn = document.getElementById('salvar-material-btn');
    if (salvarMaterialBtn) {
        salvarMaterialBtn.addEventListener('click', function() {
            const materialId = document.getElementById('material_config').value;
            const nome = document.getElementById('nome_material').value.trim();
            const valor = parseFloat(document.getElementById('valor_material').value);
            const densidade = parseFloat(document.getElementById('densidade_material').value);
            const comprimento = parseFloat(document.getElementById('comprimento_material').value);
            const descricao = document.getElementById('descricao_material').value.trim();
            const aplicacoes = document.getElementById('aplicacoes_material').value.trim();
            const vantagens = document.getElementById('vantagens_material').value.trim();
            const desvantagens = document.getElementById('desvantagens_material').value.trim();
            
            // Validar campos obrigatórios
            if (!nome || !valor || !densidade || !comprimento) {
                alert('Preencha todos os campos obrigatórios');
                return;
            }
            
            // Obter materiais do localStorage
            const materiais = JSON.parse(localStorage.getItem('materiais')) || [];
            
            if (materialId === 'novo') {
                // Verificar se já existe um material com este nome
                const materialExistente = materiais.find(m => m.nome.toLowerCase() === nome.toLowerCase());
                if (materialExistente) {
                    alert('Já existe um material com este nome');
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
                
                // Mostrar mensagem de sucesso
                alert('Material adicionado com sucesso');
                
                // Atualizar seletor para o novo material
                document.getElementById('material_config').value = novoId;
            } else {
                // Atualizar material existente
                const index = materiais.findIndex(m => m.id === materialId);
                if (index !== -1) {
                    materiais[index].nome = nome;
                    materiais[index].valor = valor;
                    materiais[index].densidade = densidade;
                    materiais[index].comprimento = comprimento;
                    materiais[index].descricao = descricao;
                    materiais[index].aplicacoes = aplicacoes;
                    materiais[index].vantagens = vantagens;
                    materiais[index].desvantagens = desvantagens;
                    
                    // Mostrar mensagem de sucesso
                    alert('Material atualizado com sucesso');
                }
            }
            
            // Salvar no localStorage
            localStorage.setItem('materiais', JSON.stringify(materiais));
            
            // Atualizar interface
            atualizarListaMateriais();
        });
    }
    
    // Adicionar event listener para excluir material
    const excluirMaterialBtn = document.getElementById('excluir-material-btn');
    if (excluirMaterialBtn) {
        excluirMaterialBtn.addEventListener('click', function() {
            const materialId = document.getElementById('material_config').value;
            
            if (materialId === 'novo') return;
            
            // Confirmar exclusão
            if (!confirm('Tem certeza que deseja excluir este material?')) return;
            
            // Obter materiais do localStorage
            const materiais = JSON.parse(localStorage.getItem('materiais')) || [];
            
            // Remover material
            const index = materiais.findIndex(m => m.id === materialId);
            if (index !== -1) {
                materiais.splice(index, 1);
                
                // Salvar no localStorage
                localStorage.setItem('materiais', JSON.stringify(materiais));
                
                // Atualizar interface
                atualizarListaMateriais();
                
                // Selecionar opção "novo"
                document.getElementById('material_config').value = 'novo';
                carregarDetalhesMaterial();
                
                // Mostrar mensagem de sucesso
                alert('Material excluído com sucesso');
            }
        });
    }
    
    // Inicializar lista de materiais
    atualizarListaMateriais();
});
