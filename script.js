document.addEventListener('DOMContentLoaded', function() {
    inicializarOfertas();
    inicializarDataMinima();
    inicializarHorarios();
    inicializarFormularios();
    inicializarAcessibilidade();

    // Eventos para o formulário de agendamento
    document.querySelectorAll('input[name="tipoAgendamento"]').forEach(radio => {
        radio.addEventListener('change', toggleEnderecoEntrega);
    });

    // Checkbox para usar endereço do cadastro
    const checkboxEndereco = document.getElementById('usarEnderecoCadastro');
    if (checkboxEndereco) {
        checkboxEndereco.addEventListener('change', toggleCamposEndereco);
    }

    // Eventos para botões de agendamento
    const modalAgendamento = document.getElementById('agendamentoModal');
    if (modalAgendamento) {
        modalAgendamento.addEventListener('show.bs.modal', function(event) {
            const button = event.relatedTarget;
            if (button && button.dataset.tipo) {
                const tipoAgendamento = button.dataset.tipo;
                document.getElementById(tipoAgendamento).checked = true;
                toggleEnderecoEntrega();
            }
        });
    }

    // Evento de submit do formulário de agendamento
    const formAgendamento = document.getElementById('formAgendamento');
    if (formAgendamento) {
        formAgendamento.addEventListener('submit', function(e) {
            e.preventDefault();
            processarAgendamento();
        });
    }

    // Evento de submit do formulário de contato
    const formContato = document.getElementById('formContato');
    if (formContato) {
        formContato.addEventListener('submit', function(e) {
            e.preventDefault();
            exibirMensagemSucesso('Mensagem enviada com sucesso! Entraremos em contato em breve.');
            formContato.reset();
        });
    }

    // Evento de submit do formulário de cadastro
    const formCadastro = document.getElementById('formCadastro');
    if (formCadastro) {
        formCadastro.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validarFormularioCadastro()) {
                exibirMensagemSucesso('Cadastro realizado com sucesso!');
                formCadastro.reset();
                $('#cadastroModal').modal('hide');
            }
        });
    }

    // Evento de submit do formulário de login
    const formLogin = document.getElementById('formLogin');
    if (formLogin) {
        formLogin.addEventListener('submit', function(e) {
            e.preventDefault();
            exibirMensagemSucesso('Login realizado com sucesso!');
            formLogin.reset();
            $('#loginModal').modal('hide');
        });
    }

    // Atualizar CEP automaticamente
    const inputCep = document.getElementById('cadCep');
    if (inputCep) {
        inputCep.addEventListener('blur', function() {
            buscarCep(inputCep.value, 'cad');
        });
    }

    const agCep = document.getElementById('agCep');
    if (agCep) {
        agCep.addEventListener('blur', function() {
            buscarCep(agCep.value, 'ag');
        });
    }

    // Inicializar botões de adicionar ao carrinho
    document.querySelectorAll('.btn-primary').forEach(button => {
        if (button.textContent.includes('Adicionar ao Carrinho')) {
            button.addEventListener('click', function() {
                const produto = button.closest('.card').querySelector('.card-title').textContent;
                adicionarAoCarrinho(produto);
            });
        }
    });
});


function inicializarOfertas() {
    const ofertas = [
        'Pão francês com 20% de desconto hoje! Aproveite!',
        'Frutas orgânicas com 15% de desconto nas quartas e quintas!',
        'Na compra de 1kg de queijo, ganhe 200g de presunto!',
        'Leve 3, pague 2 em todos os iogurtes naturais!',
        'Entrega grátis para compras acima de R$ 100,00!'
    ];

    const ofertaElement = document.getElementById('ofertaDinamica');
    if (ofertaElement) {
        const ofertaAleatoria = ofertas[Math.floor(Math.random() * ofertas.length)];
        ofertaElement.textContent = ofertaAleatoria;
    }

    //Temporizador ofertas
    setInterval(() => {
        if (ofertaElement) {
            const ofertaAleatoria = ofertas[Math.floor(Math.random() * ofertas.length)];
            ofertaElement.textContent = ofertaAleatoria;
        }
    }, 8000);
}

function inicializarDataMinima() {
    const hoje = new Date();
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);
    
    const dataFormatada = amanha.toISOString().split('T')[0];
    
    const inputData = document.getElementById('dataAgendamento');
    if (inputData) {
        inputData.min = dataFormatada;
        inputData.value = dataFormatada;
    }
}

