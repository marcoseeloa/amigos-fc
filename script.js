/* --- AUTENTICAÇÃO E NAVEGAÇÃO --- */

function realizarLogin(event) {
  event.preventDefault();
  
  const usuarioInput = document.getElementById('usuario').value.toLowerCase().trim();
  
  if (usuarioInput) {
    document.getElementById('tela-login').style.display = 'none';
    document.getElementById('app-principal').style.display = 'flex';
    
    const nomeExibicao = usuarioInput.split('@')[0];
    document.getElementById('nome-usuario-header').textContent = nomeExibicao.toUpperCase();

    const badgeAdmin = document.querySelector('.badge-admin');
    
    if (usuarioInput === 'admin@afc.com') {
      badgeAdmin.style.display = 'inline-block';
      badgeAdmin.textContent = 'Modo Administrador';
      document.body.classList.add('is-admin');
    } else {
      badgeAdmin.style.display = 'none';
      document.body.classList.remove('is-admin');
    }

    const primeiroBotao = document.querySelector('.bottom-nav .nav-item');
    mostrarSecao('escalacao', primeiroBotao);

    carregarPresencasPorData();
    atualizarHistoricoPresencas();
  }
}

function fazerLogout() {
  document.getElementById('app-principal').style.display = 'none';
  document.getElementById('tela-login').style.display = 'flex';
  document.getElementById('form-login').reset();
  document.body.classList.remove('is-admin');
}

function mostrarSecao(secaoId, elementoClicado) {
  const secoes = document.querySelectorAll('.secao-conteudo');
  secoes.forEach(secao => {
    secao.style.display = 'none';
  });

  const botoes = document.querySelectorAll('.nav-item');
  botoes.forEach(btn => {
    btn.classList.remove('active');
  });

  const secaoAlvo = document.getElementById(secaoId);
  if (secaoAlvo) {
    secaoAlvo.style.display = 'flex';
  }

  if (elementoClicado) {
    elementoClicado.classList.add('active');
  }

  if (secaoId === 'estatisticas') {
    atualizarHistoricoPresencas();
  }
}

/* --- LÓGICA DE PRESENÇA (COM LIMPEZA E CARREGAMENTO POR DATA) --- */

function marcarPresenca(botao, tipo) {
  const tr = botao.closest('tr');
  const btnP = tr.querySelector('.p-btn');
  const btnF = tr.querySelector('.f-btn');
  const statusP = tr.querySelector('.status-p');
  const statusF = tr.querySelector('.status-f');

  if (botao.classList.contains('active')) {
    limparLinhaJogador(tr);
  } else {
    if (tipo === 'P') {
      btnP.classList.add('active');
      btnF.classList.remove('active');
      statusP.textContent = 'P';
      statusP.classList.remove('off');
      statusF.textContent = '-';
      statusF.classList.add('off');
    } else if (tipo === 'F') {
      btnF.classList.add('active');
      btnP.classList.remove('active');
      statusF.textContent = 'F';
      statusF.classList.remove('off');
      statusP.textContent = '-';
      statusP.classList.add('off');
    }
  }

  atualizarContadorPresenca();
}

function limparLinhaJogador(tr) {
  const btnP = tr.querySelector('.p-btn');
  const btnF = tr.querySelector('.f-btn');
  const statusP = tr.querySelector('.status-p');
  const statusF = tr.querySelector('.status-f');

  if (btnP) btnP.classList.remove('active');
  if (btnF) btnF.classList.remove('active');
  if (statusP) { statusP.textContent = '-'; statusP.classList.add('off'); }
  if (statusF) { statusF.textContent = '-'; statusF.classList.add('off'); }
}

function zerarTabelaPresenca() {
  const linhas = document.querySelectorAll('#lista-jogadores-presenca tr');
  linhas.forEach(tr => limparLinhaJogador(tr));
  atualizarContadorPresenca();
}

function atualizarContadorPresenca() {
  const confirmados = document.querySelectorAll('#lista-jogadores-presenca .status-p:not(.off)').length;
  const contador = document.getElementById('total-confirmados');
  if (contador) contador.textContent = confirmados;
}

