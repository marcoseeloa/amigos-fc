function realizarLogin(event) {
  event.preventDefault();
  
  const usuario = document.getElementById('usuario').value;
  
  if (usuario) {
    document.getElementById('tela-login').style.display = 'none';
    document.getElementById('app-principal').style.display = 'flex';
    document.getElementById('nome-usuario-header').textContent = `Olá, ${usuario}`;
  }
}

function fazerLogout() {
  document.getElementById('app-principal').style.display = 'none';
  document.getElementById('tela-login').style.display = 'flex';
  document.getElementById('form-login').reset();
}

function mostrarSecao(secaoId, elementoClicado) {
  // Esconde todas as seções
  const secoes = document.querySelectorAll('.secao-conteudo');
  secoes.forEach(secao => {
    secao.style.display = 'none';
  });

  // Remove o estado ativo dos botões
  const botoes = document.querySelectorAll('.nav-btn');
  botoes.forEach(btn => {
    btn.classList.remove('active');
  });

  // Exibe a seção clicada
  const secaoAlvo = document.getElementById(secaoId);
  if (secaoAlvo) {
    secaoAlvo.style.display = 'block';
  }

  // Ativa o botão selecionado
  if (elementoClicado) {
    elementoClicado.classList.add('active');
  }
}
