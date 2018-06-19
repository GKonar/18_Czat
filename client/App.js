import React, { Component } from 'react';
import io from 'socket.io.client';
import styles from './App.css';

import MessageForm from './MessageForm';
import MessageList from './MessageList';
import UsersList from './UsersList';
import UserForm from './UserForm';

const socket = io('/');

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			users: [],
			messages: [], 
			text: '', 
			name: ''
		};
	}

	componentDidMount() {
  		socket.on('message', message => this.messageReceive(message));
  		socket.on('update', ({users}) => this.chatUpdate(users));
	}

	messageReceive(message) { //obiera wiadomości , a następnie aktualizuje stan wiadomości
  		const messages = [message, ...this.state.messages];
  		this.setState({messages});
	}

	chatUpdate(users) { //aktualizuje listę użytkowników z serwera
  		this.setState({users});
	}

	handleMessageSubmit(message) { //wysyłanie wiadomości do serwera
  		const messages = [message, ...this.state.messages];
  		this.setState({messages});
  		socket.emit('message', message);
	}

	handleUserSubmit(name) { //tworzenie nowego użyrkownika czatu i wysłąnie wiadomości do serwera
  		this.setState({name});
  		socket.emit('join', name);
	}

	render() {
    	return this.state.name !== '' ? (
      		this.renderLayout()				
    	) 	: this.renderUserForm() 
  	}

  	renderLayout() {
  		return (
	  		<div className={styles.App}>
	        	<div className={styles.AppHeader}>
	          		<div className={styles.AppTitle}>
	           		 	ChatApp
	          		</div>
	          		<div className={styles.AppRoom}>
	            		App room
	          		</div>
	        	</div>
	        	<div className={styles.AppBody}>
	          		<UsersList
	            		users={this.state.users}
	          		/>
	          		<div className={styles.MessageWrapper}>
		            	<MessageList
		              	messages={this.state.messages}
		            	/>
		            	<MessageForm
		              	onMessageSubmit={message => this.handleMessageSubmit(message)}
		              	name={this.state.name}
		            	/>
		          	</div>
	        	</div>
	      	</div>
  		);
  	}

  	renderUserForm() {
   		return (
   			<UserForm onUserSubmit={name => this.handleUserSubmit(name)} />
   			//onUserSubmit ma za zadanie obsłużyć wejście użytkownika na czata 
   		);
	}
};

export default App; 

/*
Klasa App dziedziczy po klasie Component zaimportowanej z Reacta, 
więc w konstruktorze musimy wywołać metodę super, która jest wywołaniem 
konstruktora klasy rozszerzanej (Component).
*/

/*
Dzięki temu prostemu zabiegowi rozwiązaliśmy następujące kryteria akceptacji:

1) if the user isn't signed in, the app should show a simple view with one input for the user's nickname
2) there should be a simple validation for that input (if the name is empty, don't leave the page)
3) writing down the nickname and pressing enter should redirect the user to chat view

*/