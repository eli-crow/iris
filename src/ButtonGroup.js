const PanelGroup = require('./PanelGroup.js');
const Button = require('./Button.js');

module.exports = class ButtonGroup extends PanelGroup
{
	constructor() {
		const element = document.createElement('div');
		element.classList.add('iris-button-group');

		super(element, Button);
		this._element = element;
	}
}