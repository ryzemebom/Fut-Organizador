function carregarEstatisticasOrdenadas() {
    const lista = document.getElementById('listaEstatisticas');
    if (!lista) return;
    lista.innerHTML = '';

    // Pega dados (usa globais se existirem; senão, localStorage)
    const jogadoresData = (typeof jogadores !== 'undefined' ? jogadores : JSON.parse(localStorage.getItem('jogadores')) || []);
    const estatData     = (typeof estatisticas !== 'undefined' ? estatisticas : JSON.parse(localStorage.getItem('estatisticas')) || []);

    // Agrega por jogador_id: soma gols e assistências de TODOS os babas
    const agregado = new Map();
    estatData.forEach(e => {
        const j = jogadoresData.find(x => x.id === e.jogador_id);
        if (!j) return;

        if (!agregado.has(j.id)) {
            agregado.set(j.id, { jogador_id: j.id, nome: j.nome, gols: 0, assistencias: 0 });
        }
        const item = agregado.get(j.id);
        item.gols += Number(e.gols || 0);
        item.assistencias += Number(e.assistencias || 0);
    });

    // Converte para array e ordena por (gols + assistências), depois desempata por gols
    const ranking = Array.from(agregado.values()).sort((a, b) => {
        const totalA = a.gols + a.assistencias;
        const totalB = b.gols + b.assistencias;
        if (totalB !== totalA) return totalB - totalA;
        return b.gols - a.gols; // desempate por gols
    });

    // Renderiza
    ranking.forEach(item => {
        const total = item.gols + item.assistencias;
        const li = document.createElement('li');
        li.textContent = `${item.nome} — ⚽ ${item.gols} | 🎯 ${item.assistencias} | 🔢 Total: ${total}`;
        lista.appendChild(li);
    });
}

// carrega ao abrir a página de estatísticas
document.addEventListener('DOMContentLoaded', carregarEstatisticasOrdenadas);
