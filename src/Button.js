const PanelElement = require('./PanelElement.js');

class Button extends PanelElement
{
	constructor (text) {
		super();
		this._callbacks = [];
		this._group = null;
		let element = document.createElement('div');
		element.classList.add('iris-button');
		element.addEventListener('click', this._onClick.bind(this), false);
		element.innerHTML = `<p>${text}</p>`;

		this._element = element;
		element = null;
	}

	_onClick () {
		if (this._group) 
			this._group.notifyClicked(this);
		for (var i = 0, ii = this._callbacks.length; i < ii; i++) {
			this._callbacks[i]();
		}
	}

	classes (classes) {
		for (var i = 0, ii = arguments.length; i < ii; i++) {
			this._element.classList.add(arguments[i]);
		}
	}

	bind (callback) {
		this._callbacks.push(callback);
		return this;
	}
	//unbind (callback)
}

module.exports = Button;