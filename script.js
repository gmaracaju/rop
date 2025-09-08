// Verificação de autorização - sempre verifica ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
    const autorizado = localStorage.getItem("autorizado");
    const ultimoLogin = localStorage.getItem("ultimoLogin");
    const agora = Date.now();
    
    // Se não está autorizado ou o login foi há mais de 10 minutos
    if (autorizado !== "true" || (ultimoLogin && agora - ultimoLogin > 10 * 60 * 1000)) {
        // Limpar dados de autorização
        localStorage.removeItem("autorizado");
        localStorage.removeItem("ultimoLogin");
        
        // Redirecionar para login
        window.location.href = "index.html";
    } else {
        // Atualizar timestamp do login
        localStorage.setItem("ultimoLogin", Date.now());
        
        // Restaurar estado salvo se existir
        restaurarEstado();
        
        // Adicionar listeners para salvar automaticamente
        adicionarListenersParaSalvar();
    }
});

// Função para salvar todo o estado do formulário
function salvarEstado() {
    const estado = {
        // Dados básicos da ocorrência
        registro: document.getElementById('registro')?.value,
        dataFato: document.getElementById('dataFato')?.value,
        horaFato: document.getElementById('horafato')?.value,
        destinatario: document.getElementById('destinatarioInput')?.value,
        natureza: document.getElementById('natureza')?.value,
        tipoDelito: document.getElementById('tipoDelito')?.value,
        localOcorrencia: document.getElementById('localOcorrencia')?.value,
        uf: document.getElementById('uf')?.value,
        cidade: document.getElementById('cidade')?.value,
        numero: document.getElementById('numero')?.value,
        bairro: document.getElementById('bairro')?.value,
        
        // Checkboxes
        checkboxes: {
            prisaoFlagrante: document.getElementById('prisaoFlagrante')?.checked,
            comunicacaoOcorrencia: document.getElementById('comunicacaoOcorrencia')?.checked,
            mandadoPrisao: document.getElementById('mandadoPrisao')?.checked,
            outros: document.getElementById('outros')?.checked
        },
        
        // Partes envolvidas
        partesEnvolvidas: [],
        
        // Relato
        relato: document.getElementById('relato')?.value,
        
        // Apreensões
        apreensoes: [],
        
        // GMs envolvidos
        gmsEnvolvidos: [],
        
        // Posto de serviço
        postoServico: document.getElementById('postoServico')?.value,
        turno: document.getElementById('turno')?.value,
        
        // Timestamp
        timestamp: Date.now()
    };

    // Salvar partes envolvidas
    document.querySelectorAll('#tabelaconduz, .tabelaconduz-clone').forEach((div, index) => {
        if (div.style.display !== 'none') {
            const parte = {
                nome: div.querySelector('#nome')?.value,
                dataNascimento: div.querySelector('#datanascimento')?.value,
                pai: div.querySelector('#pai')?.value,
                mae: div.querySelector('#mae')?.value,
                condicaoFisica: div.querySelector('#condicaoFisica')?.value,
                sexo: div.querySelector('#sexoSelect')?.value,
                naturalidade: div.querySelector('#naturalidade')?.value,
                endereco: div.querySelector('#endereco')?.value,
                cpf: div.querySelector('#cpf')?.value,
                cidadeUf: div.querySelector('#cidadeUf')?.value,
                telefone: div.querySelector('#telefone')?.value,
                tipo: {
                    autor: div.querySelectorAll('input[type="checkbox"]')[0]?.checked,
                    vitima: div.querySelectorAll('input[type="checkbox"]')[1]?.checked,
                    testemunha: div.querySelectorAll('input[type="checkbox"]')[2]?.checked,
                    outros: div.querySelectorAll('input[type="checkbox"]')[3]?.checked
                }
            };
            estado.partesEnvolvidas.push(parte);
        }
    });

    // Salvar apreensões
    document.querySelectorAll('#tabela-apreensoes tbody tr').forEach(tr => {
        if (tr.querySelector('select') && tr.querySelector('input[type="text"]')) {
            estado.apreensoes.push({
                tipo: tr.querySelector('select').value,
                especificacao: tr.querySelector('input[type="text"]').value
            });
        }
    });

    // Salvar GMs envolvidos
    document.querySelectorAll('#tabela-gms tbody tr').forEach(tr => {
        const inputs = tr.querySelectorAll('input[type="text"]');
        if (inputs.length >= 2) {
            estado.gmsEnvolvidos.push({
                nivel: tr.querySelector('select').value,
                nomeGuerra: inputs[0].value,
                matricula: inputs[1].value
            });
        }
    });

    localStorage.setItem('ropEstado', JSON.stringify(estado));
}

