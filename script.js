function realizarLogin(event) {
  event.preventDefault();
  
  const usuarioInput = document.getElementById('usuario').value;
  
  if (usuarioInput) {
    document.getElementById('tela-login').style.display = 'none';
    document.getElementById('app-principal').style.display = 'flex';
    document.getElementById('nome-usuario-header').textContent = usuarioInput.toUpperCase();
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

  // Remove o estado ativo de todos os botões da barra
  const botoes = document.querySelectorAll('.nav-item');
  botoes.forEach(btn => {
    btn.classList.remove('active');
  });

  // Exibe a seção clicada
  const secaoAlvo = document.getElementById(secaoId);
  if (secaoAlvo) {
    secaoAlvo.style.display = 'flex';
  }

  // Ativa o botão selecionado
  if (elementoClicado) {
    elementoClicado.classList.add('active');
  }
}