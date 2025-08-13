let jogadores = JSON.parse(localStorage.getItem('jogadores') || "[]");
let babas = JSON.parse(localStorage.getItem('babas') || "[]");
let estatisticas = JSON.parse(localStorage.getItem('estatisticas') || "[]");

function salvarDados() {
    localStorage.setItem("jogadores", JSON.stringify(jogadores));
    localStorage.setItem("babas", JSON.stringify(babas));
    localStorage.setItem("estatisticas", JSON.stringify(estatisticas));
}

// Mostrar tela
function mostrarTela(tela) {
    document.getElementById("dashboard").style.display = "none";
    document.querySelectorAll(".tela").forEach(div => div.style.display = "none");

    document.getElementById(`tela-${tela}`).style.display = "block";

    if(tela === 'jogadores') carregarTelaJogadores();
    if(tela === 'babas') carregarTelaBabas();
    if(tela === 'estatisticas') carregarTelaEstatisticas();
}

// Voltar ao dashboard
function voltarDashboard() {
    document.querySelectorAll(".tela").forEach(div => div.style.display = "none");
    document.getElementById("dashboard").style.display = "grid";
}

// --- Jogadores ---


// Adicionar jogador
function adicionarJogador() {
    const nome = document.getElementById("nomeJogador").value.trim();
    const nivel = parseInt(document.getElementById("nivelJogador").value);

    if(!nome){ alert("Preencha o nome do jogador!"); return; }

    const id = Date.now();
    jogadores.push({id, nome, nivel});
    salvarDados();
    carregarTelaJogadores();
    document.getElementById("nomeJogador").value = ""; // limpa campo
}

