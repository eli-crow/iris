const Panel = require('./Panel.js');

const __uploadMessage = 'Upload';
const __dropMessage = 'Drop files here to create a new layer.';

module.exports = class SurfacesPanel extends Panel
{
	constructor (surfaceSelector) {
		super(['load', 'add', 'remove', 'select'], require('../templates/panel-surfaces.pug'));

		this._add = new Panel.Button('+')
			.on('click', () => this.emit('add'));
		this._remove = new Panel.Button('-')
			.on('click', () => this.emit('remove'));
		this._fileSelect = new Panel.FileSelect(__uploadMessage, __dropMessage, window)
			.on('load', data => this.emit('load', data));

		//init
		const x = new Panel.Group(this._element.querySelector('.controls'))
			.add(surfaceSelector)
			.add(new Panel.ButtonGroup().add([
				this._add, 
				this._remove
			]))
			.add(this._fileSelect);
	}

	onResize() {

	}
}