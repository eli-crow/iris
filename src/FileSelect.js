const PanelElement = require('./PanelElement.js');

const __template = require('../templates/file-select.pug');

module.exports = class FileSelect extends PanelElement 
{
	constructor () {
		super(['load'], __template());

		this._dropZone = this._element.querySelector('.iris-dropzone');
		this._loading = this._element.querySelector('.iris-loading');
		this._input = this._element.querySelector('.iris-file-select-input');

		//init
		this.classes('iris-file-select');

		//TODO: add feature-detection
		this._input.addEventListener('change', e => this._onFileSelect(e, this._input.value), false);
		this._dropZone.addEventListener('dragover', e => this._onDragOver(e), false);
		this._dropZone.addEventListener('drop', e => this._onDrop(e), false);
	}

	_onFileSelect (e, value) {
		this.emit('load');
	}

	_onDrop (e) {
		e.stopPropagation();
		e.preventDefault();

		const files = e.dataTransfer.files;

		for (let i = 0, ii = files.length; i < ii; i++) {
			const f = files[i];
			console.log(f.size);
		}

		this.emit('load', files);
	}

	_onDragOver (e) {
		e.stopPropagation();
		e.preventDefault();

		e.dataTransfer.dropEffect = 'copy';
	}
}