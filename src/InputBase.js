const PanelElement = require('./PanelElement.js');
const fnutils = require('./fnutils.js');
const strutils = require('./strutils.js');

module.exports = class InputBase extends PanelElement
{
	constructor(type, attributes, events) {
		super(['input', 'change'].concat(events));
		
		let html = attributes['name'] ? `<label for="${attributes.name}">
			${strutils.titleCase(attributes.name)}
		</label>` : '';
		html += `<input type="${type}"`;
		for (let name in attributes) html += ` ${name}="${attributes[name]}"`;
		html += '>';

		const element = document.createElement('div');
		element.innerHTML = html;
		element.classList.add('iris-input');

		this._element = element;
		this._input = element.children[element.children.length - 1];
		this._map = null;

		//init
		this._input.addEventListener('input', () => this._emitValue('input'), false);
		this._input.addEventListener('change', () => this._emitValue('change'), false);
	}

	_emitValue (eventname) {
		let val = +this._input.value; 
		if (this._map) 
			val = this._map(val);
		this.emit(eventname, val);
	}

	map (fn) {
		if (typeof fn === 'function') this._map = fn;
	}

	bind (subject, prop) {
		if (fnutils.isFunction(subject)) {
			this.on('input', val => subject(val));
			this.emit('change', subject(this._input.value));
		}
		else if (subject.hasOwnProperty(prop)) {
			this.on('input', val => subject[prop] = val);
			this.emit('change', this._input.value);
		}

		this.name(prop);
		return this;
	}

	name (name) {
		this._name = name;
		return this;
	}
}