const PanelElement = require('./PanelElement.js');
const fnutils = require('./fnutils.js');

module.exports = class Button extends PanelElement
{
	constructor (text) {
		super(['click']);

		const element = document.createElement('a');
		element.classList.add('iris-button');
		element.addEventListener('click', this._onClick.bind(this), false);
		element.innerHTML = text;

		this._group = null;
		this._element = element;
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