const Panel = require('./Panel.js');

module.exports = class SurfacesPanel extends Panel
{
	constructor () {
		super(['load'], require('../templates/panel-surfaces.pug'));

		this._controls = this._element.querySelector('.controls');
		this._fileSelect = new Panel.FileSelect();

		//init
		this._fileSelect.on('load', dataUrl => this.emit('load', dataUrl));
		const x = new Panel.Group(this._controls)
			.add(this._fileSelect)
	}

	onResize() {

	}
}