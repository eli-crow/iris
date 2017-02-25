const PanelElement = require('./PanelElement.js');
const Emitter = require('./Emitter.js');
const fnutils = require('./fnutils.js');

const ONINPUT_EVENTNAME = "oninput" in document.body ? 'input' : 'change';

class InputBase extends PanelElement
{
	constructor(type, attributes) {
		super();
		this._emitter = new Emitter(['input', 'change']);
		
		let html = `<input type="${type}"`;
		for (let name in attributes) html += ` ${name}="${attributes[name]}"`;
		html += '>';

		const tempEl = document.createElement('div');
		tempEl.innerHTML = html;
		this._element = tempEl.children[0];
		this._element.addEventListener(ONINPUT_EVENTNAME, this.onInput.bind(this), false);
		this._element.addEventListener('change', this.onChange.bind(this), false);
	}

	onInput () {
		let val = +this._element.value; 
		if (typeof this.transform === 'function') val = this.transform(val);
		this._emitter.emit('input', val);
	}
	onChange () {
		let val = +this._element.value; 
		if (typeof this.transform === 'function') val = this.transform(val);
		this._emitter.emit('change', val);
	}

	on (eventname, callback) {
		this._emitter.on(eventname, callback);
		return this;
	}
	off (eventname, callback) {
		this._emitter.removeEventListener(eventname, callback);
		return this;
	}

	bind (subject, prop) {
		if (fnutils.isFunction(subject)) {
			this._emitter.on('input', val => {
				subject(val);
			});
		}
		else if (prop in subject) {
			this._emitter.on('input', val => {
				subject[prop] = val;
			});
		}
		//TODO: change name of label
		return this;
	}

	classes (names) {
		const el = this._element;
		for (var i = 0, ii = arguments.length; i < ii; i++) {
			el.classList.add(arguments[i]);
		}
		return this;
	}

	transform (transform) {
		this.transform = transform;
		return this;
	}

	name (name) {
		this._name = name;
		return this;
	}

	appendTo (element) {
		element.appendChild(this._element);
		return this;
	}
}

module.exports = InputBase;