import 'todomvc-common';
import TodoStore from './stores/TodoStore';
import ViewStore from './stores/ViewStore';
import TodoApp from './components/todoApp.js';
import React from 'react';
import ReactDOM from 'react-dom';

var todoStore = TodoStore.fromJS(JSON.parse(window.localStorage.getItem('today')) || []);
var viewStore = new ViewStore();

todoStore.subscribeStorage();

ReactDOM.render(
	<TodoApp todoStore={todoStore} viewStore={viewStore}/>,
	document.getElementById('todoapp')
);