// Função para restaurar o estado do formulário
function restaurarEstado() {
    const estadoSalvo = localStorage.getItem('ropEstado');
    if (!estadoSalvo) {
        // Se não há dados salvos, ocultar a parte padrão
        document.querySelector('#tabelaconduz').style.display = 'none';
        return;
    }

    const estado = JSON.parse(estadoSalvo);

    // Restaurar dados básicos
    if (document.getElementById('registro')) document.getElementById('registro').value = estado.registro || '';
    if (document.getElementById('dataFato')) document.getElementById('dataFato').value = estado.dataFato || '';
    if (document.getElementById('horafato')) document.getElementById('horafato').value = estado.horaFato || '';
    if (document.getElementById('destinatarioInput')) document.getElementById('destinatarioInput').value = estado.destinatario || '';
    if (document.getElementById('natureza')) document.getElementById('natureza').value = estado.natureza || '';
    if (document.getElementById('tipoDelito')) document.getElementById('tipoDelito').value = estado.tipoDelito || '';
    if (document.getElementById('localOcorrencia')) document.getElementById('localOcorrencia').value = estado.localOcorrencia || '';
    if (document.getElementById('uf')) document.getElementById('uf').value = estado.uf || 'SE';
    if (document.getElementById('cidade')) document.getElementById('cidade').value = estado.cidade || 'Aracaju';
    if (document.getElementById('numero')) document.getElementById('numero').value = estado.numero || 'S/N';
    if (document.getElementById('bairro')) document.getElementById('bairro').value = estado.bairro || '';
    
    // Restaurar checkboxes
    if (estado.checkboxes) {
        if (document.getElementById('prisaoFlagrante')) document.getElementById('prisaoFlagrante').checked = estado.checkboxes.prisaoFlagrante || false;
        if (document.getElementById('comunicacaoOcorrencia')) document.getElementById('comunicacaoOcorrencia').checked = estado.checkboxes.comunicacaoOcorrencia || false;
        if (document.getElementById('mandadoPrisao')) document.getElementById('mandadoPrisao').checked = estado.checkboxes.mandadoPrisao || false;
        if (document.getElementById('outros')) document.getElementById('outros').checked = estado.checkboxes.outros || false;
    }
    
    // Restaurar relato
    if (document.getElementById('relato')) {
        document.getElementById('relato').value = estado.relato || '';
        // Expandir o textarea após restaurar o conteúdo
        autoExpand(document.getElementById('relato'));
    }
    
    // Restaurar partes envolvidas - CORRIGIDO: não restaurar partes vazias
    if (estado.partesEnvolvidas && estado.partesEnvolvidas.length > 0) {
        // Filtrar apenas partes com dados válidos
        const partesComDados = estado.partesEnvolvidas.filter(parte => 
            parte.nome || parte.cpf || parte.endereco || parte.pai || parte.mae
        );
        
        if (partesComDados.length > 0) {
            // Mostrar a primeira parte
            const primeiraParte = document.querySelector('#tabelaconduz');
            primeiraParte.style.display = 'block';
            
            restaurarParteEnvolvida(primeiraParte, partesComDados[0]);
            
            // Adicionar e restaurar as partes adicionais
            for (let i = 1; i < partesComDados.length; i++) {
                inserir();
                const novasPartes = document.querySelectorAll('#tabelaconduz, .tabelaconduz-clone');
                const ultimaParte = novasPartes[novasPartes.length - 1];
                restaurarParteEnvolvida(ultimaParte, partesComDados[i]);
                
                // CORREÇÃO: Garantir que o botão de excluir seja visível
                ultimaParte.style.display = 'block';
            }
        } else {
            // Se não há partes com dados válidos, ocultar a primeira parte
            document.querySelector('#tabelaconduz').style.display = 'none';
        }
    } else {
        // Se não há partes envolvidas salvas, ocultar a primeira parte
        document.querySelector('#tabelaconduz').style.display = 'none';
    }
    
    // Restaurar apreensões
    if (estado.apreensoes && estado.apreensoes.length > 0) {
        document.getElementById('tabela-apreensoes').style.display = 'table';
        estado.apreensoes.forEach(apreensao => {
            adicionarApreensao();
            const todasLinhas = document.querySelectorAll('#tabela-apreensoes tbody tr');
            const ultimaLinha = todasLinhas[todasLinhas.length - 1];
            ultimaLinha.querySelector('select').value = apreensao.tipo;
            ultimaLinha.querySelector('input[type="text"]').value = apreensao.especificacao;
        });
    }
    
    // Restaurar GMs envolvidos
    if (estado.gmsEnvolvidos && estado.gmsEnvolvidos.length > 0) {
        estado.gmsEnvolvidos.forEach(gm => {
            adicionarAgente();
            const todasLinhas = document.querySelectorAll('#tabela-gms tbody tr');
            const ultimaLinha = todasLinhas[todasLinhas.length - 1];
            ultimaLinha.querySelector('select').value = gm.nivel;
            const inputs = ultimaLinha.querySelectorAll('input[type="text"]');
            inputs[0].value = gm.nomeGuerra;
            inputs[1].value = gm.matricula;
        });
    }
    
    // Restaurar posto de serviço
    if (document.getElementById('postoServico')) 
        document.getElementById('postoServico').value = estado.postoServico || '';
    if (document.getElementById('turno')) 
        document.getElementById('turno').value = estado.turno || '24h';
    
    // Atualizar realce dos campos
    inicializarRealce();
}

