function realizarLogin(event) {
  event.preventDefault();
  
  const usuarioInput = document.getElementById('usuario').value.toLowerCase().trim();
  
  if (usuarioInput) {
    document.getElementById('tela-login').style.display = 'none';
    document.getElementById('app-principal').style.display = 'flex';
    
    // Atualiza o nome do usuário no topo
    const nomeExibicao = usuarioInput.split('@')[0];
    document.getElementById('nome-usuario-header').textContent = nomeExibicao.toUpperCase();

    const badgeAdmin = document.querySelector('.badge-admin');
    
    // VERIFICA PERMISSÃO (ADMIN VS JOGADOR)
    if (usuarioInput === 'admin@afc.com') {
      badgeAdmin.style.display = 'inline-block';
      badgeAdmin.textContent = 'Modo Administrador';
      document.body.classList.add('is-admin');
    } else {
      // Jogador comum
      badgeAdmin.style.display = 'none';
      document.body.classList.remove('is-admin');
    }

    // Abre a aba INÍCIO por padrão
    const primeiroBotao = document.querySelector('.bottom-nav .nav-item');
    mostrarSecao('escalacao', primeiroBotao);

    // Carrega dados da data atual
    carregarPresencasPorData();
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
}

/* --- LÓGICA DOS BOTÕES E ABA DE PRESENÇA --- */

function marcarPresenca(botao, tipo) {
  const tr = botao.closest('tr');
  const btnP = tr.querySelector('.p-btn');
  const btnF = tr.querySelector('.f-btn');
  const statusP = tr.querySelector('.status-p');
  const statusF = tr.querySelector('.status-f');

  // Se o botão já está selecionado, desmarca tudo (zera a linha)
  if (botao.classList.contains('active')) {
    limparLinhaJogador(tr);
  } else {
    if (tipo === 'P') {
      btnP.classList.add('active');
      btnF.classList.remove('active');
      
      statusP.textContent = '✓';
      statusP.classList.remove('off');
      
      statusF.textContent = '-';
      statusF.classList.add('off');
    } else if (tipo === 'F') {
      btnF.classList.add('active');
      btnP.classList.remove('active');
      
      statusF.textContent = '✗';
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
  
  if (statusP) {
    statusP.textContent = '-';
    statusP.classList.add('off');
  }
  if (statusF) {
    statusF.textContent = '-';
    statusF.classList.add('off');
  }
}

function zerarTabelaPresenca() {
  const linhas = document.querySelectorAll('#lista-jogadores-presenca tr');
  linhas.forEach(tr => limparLinhaJogador(tr));
  atualizarContadorPresenca();
}

function atualizarContadorPresenca() {
  const confirmados = document.querySelectorAll('.tabela-presenca .p-btn.active').length;
  const contador = document.getElementById('total-confirmados');
  if (contador) contador.textContent = confirmados;
}

// SALVAR NO NAVEGADOR COM A DATA SELECIONADA
function salvarListaPresenca() {
  const dataSelecionada = document.getElementById('data-pelada').value;
  if (!dataSelecionada) {
    alert('Selecione uma data válida.');
    return;
  }

  const linhas = document.querySelectorAll('#lista-jogadores-presenca tr');
  const dadosPresenca = {};

  linhas.forEach(tr => {
    const nome = tr.getAttribute('data-jogador');
    const isP = tr.querySelector('.p-btn').classList.contains('active');
    const isF = tr.querySelector('.f-btn').classList.contains('active');

    if (isP) dadosPresenca[nome] = 'P';
    else if (isF) dadosPresenca[nome] = 'F';
    else dadosPresenca[nome] = null;
  });

  localStorage.setItem(`presenca_${dataSelecionada}`, JSON.stringify(dadosPresenca));
  alert(`Lista salva com sucesso para o dia ${dataSelecionada}!`);
}

// CARREGAR A LISTA QUANDO MUDAR A DATA
function carregarPresencasPorData() {
  zerarTabelaPresenca();

  const dataSelecionada = document.getElementById('data-pelada').value;
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

document.addEventListener('DOMContentLoaded', () => {
  atualizarContadorPresenca();

  const inputData = document.getElementById('data-pelada');
  if (inputData) {
    inputData.addEventListener('change', carregarPresencasPorData);
  }
});
