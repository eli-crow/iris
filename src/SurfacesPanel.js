const Panel = require('./Panel.js');

const __uploadMessage = '+';
const __dropMessage = 'Drop files here to create a new layer.';

module.exports = class SurfacesPanel extends Panel
{
	constructor () {
		super(['load', 'select'], require('../templates/panel-surfaces.pug'));

		this._controls = this._element.querySelector('.controls');
		this._fileSelect = new Panel.FileSelect(__uploadMessage, __dropMessage);
		this._surfaceSelector = new Panel.SurfaceSelector();

		//init
		this._fileSelect.on('load', data => this.emit('load', data));
		this._surfaceSelector.on('select', data => this.emit('select', data));
		const x = new Panel.Group(this._controls)
			.add(this._surfaceSelector)
			.add(this._fileSelect);
	}

	drawSurfaceListView (surfaces) {
		this._surfaceSelector.draw(surfaces);
	}

	onResize() {

	}
}