// Função auxiliar para restaurar uma parte envolvida
function restaurarParteEnvolvida(container, dados) {
    if (container.querySelector('#nome')) container.querySelector('#nome').value = dados.nome || '';
    if (container.querySelector('#datanascimento')) container.querySelector('#datanascimento').value = dados.dataNascimento || '';
    if (container.querySelector('#pai')) container.querySelector('#pai').value = dados.pai || '';
    if (container.querySelector('#mae')) container.querySelector('#mae').value = dados.mae || '';
    if (container.querySelector('#condicaoFisica')) container.querySelector('#condicaoFisica').value = dados.condicaoFisica || '';
    if (container.querySelector('#sexoSelect')) container.querySelector('#sexoSelect').value = dados.sexo || '';
    if (container.querySelector('#naturalidade')) container.querySelector('#naturalidade').value = dados.naturalidade || '';
    if (container.querySelector('#endereco')) container.querySelector('#endereco').value = dados.endereco || '';
    if (container.querySelector('#cpf')) container.querySelector('#cpf').value = dados.cpf || '';
    if (container.querySelector('#cidadeUf')) container.querySelector('#cidadeUf').value = dados.cidadeUf || '';
    if (container.querySelector('#telefone')) container.querySelector('#telefone').value = dados.telefone || '';
    
    // Restaurar tipo (autor, vítima, etc.)
    if (dados.tipo) {
        const checkboxes = container.querySelectorAll('input[type="checkbox"]');
        if (checkboxes[0]) checkboxes[0].checked = dados.tipo.autor || false;
        if (checkboxes[1]) checkboxes[1].checked = dados.tipo.vitima || false;
        if (checkboxes[2]) checkboxes[2].checked = dados.tipo.testemunha || false;
        if (checkboxes[3]) checkboxes[3].checked = dados.tipo.outros || false;
    }
    
    // CORREÇÃO: Garantir que o botão de excluir seja adicionado para partes clonadas
    // Verificar se é um clone e não tem botão de excluir
    if (container.classList.contains('tabelaconduz-clone') && !container.querySelector('.excluir-btn')) {
        // Remove o botão antigo, se houver
        var oldButton = container.querySelector(".button-container");
        if (oldButton) oldButton.remove();

        // Cria botão de exclusão
        var excluirBtn = document.createElement("button");
        excluirBtn.innerHTML = "EXCLUIR";
        excluirBtn.classList.add("excluir-btn");
        excluirBtn.onclick = function () { ocultarDiv(container); };

        var buttonContainer = document.createElement("div");
        buttonContainer.classList.add("button-container");
        buttonContainer.appendChild(excluirBtn);
        container.appendChild(buttonContainer);
    }
}

// Adicionar listeners para salvar automaticamente
function adicionarListenersParaSalvar() {
    document.querySelectorAll('input, select, textarea').forEach(element => {
        element.addEventListener('input', salvarEstado);
        element.addEventListener('change', salvarEstado);
    });
}

// Modificar as funções de inserção para também salvar o estado
const originalInserir = inserir;
inserir = function() {
    originalInserir();
    setTimeout(salvarEstado, 100);
}

