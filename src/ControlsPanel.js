const Panel = require('./Panel.js');

module.exports = class BrushPanel extends Panel
{
	constructor () {
		super(['download'], require('../templates/panel-controls.pug'));

		this._inputs = new Panel.Group(this._element.querySelector('.iris-input-group'))
			.add(new Panel.Button('download').bind(() => this.emit('download')));
	}
}