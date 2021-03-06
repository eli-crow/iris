import PanelElement from './PanelElement.js';
import * as fnutils from './fnutils.js';
import * as strutils from './strutils.js';

export default class InputBase extends PanelElement
{
	constructor(type, attributes, events, templateHTML) {
		super(['input', 'change'].concat(events));
		
		let html = '';

		if (templateHTML) {
			html = templateHTML;
		} else {
			if (options && options['icon']) {
				html = `<span class="iris-icon i-${options['icon']}"></span>`;
			}
			else if (attributes['name']) {
				html = `<label for="${attributes.name}">${attributes.name}</label>`;
			}

			html += `<input type="${type}"`;
			for (let name in attributes) html += ` ${name}="${attributes[name]}"`;
			html += '>';
		}

		const element = document.createElement('div');
		element.innerHTML = html;
		element.classList.add('iris-input');

		this._element = element;
		this._input = element.querySelector('input');
		this._map = null;

		//init
		this._input.addEventListener('input', () => this._emitValue('input'), false);
		this._input.addEventListener('change', () => this._emitValue('change'), false);
	}

	_emitValue (eventname) {
		let val = this.getValue(); 
		this.emit(eventname, val);
	}

	map (fn) {
		if (fnutils.isFunction(fn)) this._map = fn;

		return this;
	}
	unmap (fn) {
		if (fnutils.isFunction(fn)) this._unmap = fn;

		return this;
	}

	getValue () {
		const val = window.parseFloat(this._input.value);
		return this._map ? this._map(val) : val;
	}
	setValue (val) {
		this._input.value = this._unmap ? this._unmap(val) : val;
	}

	bind (subject, prop) {
		if (fnutils.isFunction(subject)) {
			this.on('input', val => subject(this.getValue()));
			this.emit('change', subject(this.getValue()));
		}
		else if (subject.hasOwnProperty(prop)) {
			this.on('input', val => subject[prop] = this.getValue());
			this.emit('change', this.getValue());
		}

		this.name(prop);
		return this;
	}

	name (name) {
		this._name = name;
		return this;
	}
}