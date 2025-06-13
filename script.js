window.addEventListener('DOMContentLoaded', () => {
    const autorizado = localStorage.getItem("autorizado");
    if (autorizado !== "true") {
      document.body.innerHTML = "<h1 style='color: red; text-align: center; margin-top: 50px;'>Usuário não autorizado</h1>";
    } else {
      // Limpa o localStorage se quiser bloquear recarregamentos subsequentes
      localStorage.removeItem("autorizado");
    }
  });


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
            });

            imageBox.appendChild(img);
            imageBox.appendChild(removeBtn);
            previewContainer.appendChild(imageBox);
        };

        reader.readAsDataURL(file);
    });

    this.value = '';
});

function imprimirSemBotoes() {
    const botoes = document.querySelectorAll(
        '.excluir-btn, .custom-btn, .remove-btn, #inserir-btn, .imprimir, .button-container'
    );
    
    document.querySelectorAll('select').forEach(select => {
        const printSpan = select.nextElementSibling;
        if (printSpan && printSpan.classList.contains('select-print')) {
            printSpan.textContent = select.options[select.selectedIndex].text;
            printSpan.style.display = 'inline';
        }
    });

    botoes.forEach(botao => {
        botao.style.display = 'none';
    });

    setTimeout(() => {
        window.print();

        botoes.forEach(botao => {
            botao.style.display = '';
        });
        
        document.querySelectorAll('.select-print').forEach(span => {
            span.style.display = 'none';
        });
    }, 100);
}

function updateSelectPrint(select) {
    const printSpan = select.nextElementSibling;
    printSpan.textContent = select.options[select.selectedIndex].text;
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
                <option>GM-1</option>
                <option>GM-2</option>
                <option>GM-3</option>
                <option>SUPERVISOR</option>
                <option>SUB-INSPETOR</option>
                <option>INSPETOR</option>
            </select>
            <span class="select-print" style="display:none;"></span>
        </td>
        <td><input type="text" size="20"></td>
        <td><input type="text" size="15"></td>
    `;

    tbody.appendChild(tr);

    const btnExcluir = document.createElement('button');
    btnExcluir.textContent = 'EXCLUIR';
    btnExcluir.className = 'excluir-btn';
    btnExcluir.onclick = () => {
        tr.remove();
        btnExcluir.remove();
    };

    const divBtn = document.createElement('div');
    divBtn.className = 'button-container';
    divBtn.appendChild(btnExcluir);

    tr.parentNode.insertBefore(divBtn, tr.nextSibling);
}
function autoExpand(textarea) {
    textarea.style.height = 'auto'; // reset
    textarea.style.height = textarea.scrollHeight/1.19 + 'px';
}
function excluirLinha(btn) {
    const row = btn.closest('tr');
    const buttonRow = row.nextElementSibling;
    row.remove();
    if (buttonRow && buttonRow.classList.contains('button-container-row')) {
        buttonRow.remove();
    }
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
        });
    });
}

window.addEventListener('DOMContentLoaded', () => {
    ativarExclusividadeParte();
});
