// LISTA OFICIAL DO GRUPO
let elencoJogadores = [
  "DANDÃO", "GUSTAVO", "FLAVINHO", "EVERTON", "MARCOS", 
  "MARRECO", "DECO", "DANIEL", "TIO DINHO", "ERIC", 
  "GUSTAVO VALESCA", "JOSUE", "IGOR", "MARCOS GRANIÇO", 
  "MARINALDO", "ROZA", "THIAGO", "FABRICIO", "CESAR", "BARBA"
];

// ESTRUTURA DE ESTATÍSTICAS E FINANCEIRO
let estatisticas = {};
let financeiro = {};
let jogadorLogadoAtual = null;

elencoJogadores.forEach(j => {
  estatisticas[j] = { gols: 0, assist: 0 };
  financeiro[j] = { presencas: 0, faltas: 0, mensalidade: "Pendente" };
});

const telaLogin = document.getElementById('tela-login');
const appPrincipal = document.getElementById('app-principal');
const formLogin = document.getElementById('form-login');
const saudacaoUsuario = document.getElementById('saudacao-usuario');
const btnLogout = document.getElementById('btn-logout');
const badgeAdmin = document.getElementById('badge-admin-tag');
const painelAdminStats = document.getElementById('painel-admin-stats');
const painelAdminElenco = document.getElementById('painel-admin-elenco');
const painelAdminFinanceiro = document.getElementById('painel-admin-financeiro');
const cardPerfilJogador = document.getElementById('card-perfil-jogador');

// LOGIN DINÂMICO
formLogin.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim().toLowerCase();
  const senha = document.getElementById('senha').value;

  if (email === 'admin@afc.com' && senha === '123') {
    fazerLogin('Administrador Marcos', 'admin');
  } else {
    // Permite login de qualquer jogador usando "nome@afc.com"
    const nomeExtraido = email.split('@')[0].toUpperCase();
    const jogadorEncontrado = elencoJogadores.find(j => j.replace(/\s+/g, '') === nomeExtraido);

    if (jogadorEncontrado && senha === '123') {
      fazerLogin(jogadorEncontrado, 'jogador');
    } else {
      alert('E-mail ou senha incorretos! Dica: use nome@afc.com e senha 123');
    }
  }
});

function fazerLogin(nome, tipo) {
  telaLogin.classList.add('hidden');
  appPrincipal.classList.remove('hidden');
  saudacaoUsuario.textContent = `Olá, ${nome}`;

  if (tipo === 'admin') {
    jogadorLogadoAtual = null;
    badgeAdmin.classList.remove('hidden');
    painelAdminStats.classList.remove('hidden');
    painelAdminElenco.classList.remove('hidden');
    painelAdminFinanceiro.classList.remove('hidden');
    cardPerfilJogador.classList.add('hidden'); // Esconde card pessoal do admin
    inicializarDragAndDrop();
  } else {
    jogadorLogadoAtual = nome;
    badgeAdmin.classList.add('hidden');
    painelAdminStats.classList.add('hidden');
    painelAdminElenco.classList.add('hidden');
    painelAdminFinanceiro.classList.add('hidden');
    cardPerfilJogador.classList.remove('hidden'); // Exibe card pessoal do jogador
    atualizarCardPerfilJogador(nome);
  }

  carregarInterface();
}

btnLogout.addEventListener('click', () => {
  appPrincipal.classList.add('hidden');
  telaLogin.classList.remove('hidden');
  document.getElementById('email').value = '';
  document.getElementById('senha').value = '';
});

// ATUALIZAR CARD PERSONALIZADO DO JOGADOR
function atualizarCardPerfilJogador(nome) {
  const elMensalidade = document.getElementById('perfil-mensalidade');
  const elGols = document.getElementById('perfil-gols');
  const elAssist = document.getElementById('perfil-assist');
  const elFreq = document.getElementById('perfil-frequencia');

  const status = financeiro[nome].mensalidade;
  elMensalidade.textContent = status === 'Pago' ? 'Pago ✅' : 'Pendente ❌';
  elMensalidade.style.color = status === 'Pago' ? '#10b981' : '#ef4444';

  elGols.textContent = estatisticas[nome].gols;
  elAssist.textContent = estatisticas[nome].assist;
  elFreq.textContent = `${financeiro[nome].presencas} / ${financeiro[nome].faltas}`;
}

// ABAS
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.add('hidden'));

    btn.classList.add('active');
    const targetTab = btn.getAttribute('data-tab');
    document.getElementById(targetTab).classList.remove('hidden');
  });
});

