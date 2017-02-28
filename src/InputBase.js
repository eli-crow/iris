const PanelElement = require('./PanelElement.js');
const fnutils = require('./fnutils.js');

const ONINPUT_EVENTNAME = "oninput" in document.body ? 'input' : 'change';

module.exports = class InputBase extends PanelElement
{
	constructor(type, attributes, events) {
		const emitterEvents = ['input', 'change'];
		if (events) emitterEvents.concat(events);
		super(emitterEvents);
		
		let html = attributes['name'] ? `<label for="${attributes.name}">
			${attributes.name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
		</label>` : '';
		html += `<input type="${type}"`;
		for (let name in attributes) html += ` ${name}="${attributes[name]}"`;
		html += '>';

		const tempEl = document.createElement('div');
		tempEl.innerHTML = html;
		this._element = tempEl;

		this._input = tempEl.children[tempEl.children.length - 1];
		this._input.addEventListener(ONINPUT_EVENTNAME, this.onInput.bind(this), false);
		this._input.addEventListener('change', this.onChange.bind(this), false);
	}

	onInput () {
		let val = +this._input.value; 
		if (typeof this.transform === 'function') val = this.transform(val);
		this.emit('input', val);
	}
	onChange () {
		let val = +this._input.value; 
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