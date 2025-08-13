function adicionarJogador() {
    const nome = document.getElementById('nomeJogador').value.trim();
    const nivel = parseInt(document.getElementById('nivelJogador').value);

    if(!nome) return alert("Digite o nome do jogador.");

    const jogador = { id: gerarId(jogadores), nome, nivel };
    jogadores.push(jogador);
    salvarDados();
    carregarListaJogadores();
    document.getElementById('nomeJogador').value = '';
}

function carregarListaJogadores() {
    const lista = document.getElementById('listaJogadores');
    if(!lista) return;
    lista.innerHTML = '';

    jogadores.forEach(j => {
        const li = document.createElement('li');
        li.innerHTML = `${j.nome} (${j.nivel}⭐) <button onclick="removerJogador(${j.id})">🗑</button>`;
        lista.appendChild(li);
    });
}

// Chamada ao carregar a página
document.addEventListener("DOMContentLoaded", carregarListaJogadores);


function removerJogador(id) {
    if(!confirm("Remover jogador permanentemente?")) return;
    jogadores = jogadores.filter(j => j.id !== id);
    // Remover jogador de Babas existentes
    babas.forEach(b => b.jogadores = b.jogadores.filter(jid => jid !== id));
    // Remover estatísticas
    estatisticas = estatisticas.filter(e => e.jogador_id !== id);
    salvarDados();
    carregarListaJogadores();
}