function inicializarHorarios() {
    const selectHorario = document.getElementById('horaAgendamento');
    if (selectHorario) {
        selectHorario.innerHTML = '<option value="">Selecione um horário</option>';
        
        const horariosRetirada = [];
        for (let i = 8; i <= 21; i++) {
            horariosRetirada.push(`${i}:00`);
        }
        
        const horariosEntrega = ['9:00', '11:00', '13:00', '15:00', '17:00', '19:00'];
        
        adicionarHorariosAoSelect(selectHorario, horariosRetirada);
        
        // Trocar horários quando o tipo de agendamento mudar
        document.querySelectorAll('input[name="tipoAgendamento"]').forEach(radio => {
            radio.addEventListener('change', function() {
                selectHorario.innerHTML = '<option value="">Selecione um horário</option>';
                if (this.value === 'retirada') {
                    adicionarHorariosAoSelect(selectHorario, horariosRetirada);
                } else {
                    adicionarHorariosAoSelect(selectHorario, horariosEntrega);
                }
            });
        });
    }
}

function adicionarHorariosAoSelect(select, horarios) {
    horarios.forEach(horario => {
        const option = document.createElement('option');
        option.value = horario;
        option.textContent = horario;
        select.appendChild(option);
    });
}

function inicializarFormularios() {
    console.log('Máscaras de formulário inicializadas');
    
    // Validações de formulário
    document.querySelectorAll('form').forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.required) {
                input.addEventListener('blur', function() {
                    if (!input.value.trim()) {
                        input.classList.add('is-invalid');
                    } else {
                        input.classList.remove('is-invalid');
                        input.classList.add('is-valid');
                    }
                });
            }
        });
    });
}