function salvarListaPresenca() {
  const inputData = document.getElementById('data-pelada');
  if (!inputData || !inputData.value) {
    alert('Selecione uma data válida.');
    return;
  }

  const dataSelecionada = inputData.value;
  const linhas = document.querySelectorAll('#lista-jogadores-presenca tr');
  const dadosPresenca = {};

  linhas.forEach(tr => {
    const nome = tr.getAttribute('data-jogador');
    const isP = !tr.querySelector('.status-p').classList.contains('off');
    const isF = !tr.querySelector('.status-f').classList.contains('off');

    if (isP) dadosPresenca[nome] = 'P';
    else if (isF) dadosPresenca[nome] = 'F';
    else dadosPresenca[nome] = null;
  });

  localStorage.setItem(`presenca_${dataSelecionada}`, JSON.stringify(dadosPresenca));
  alert(`Lista de presença salva para a data ${dataSelecionada.split('-').reverse().join('/')}!`);
  
  atualizarHistoricoPresencas();
}

function carregarPresencasPorData() {
  zerarTabelaPresenca();

  const inputData = document.getElementById('data-pelada');
  if (!inputData) return;

  const dataSelecionada = inputData.value;
  const dadosSalvos = localStorage.getItem(`presenca_${dataSelecionada}`);

  if (dadosSalvos) {
    const presencas = JSON.parse(dadosSalvos);
    const linhas = document.querySelectorAll('#lista-jogadores-presenca tr');

    linhas.forEach(tr => {
      const nome = tr.getAttribute('data-jogador');
      const status = presencas[nome];

      if (status === 'P') {
        const btnP = tr.querySelector('.p-btn');
        if (btnP) marcarPresenca(btnP, 'P');
      } else if (status === 'F') {
        const btnF = tr.querySelector('.f-btn');
        if (btnF) marcarPresenca(btnF, 'F');
      }
    });
  }
}

/* --- HISTÓRICO ACUMULADO COM FILTRO DE MÊS --- */

function atualizarHistoricoPresencas() {
  const tbody = document.getElementById('historico-presencas-body');
  if (!tbody) return;

  const inputMes = document.getElementById('filtro-mes-historico');
  const mesSelecionado = inputMes ? inputMes.value : '';

  const resumo = {};

  const listaJogadores = document.querySelectorAll('#lista-jogadores-presenca tr');
  listaJogadores.forEach(tr => {
    const nome = tr.getAttribute('data-jogador');
    resumo[nome] = { presencas: 0, faltas: 0 };
  });

  for (let i = 0; i < localStorage.length; i++) {
    const chave = localStorage.key(i);
    
    if (chave.startsWith('presenca_')) {
      const dataChave = chave.replace('presenca_', '');
      
      if (mesSelecionado && !dataChave.startsWith(mesSelecionado)) {
        continue;
      }

      const dados = JSON.parse(localStorage.getItem(chave));
      for (const jogador in dados) {
        if (resumo[jogador]) {
          if (dados[jogador] === 'P') resumo[jogador].presencas++;
          if (dados[jogador] === 'F') resumo[jogador].faltas++;
        }
      }
    }
  }

  tbody.innerHTML = '';
  for (const jogador in resumo) {
    const p = resumo[jogador].presencas;
    const f = resumo[jogador].faltas;
    const totalJogos = p + f;
    const porc = totalJogos > 0 ? Math.round((p / totalJogos) * 100) : 0;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="nome-atleta">${jogador}</td>
      <td class="text-center" style="color: #22c55e; font-weight: 800;">${p}</td>
      <td class="text-center" style="color: #ef4444; font-weight: 800;">${f}</td>
      <td class="text-center" style="color: #38bdf8; font-weight: 800;">${porc}%</td>
    `;
    tbody.appendChild(tr);
  }
}

/* --- INICIALIZAÇÃO --- */

document.addEventListener('DOMContentLoaded', () => {
  atualizarContadorPresenca();

  const inputData = document.getElementById('data-pelada');
  if (inputData) {
    inputData.addEventListener('change', carregarPresencasPorData);
  }
});