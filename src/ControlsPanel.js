const Panel = require('./Panel.js');

const __template = require('../templates/panel-controls.pug');

module.exports = class BrushPanel extends Panel
{
	constructor () {
		super(['clear', '']);

		const tempEl = document.createElement('div');
		tempEl.insertAdjacentHTML('beforeend', __template());
		const element = tempEl.children[0];

		const clear = element.querySelector('.clear-canvas');
		clear.addEventListener('click', () => this.emit('clear'), false);

		this._element = element;
		this._clear = clear;
	}
}