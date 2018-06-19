class UsersService {
	constructor() {
		this.users=[];
	}

	getAllUsers() {
		return this.users;
	}

	getUserById(userId) {
		return this.users.find(user => user.id === userId)
	}

	addUser(user) {
		this.users = [user, ...this.users];
	}

	removeUser(userId) {
		this.users = this.users.filter(user => user.id !== userId)
	}
}

module.exports = UsersService;

/*  getAllUsers - jej zadaniem jest zwrócenie tablicy użytkowników,
	getUserById - ta metoda zajmuje się odszukaniem użytkownika po wskazanym przez
		nas id. W tym przykładzie korzystamy z metody find, w której z wykorzystaniem
		arrow function szukamy użytkownika posiadającego identyczne id do wskazanego w
		argumencie metody - userId,     
	addUser - dzięki niej możemy dodać kolejną osobę do listy,     
	removeUser - ta metoda usuwa wskazanego przez nas
		użytkownika przy pomocy metody Array.prototype.filter, która odfiltrowuje
		każdy obiekt znajdujący się na liście i zwraca te, które spełniają przekazany
		warunek. W tym miejscu odfiltrowujemy tych użytkowników, których ID różni się
		od wskazanego w argumencie metody.

/*