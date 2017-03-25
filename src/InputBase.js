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