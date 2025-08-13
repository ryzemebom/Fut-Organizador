// Arrays principais
let jogadores = [];
let babas = [];
let estatisticas = [];

// Carregar dados do localStorage
function carregarDados() {
    jogadores = JSON.parse(localStorage.getItem('jogadores')) || [];
    babas = JSON.parse(localStorage.getItem('babas')) || [];
    estatisticas = JSON.parse(localStorage.getItem('estatisticas')) || [];
}

// Salvar dados no localStorage
function salvarDados() {
    localStorage.setItem('jogadores', JSON.stringify(jogadores));
    localStorage.setItem('babas', JSON.stringify(babas));
    localStorage.setItem('estatisticas', JSON.stringify(estatisticas));
}

// Função auxiliar para gerar ID único
function gerarId(array) {
    return array.length > 0 ? Math.max(...array.map(item => item.id)) + 1 : 1;
}

// Inicializa os dados ao carregar a página
document.addEventListener("DOMContentLoaded", carregarDados);
