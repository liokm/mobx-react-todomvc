import {observable} from 'mobx';
import { uuid } from '../utils';

export default class TodoModel {
	store;
	id = uuid();
	createdAt;
	@observable title;
	@observable completed;

	constructor(store, title, completed, createdAt) {
		this.store = store;
		this.title = title;
		this.completed = completed;
		this.createdAt = new Date(createdAt);
	}

	toggle() {
		this.completed = !this.completed;
	}

	destroy() {
		this.store.todos.remove(this);
	}

	setTitle(title) {
		this.title = title;
	}

	toJS() {
		// Squuuuuuuuuuuueeze
		return [this.title, this.completed, this.createdAt.getTime()];
	}

	static fromJS(store, arr) {
		return new TodoModel(store, ...arr);
	}
}