const originalAdicionarApreensao = adicionarApreensao;
adicionarApreensao = function() {
    originalAdicionarApreensao();
    setTimeout(salvarEstado, 100);
}

const originalAdicionarAgente = adicionarAgente;
adicionarAgente = function() {
    originalAdicionarAgente();
    setTimeout(salvarEstado, 100);
}

// Adicionar event listener para o botão de remover imagens
document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('remove-btn')) {
        setTimeout(salvarEstado, 100);
    }
});

// Função para limpar todos os dados
function limparDados() {
    if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
        localStorage.removeItem('ropEstado');
        location.reload();
    }
}

// Adicionar função para fazer logout
function fazerLogout() {
    if (confirm('Deseja sair do sistema? Os dados atuais serão salvos para possível recuperação.')) {
        // Salvar estado atual antes de sair
        salvarEstado();
        
        // Limpar autorização
        localStorage.removeItem("autorizado");
        localStorage.removeItem("ultimoLogin");
        
        // Redirecionar para login
        window.location.href = "index.html";
    }
}

// ===== FUNÇÕES ORIGINAIS =====
function inserir() {
    var original = document.querySelector("#tabelaconduz");
    var div2 = original.cloneNode(true);
    div2.style.display = "block";

    // Remove o botão antigo, se houver
    var oldButton = div2.querySelector(".button-container");
    if (oldButton) oldButton.remove();

    // Cria botão de exclusão
    var excluirBtn = document.createElement("button");
    excluirBtn.innerHTML = "EXCLUIR";
    excluirBtn.classList.add("excluir-btn");
    excluirBtn.onclick = function () { ocultarDiv(div2); };

    var buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");
    buttonContainer.appendChild(excluirBtn);
    div2.appendChild(buttonContainer);

    // Encontra o último .tabelaconduz visível (inclusive os clones)
    var todasDivs = document.querySelectorAll("#tabelaconduz, .tabelaconduz-clone");
    var ultima = todasDivs[todasDivs.length - 1];
    ultima.after(div2);

    // Marca como clone para futuras inserções
    div2.classList.add("tabelaconduz-clone");

    // Reaplica comportamento de exclusividade
    ativarExclusividadeParte();
}

function ocultarDiv(div) {
    div.style.display = "none";
    salvarEstado();
}

let fileInput = document.getElementById("file-input");
let imageContainer = document.getElementById("images");
let numOfFiles = document.getElementById("num-of-files");

function preview() {
    imageContainer.innerHTML = "";
    numOfFiles.textContent = `${fileInput.files.length} Arquivo(s) Selecionado(s)`;

    for (let i of fileInput.files) {
        let reader = new FileReader();
        let figure = document.createElement("figure");
        let figCap = document.createElement("figCaption");
        figure.appendChild(figCap);

        function excluirImagem() {
            figure.remove();
            salvarEstado();
        }

        reader.onload = () => {
            let img = document.createElement("img");
            img.setAttribute("src", reader.result);
            figure.insertBefore(img, figCap);

            let btnExcluir = document.createElement("button");
            btnExcluir.textContent = "Excluir";
            btnExcluir.style.backgroundColor = "red";
            btnExcluir.style.color = "white";
            btnExcluir.style.border = "none";
            btnExcluir.style.padding = "5px 10px";
            btnExcluir.style.cursor = "pointer";
            btnExcluir.onclick = excluirImagem;

            figure.appendChild(btnExcluir);
        };

        imageContainer.appendChild(figure);
        reader.readAsDataURL(i);
    }
    salvarEstado();
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');

    if (users[username] && users[username] === password) {
        window.location.href = "rop.html";
    } else {
        message.style.color = "red";
        message.textContent = "Usuário ou senha incorretos!";
    }
}

const uploadInput = document.getElementById('upload');
const previewContainer = document.getElementById('previewContainer');

uploadInput.addEventListener('change', function () {
    const files = this.files;

    Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            const imageBox = document.createElement('div');
            imageBox.classList.add('image-box');

            const img = document.createElement('img');
            img.src = e.target.result;

            const removeBtn = document.createElement('button');
            removeBtn.classList.add('remove-btn');
            removeBtn.textContent = 'Remover';

            removeBtn.addEventListener('click', () => {
                previewContainer.removeChild(imageBox);
                salvarEstado();
            });

            imageBox.appendChild(img);
            imageBox.appendChild(removeBtn);
            previewContainer.appendChild(imageBox);
        };

        reader.readAsDataURL(file);
    });

    this.value = '';
    salvarEstado();
});

