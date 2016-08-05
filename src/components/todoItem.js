import React from 'react';
import { findDOMNode } from 'react-dom';
import {observer} from 'mobx-react';

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

class FocusEndInput extends React.Component {
	focusEnd(inputField) {
		if (inputField != null && inputField.value.length != 0){
			if (inputField.createTextRange){
				const FieldRange = inputField.createTextRange();
				FieldRange.moveStart('character',inputField.value.length);
				FieldRange.collapse();
				FieldRange.select();
			} else if (inputField.selectionStart || inputField.selectionStart == '0') {
				var elemLen = inputField.value.length;
				inputField.selectionStart = elemLen;
				inputField.selectionEnd = elemLen;
				inputField.focus();
			}
		}else{
			inputField.focus();
		}
	}

	componentDidMount() {
		this.focusEnd(this._input);
	}

	render() {
		return <input
			ref={input => this._input = input}
			{...this.props}
		/>;
	}
}

@observer
export default class TodoItem extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {editText: props.todo.title};
	}

	render() {
		const {viewStore, todo} = this.props;
		return (
			<li className={[
				todo.completed ? "completed": "",
				todo === viewStore.todoBeingEdited ? "editing" : ""
			].join(" ")}>
				<div className="view">
					<input
						className="toggle"
						type="checkbox"
						checked={todo.completed}
						onChange={this.handleToggle}
					/>
					<label
						onClick={this.handleEdit}
						dangerouslySetInnerHTML={
							{
								__html: todo.title.replace(/^(\w+-\d+)\b(.*)/, function(match, p1, p2) {
									return `<span><a style="color: #ee3124" href="https://jira.eroad.io/browse/${p1}" target="_blank">${p1.toUpperCase()}</a> ${p2}</span>`
								})
							}
						}
					/>
					<button className="destroy" onClick={this.handleDestroy} />
				</div>
				{
					// <input autoFocus={true}> does not move cursor to the end of the input
					this.props.viewStore.todoBeingEdited === todo?
						<FocusEndInput
							className='edit'
							value={this.state.editText}
							onBlur={this.handleSubmit}
							onChange={this.handleChange}
							onKeyDown={this.handleKeyDown}
						/>
					:null
				}
			</li>
		);
	}

	handleSubmit = (event) => {
		const val = this.state.editText.trim();
		if (val) {
			this.props.todo.setTitle(val);
			this.setState({editText: val});
		} else {
			this.handleDestroy();
		}
		this.props.viewStore.todoBeingEdited = null;
	};

	handleDestroy = () => {
		this.props.todo.destroy();
		this.props.viewStore.todoBeingEdited = null;
	};

	handleEdit = () => {
		const todo = this.props.todo;
		this.props.viewStore.todoBeingEdited = todo;
		this.setState({editText: todo.title});
	};

	handleKeyDown = (event) => {
		if (event.which === ESCAPE_KEY) {
			this.setState({editText: this.props.todo.title});
			this.props.viewStore.todoBeingEdited = null;
		} else if (event.which === ENTER_KEY) {
			this.handleSubmit(event);
		}
	};

	handleChange = (event) => {
		this.setState({editText: event.target.value});
	};

	handleToggle = () => {
		this.props.todo.toggle();
	};
}

TodoItem.propTypes = {
	todo: React.PropTypes.object.isRequired,
	viewStore: React.PropTypes.object.isRequired
};
