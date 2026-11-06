let listaVeiculo = []; // conjunto de dados
let oQueEstaFazendo = ''; // variável global de controle
let veiculoCorrente = null; // CORRIGIDO: Nome alterado para evitar conflito com a classe Veiculo

// Inicialização da interface
bloquearAtributos(true);

// backend (não interage com o html)
function procurePorChavePrimaria(chave) {
    for (let i = 0; i < listaVeiculo.length; i++) {
        const v = listaVeiculo[i]; // CORRIGIDO: Evita redeclarar com nome de classe
        if (v.placa == chave) {
            v.posicaoNaLista = i;
            return v;
        }
    }
    return null; // não achou
}

// Função para procurar um elemento pela chave primária
function procure() {
    const placa = document.getElementById("inputPlaca").value;
    if (isNaN(placa) || !Number.isInteger(Number(placa))) {
        mostrarAviso("Precisa ser um número inteiro");
        document.getElementById("inputPlaca").focus();
        return;
    }

    if (placa) { 
        veiculoCorrente = procurePorChavePrimaria(placa);
        if (veiculoCorrente) { 
            mostrarDadosVeiculo(veiculoCorrente);
            visibilidadeDosBotoes('inline', 'none', 'inline', 'inline', 'none'); 
            mostrarAviso("Achou na lista, pode alterar ou excluir");
        } else { 
            limparAtributos();
            visibilidadeDosBotoes('inline', 'inline', 'none', 'none', 'none');
            mostrarAviso("Não achou na lista, pode inserir");
        }
    } else {
        document.getElementById("inputPlaca").focus();
        return;
    }
}

function inserir() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline'); 
    oQueEstaFazendo = 'inserindo';
    mostrarAviso("INSERINDO - Digite os atributos e clique no botão salvar");
    document.getElementById("inputPlaca").focus();
}

function alterar() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'alterando';
    mostrarAviso("ALTERANDO - Digite os atributos e clique no botão salvar");
}

function excluir() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline'); 

    oQueEstaFazendo = 'excluindo';
    mostrarAviso("EXCLUINDO - clique no botão salvar para confirmar a exclusão");
}

function salvar() {
    let placa;
    if (veiculoCorrente == null) {
        placa = parseInt(document.getElementById("inputPlaca").value);
    } else {
        placa = veiculoCorrente.placa;
    }

    const marca = document.getElementById("inputmarca").value;
    const ano = parseInt(document.getElementById("inputAno").value);
    const modelo = document.getElementById("inputModelo").value;

    if (placa && marca && ano && modelo) { 
        switch (oQueEstaFazendo) {
            case 'inserindo':
                // CORRIGIDO: Ordem correta dos parâmetros do seu construtor (modelo antes de ano)
                veiculoCorrente = new Veiculo(placa, marca, modelo, ano, listaVeiculo.length);
                listaVeiculo.push(veiculoCorrente);
                mostrarAviso("Inserido na lista");
                break;
            case 'alterando':
                // CORRIGIDO: Ordem dos parâmetros corrigida e uso de Veiculo instanciador correto
                let veiculoAlterado = new Veiculo(placa, marca, modelo, ano, veiculoCorrente.posicaoNaLista);
                listaVeiculo[veiculoCorrente.posicaoNaLista] = veiculoAlterado;
                mostrarAviso("Alterado");
                break;
            case 'excluindo':
                let novaLista = [];
                for (let i = 0; i < listaVeiculo.length; i++) {
                    if (veiculoCorrente.posicaoNaLista != i) {
                        novaLista.push(listaVeiculo[i]);
                    }
                }
                listaVeiculo = novaLista;
                
                // Atualiza os índices de posições restantes após a exclusão
                for (let i = 0; i < listaVeiculo.length; i++) {
                    listaVeiculo[i].posicaoNaLista = i;
                }
                mostrarAviso("EXCLUIDO");
                break;
            default:
                mostrarAviso("Erro aleatório");
        }
        
        veiculoCorrente = null; // Limpa o estado global
        visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
        limparAtributos();
        listar();
        document.getElementById("inputPlaca").value = "";
        document.getElementById("inputPlaca").focus();
    } else {
        alert("Erro nos dados digitados");
        return;
    }
}

function preparaListagem(vetor) {
    let texto = "";
    for (let i = 0; i < vetor.length; i++) {
        const linha = vetor[i];
        // Exibição amigável baseada nas propriedades corretas da sua classe
        texto += linha.placa + " - " + linha.marca + " - " + linha.modelo + " - " + linha.ano + "<br>";
    }
    return texto;
}

function listar() {
    document.getElementById("outputSaida").innerHTML = preparaListagem(listaVeiculo);
}

function cancelarOperacao() {
    veiculoCorrente = null;
    limparAtributos();
    bloquearAtributos(true);
    visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
    document.getElementById("inputPlaca").value = "";
    mostrarAviso("Cancelou a operação de edição");
}

function mostrarAviso(mensagem) {
    document.getElementById("divAviso").innerHTML = mensagem;
}

function mostrarDadosVeiculo(v) {
    document.getElementById("inputPlaca").value = v.placa;
    document.getElementById("inputmarca").value = v.marca;
    document.getElementById("inputAno").value = v.ano;
    document.getElementById("inputModelo").value = v.modelo;
    bloquearAtributos(true);
}

function limparAtributos() {
    // CORRIGIDO: document.getElementByplaca substituído pelo método correto do DOM
    document.getElementById("inputmarca").value = "";
    document.getElementById("inputAno").value = "";
    document.getElementById("inputModelo").value = "";
    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    document.getElementById("inputPlaca").readOnly = !soLeitura;
    document.getElementById("inputmarca").readOnly = soLeitura;
    document.getElementById("inputAno").readOnly = soLeitura;
    document.getElementById("inputModelo").readOnly = soLeitura;
}

function visibilidadeDosBotoes(btProcure, btInserir, btAlterar, btExcluir, btSalvar) {
    document.getElementById("btProcure").style.display = btProcure;
    document.getElementById("btInserir").style.display = btInserir;
    document.getElementById("btAlterar").style.display = btAlterar;
    document.getElementById("btExcluir").style.display = btExcluir;
    document.getElementById("btSalvar").style.display = btSalvar;
    document.getElementById("btCancelar").style.display = btSalvar; 
    document.getElementById("inputPlaca").focus();
}
