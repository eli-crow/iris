const PanelElement = require('./PanelElement.js');

class ButtonGroup extends PanelElement 
{
	constructor() {
		super();
		this._buttons = [];
		this._element = document.createElement('div');
		this._element.classList.add('iris-button-group');
	}

	add (buttons) {
		for (let i = 0, ii = arguments.length; i < ii; i++) {
			const btn = arguments[i];
			this._buttons.push(btn);
			btn.appendTo(this._element);
		}
		return this;
	}
}

module.exports = ButtonGroup;