(() => {
  // socket que "ouve" o servidor
  var socket = io.connect("http://localhost:3000");
  var ready = false;

  // Ao submeter o fomulário
  $("#submit").submit((e) => {
    e.preventDefault();
    $("#nick").fadeOut();
    $("#chat").fadeIn();
    var name = $("#nickname").val();
    var time = new Date();
    $("#name").html(name);
    $("#time").html('First login: ' + time.getHours() + ':' + time.getMinutes());

    ready = true;
    socket.emit("join", name);
  });

  // Quando evento "update" acontecer no servidor
  socket.on("update", function(msg) {
    if (ready) {
      $('.chat').append('<li class="info">' + msg + '</li>')
    }
  });

  // Quando usuário apertar enter no campo de mensagem
  $("#textarea").keypress(function(e) {
    // Só executa se for teclado "Enter"
    if(e.which == 13) {
      var text = $("#textarea").val();
      var time = new Date();

      // Limpa o campo de texto
      $("#textarea").val('');

      // Adiciona linha no chat
      $(".chat").append('<li class="self"><div class="msg"><span>'
                  + $("#nickname").val() + ':</span>    <p>' + text + '</p><time>' + 
                  time.getHours() + ':' + time.getMinutes() + '</time></div></li>');
      
      // Envia a mensagem pelo socket
      socket.emit("send", text);
      // automatically scroll down
      document.getElementById('bottom').scrollIntoView();
    }
  });

  // Verifica as mesagens referentes ao chat
  socket.on("chat", function(client,msg) {
    if (ready) {
       var time = new Date();
       $(".chat").append('<li class="other"><div class="msg"><span>' + 
                    client + ':</span><p>' + msg + '</p><time>' + time.getHours() + ':' + 
                    time.getMinutes() + '</time></div></li>');
    }
   });
})();