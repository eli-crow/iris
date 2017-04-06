import Panel from './Panel.js';
import Group from './Group.js';
import Button from './Button.js';
import FileSelect from './FileSelect.js';

const __uploadMessage = 'Upload';
const __dropMessage = 'Drop files here to create a new layer.';

export default class SurfacesPanel extends Panel
{
	constructor (surfaceSelector) {
		super(['load', 'add', 'remove', 'select'], require('../templates/panel-surfaces.pug'));		

		this._add = new Button('', null, this._element.querySelector('.add'))
			.on('click', () => this.emit('add'));
		this._remove = new Button('', null, this._element.querySelector('.remove'))
			.on('click', () => this.emit('remove'));
		this._fileSelect = new FileSelect(__uploadMessage, __dropMessage, window)
			.on('load', data => this.emit('load', data));

		//init
		const x = new Group(this._element.querySelector('.selector'))
			.add(surfaceSelector);
		const y = new Group(this._element.querySelector('.controls'))
			.add(this._fileSelect);
	}

	onResize() {

	}
}