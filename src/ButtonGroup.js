import Group from './Group.js';
import Button from './Button.js';

export default class ButtonGroup extends Group
{
	constructor(groupElement) {
		const element = groupElement || document.createElement('div');
		element.classList.add('iris-button-group');

		super(element, Button);
	}
}