function imprimirSemBotoes() {
    // Esconde botões antes de imprimir
    const botoes = document.querySelectorAll(
        '.excluir-btn, .custom-btn, .remove-btn, #inserir-btn, .imprimir, .button-container'
    );
    botoes.forEach(botao => botao.style.display = 'none');

    // Verifica se há partes envolvidas
    const partesVisiveis = Array.from(document.querySelectorAll('#tabelaconduz, .tabelaconduz-clone'))
        .filter(div => div.style.display !== 'none');
    if (partesVisiveis.length === 0) {
        const aviso = document.createElement('p');
        aviso.textContent = 'Sem partes envolvidas';
        aviso.style.textAlign = 'center';
        aviso.style.marginTop = '10px';
        document.querySelector('#div2').appendChild(aviso);
    }

    // Verifica apreensões
    const tabelaApreensoes = document.getElementById('tabela-apreensoes');
    const linhasApreensoes = tabelaApreensoes.querySelectorAll('tbody tr');
    if (linhasApreensoes.length === 0) {
        const aviso = document.createElement('p');
        aviso.textContent = 'Nenhum objeto apreendido';
        aviso.style.textAlign = 'center';
        aviso.style.marginTop = '10px';
        tabelaApreensoes.insertAdjacentElement('afterend', aviso);
    }

    // Verifica imagens
    const preview = document.getElementById('previewContainer');
    if (preview.querySelectorAll('.image-box').length === 0) {
        const aviso = document.createElement('p');
        aviso.textContent = 'Não foram anexadas imagens';
        aviso.style.textAlign = 'center';
        aviso.style.marginTop = '10px';
        preview.appendChild(aviso);
    }

    // Atualiza visualização de selects
    document.querySelectorAll('select').forEach(select => {
        const printSpan = select.nextElementSibling;
        if (printSpan && printSpan.classList.contains('select-print')) {
            printSpan.textContent = select.options[select.selectedIndex]?.text || '';
            printSpan.style.display = 'inline-flex'; // mostrar texto na impressão
            select.style.display = 'none'; // esconde o select
        }
    });

    // Imprime
    setTimeout(() => {
        window.print();

        // Restaura botões
        botoes.forEach(botao => botao.style.display = '');

        // Restaura selects e esconde os spans
        document.querySelectorAll('select').forEach(select => {
            const printSpan = select.nextElementSibling;
            if (printSpan && printSpan.classList.contains('select-print')) {
                printSpan.style.display = 'none';
                select.style.display = ''; // mostra o select novamente
            }
        });

        // Remove mensagens adicionadas
        document.querySelectorAll('#div2 p, #tabela-apreensoes + p, #previewContainer p').forEach(p => p.remove());
    }, 100);
}

function updateSelectPrint(select) {
    const printSpan = select.nextElementSibling;
    printSpan.textContent = select.options[select.selectedIndex].text;
    salvarEstado();
}

function adicionarApreensao() {
    const tabela = document.getElementById('tabela-apreensoes');
    tabela.style.display = 'table'; // Mostra a tabela

    const tbody = tabela.querySelector('tbody');

    const tr = document.createElement('tr');

    tr.innerHTML = `
        <td>
            <select onchange="updateSelectPrint(this)">
                <option></option>
                <option>Objeto</option>
                <option>Arma</option>
                <option>Veículo</option>
                <option>Substância</option>
                <option>Outros</option>
            </select>
            <span class="select-print" style="display:none;"></span>
        </td>
        <td><input type="text" size="40"></td>
    `;

    tbody.appendChild(tr);

    const btnExcluir = document.createElement('button');
    btnExcluir.textContent = 'EXCLUIR';
    btnExcluir.className = 'excluir-btn';
    btnExcluir.onclick = () => {
        tr.remove();
        btnExcluir.remove();
        salvarEstado();

        // Se não houver mais linhas, esconde a tabela
        if (tbody.querySelectorAll('tr').length === 0) {
            tabela.style.display = 'none';
        }
    };

    const divBtn = document.createElement('div');
    divBtn.className = 'button-container';
    divBtn.appendChild(btnExcluir);

    tr.parentNode.insertBefore(divBtn, tr.nextSibling);
}

