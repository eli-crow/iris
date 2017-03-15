const PanelElement = require('./PanelElement.js');

const __template = require('../templates/file-select.pug');

module.exports = class FileSelect extends PanelElement 
{
	constructor () {
		super(['load'], __template());

		this._dropZone = this._element.querySelector('.iris-dropzone');
		this._loading = this._element.querySelector('.iris-loading');
		this._input = this._element.querySelector('.iris-file-select-input');
		this._fileReader = new FileReader();

		//init
		this.classes('iris-file-select');

		//TODO: add feature-detection
		this._input.addEventListener('change', e => this._onFileSelect(e, this._input.value), false);
		window.addEventListener('dragover', e => this._onDragOver(e), false);
		window.addEventListener('dragenter', e => this._onDragEnter(e), false);
		window.addEventListener('dragexit', e => this._onDragLeave(e), false);
		window.addEventListener('drop', e => this._onDrop(e), false);
		this._fileReader.addEventListener('load', file => this.emit('load', this._fileReader.result), false);
	}

	_onFileSelect (e, value) {
		this.emit('load');
	}

	_onDrop (e) {
		e.stopPropagation();
		e.preventDefault();

		this.unclass('drop');

		const files = e.dataTransfer.files;

		for (let i = 0, ii = files.length; i < ii; i++) {
			this._fileReader.readAsDataURL(files[i]);
		}
	}

	_onDragEnter (e) {
		e.stopPropagation();
		e.preventDefault();

		this.class('drop');
	}

	_onDragLeave (e) {
		this.unclass('drop');
	}

	_onDragOver (e) {
		e.stopPropagation();
		e.preventDefault();

		e.dataTransfer.dropEffect = 'copy';
	}
}