// DESENHAR DADOS NA TELA
function carregarInterface() {
  // 1. Lista de Escalação
  const divDisponiveis = document.getElementById('disponiveis');
  divDisponiveis.innerHTML = '';
  elencoJogadores.forEach(nome => {
    divDisponiveis.innerHTML += `<div class="jogador">${nome}</div>`;
  });

  // 2. Lista Geral do Elenco
  const ulElenco = document.getElementById('lista-elenco-completa');
  ulElenco.innerHTML = '';
  elencoJogadores.forEach(nome => {
    ulElenco.innerHTML += `<li><strong>${nome}</strong> — Amigos F.C.</li>`;
  });

  // 3. Seletores Admin
  const selectStats = document.getElementById('select-jogador-stats');
  const selectFinanceiro = document.getElementById('select-jogador-financeiro');
  
  selectStats.innerHTML = '';
  selectFinanceiro.innerHTML = '';

  elencoJogadores.forEach(nome => {
    selectStats.innerHTML += `<option value="${nome}">${nome}</option>`;
    selectFinanceiro.innerHTML += `<option value="${nome}">${nome}</option>`;
  });

  // 4. Tabelas
  atualizarTabelaArtilharia();
  atualizarTabelaFinanceiro();
}

function atualizarTabelaArtilharia() {
  const tbody = document.getElementById('tabela-artilharia');
  tbody.innerHTML = '';

  const ordenados = [...elencoJogadores].sort((a, b) => estatisticas[b].gols - estatisticas[a].gols);

  ordenados.forEach(nome => {
    tbody.innerHTML += `
      <tr>
        <td>${nome}</td>
        <td><strong>${estatisticas[nome].gols}</strong></td>
        <td>${estatisticas[nome].assist}</td>
      </tr>
    `;
  });
}

function atualizarTabelaFinanceiro() {
  const tbody = document.getElementById('tabela-financeiro');
  tbody.innerHTML = '';

  elencoJogadores.forEach(nome => {
    const status = financeiro[nome].mensalidade;
    const corStatus = status === 'Pago' ? '#10b981' : '#ef4444';

    tbody.innerHTML += `
      <tr>
        <td><strong>${nome}</strong></td>
        <td>${financeiro[nome].presencas}</td>
        <td>${financeiro[nome].faltas}</td>
        <td style="color: ${corStatus}; font-weight: bold;">${status}</td>
      </tr>
    `;
  });
}

// CADASTRAR NOVO JOGADOR (ADMIN)
const formAdd = document.getElementById('form-add-jogador');
if (formAdd) {
  formAdd.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputNome = document.getElementById('novo-nome-jogador');
    const novoNome = inputNome.value.trim().toUpperCase();

    if (novoNome && !elencoJogadores.includes(novoNome)) {
      elencoJogadores.push(novoNome);
      estatisticas[novoNome] = { gols: 0, assist: 0 };
      financeiro[novoNome] = { presencas: 0, faltas: 0, mensalidade: "Pendente" };
      inputNome.value = '';
      carregarInterface();
      alert(`${novoNome} adicionado ao elenco!`);
    }
  });
}

// LANÇAR ESTATÍSTICAS (ADMIN)
const formStats = document.getElementById('form-registrar-stats');
if (formStats) {
  formStats.addEventListener('submit', (e) => {
    e.preventDefault();
    const jogador = document.getElementById('select-jogador-stats').value;
    const novosGols = parseInt(document.getElementById('input-gols').value) || 0;
    const novasAssist = parseInt(document.getElementById('input-assist').value) || 0;

    if (estatisticas[jogador]) {
      estatisticas[jogador].gols += novosGols;
      estatisticas[jogador].assist += novasAssist;
      atualizarTabelaArtilharia();
      
      if (jogadorLogadoAtual === jogador) {
        atualizarCardPerfilJogador(jogador);
      }

      alert(`Registrado ${novosGols} gol(s) e ${novasAssist} assistência(s) para ${jogador}!`);
    }
  });
}

// LANÇAR FINANCEIRO & PRESENÇA (ADMIN)
const formFinanceiro = document.getElementById('form-registrar-financeiro');
if (formFinanceiro) {
  formFinanceiro.addEventListener('submit', (e) => {
    e.preventDefault();
    const jogador = document.getElementById('select-jogador-financeiro').value;
    const freq = document.getElementById('select-frequencia').value;
    const mensalidade = document.getElementById('select-mensalidade').value;

    if (financeiro[jogador]) {
      if (freq === 'presenca') {
        financeiro[jogador].presencas += 1;
      } else {
        financeiro[jogador].faltas += 1;
      }

      financeiro[jogador].mensalidade = mensalidade;
      atualizarTabelaFinanceiro();

      if (jogadorLogadoAtual === jogador) {
        atualizarCardPerfilJogador(jogador);
      }

      alert(`Atualizado registro de ${jogador}!`);
    }
  });
}

// DRAG AND DROP
function inicializarDragAndDrop() {
  const opcoesSortable = { group: 'jogadores', animation: 150 };
  new Sortable(document.getElementById('disponiveis'), opcoesSortable);
  new Sortable(document.getElementById('time-azul'), opcoesSortable);
  new Sortable(document.getElementById('time-preto'), opcoesSortable);
}