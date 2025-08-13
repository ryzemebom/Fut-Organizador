document.addEventListener("DOMContentLoaded", () => {
    carregarSelectBabas();
    carregarJogadoresDisponiveis();
});

// Criar Baba
function criarBaba() {
    const nome = document.getElementById('nomeBaba').value.trim();
    const data = document.getElementById('dataBaba').value;
    const local = document.getElementById('localBaba').value.trim();

    if(!nome || !data || !local) return alert("Preencha todos os campos.");

    const baba = { id: gerarId(babas), nome, data, local, jogadores: [], times: [] };
    babas.push(baba);
    salvarDados();
    document.getElementById('nomeBaba').value = '';
    carregarSelectBabas();
}

// Carregar select de Babas
function carregarSelectBabas() {
    const select = document.getElementById('selectBaba');
    if(!select) return;

    select.innerHTML = '';

    if(babas.length === 0){
        const option = document.createElement('option');
        option.textContent = "Nenhum Baba cadastrado";
        select.appendChild(option);
        document.getElementById('listaJogadoresBaba').innerHTML = '';
        document.getElementById('timesBaba').innerHTML = '';
        return;
    }

    babas.forEach(b => {
        const option = document.createElement('option');
        option.value = b.id;
        option.textContent = `${b.nome} - ${b.data}`;
        select.appendChild(option);
    });

    select.selectedIndex = 0;
    carregarBaba();
}

// Carregar jogadores disponíveis
function carregarJogadoresDisponiveis() {
    const container = document.getElementById('listaJogadoresDisponiveis');
    if(!container) return;
    container.innerHTML = '';

    jogadores.forEach(j => {
        const checkbox = document.createElement('div');
        checkbox.innerHTML = `
            <input type="checkbox" id="jogador-${j.id}" value="${j.id}">
            <label for="jogador-${j.id}">${j.nome} (${j.nivel}⭐)</label>
        `;
        container.appendChild(checkbox);
    });
}

// Adicionar jogadores ao Baba
function adicionarJogadoresAoBaba() {
    const select = document.getElementById('selectBaba');
    const babaId = parseInt(select.value);
    const baba = babas.find(b => b.id === babaId);
    if(!baba) return;

    const checkboxes = document.querySelectorAll('#listaJogadoresDisponiveis input[type="checkbox"]:checked');
    checkboxes.forEach(cb => {
        const jogadorId = parseInt(cb.value);
        if(!baba.jogadores.includes(jogadorId)) baba.jogadores.push(jogadorId);
        cb.checked = false;
    });

    salvarDados();
    carregarBaba();
}

// Carregar Baba selecionado
function carregarBaba() {
    const select = document.getElementById('selectBaba');
    if(!select) return;
    const babaId = parseInt(select.value);
    const baba = babas.find(b => b.id === babaId);
    if(!baba) return;

    const lista = document.getElementById('listaJogadoresBaba');
    lista.innerHTML = '';
    baba.jogadores.forEach(id => {
        const jogador = jogadores.find(j => j.id === id);
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${jogador.nome} (${jogador.nivel}⭐)</span>
            <input type="number" min="0" value="${getGols(baba.id, jogador.id)}" placeholder="Gols" onchange="atualizarGols(${baba.id}, ${jogador.id}, this.value)">
            <input type="number" min="0" value="${getAssistencias(baba.id, jogador.id)}" placeholder="Assistências" onchange="atualizarAssistencias(${baba.id}, ${jogador.id}, this.value)">
            <button onclick="removerJogadorDoBaba(${baba.id}, ${jogador.id})">🗑</button>
        `;
        lista.appendChild(li);
    });

    mostrarTimes(baba);
}

// Gols e assistências
function getGols(babaId, jogadorId){
    const stat = estatisticas.find(e => e.baba_id === babaId && e.jogador_id === jogadorId);
    return stat ? stat.gols : 0;
}
function getAssistencias(babaId, jogadorId){
    const stat = estatisticas.find(e => e.baba_id === babaId && e.jogador_id === jogadorId);
    return stat ? stat.assistencias : 0;
}
function atualizarGols(babaId, jogadorId, valor){
    let stat = estatisticas.find(e => e.baba_id === babaId && e.jogador_id === jogadorId);
    if(!stat){ stat = {baba_id: babaId, jogador_id: jogadorId, gols:0, assistencias:0}; estatisticas.push(stat); }
    stat.gols = parseInt(valor)||0;
    salvarDados();
}
function atualizarAssistencias(babaId, jogadorId, valor){
    let stat = estatisticas.find(e => e.baba_id === babaId && e.jogador_id === jogadorId);
    if(!stat){ stat = {baba_id: babaId, jogador_id: jogadorId, gols:0, assistencias:0}; estatisticas.push(stat); }
    stat.assistencias = parseInt(valor)||0;
    salvarDados();
}

// Remover jogador do Baba
function removerJogadorDoBaba(babaId, jogadorId){
    const baba = babas.find(b => b.id === babaId);
    baba.jogadores = baba.jogadores.filter(id => id!==jogadorId);
    if(baba.times) baba.times.forEach(time=>{ for(let i=time.length-1;i>=0;i--){ if(time[i].id===jogadorId) time.splice(i,1); } });
    salvarDados();
    carregarBaba();
}

// Sortear times (máx 4 jogadores por time)
function sortearTimesSelecionado(){
    const select = document.getElementById('selectBaba');
    const babaId = parseInt(select.value);
    const numTimes = parseInt(document.getElementById('numTimes').value) || 2;
    sortearTimes(babaId,numTimes);
}
function sortearTimes(babaId,numTimes){
    const baba = babas.find(b => b.id===babaId);
    const jogadoresBaba = baba.jogadores.map(id=>jogadores.find(j=>j.id===id));
    const maxPorTime = 4;
    const maxTimes = Math.ceil(jogadoresBaba.length/maxPorTime);
    if(numTimes>maxTimes) numTimes=maxTimes;

    jogadoresBaba.sort(()=>Math.random()-0.5);
    const times = Array.from({length:numTimes},()=>[]);
    jogadoresBaba.forEach((j,i)=>times[i%numTimes].push(j));

    baba.times = times;
    salvarDados();
    mostrarTimes(baba);
}
function mostrarTimes(baba){
    const container = document.getElementById('timesBaba');
    if(!container) return;
    container.innerHTML = '';
    if(!baba.times) return;
    baba.times.forEach((time,index)=>{
        const div=document.createElement('div');
        div.className='baba-card';
        div.innerHTML=`<h4>Time ${index+1}</h4>${time.map(j=>`<p>${j.nome} (${j.nivel}⭐)</p>`).join('')}`;
        container.appendChild(div);
    });
}
function removerBabaSelecionado() {
    const select = document.getElementById('selectBaba');
    const babaId = parseInt(select.value);
    if(!babaId) return;

    const confirmDelete = confirm("Tem certeza que deseja apagar este Baba?");
    if(!confirmDelete) return;

    // Remove o Baba do array
    babas = babas.filter(b => b.id !== babaId);

    // Remove estatísticas relacionadas
    estatisticas = estatisticas.filter(e => e.baba_id !== babaId);

    salvarDados();
    carregarSelectBabas();
}
