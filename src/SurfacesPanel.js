const Panel = require('./Panel.js');

const __uploadMessage = 'Upload';
const __dropMessage = 'Drop files here to create a new layer.';

module.exports = class SurfacesPanel extends Panel
{
	constructor () {
		super(['load', 'download', 'add', 'remove', 'select', 'reorderup', 'reorderdown'], require('../templates/panel-surfaces.pug'));

		this._add = new Panel.Button('+')
			.on('click', () => this.emit('add'));
		this._remove = new Panel.Button('-')
			.on('click', () => this.emit('remove'));
		this._download = new Panel.Button('download')
			.on('click', () => this.emit('download'));
		this._fileSelect = new Panel.FileSelect(__uploadMessage, __dropMessage, window)
			.on('load', data => this.emit('load', data));
		this._surfaceSelector = new Panel.SurfaceSelector()
			.on('select', data => this.emit('select', data))
			.on('remove', data => this.emit('remove', data))
			.on('reorderup', surface => this.emit('reorderup', surface))
			.on('reorderdown', surface => this.emit('reorderdown', surface));

		//init
		const x = new Panel.Group(this._element.querySelector('.controls'))
			.add(this._surfaceSelector)
			.add(new Panel.ButtonGroup().add([
				this._add, 
				this._remove,
				this._download
			]))
			.add(this._fileSelect);
	}

	drawSurfaceListView (surfaces) {
		this._surfaceSelector.draw(surfaces);
	}

	onResize() {

	}
}