function inicializarAcessibilidade() {
    // Controles de acessibilidade dinamicos
    const header = document.querySelector('header .container');
    if (header) {
        const acessibilidadeControles = document.createElement('div');
        acessibilidadeControles.className = 'accessibility-controls mt-2';
        acessibilidadeControles.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <div class="zoom-controls">
                        <button id="zoomReset" class="btn btn-sm btn-outline-light">Tamanho Normal</button>
                        <button id="zoomIn" class="btn btn-sm btn-outline-light">A+</button>
                        <button id="zoomOut" class="btn btn-sm btn-outline-light">A-</button>
                    </div>
                </div>
                <div class="col-md-6 text-end">
                    <button id="contrastToggle" class="btn btn-sm btn-outline-light contrast-toggle">Alto Contraste</button>
                    <button id="dyslexicFont" class="btn btn-sm btn-outline-light">Fonte Dislexia</button>
                </div>
            </div>
        `;
        header.appendChild(acessibilidadeControles);
        
        // Eventos para os botões de acessibilidade
        document.getElementById('zoomIn').addEventListener('click', () => {
            const body = document.body;
            if (body.classList.contains('larger-text')) {
                body.classList.remove('larger-text');
                body.classList.add('largest-text');
            } else if (!body.classList.contains('largest-text')) {
                body.classList.add('larger-text');
            }
        });
        
        document.getElementById('zoomOut').addEventListener('click', () => {
            const body = document.body;
            if (body.classList.contains('largest-text')) {
                body.classList.remove('largest-text');
                body.classList.add('larger-text');
            } else if (body.classList.contains('larger-text')) {
                body.classList.remove('larger-text');
            }
        });
        
        document.getElementById('zoomReset').addEventListener('click', () => {
            document.body.classList.remove('larger-text', 'largest-text');
        });
        
        document.getElementById('contrastToggle').addEventListener('click', () => {
            document.body.classList.toggle('high-contrast');
        });
        
        document.getElementById('dyslexicFont').addEventListener('click', () => {
            document.body.classList.toggle('dyslexic-font');
        });
    }
}

// Agendamento

function toggleEnderecoEntrega() {
    const enderecoEntrega = document.getElementById('enderecoEntrega');
    const entrega = document.getElementById('entrega');
    
    if (enderecoEntrega && entrega) {
        if (entrega.checked) {
            enderecoEntrega.style.display = 'block';
        } else {
            enderecoEntrega.style.display = 'none';
        }
    }
}

function toggleCamposEndereco() {
    const camposEndereco = document.getElementById('camposEndereco');
    const usarEnderecoCadastro = document.getElementById('usarEnderecoCadastro');
    
    if (camposEndereco && usarEnderecoCadastro) {
        if (usarEnderecoCadastro.checked) {
            camposEndereco.style.display = 'none';
        } else {
            camposEndereco.style.display = 'block';
        }
    }
}

function processarAgendamento() {
    const tipoAgendamento = document.querySelector('input[name="tipoAgendamento"]:checked').value;
    const dataAgendamento = document.getElementById('dataAgendamento').value;
    const horaAgendamento = document.getElementById('horaAgendamento').value;
    
    // Formatar a data
    const dataFormatada = formatarData(dataAgendamento);
    
    // Exibir detalhes do agendamento
    const detalhesAgendamento = document.getElementById('detalhesAgendamento');
    if (detalhesAgendamento) {
        let enderecoHtml = '';
        
        if (tipoAgendamento === 'entrega') {
            const usarEnderecoCadastro = document.getElementById('usarEnderecoCadastro').checked;
            
            if (usarEnderecoCadastro) {
                enderecoHtml = '<p><strong>Endereço:</strong> Endereço cadastrado será utilizado</p>';
            } else {
                const logradouro = document.getElementById('agLogradouro').value;
                const numero = document.getElementById('agNumero').value;
                const bairro = document.getElementById('agBairro').value;
                const cidade = document.getElementById('agCidade').value;
                
                enderecoHtml = `
                    <p><strong>Endereço de Entrega:</strong> ${logradouro}, ${numero}</p>
                    <p><strong>Bairro:</strong> ${bairro}</p>
                    <p><strong>Cidade:</strong> ${cidade}</p>
                `;
            }
        }
        
        detalhesAgendamento.innerHTML = `
            <div class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">Detalhes do Agendamento</h5>
                    <p><strong>Tipo:</strong> ${tipoAgendamento === 'retirada' ? 'Retirada na Loja' : 'Entrega em Domicílio'}</p>
                    <p><strong>Data:</strong> ${dataFormatada}</p>
                    <p><strong>Horário:</strong> ${horaAgendamento}</p>
                    ${enderecoHtml}
                    <p class="text-success"><small>Você receberá um e-mail de confirmação com os detalhes.</small></p>
                </div>
            </div>
        `;
    }
    
    // Exibir modal de confirmação
    const confirmacaoModal = new bootstrap.Modal(document.getElementById('confirmacaoModal'));
    confirmacaoModal.show();
    
    // Esconder o modal de agendamento
    const agendamentoModal = bootstrap.Modal.getInstance(document.getElementById('agendamentoModal'));
    agendamentoModal.hide();
    
    // Limpar formulário
    document.getElementById('formAgendamento').reset();
    inicializarDataMinima();
}

// Utilitárias

function formatarData(dataStr) {
    const data = new Date(dataStr);
    return data.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
    });
}

function buscarCep(cep, prefixo) {
    cep = cep.replace(/\D/g, '');
    
    if (cep.length !== 8) {
        return;
    }
    
    setTimeout(() => {
        const endereco = {
            logradouro: 'Avenida Exemplo',
            bairro: 'Centro',
            cidade: 'São Paulo',
            estado: 'SP'
        };
        
        document.getElementById(`${prefixo}Logradouro`).value = endereco.logradouro;
        document.getElementById(`${prefixo}Bairro`).value = endereco.bairro;
        document.getElementById(`${prefixo}Cidade`).value = endereco.cidade;
        document.getElementById(`${prefixo}Estado`).value = endereco.estado;
    }, 800);
}

function validarFormularioCadastro() {
    const senha = document.getElementById('cadSenha').value;
    const confirmaSenha = document.getElementById('cadConfirmaSenha').value;
    
    if (senha !== confirmaSenha) {
        alert('As senhas não coincidem!');
        return false;
    }
    
    const cpf = document.getElementById('cadCpf').value.replace(/\D/g, '');
    if (cpf.length !== 11) {
        alert('CPF inválido!');
        return false;
    }
        
    return true;
}

function exibirMensagemSucesso(mensagem) {
    const toastContainer = document.createElement('div');
    toastContainer.className = 'position-fixed bottom-0 end-0 p-3';
    toastContainer.style.zIndex = '1050';
    
    toastContainer.innerHTML = `
        <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header bg-success text-white">
                <strong class="me-auto">Sucesso</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Fechar"></button>
            </div>
            <div class="toast-body">
                ${mensagem}
            </div>
        </div>
    `;
    
    document.body.appendChild(toastContainer);
    
    setTimeout(() => {
        if (toastContainer.parentNode) {
            document.body.removeChild(toastContainer);
        }
    }, 5000);
}

function adicionarAoCarrinho(produto) {
    // Carrinho
    console.log(`Produto adicionado ao carrinho: ${produto}`);
    
    // Cria um contador de itens no carrinho
    let carrinhoContador = document.querySelector('.carrinho-contador');
    
    if (!carrinhoContador) {
        const headerBtns = document.querySelector('header .text-end');
        
        if (headerBtns) {
            const btnCarrinho = document.createElement('button');
            btnCarrinho.className = 'btn btn-warning ms-2';
            btnCarrinho.innerHTML = '<i class="fas fa-shopping-cart"></i> <span class="carrinho-contador">1</span>';
            headerBtns.appendChild(btnCarrinho);
            
            btnCarrinho.addEventListener('click', () => {
                alert('Carrinho de compras será implementado em breve!');
            });
        }
    } else {
        // Incrementa o contador
        const contador = parseInt(carrinhoContador.textContent);
        carrinhoContador.textContent = contador + 1;
    }
    
    // Exibe mensagem
    exibirMensagemSucesso(`${produto} adicionado ao carrinho!`);
}