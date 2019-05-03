(() => {
  // socket que "ouve" o servidor
  var socket = io.connect("http://localhost:3000");
  var ready = false;

  // Ao submeter o fomulário
  document.getElementById("submit")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      let time = new Date();
      let name = document.getElementById("nickname").value;

      document.getElementById("nick").remove();
      document.getElementById("chat").style.display = "block";
      document.getElementById("name").innerHTML = name;
      document.getElementById("time").innerHTML = `First login: ${time.getHours()}:${time.getMinutes()}`;

      ready = true;
      // Envia evento 'join' pelo socket.io
      socket.emit("join", name);
    });

  // Quando evento "update" acontecer no servidor
  socket.on("update", msg => {
    if (ready) {
      document.querySelector('.chat')
        .insertAdjacentHTML('beforeend', `<li class="info">${msg}</li>`);
    }
  });

  // Quando usuário apertar enter no campo de mensagem
  document.getElementById("textarea")
    .addEventListener("keypress", (e) => {
      // Só executa se for teclado "Enter"
      if (e.which !== 13) return;

      let textarea = document.getElementById("textarea");
      let nickname = document.getElementById("name");
      let text = textarea.value;
      let time = new Date();

      // Limpa o campo de texto
      textarea.value = '';

      // Adiciona linha no chat
      document.querySelector(".chat")
        .insertAdjacentHTML('beforeend',
          `<li class="self">
            <div class="msg">
              <span>${nickname.innerHTML}:</span>
              <p>${text}</p>
              <time>${time.getHours()}:${time.getMinutes()}</time>
            </div>
          </li>`);
      
      // Envia evento 'send' pelo socket.io
      socket.emit("send", text);
      // 'Scrolla' a página para baixo
      document.getElementById('bottom').scrollIntoView();
    });

  // Verifica as mesagens referentes ao chat
  socket.on("chat", (client, msg) => {
    if (!ready) return;

    let time = new Date();
    
    document.querySelector(".chat")
    .insertAdjacentHTML('beforeend', 
        `<li class="other">
          <div class="msg">
            <span>${client}:</span>
            <p>${msg}</p>
            <time>${time.getHours()}:${time.getMinutes()}</time>
          </div>
        </li>`);
   });
})();