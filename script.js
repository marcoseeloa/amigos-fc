function realizarLogin(event) {
  event.preventDefault();
  
  const usuarioInput = document.getElementById('usuario').value.toLowerCase().trim();
  
  if (usuarioInput) {
    document.getElementById('tela-login').style.display = 'none';
    document.getElementById('app-principal').style.display = 'flex';
    
    // Atualiza nome exibido no topo
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

    // Abre a aba Início por padrão ao logar
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

  // Remove a classe "active" dos botões
  const botoes = document.querySelectorAll('.nav-item');
  botoes.forEach(btn => {
    btn.classList.remove('active');
  });

  // Mostra a seção desejada
  const secaoAlvo = document.getElementById(secaoId);
  if (secaoAlvo) {
    secaoAlvo.style.display = 'flex';
  }

  // Ativa o botão clicado
  if (elementoClicado) {
    elementoClicado.classList.add('active');
  }
}