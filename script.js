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
  }
}

function fazerLogout() {
  document.getElementById('app-principal').style.display = 'none';
  document.getElementById('tela-login').style.display = 'flex';
  document.getElementById('form-login').reset();
  document.body.classList.remove('is-admin');
}

function mostrarSecao(secaoId, elementoClicado) {
  // Esconde todas as seções
  const secoes = document.querySelectorAll('.secao-conteudo');
  secoes.forEach(secao => {
    secao.style.display = 'none';
  });

  // Remove o estado ativo de todos os botões da barra
  const botoes = document.querySelectorAll('.nav-item');
  botoes.forEach(btn => {
    btn.classList.remove('active');
  });

  // Exibe a seção solicitada
  const secaoAlvo = document.getElementById(secaoId);
  if (secaoAlvo) {
    secaoAlvo.style.display = 'flex';
  }

  // Ativa o botão clicado
  if (elementoClicado) {
    elementoClicado.classList.add('active');
  }
}

// LOGICA DA ABA DE PRESENÇA
function marcarPresenca(botao, tipo) {
  const tr = botao.closest('tr');
  const btnP = tr.querySelector('.p-btn');
  const btnF = tr.querySelector('.f-btn');
  const statusP = tr.querySelector('.status-p');
  const statusF = tr.querySelector('.status-f');

  if (tipo === 'P') {
    btnP.classList.add('active');
    btnF.classList.remove('active');
    statusP.textContent = '✓';
    statusP.classList.remove('off');
    statusF.textContent = '-';
    statusF.classList.add('off');
  } else {
    btnF.classList.add('active');
    btnP.classList.remove('active');
    statusF.textContent = '✗';
    statusF.classList.remove('off');
    statusP.textContent = '-';
    statusP.classList.add('off');
  }

  atualizarContadorPresenca();
}

function atualizarContadorPresenca() {
  const confirmados = document.querySelectorAll('.tabela-presenca .p-btn.active').length;
  const contador = document.getElementById('total-confirmados');
  if (contador) contador.textContent = confirmados;
}

document.addEventListener('DOMContentLoaded', atualizarContadorPresenca);