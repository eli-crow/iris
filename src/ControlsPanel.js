import Panel from './Panel.js';
import Group from './Group.js';
import Button from './Button.js';

export default class ControlsPanel extends Panel
{
	constructor () {
		super(['download'], require('../templates/panel-controls.pug'));

		this._inputs = new Group(this._element.querySelector('.iris-input-group'))
			.add(new Button('download').bind(() => this.emit('download')));
	}
}