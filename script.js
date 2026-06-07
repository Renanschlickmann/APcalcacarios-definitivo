let estoqueBranco = 0;
let estoquePreto = 0;

let entradas = [];
let saidas = [];
let servicos = [];
let clientes = [];

const estoqueBrancoEl = document.getElementById("estoqueBranco");
const estoquePretoEl = document.getElementById("estoquePreto");

const listaEntradas = document.getElementById("listaEntradas");
const listaSaidas = document.getElementById("listaSaidas");
const listaServicos = document.getElementById("listaServicos");
const listaClientes = document.getElementById("listaClientes");

const totalEntradasEl = document.getElementById("totalEntradas");
const totalSaidasEl = document.getElementById("totalSaidas");
const totalServicosEl = document.getElementById("totalServicos");
const totalComprasEl = document.getElementById("totalCompras");
const totalVendasEl = document.getElementById("totalVendas");
const totalValorServicosEl = document.getElementById("totalValorServicos");

function dataAtual() {
    return new Date().toLocaleString("pt-BR");
}

function normalizarTexto(texto) {
    return texto
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

function converterValor(valor) {
    if (!valor) return 0;

    return Number(
        valor
        .toString()
        .replace(/\./g, "")
        .replace(",", ".")
        .replace(/[^\d.]/g, "")
    ) || 0;
}

function formatarDinheiro(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function formatarQtd(valor) {
    return (Number(valor) || 0).toFixed(2);
}

function calcularTotal(item) {
    return (Number(item.quantidade) || 0) * converterValor(item.valor);
}

function carregarDados() {
    const dados = JSON.parse(localStorage.getItem("calcarioSistema"));

    if (dados) {
        estoqueBranco = dados.estoqueBranco || 0;
        estoquePreto = dados.estoquePreto || 0;

        entradas = dados.entradas || [];
        saidas = dados.saidas || [];
        servicos = dados.servicos || [];
        clientes = dados.clientes || [];

        atualizarEstoque();
        renderizarListas();
        renderizarClientes();
    }
}

function salvarDados() {
    const dados = {
        estoqueBranco,
        estoquePreto,
        entradas,
        saidas,
        servicos,
        clientes
    };

    localStorage.setItem("calcarioSistema", JSON.stringify(dados));
}

function atualizarEstoque() {
    estoqueBrancoEl.textContent = formatarQtd(estoqueBranco) + " Ton";
    estoquePretoEl.textContent = formatarQtd(estoquePreto) + " Ton";
}

function atualizarTotais() {
    let totalEntradaQtd = 0;
    let totalSaidaQtd = 0;
    let totalServicoQtd = 0;

    let totalCompras = 0;
    let totalVendas = 0;
    let totalServicosValor = 0;

    entradas.forEach(item => {
        totalEntradaQtd += Number(item.quantidade) || 0;
        totalCompras += calcularTotal(item);
    });

    saidas.forEach(item => {
        totalSaidaQtd += Number(item.quantidade) || 0;
        totalVendas += calcularTotal(item);
    });

    servicos.forEach(item => {
        totalServicoQtd += Number(item.quantidade) || 0;
        totalServicosValor += calcularTotal(item);
    });

    totalEntradasEl.textContent = formatarQtd(totalEntradaQtd) + " Ton";
    totalSaidasEl.textContent = formatarQtd(totalSaidaQtd) + " Ton";
    totalServicosEl.textContent = formatarQtd(totalServicoQtd);
    totalComprasEl.textContent = formatarDinheiro(totalCompras);
    totalVendasEl.textContent = formatarDinheiro(totalVendas);
    totalValorServicosEl.textContent = formatarDinheiro(totalServicosValor);
}

function renderizarListas() {
    listaEntradas.innerHTML = "";
    listaSaidas.innerHTML = "";
    listaServicos.innerHTML = "";

    entradas.forEach((item, index) => {
        const li = document.createElement("li");

        li.innerHTML = `
            <div class="item-linha">
                <div>
                    <strong>${item.nome}</strong><br>
                    Calcário ${item.tipo} - ${formatarQtd(item.quantidade)} Ton<br>
                    Valor unitário: R$ ${item.valor || "0"}<br>
                    <span class="valor-total">
                        Total: ${formatarDinheiro(calcularTotal(item))}
                    </span>
                    <div class="data-lancamento">
                        ${item.data || "Sem data"}
                    </div>
                </div>

                <div class="botoes-item">
                    <button class="btn-editar" onclick="editarEntrada(${index})">
                        editar
                    </button>

                    <button class="btn-excluir" onclick="excluirEntrada(${index})">
                        apagar
                    </button>
                </div>
            </div>
        `;

        listaEntradas.appendChild(li);
    });

    saidas.forEach((item, index) => {
        const li = document.createElement("li");

        li.innerHTML = `
            <div class="item-linha">
                <div>
                    <strong>${item.nome}</strong><br>
                    Calcário ${item.tipo} - ${formatarQtd(item.quantidade)} Ton<br>
                    Valor unitário: R$ ${item.valor || "0"}<br>
                    <span class="valor-total">
                        Total: ${formatarDinheiro(calcularTotal(item))}
                    </span>
                    <div class="data-lancamento">
                        ${item.data || "Sem data"}
                    </div>
                </div>

                <div class="botoes-item">
                    <button class="btn-editar" onclick="editarSaida(${index})">
                        editar
                    </button>

                    <button class="btn-excluir" onclick="excluirSaida(${index})">
                        apagar
                    </button>
                </div>
            </div>
        `;

        listaSaidas.appendChild(li);
    });

    servicos.forEach((item, index) => {
        const li = document.createElement("li");

        li.innerHTML = `
            <div class="item-linha">
                <div>
                    <strong>${item.nome}</strong><br>
                    ${item.tipo} - ${formatarQtd(item.quantidade)}<br>
                    Valor unitário: R$ ${item.valor || "0"}<br>
                    <span class="valor-total">
                        Total: ${formatarDinheiro(calcularTotal(item))}
                    </span>
                    <div class="data-lancamento">
                        ${item.data || "Sem data"}
                    </div>
                </div>

                <div class="botoes-item">
                    <button class="btn-editar" onclick="editarServico(${index})">
                        editar
                    </button>

                    <button class="btn-excluir" onclick="excluirServico(${index})">
                        apagar
                    </button>
                </div>
            </div>
        `;

        listaServicos.appendChild(li);
    });

    atualizarTotais();
}

function renderizarClientes() {
    listaClientes.innerHTML = "";

    const saidaSelect = document.getElementById("saidaNome");
    const servicoSelect = document.getElementById("servicoNome");

    saidaSelect.innerHTML = `<option value="">Selecione o cliente</option>`;
    servicoSelect.innerHTML = `<option value="">Selecione o cliente</option>`;

    clientes.forEach((cliente, index) => {
        saidaSelect.innerHTML += `
            <option value="${cliente.nome}">
                ${cliente.nome}
            </option>
        `;

        servicoSelect.innerHTML += `
            <option value="${cliente.nome}">
                ${cliente.nome}
            </option>
        `;

        const li = document.createElement("li");

        li.innerHTML = `
            <div class="item-linha">
                <div>
                    <strong>${cliente.nome}</strong><br>
                    ${cliente.telefone || "Sem telefone"}<br>
                    ${cliente.obs || ""}
                </div>

                <div class="botoes-item">
                    <button class="btn-editar" onclick="verCliente('${cliente.nome}')">
                        ver
                    </button>

                    <button class="btn-excluir" onclick="apagarCliente(${index})">
                        apagar
                    </button>
                </div>
            </div>
        `;

        listaClientes.appendChild(li);
    });
}

document.getElementById("formCliente").addEventListener("submit", function(e) {
    e.preventDefault();

    const nome = document.getElementById("clienteNome").value.trim();
    const telefone = document.getElementById("clienteTelefone").value.trim();
    const obs = document.getElementById("clienteObs").value.trim();

    const existe = clientes.some(cliente =>
        normalizarTexto(cliente.nome) === normalizarTexto(nome)
    );

    if (existe) {
        alert("Cliente já cadastrado!");
        return;
    }

    clientes.unshift({
        nome,
        telefone,
        obs,
        data: dataAtual()
    });

    renderizarClientes();
    salvarDados();

    this.reset();
});

function apagarCliente(index) {
    const confirmar = confirm("Deseja apagar este cliente? Os lançamentos dele não serão apagados.");

    if (!confirmar) return;

    clientes.splice(index, 1);

    renderizarClientes();
    salvarDados();
}

document.getElementById("formEntrada").addEventListener("submit", function(e) {
    e.preventDefault();

    const nome = document.getElementById("entradaNome").value.trim();
    const tipo = document.getElementById("entradaTipo").value;
    const quantidade = Number(document.getElementById("entradaQuantidade").value);
    const valor = document.getElementById("entradaValor").value.trim();

    if (tipo === "branco") {
        estoqueBranco += quantidade;
    } else {
        estoquePreto += quantidade;
    }

    entradas.unshift({
        nome,
        tipo,
        quantidade,
        valor,
        data: dataAtual()
    });

    atualizarEstoque();
    renderizarListas();
    salvarDados();

    this.reset();
});

document.getElementById("formSaida").addEventListener("submit", function(e) {
    e.preventDefault();

    const nome = document.getElementById("saidaNome").value;
    const tipo = document.getElementById("saidaTipo").value;
    const quantidade = Number(document.getElementById("saidaQuantidade").value);
    const valor = document.getElementById("saidaValor").value.trim();

    if (tipo === "branco") {
        if (quantidade > estoqueBranco) {
            alert("Estoque insuficiente!");
            return;
        }

        estoqueBranco -= quantidade;
    } else {
        if (quantidade > estoquePreto) {
            alert("Estoque insuficiente!");
            return;
        }

        estoquePreto -= quantidade;
    }

    saidas.unshift({
        nome,
        tipo,
        quantidade,
        valor,
        data: dataAtual()
    });

    atualizarEstoque();
    renderizarListas();
    salvarDados();

    this.reset();
});

document.getElementById("formServico").addEventListener("submit", function(e) {
    e.preventDefault();

    const nome = document.getElementById("servicoNome").value;
    const tipo = document.getElementById("servicoTipo").value;
    const quantidade = document.getElementById("servicoQuantidade").value;
    const valor = document.getElementById("servicoValor").value.trim();

    servicos.unshift({
        nome,
        tipo,
        quantidade,
        valor,
        data: dataAtual()
    });

    renderizarListas();
    salvarDados();

    this.reset();
});

function excluirEntrada(index) {
    const confirmar = confirm("Deseja apagar esta entrada?");

    if (!confirmar) return;

    const item = entradas[index];

    if (item.tipo === "branco") {
        estoqueBranco -= item.quantidade;
    } else {
        estoquePreto -= item.quantidade;
    }

    entradas.splice(index, 1);

    atualizarEstoque();
    renderizarListas();
    salvarDados();
}

function excluirSaida(index) {
    const confirmar = confirm("Deseja apagar esta saída?");

    if (!confirmar) return;

    const item = saidas[index];

    if (item.tipo === "branco") {
        estoqueBranco += item.quantidade;
    } else {
        estoquePreto += item.quantidade;
    }

    saidas.splice(index, 1);

    atualizarEstoque();
    renderizarListas();
    salvarDados();
}

function excluirServico(index) {
    const confirmar = confirm("Deseja apagar este serviço?");

    if (!confirmar) return;

    servicos.splice(index, 1);

    renderizarListas();
    salvarDados();
}

function editarEntrada(index) {
    const item = entradas[index];

    document.getElementById("entradaNome").value = item.nome;
    document.getElementById("entradaTipo").value = item.tipo;
    document.getElementById("entradaQuantidade").value = item.quantidade;
    document.getElementById("entradaValor").value = item.valor || "";

    if (item.tipo === "branco") {
        estoqueBranco -= item.quantidade;
    } else {
        estoquePreto -= item.quantidade;
    }

    entradas.splice(index, 1);

    fecharExtrato();
    atualizarEstoque();
    renderizarListas();
    salvarDados();

    document.getElementById("formEntrada").scrollIntoView({ behavior: "smooth" });
}

function editarSaida(index) {
    const item = saidas[index];

    document.getElementById("saidaNome").value = item.nome;
    document.getElementById("saidaTipo").value = item.tipo;
    document.getElementById("saidaQuantidade").value = item.quantidade;
    document.getElementById("saidaValor").value = item.valor || "";

    if (item.tipo === "branco") {
        estoqueBranco += item.quantidade;
    } else {
        estoquePreto += item.quantidade;
    }

    saidas.splice(index, 1);

    fecharExtrato();
    atualizarEstoque();
    renderizarListas();
    salvarDados();

    document.getElementById("formSaida").scrollIntoView({ behavior: "smooth" });
}

function editarServico(index) {
    const item = servicos[index];

    document.getElementById("servicoNome").value = item.nome;
    document.getElementById("servicoTipo").value = item.tipo;
    document.getElementById("servicoQuantidade").value = item.quantidade;
    document.getElementById("servicoValor").value = item.valor || "";

    servicos.splice(index, 1);

    fecharExtrato();
    renderizarListas();
    salvarDados();

    document.getElementById("formServico").scrollIntoView({ behavior: "smooth" });
}

function verCliente(nome) {
    document.getElementById("pesquisaCliente").value = nome;
    pesquisarCliente();
}

function limparPesquisaCliente() {
    document.getElementById("pesquisaCliente").value = "";
    document.getElementById("resultadoCliente").innerHTML = "";
}

function pesquisarCliente() {
    const termo = document.getElementById("pesquisaCliente").value.trim();
    const resultado = document.getElementById("resultadoCliente");

    resultado.innerHTML = "";

    if (!termo) {
        alert("Digite o nome do cliente.");
        return;
    }

    const termoNormalizado = normalizarTexto(termo);

    const entradasCliente = entradas.filter(item =>
        normalizarTexto(item.nome).includes(termoNormalizado)
    );

    const saidasCliente = saidas.filter(item =>
        normalizarTexto(item.nome).includes(termoNormalizado)
    );

    const servicosCliente = servicos.filter(item =>
        normalizarTexto(item.nome).includes(termoNormalizado)
    );

    const totalEntradasCliente = entradasCliente.reduce((acc, item) => acc + calcularTotal(item), 0);
    const totalSaidasCliente = saidasCliente.reduce((acc, item) => acc + calcularTotal(item), 0);
    const totalServicosCliente = servicosCliente.reduce((acc, item) => acc + calcularTotal(item), 0);

    resultado.innerHTML = `
        <div class="cliente-card">
            <h3>Resultado para: ${termo}</h3>

            <p><strong>Entradas:</strong> ${entradasCliente.length}</p>
            <p><strong>Saídas:</strong> ${saidasCliente.length}</p>
            <p><strong>Serviços:</strong> ${servicosCliente.length}</p>

            <p><strong>Total Entradas:</strong> ${formatarDinheiro(totalEntradasCliente)}</p>
            <p><strong>Total Saídas:</strong> ${formatarDinheiro(totalSaidasCliente)}</p>
            <p><strong>Total Serviços:</strong> ${formatarDinheiro(totalServicosCliente)}</p>
        </div>
    `;

    function criarBloco(titulo, lista) {
        let html = `<div class="cliente-info"><h4>${titulo}</h4>`;

        if (lista.length === 0) {
            html += `<p>Nenhum lançamento encontrado.</p>`;
        }

        lista.forEach(item => {
            html += `
                <p>
                    <strong>${item.tipo || "Serviço"}</strong> -
                    ${formatarQtd(item.quantidade)}
                    <br>
                    Total: ${formatarDinheiro(calcularTotal(item))}
                    <br>
                    <span class="data-lancamento">${item.data || "Sem data"}</span>
                </p>
            `;
        });

        html += `</div>`;

        resultado.innerHTML += html;
    }

    criarBloco("Entradas", entradasCliente);
    criarBloco("Saídas", saidasCliente);
    criarBloco("Serviços", servicosCliente);
}

document.getElementById("btnPesquisarCliente").addEventListener("click", pesquisarCliente);

document.getElementById("btnBackup").addEventListener("click", function() {
    const dados = {
        estoqueBranco,
        estoquePreto,
        entradas,
        saidas,
        servicos,
        clientes
    };

    const json = JSON.stringify(dados, null, 2);

    const blob = new Blob([json], {
        type: "application/json"
    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "backup-calcario.json";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

document.getElementById("btnExcel").addEventListener("click", function() {
    let csv = `TIPO,NOME,CALCARIO_SERVICO,QUANTIDADE,VALOR_UNITARIO,TOTAL,DATA\n`;

    entradas.forEach(item => {
        csv += `ENTRADA,${item.nome},${item.tipo},${item.quantidade},${item.valor || 0},${calcularTotal(item)},${item.data || ""}\n`;
    });

    saidas.forEach(item => {
        csv += `SAIDA,${item.nome},${item.tipo},${item.quantidade},${item.valor || 0},${calcularTotal(item)},${item.data || ""}\n`;
    });

    servicos.forEach(item => {
        csv += `SERVICO,${item.nome},${item.tipo},${item.quantidade},${item.valor || 0},${calcularTotal(item)},${item.data || ""}\n`;
    });

    const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;"
    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "relatorio-calcario.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

document.getElementById("inputImportar").addEventListener("change", function(event) {
    const arquivo = event.target.files[0];

    if (!arquivo) return;

    const leitor = new FileReader();

    leitor.onload = function(e) {
        const dados = JSON.parse(e.target.result);

        estoqueBranco = dados.estoqueBranco || 0;
        estoquePreto = dados.estoquePreto || 0;

        entradas = dados.entradas || [];
        saidas = dados.saidas || [];
        servicos = dados.servicos || [];
        clientes = dados.clientes || [];

        atualizarEstoque();
        renderizarListas();
        renderizarClientes();
        salvarDados();

        alert("Backup importado com sucesso!");
    };

    leitor.readAsText(arquivo);
});

const modalExtrato = document.getElementById("modalExtrato");
const btnAbrirExtrato = document.getElementById("btnAbrirExtrato");
const btnFecharExtrato = document.getElementById("btnFecharExtrato");
const btnVoltarExtrato = document.getElementById("btnVoltarExtrato");

function abrirExtrato() {
    modalExtrato.classList.add("ativo");
    mostrarAba("entradas");
    atualizarTotais();
}

function fecharExtrato() {
    limparPesquisaCliente();
    modalExtrato.classList.remove("ativo");
}

function mostrarAba(nome) {
    document.querySelectorAll(".conteudo-aba").forEach(aba => {
        aba.classList.remove("ativo");
    });

    document.querySelectorAll(".aba").forEach(botao => {
        botao.classList.remove("ativa");
    });

    if (nome === "entradas") {
        document.getElementById("abaEntradas").classList.add("ativo");
        document.querySelectorAll(".aba")[0].classList.add("ativa");
    }

    if (nome === "saidas") {
        document.getElementById("abaSaidas").classList.add("ativo");
        document.querySelectorAll(".aba")[1].classList.add("ativa");
    }

    if (nome === "servicos") {
        document.getElementById("abaServicos").classList.add("ativo");
        document.querySelectorAll(".aba")[2].classList.add("ativa");
    }

    if (nome === "clientes") {
        document.getElementById("abaClientes").classList.add("ativo");
        document.querySelectorAll(".aba")[3].classList.add("ativa");
    }
}

btnAbrirExtrato.addEventListener("click", abrirExtrato);
btnFecharExtrato.addEventListener("click", fecharExtrato);
btnVoltarExtrato.addEventListener("click", fecharExtrato);

modalExtrato.addEventListener("click", function(event) {
    if (event.target === modalExtrato) {
        fecharExtrato();
    }
});

document.getElementById("btnImprimirExtrato").addEventListener("click", function() {
    const dataAtualPdf = new Date().toLocaleDateString("pt-BR");

    let conteudo = `
        <html>
        <head>
            <title>Extrato ApCalcários</title>

            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                    color: #111;
                }

                .botao-voltar {
                    background: #1e3b20;
                    color: white;
                    border: none;
                    padding: 12px 18px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                    margin-bottom: 20px;
                }

                h1 {
                    text-align: center;
                    margin-bottom: 5px;
                }

                .data {
                    text-align: center;
                    margin-bottom: 25px;
                    color: #555;
                }

                h2 {
                    background: #1e3b20;
                    color: white;
                    padding: 10px;
                    border-radius: 6px;
                    margin-top: 25px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 10px;
                    margin-bottom: 20px;
                }

                th, td {
                    border: 1px solid #ccc;
                    padding: 8px;
                    text-align: left;
                    font-size: 14px;
                }

                th {
                    background: #f1f5f9;
                }

                .rodape {
                    margin-top: 30px;
                    text-align: center;
                    font-size: 12px;
                    color: #555;
                }

                @media print {
                    .botao-voltar {
                        display: none;
                    }
                }
            </style>
        </head>

        <body>
            <button class="botao-voltar" onclick="window.close()">
                ← Voltar ao sistema
            </button>

            <h1>Extrato ApCalcários</h1>
            <p class="data">Emitido em ${dataAtualPdf}</p>

            <h2>Resumo</h2>
            <table>
                <tr>
                    <th>Total Entradas</th>
                    <th>Total Saídas</th>
                    <th>Total Serviços</th>
                    <th>Total Compras</th>
                    <th>Total Vendas</th>
                    <th>Total Serviços R$</th>
                </tr>
                <tr>
                    <td>${totalEntradasEl.textContent}</td>
                    <td>${totalSaidasEl.textContent}</td>
                    <td>${totalServicosEl.textContent}</td>
                    <td>${totalComprasEl.textContent}</td>
                    <td>${totalVendasEl.textContent}</td>
                    <td>${totalValorServicosEl.textContent}</td>
                </tr>
            </table>
    `;

    function tabela(titulo, lista, nomeColuna) {
        conteudo += `
            <h2>${titulo}</h2>
            <table>
                <tr>
                    <th>${nomeColuna}</th>
                    <th>Tipo</th>
                    <th>Quantidade</th>
                    <th>Valor Unitário</th>
                    <th>Total</th>
                    <th>Data</th>
                </tr>
        `;

        lista.forEach(item => {
            conteudo += `
                <tr>
                    <td>${item.nome}</td>
                    <td>${item.tipo}</td>
                    <td>${formatarQtd(item.quantidade)}</td>
                    <td>R$ ${item.valor || "0"}</td>
                    <td>${formatarDinheiro(calcularTotal(item))}</td>
                    <td>${item.data || "Sem data"}</td>
                </tr>
            `;
        });

        conteudo += `</table>`;
    }

    tabela("Entradas", entradas, "Fornecedor");
    tabela("Saídas", saidas, "Cliente");
    tabela("Serviços", servicos, "Cliente");

    conteudo += `
        <div class="rodape">
            © 2026 - feito por Renan Schlickmann Gesser
        </div>

        </body>
        </html>
    `;

    const janela = window.open("", "_blank");

    janela.document.write(conteudo);
    janela.document.close();

    setTimeout(() => {
        janela.print();
    }, 500);
});

carregarDados();