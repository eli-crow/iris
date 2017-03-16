const PanelElement = require('./PanelElement.js');

const __template = require('../templates/file-select.pug');

module.exports = class FileSelect extends PanelElement 
{
	constructor (uploadMessage, dropMessage) {
		super(['load'], __template({uploadMessage, dropMessage}));

		this._dropZone = this._element.querySelector('.iris-dropzone');
		this._loading = this._element.querySelector('.iris-loading');
		this._input = this._element.querySelector('.iris-file-select-input > input');
		this._fileReader = new FileReader();

		//init
		this.classes('iris-file-select');

		//TODO: add feature-detection
		this._input.addEventListener('click', e => this._onFileSelect(e, this._input.value), false);
		window.addEventListener('dragover', e => this._onDragOver(e), false);
		window.addEventListener('dragenter', e => this._onDragEnter(e), false);
		window.addEventListener('dragexit', e => this._onDragLeave(e), false);
		window.addEventListener('drop', e => this._onDrop(e), false);
		this._fileReader.addEventListener('load', file => this._emitFile(file), false);
	}

	_emitFile (file) {
		this.emit('load', {
			dataUrl: this._fileReader.result,
			name: this._fileReader.__fileName__
		});
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
			const f = files[i];
			this._fileReader.readAsDataURL(f);
			this._fileReader.__fileName__ = f.name;
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