function adicionarAgente() {
    const tbody = document.querySelector('#tabela-gms tbody');

    const tr = document.createElement('tr');

    tr.innerHTML = `
        <td>
            <select onchange="updateSelectPrint(this)">
                <option></option>
                <option>Subinspetor de 2ª Classe</option>
                <option>Subinspetor de 3ª Classe</option>
                <option>Supervisor</option>
                <option>Guarda Municipal</option>
            </select>
            <span class="select-print" style="display:none;"></span>
        </td>
        <td><input type="text" size="24"></td>
        <td><input type="text" size="5"></td>
    `;

    tbody.appendChild(tr);

    const btnExcluir = document.createElement('button');
    btnExcluir.textContent = 'EXCLUIR';
    btnExcluir.className = 'excluir-btn';
    btnExcluir.onclick = () => {
        tr.remove();
        btnExcluir.remove();
        salvarEstado();
    };

    const divBtn = document.createElement('div');
    divBtn.className = 'button-container';
    divBtn.appendChild(btnExcluir);

    tr.parentNode.insertBefore(divBtn, tr.nextSibling);
}

function autoExpand(textarea) {
    // Pequeno delay para garantir que o conteúdo foi renderizado
    setTimeout(() => {
        textarea.style.height = 'auto'; // reset
        textarea.style.height = textarea.scrollHeight + 'px';
        salvarEstado();
    }, 10);
}

function excluirLinha(btn) {
    const row = btn.closest('tr');
    const buttonRow = row.nextElementSibling;
    row.remove();
    if (buttonRow && buttonRow.classList.contains('button-container-row')) {
        buttonRow.remove();
    }
    salvarEstado();
}

// Garante que só um checkbox por grupo seja marcado
document.querySelectorAll('.parte-envolvida').forEach(cb => {
    cb.addEventListener('change', function () {
        if (this.checked) {
            // Encontra o grupo onde esse checkbox está
            const grupo = this.closest('.fundocinza');

            // Desmarca os outros só dentro desse grupo
            grupo.querySelectorAll('.parte-envolvida').forEach(outro => {
                if (outro !== this) outro.checked = false;
            });
        }
        salvarEstado();
    });
});

function ativarExclusividadeParte() {
    document.querySelectorAll('.parte-envolvida').forEach(cb => {
        cb.addEventListener('change', function () {
            if (this.checked) {
                const grupo = this.closest('.fundocinza');
                grupo.querySelectorAll('.parte-envolvida').forEach(outro => {
                    if (outro !== this) outro.checked = false;
                });
            }
            salvarEstado();
        });
    });
}

window.addEventListener('DOMContentLoaded', () => {
    ativarExclusividadeParte();
    
    // Verificar se a parte padrão está vazia e ocultá-la se necessário
    const partePadrao = document.querySelector('#tabelaconduz');
    const inputs = partePadrao.querySelectorAll('input');
    
    let temDados = false;
    for (let input of inputs) {
        if (input.value && input.value.trim() !== '') {
            temDados = true;
            break;
        }
    }
    
    // Se não tem dados e não está restaurando de um estado salvo, ocultar
    if (!temDados && !localStorage.getItem('ropEstado')) {
        partePadrao.style.display = 'none';
    }
});

// ===== Realce automático dos campos =====
function aplicarRealce(campo) {
    if (campo.type === "checkbox" || campo.type === "radio") return; // ignora checkboxes
    if (campo.tagName === "SELECT") {
        if (campo.value && campo.value.trim() !== "") {
            campo.classList.remove("vazio");
            campo.classList.add("preenchido");
        } else {
            campo.classList.remove("preenchido");
            campo.classList.add("vazio");
        }
    } else {
        if (campo.value && campo.value.trim() !== "") {
            campo.classList.remove("vazio");
            campo.classList.add("preenchido");
        } else {
            campo.classList.remove("preenchido");
            campo.classList.add("vazio");
        }
    }
}

function inicializarRealce() {
    const campos = document.querySelectorAll("input, select, textarea");
    campos.forEach(campo => {
        aplicarRealce(campo);
        campo.addEventListener("input", () => {
            aplicarRealce(campo);
            salvarEstado();
        });
        campo.addEventListener("change", () => {
            aplicarRealce(campo);
            salvarEstado();
        });
    });
}

// Rodar quando a página carrega
window.addEventListener("DOMContentLoaded", inicializarRealce);

// Rodar sempre que novos elementos forem adicionados
const observer = new MutationObserver(() => {
    inicializarRealce();
});
observer.observe(document.body, { childList: true, subtree: true });