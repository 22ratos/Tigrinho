// 1. depositar algum dinheiro 
// 2. determinar o numero de linhas para apostar
// 3. coletar o dinheiro da aposta
// 4. girar a maquina
// 5. checar se o usuario ganhou
// 6. dar ao usuario o seu premio
// 7. jogar novamente

//-------importações-------//
const prompt = require("prompt-sync")(); //meu pacote que captura informações do meu prompt

//------variaveis globais----//
const LINHAS = 3;
const COLUNAS = 3;

const SIMBOLOS_COUNTAGEM = { //'CHAVE': Quantidade,
    'A': 2,
    'B': 4,
    'C': 6,
    'D': 8
};

const SIMBOLOS_VALORES = { //O valor de cada chave/ ex: em uma linha de AAA o valor vai ser multiplicado por 5
    'A': 5,
    'B': 4,
    'C': 3,
    'D': 2
};

// Função para realizar o depósito inicial do usuário
const deposito = () => {
    while (true) { // Enquanto a condição for verdadeira, o loop continuará executando
        const valorDeposito = prompt('Insira o valor do deposito: '); // Pede o valor ao usuário e armazena em uma variável
        const numeroDeposito = parseFloat(valorDeposito); // Converte a string em um número de ponto flutuante

        // Verifica se o valor inserido é válido (um número maior que 0)
        if (isNaN(numeroDeposito) || numeroDeposito <= 0) { 
            console.log('valor invalido, tente novamente')
        } else {
            return numeroDeposito; // Se o valor for válido, retorna o valor e sai do loop
        }
    }
};

// Função para determinar o número de linhas que o usuário quer apostar
const getNumeroDeLinhas = () => {
    while (true) {
        const linhas = prompt('Insira o numero de linhas para apostar (1-3): '); // Solicita o número de linhas
        const numeroDeLinhas = parseFloat(linhas); // Converte a string em um número de ponto flutuante

        // Verifica se o número de linhas é válido (entre 1 e 3)
        if (isNaN(numeroDeLinhas) || numeroDeLinhas <= 0 || numeroDeLinhas > 3) { 
            console.log('valor de linhas invalido, tente novamente')
        } else {
            return numeroDeLinhas; // Se válido, retorna o número de linhas
        }
    }
};

// Função para coletar a aposta do usuário
const getAposta = (balanco, linhas) => { // Recebe o balanço e o número de linhas como parâmetros
    while (true) {
        const aposta = prompt('Insira o valor total da aposta por linha: '); // Solicita o valor da aposta por linha
        const valorDaAposta = parseFloat(aposta); // Converte a string em um número de ponto flutuante

        // Verifica se a aposta é válida (um número maior que 0 e não superior ao saldo disponível dividido pelo número de linhas)
        if (isNaN(valorDaAposta) || valorDaAposta <= 0 || valorDaAposta > balanco / linhas) { 
            console.log('valor da aposta invalido, tente novamente.')
        } else {
            return valorDaAposta; // Se válido, retorna o valor da aposta
        }
    }
};

// Função para girar os carretéis da máquina caça-níqueis
const girar = () => {
    const simbolos = []; // Cria uma lista para armazenar todos os símbolos
    for (const [simbolo, contagem] of Object.entries(SIMBOLOS_COUNTAGEM)) { // Itera sobre cada símbolo e sua contagem
        for (let i = 0; i < contagem; i++) {
            simbolos.push(simbolo); // Adiciona o símbolo à lista com base na contagem definida
        }
    }
    
    const carretel = []; // Inicializa os carretéis (linhas da máquina)
    for (let i = 0; i < COLUNAS; i++) { // Preenche cada coluna com símbolos
        carretel.push([]);
        const carretelSimbolos = [...simbolos]; // Copia os símbolos para cada carretel
        for (let j = 0; j < LINHAS; j++) {
            const indexAleatorio = Math.floor(Math.random() * carretelSimbolos.length); // Gera um índice aleatório para selecionar um símbolo
            const simboloSelecionado = carretelSimbolos[indexAleatorio];
            carretel[i].push(simboloSelecionado); // Adiciona o símbolo selecionado ao carretel
            carretelSimbolos.splice(indexAleatorio, 1); // Remove o símbolo selecionado da lista de símbolos disponíveis
        }
    }

    return carretel; // Retorna o carretel com os símbolos distribuídos
};

// Função para transformar o formato do carretel (linhas para colunas)
const transformar = (carretel) => {
    const colunas = [];

    for (let i = 0; i < COLUNAS; i++) {
        colunas.push([]);
        for (let j = 0; j < LINHAS; j++) { // Preenche as colunas com os símbolos correspondentes do carretel
            colunas[i].push(carretel[j][i]);
        }
    }

    return colunas; // Retorna as colunas transformadas
};

// Função para imprimir as colunas na tela
const imprimirColunas = (colunas) => {
    for (const coluna of colunas) { // Itera sobre cada coluna
        let letraColuna = '';
        for (const [i, simbolo] of coluna.entries()) { // Concatena os símbolos da coluna em uma string
            letraColuna += simbolo;
            if (i != coluna.length - 1) {
                letraColuna += ' | '; // Adiciona separadores entre os símbolos
            }
        }
        console.log(letraColuna); // Imprime a coluna formatada
    }
};

// Função para verificar se o usuário ganhou
const getVitorias = (colunas, aposta, linhas) => {
    let vitorias = 0;

    for (let coluna = 0; coluna < linhas; coluna++) { // Itera sobre as linhas escolhidas pelo usuário
        const simbolos = colunas[coluna];
        let todosIguais = true;

        for (const simbolo of simbolos) { // Verifica se todos os símbolos na linha são iguais
            if (simbolo != simbolos[0]) { // Se algum símbolo for diferente do primeiro, a linha não é uma vitória
                todosIguais = false;
                break;
            }
        }
         
        if (todosIguais) { // Se todos os símbolos forem iguais, o usuário ganhou nessa linha
            vitorias += aposta * SIMBOLOS_VALORES[simbolos[0]]; // Calcula o valor da vitória multiplicando a aposta pelo valor do símbolo
        }
    }
    return vitorias; // Retorna o valor total das vitórias
};

// Função principal do jogo
const jogo = () => {
    let balanco = deposito(); // Inicializa o saldo do usuário com o valor depositado

    while (true) {
        console.log('Você tem um total de $' + balanco); // Mostra o saldo atual do usuário
        const numeroDeLinhas = getNumeroDeLinhas(); // Obtém o número de linhas para apostar
        const aposta = getAposta(balanco, numeroDeLinhas); // Obtém o valor da aposta por linha
        balanco -= aposta * numeroDeLinhas; // Deduz o valor total da aposta do saldo
        const carretel = girar(); // Gira a máquina para gerar os símbolos
        const colunas = transformar(carretel); // Transforma o formato das colunas
        imprimirColunas(colunas); // Imprime as colunas resultantes
        const vitorias = getVitorias(colunas, aposta, numeroDeLinhas); // Calcula os ganhos do usuário
        balanco += vitorias; // Adiciona os ganhos ao saldo
        console.log('Você ganhou $' + vitorias.toString()); // Informa o usuário sobre o valor ganho
    
        if (balanco <= 0) { // Verifica se o saldo do usuário acabou
            console.log('Você está sem dinheiro! XD');
            break; // Sai do loop e encerra o jogo
        }

        const jogarNovamente = prompt('Você gostaria de jogar novamente (s/n)? '); // Pergunta ao usuário se ele quer jogar novamente

        if (jogarNovamente != 's') break; // Se a resposta não for 's', o jogo termina
    }
};

jogo(); // Inicia o jogo