// Listar jogadores
function carregarTelaJogadores() {
    const lista = document.getElementById("listaJogadores");
    lista.innerHTML = "";

    jogadores.forEach(j => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${j.nome} (${j.nivel}⭐)
            <button onclick="removerJogador(${j.id})">🗑 Remover</button>
        `;
        lista.appendChild(li);
    });
}

// Remover jogador
function removerJogador(jogadorId) {
    if(!confirm("Tem certeza que deseja remover este jogador?")) return;

    // Remove jogador
    jogadores = jogadores.filter(j => j.id !== jogadorId);

    // Remove estatísticas
    estatisticas = estatisticas.filter(e => e.jogador_id !== jogadorId);

    // Remove jogador dos babas
    babas.forEach(b => {
        b.jogadores = b.jogadores.filter(id => id !== jogadorId);
        if(b.times){
            b.times.forEach(time => {
                for(let i = time.length-1; i>=0; i--){
                    if(time[i].id === jogadorId) time.splice(i,1);
                }
            });
        }
    });

    salvarDados();
    carregarTelaJogadores();
}


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
    if(!stat){
        stat = {baba_id: babaId, jogador_id: jogadorId, gols: 0, assistencias: 0};
        estatisticas.push(stat);
    }
    stat.gols = parseInt(valor) || 0;
    salvarDados();
}

function atualizarAssistencias(babaId, jogadorId, valor){
    let stat = estatisticas.find(e => e.baba_id === babaId && e.jogador_id === jogadorId);
    if(!stat){
        stat = {baba_id: babaId, jogador_id: jogadorId, gols: 0, assistencias: 0};
        estatisticas.push(stat);
    }
    stat.assistencias = parseInt(valor) || 0;
    salvarDados();
}


// Salvar dados
function salvarDados() {
    localStorage.setItem("jogadores", JSON.stringify(jogadores));
    localStorage.setItem("babas", JSON.stringify(babas));
    localStorage.setItem("estatisticas", JSON.stringify(estatisticas));
}



function adicionarJogador() {
    const nome = document.getElementById("nomeJogador").value;
    const nivel = parseInt(document.getElementById("nivelJogador").value);
    if(!nome){ alert("Digite o nome do jogador!"); return; }
    jogadores.push({id: Date.now(), nome, nivel});
    salvarDados();
    document.getElementById("nomeJogador").value = "";
    atualizarListaJogadores();
}

function atualizarListaJogadores() {
    const lista = document.getElementById("listaJogadores");
    lista.innerHTML = "";
    jogadores.forEach(j => {
        const li = document.createElement("li");
        li.textContent = `${j.nome} - ${"⭐".repeat(j.nivel)}`;
        lista.appendChild(li);
    });
}

// --- Babas ---
function carregarTelaBabas() {
    const tela = document.getElementById("tela-babas");
    tela.innerHTML = `
        <button onclick="voltarDashboard()">⬅ Voltar</button><br>
        <h2>Criar e Gerenciar Babas</h2>
        <div class="tela-section">
            <h3>Criar Baba</h3>
            <input type="text" id="nomeBaba" placeholder="Nome do baba">
            <input type="date" id="dataBaba">
            <input type="text" id="localBaba" placeholder="Local">
            <h4>Selecione os jogadores:</h4>
            <div id="listaJogadoresSelecao"></div>
            <button onclick="criarBaba()">Criar Baba</button>
        </div>
        <div class="tela-section">
            <h3>Lista de Babas</h3>
            <ul id="listaBabas"></ul>
        </div>
    `;
    atualizarListaBabas();
}


function atualizarListaBabas() {
    const listaSelecao = document.getElementById("listaJogadoresSelecao");
    listaSelecao.innerHTML = "";
    jogadores.forEach(j => {
        const label = document.createElement("label");
        const cb = document.createElement("input");
        cb.type="checkbox"; cb.value=j.id;
        label.appendChild(cb);
        label.append(` ${j.nome} (${j.nivel}⭐)`);
        listaSelecao.appendChild(label);
    });

    const listaBabas = document.getElementById("listaBabas");
    listaBabas.innerHTML = "";
    babas.forEach(b => {
        const li = document.createElement("li");
        li.innerHTML = `${b.nome} - ${b.data} - ${b.local} 
        <button onclick="gerenciarBaba(${b.id})">Gerenciar</button>`;
        listaBabas.appendChild(li);
    });
}

function criarBaba() {
    const nome = document.getElementById("nomeBaba").value;
    const data = document.getElementById("dataBaba").value;
    const local = document.getElementById("localBaba").value;
    const selecionados = Array.from(document.querySelectorAll("#listaJogadoresSelecao input:checked")).map(cb=>parseInt(cb.value));

    if(!nome || !data){ alert("Preencha nome e data!"); return; }
    if(selecionados.length===0){ alert("Selecione pelo menos 1 jogador!"); return; }

    const baba = {id: Date.now(), nome, data, local, jogadores: selecionados};
    babas.push(baba);
    selecionados.forEach(id => estatisticas.push({baba_id:baba.id, jogador_id:id, gols:0, assistencias:0}));
    salvarDados();
    atualizarListaBabas();
}

function gerenciarBaba(babaId) {
    localStorage.setItem('telaAtual', 'gerenciarBaba');
    localStorage.setItem('babaAtual', babaId);
    const baba = babas.find(b => b.id === babaId);
    const tela = document.getElementById("tela-babas");
    tela.innerHTML = `
        <button onclick="carregarTelaBabas()">⬅ Voltar</button>
        <h2>Gerenciar Baba: ${baba.nome}</h2>
        <p>📅 ${baba.data} | 📍 ${baba.local}</p>

        <div class="tela-section">
            <h3>Sortear Times</h3>
            <label>Número de times:</label>
            <input type="number" id="numTimes" value="2" min="2" max="${baba.jogadores.length}">
            <button onclick="sortearTimes(${baba.id})">Sortear</button>
        </div>

        <div class="tela-section">
            <h3>Jogadores do Baba</h3>
            <ul id="listaJogadoresBaba"></ul>
        </div>

        <div class="tela-section">
            <h3>Times Sorteados</h3>
            <div id="timesSorteados" class="babas-grid"></div>
        </div>
    `;

    // Lista de jogadores
    const lista = document.getElementById("listaJogadoresBaba");
    baba.jogadores.forEach(id => {
        const j = jogadores.find(j => j.id === id);
        const li = document.createElement("li");
        li.textContent = `${j.nome} (${j.nivel}⭐)`;
        lista.appendChild(li);
    });

    // Mostrar times salvos, se houver
    mostrarTimes(baba);
}


function addGol(baba_id,jogador_id){
    estatisticas.find(e=>e.baba_id===baba_id && e.jogador_id===jogador_id).gols++;
    salvarDados();
    gerenciarBaba(baba_id);
}

function addAssist(baba_id,jogador_id){
    estatisticas.find(e=>e.baba_id===baba_id && e.jogador_id===jogador_id).assistencias++;
    salvarDados();
    gerenciarBaba(baba_id);
}

// --- Estatísticas ---
function carregarTelaEstatisticas() {
    const tela = document.getElementById("tela-estatisticas");
    tela.innerHTML = `<button onclick="voltarDashboard()">⬅ Voltar</button><h2>Estatísticas</h2>`;
    if(estatisticas.length === 0){
        tela.innerHTML += "<p>Nenhuma estatística registrada.</p>";
        return;
    }

    const section = document.createElement("div");
    section.classList.add("tela-section");

    estatisticas.forEach(e => {
        const j = jogadores.find(j=>j.id===e.jogador_id);
        const card = document.createElement("div");
        card.className = "estatistica-card";
        card.innerHTML = `<p>${j.nome}</p><p>Gols: ${e.gols}</p><p>Assistências: ${e.assistencias}</p>`;
        section.appendChild(card);
    });

    tela.appendChild(section);
}

// Mostrar tela
function mostrarTela(tela) {
    document.getElementById("dashboard").style.display = "none";
    document.querySelectorAll(".tela").forEach(div => div.style.display = "none");

    document.getElementById(`tela-${tela}`).style.display = "block";

    if(tela === 'jogadores') carregarTelaJogadores();
    if(tela === 'babas') carregarTelaBabas();
    if(tela === 'estatisticas') carregarTelaEstatisticas();
}

// Voltar ao dashboard
function voltarDashboard() {
    document.querySelectorAll(".tela").forEach(div => div.style.display = "none");
    document.getElementById("dashboard").style.display = "grid";
}

// --- Tela Babas ---
function carregarTelaBabas() {
    const tela = document.getElementById("tela-babas");
    tela.innerHTML = `
        <button onclick="voltarDashboard()">⬅ Voltar</button>
        <h2>Babas - Painel Separado</h2>
        <div class="tela-section">
            <h3>Criar Baba</h3>
            <input type="text" id="nomeBaba" placeholder="Nome do baba">
            <input type="date" id="dataBaba">
            <input type="text" id="localBaba" placeholder="Local">
            <h4>Selecione os jogadores:</h4>
            <div id="listaJogadoresSelecao"></div>
            <button onclick="criarBaba()">Criar Baba</button>
        </div>
        <div class="tela-section">
            <h3>Lista de Babas</h3>
            <div id="listaBabas" class="babas-grid"></div>
        </div>
    `;
    atualizarListaBabas();
}



function atualizarListaBabas() {
    const listaSelecao = document.getElementById("listaJogadoresSelecao");
    listaSelecao.innerHTML = "";
    jogadores.forEach(j => {
        const label = document.createElement("label");
        const cb = document.createElement("input");
        cb.type="checkbox"; cb.value=j.id;
        label.appendChild(cb);
        label.append(` ${j.nome} (${j.nivel}⭐)`);
        listaSelecao.appendChild(label);
    });

    const listaBabas = document.getElementById("listaBabas");
    listaBabas.innerHTML = "";

    babas.forEach(b => {
        const card = document.createElement("div");
        card.className = "baba-card";
        card.innerHTML = `
            <h4>${b.nome}</h4>
            <p>📅 ${b.data}</p>
            <p>📍 ${b.local}</p>
            <button onclick="gerenciarBaba(${b.id})">Gerenciar</button>
        `;
        listaBabas.appendChild(card);
    });
}


// Criar Baba
function criarBaba() {
    const nome = document.getElementById("nomeBaba").value;
    const data = document.getElementById("dataBaba").value;
    const local = document.getElementById("localBaba").value;
    const selecionados = Array.from(document.querySelectorAll("#listaJogadoresSelecao input:checked")).map(cb=>parseInt(cb.value));

    if(!nome || !data){ alert("Preencha nome e data!"); return; }
    if(selecionados.length===0){ alert("Selecione pelo menos 1 jogador!"); return; }

    const baba = {id: Date.now(), nome, data, local, jogadores: selecionados};
    babas.push(baba);
    selecionados.forEach(id => estatisticas.push({baba_id:baba.id, jogador_id:id, gols:0, assistencias:0}));
    salvarDados();
    atualizarListaBabas();
}


function sortearTimes(babaId) {
    const baba = babas.find(b => b.id === babaId);
    let numTimes = parseInt(document.getElementById("numTimes").value);

    // Garantir no mínimo 2 times
    if(numTimes < 2) numTimes = 2;

    const jogadoresBaba = baba.jogadores.map(id => jogadores.find(j => j.id === id));

    // Limitar número de jogadores por time a 4
    const maxPorTime = 4;
    const maxTimesPossiveis = Math.ceil(jogadoresBaba.length / maxPorTime);
    if(numTimes > maxTimesPossiveis) numTimes = maxTimesPossiveis;

    // Embaralhar jogadores
    jogadoresBaba.sort(() => Math.random() - 0.5);

    // Distribuir jogadores nos times
    const times = Array.from({length: numTimes}, () => []);
    jogadoresBaba.forEach((j, i) => {
        times[i % numTimes].push(j);
    });

    // Salvar no baba
    baba.times = times;
    salvarDados(); // função que salva no localStorage ou backend

    // Mostrar os times
    mostrarTimes(baba);
}

function mostrarTimes(baba) {
    const container = document.getElementById("timesSorteados");
    container.innerHTML = "";

    if(!baba.times) return; // se ainda não foi sorteado

    baba.times.forEach((time, i) => {
        const card = document.createElement("div");
        card.className = "baba-card";
        let html = `<h4>Time ${i+1}</h4>`;
        time.forEach(j => html += `<p>${j.nome} (${j.nivel}⭐)</p>`);
        card.innerHTML = html;
        container.appendChild(card);
    });
}
