const PanelElement = require('./PanelElement.js');
const Reactor = require('./Reactor.js');

const ONINPUT_EVENTNAME = "oninput" in document.body ? 'input' : 'change';

class InputBase extends PanelElement
{
	constructor(type, attributes) {
		super();
		this._reactor = new Reactor(['input', 'change']);
		
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
		this._reactor.dispatchEvent('input', val)
	}
	onChange () {
		let val = +this._element.value; 
		if (typeof this.transform === 'function') val = this.transform(val);
		this._reactor.dispatchEvent('change', val)
	}

	on (eventname, callback) {
		this._reactor.addEventListener(eventname, callback);
		return this;
	}
	off (eventname, callback) {
		this._reactor.removeEventListener(eventname, callback);
		return this;
	}

	bind (object, prop, transform) {
		if (prop in object) {
			this._reactor.addEventListener('input', function (val) {
				var xform = transform;
				object[prop] = xform ? xform(val) : val;
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