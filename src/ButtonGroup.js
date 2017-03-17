const Group = require('./Group.js');
const Button = require('./Button.js');

module.exports = class ButtonGroup extends Group
{
	constructor(groupElement) {
		const element = groupElement || document.createElement('div');
		element.classList.add('iris-button-group');

		super(element, Button);
	}
}