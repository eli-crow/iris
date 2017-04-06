import PanelElement from './PanelElement.js';
import * as fnutils from './fnutils.js';

export default class Button extends PanelElement
{
	constructor (text, events, element) {
		super(['click'].concat(events || []));

		const el = element || document.createElement('a');
		el.classList.add('iris-input', 'iris-button');
		el.addEventListener('click', () => this._onClick(), false);
		if (!element) el.innerHTML = text;

		this._group = null;
		this._element = el;
	}

	_onClick () {
		if (this._group) 
			this._group.notifyClicked(this);

		this.emit('click');
	}

	bind (subject, propName) {
		if (fnutils.isFunction(subject))
			this.on('click', val => subject(val));
		else if (subject.hasOwnProperty(propName)) 
			this.on('click', val => subject[propName] = val);
		return this;
	}
}