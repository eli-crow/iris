const Panel = require('./Panel.js');

module.exports = class BrushPanel extends Panel
{
	constructor () {
		super(['clear'], require('../templates/panel-controls.pug'));

		const clear = this._element.querySelector('.clear-canvas');
		clear.addEventListener('click', () => this.emit('clear'), false);

		this._clear = clear;
	}
}