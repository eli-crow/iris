const PanelElement = require('./PanelElement.js');
const fnutils = require('./fnutils.js');

const ONINPUT_EVENTNAME = "oninput" in document.body ? 'input' : 'change';

module.exports = class InputBase extends PanelElement
{
	constructor(type, attributes, events) {
		const emitterEvents = ['input', 'change'];
		if (events) emitterEvents.concat(events);
		super(emitterEvents);
		
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
		this.emit('input', val);
	}
	onChange () {
		let val = +this._element.value; 
		if (typeof this.transform === 'function') val = this.transform(val);
		this.emit('change', val);
	}

	bind (subject, prop) {
		if (fnutils.isFunction(subject)) 
			this.on('input', val => subject(val));
		else if (subject.hasOwnProperty(prop)) 
			this.on('input', val => subject[prop] = val);

		this.name(prop);
		return this;
	}

	name (name) {
		this._name = name;
		return this;
	}
}