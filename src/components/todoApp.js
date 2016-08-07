import React from 'react';
import {observer} from 'mobx-react';
import {Router} from 'director';

import TodoEntry from './todoEntry';
import TodoOverview from './todoOverview';
import TodoFooter from './todoFooter';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';


@observer
export default class TodoApp extends React.Component {
	render() {
		const {todoStore, viewStore} = this.props;
		return (
			<div style={{maxWidth: '560px', margin: '0 auto'}} className='todoapp'>
				<header className="header">
					{/*<h1>DAILY GOAL</h1>*/}
					<h3 style={{color: '#aaa', textAlign: 'center', paddingTop: '1rem'}}>{viewStore.datetime}</h3>
					<TodoEntry todoStore={todoStore} />
				</header>
				<TodoOverview todoStore={todoStore} viewStore={viewStore} />
				<TodoFooter todoStore={todoStore} viewStore={viewStore} />
			</div>
		);
	}

	componentDidMount() {
		var viewStore = this.props.viewStore;
		var router = Router({
			'/': function() { viewStore.todoFilter = ALL_TODOS; },
			'/active': function() { viewStore.todoFilter = ACTIVE_TODOS; },
			'/completed': function() { viewStore.todoFilter = COMPLETED_TODOS; }
		});
		router.init('/');
	}
}

TodoApp.propTypes = {
	viewStore: React.PropTypes.object.isRequired,
	todoStore: React.PropTypes.object.isRequired
};
