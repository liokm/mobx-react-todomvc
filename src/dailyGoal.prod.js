import 'todomvc-common';
import TodoStore from './stores/TodoStore';
import ViewStore from './stores/ViewStore';
import TodoApp from './components/todoApp.js';
import React from 'react';
import ReactDOM from 'react-dom';
import 'todomvc-common/base.css';
import 'todomvc-app-css/index.css';


var todoStore = TodoStore.fromJS(JSON.parse(window.localStorage.getItem('today')) || []);
var viewStore = new ViewStore();

todoStore.subscribeStorage();

let root = document.createElement('div');
root = document.getElementById('main-content') || document.body.appendChild(root);
root.className += ' todoapp';

ReactDOM.render(
	<TodoApp todoStore={todoStore} viewStore={viewStore}/>,
	root
);
