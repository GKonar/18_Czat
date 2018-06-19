const express = require('express');
const http = require('http');		//ładujemy odpowiednie moduły
const socketIo = require('socket.io');

const app = express(); // tworzymy aplikację
const server = http.createServer(app); //tworzymy server na podstawie app
const io = socketIo(server); //podpinamy socket do serwera 
const UsersService = require('./UsersService'); //import modułu

const userService = new UsersService();

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) { //socket to osoba, która właśnie weszła na czata
  //Powyższa funkcja io.on() nasłuchuje na połączenie klienta z aplikacją.
  // klient nasłuchuje na wiadomość wejścia do czatu 
	socket.on('join', function(name){
	// użytkownika, który pojawił się w aplikacji zapisujemy do serwisu trzymającego listę osób w czacie
	   userService.addUser({
	    id: socket.id,
	    name
	   });
	// aplikacja emituje zdarzenie update, które aktualizuje informację na temat listy użytkowników każdemu nasłuchującemu na wydarzenie 'update'
	   io.emit('update', {
	    users: userService.getAllUsers()
	   });
	});
//funkcja, która ma się wykonać po utraceniu przez klienta połączenia z serwerem
  socket.on('disconnect', () => {
    userService.removeUser(socket.id);
    socket.broadcast.emit('update', {
      users: userService.getAllUsers()
    });
  });
//funkcja odpoweidzialna za wysyłanie wiadomości
  socket.on('message', function(message){
    const {name} = userService.getUserById(socket.id);
    socket.broadcast.emit('message', {
      text: message.text,
      from: name
    });
  });
});

server.listen(3000, function(){
    console.log('listening on *:3000');
  });

/*
//funkcja, która ma się wykonać po utraceniu przez klienta połączenia z serwerem
io.on('connection', function(socket) {
  socket.on('disconnect', () => {
    userService.removeUser(socket.id);
    socket.broadcast.emit('update', {
      users: userService.getAllUsers()
    });
  });
});

//funkcja odpoweidzialna za wysyłanie wiadomości
io.on('connection', function(socket) {
  socket.on('message', function(message){
    const {name} = userService.getUserById(socket.id);
    socket.broadcast.emit('message', {
      text: message.text,
      from: name
    });
  });
});

server.listen(3000, function(){
    console.log('listening on *:3000');
  });
*/


