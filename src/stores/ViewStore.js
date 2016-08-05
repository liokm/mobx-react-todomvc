import {observable} from 'mobx';
import { ALL_TODOS } from '../constants';

export default class ViewStore {
	@observable todoBeingEdited = null;
	@observable todoFilter= ALL_TODOS;
	@observable datetime;

	setDatetime = () => {
		this.datetime = new Date().toLocaleString();
		setTimeout(this.setDatetime, 1000);
	}

	constructor() {
		this.setDatetime();
	}
}
