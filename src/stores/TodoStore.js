import {observable, computed, autorun} from 'mobx';
import TodoModel from '../models/TodoModel'

function getDate(d) {
	return d.toISOString().substr(0, 10);
}

export default class TodoStore {
	@observable todos = [];

	@computed get activeTodoCount() {
		return this.todos.reduce(
			(sum, todo) => sum + (todo.completed ? 0 : 1),
			0
		)
	}

	@computed get completedCount() {
		return this.todos.length - this.activeTodoCount;
	}

	subscribeStorage() {
		autorun(() => {
			const todos = this.toJS();
			if (this.subscribedStorage !== true) {
				this.subscribedStorage = true;
				return;
			}
			window.localStorage.setItem('today', JSON.stringify(todos));
		})
	}

	archieve() {
		const d = new Date();
		d.setDate(d.getDate() - 1);
		window.localStorage.setItem(getDate(d), JSON.stringify(this.todos.filter(x => x.completed).map(x => x.toJS())));
		this.clearCompleted();
	}

	subscribeServerToStore(model) {
		autorun(() => {
			const todos = this.toJS();
			if (this.subscribedServerToModel !== true) {
				this.subscribedServerToModel = true;
				return;
			}
			fetch('/api/todos', {
				method: 'post',
				body: JSON.stringify({ todos }),
				headers: new Headers({ 'Content-Type': 'application/json' })
			})
		});
	}

	addTodo (title) {
		this.todos.push(new TodoModel(this, title, false, Date.now()));
	}

	toggleAll (checked) {
		this.todos.forEach(
			todo => todo.completed = checked
		);
	}

	clearCompleted () {
		this.todos = this.todos.filter(
			todo => !todo.completed
		);
	}

	toJS() {
		return this.todos.map(todo => todo.toJS());
	}

	static fromJS(array) {
		const todoStore = new TodoStore();
		todoStore.todos = array.map(item => TodoModel.fromJS(todoStore, item));
		return todoStore;
	}
}
