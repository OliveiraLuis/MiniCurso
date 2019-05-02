var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Armazena os clientes conectados
var clients = {};

app.use(express.static('./'));
app.use(express.static('./src/templates/'));
app.use(express.static('./src/css'));
app.use(express.static('./src/js'));

// Dispara a cada vez que um cliente se conecta ao socket
io.on("connection", function (client) {

  // Ao entrar na sala
  client.on("join", function(name) {
    console.log("Entrou na sala: " + name);
    clients[client.id] = name;
    client.emit("update", "Você se conectou na sala.");
    client.broadcast.emit("update", name + " entrou no servidor :)")
  });

  // Ao enviar uma mensagem
  client.on("send", function(msg) {
    console.log("Messagem: " + msg);
    client.broadcast.emit("chat", clients[client.id], msg);
  });

  // Ao sair da sala
  client.on("disconnect", function() {
    console.log("Desconectou");
    io.emit("update", clients[client.id] + " saiu da sala :(");
    delete clients[client.id];
  });
});

http.listen(3000, function() {
  console.log('ouvindo na porta: 3000');
});