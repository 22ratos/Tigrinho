document.addEventListener("DOMContentLoaded", () => {
    let balanco = 0;

    const musicaDeposito = () => {
        var music = new Audio('./assets/mixkit-coins-handling-1939.wav');
        music.play();
    };

    const musicaGirar = () => {
        var music = new Audio('./assets/90s-game-ui-6-185099.mp3');
        music.play();
    };

    const atualizarBalanco = () => {
        document.getElementById("balanco").textContent = balanco.toString();
    };

    const girarMaquina = () => {
        const simbolos = ['🍇', '🍉', '🍌', '🥝'];
        let resultado = [];

        for (let i = 0; i < 3; i++) {
            let coluna = [];
            for (let j = 0; j < 3; j++) {
                coluna.push(simbolos[Math.floor(Math.random() * simbolos.length)]);
            }
            resultado.push(coluna);
        }
        return resultado;
    };

    const exibirResultado = (resultado) => {
        for (let i = 0; i < 3; i++) {
            document.getElementById(`coluna-${i + 1}`).textContent = resultado[i].join(' | ');
        }
    };

    const calcularVitoria = (resultado, aposta, linhas) => {
        let ganhos = 0;
        const simbolosValores = {'🍇': 5, '🍉': 4, '🍌': 3, '🥝': 2};

        for (let i = 0; i < linhas; i++) {
            if (resultado[0][i] === resultado[1][i] && resultado[1][i] === resultado[2][i]) {
                ganhos += aposta * simbolosValores[resultado[0][i]];
            }
        }
        return ganhos;
    };

  

    document.getElementById("confirmar-deposito").addEventListener("click", () => {
        const deposito = parseFloat(document.getElementById("deposito").value);

        if (isNaN(deposito) || deposito <= 0) {
            document.getElementById("mensagem").textContent = "Depósito inválido! >:(";
            return;
        }

        balanco = deposito;
        atualizarBalanco();
        document.getElementById("girar").disabled = false; // Habilita o botão de girar após o depósito
        document.getElementById("mensagem").textContent = "Depósito confirmado! Agora você pode jogar XD.";

        musicaDeposito(); // Chama a função de música do deposito
    });

    document.getElementById("girar").addEventListener("click", () => {
        const linhas = parseInt(document.getElementById("linhas").value);
        const aposta = parseInt(document.getElementById("aposta").value);

        if (aposta <= 0 || aposta * linhas > balanco) {
            document.getElementById("mensagem").textContent = "Aposta inválida! Valor insuficiente!";
            return;
        }

        balanco -= aposta * linhas;

        const resultado = girarMaquina();
        exibirResultado(resultado);

        const vitorias = calcularVitoria(resultado, aposta, linhas);
        balanco += vitorias;

        document.getElementById("mensagem").textContent = vitorias > 0 ? `Você ganhou $${vitorias}! :'(` : "Sem vitórias desta vez haha XD!";
        atualizarBalanco();

        if (balanco <= 0) {
            document.getElementById("mensagem").textContent = "Você está sem dinheiro! XD";
            document.getElementById("girar").disabled = true;
        }

        musicaGirar(); // Chama a função de música do deposito
    });

    document.getElementById("sair").addEventListener("click", () => {
        window.close(); // Fecha a janela ou aba do navegador
    });

    atualizarBalanco();
});
