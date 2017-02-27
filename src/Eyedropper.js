const Emitter = require('./Emitter.js');
const listenerutils = require('./listenerutils.js');
const colorutils = require('./colorutils.js');
const canvasutils = require('./canvasutils.js');

module.exports = class Eyedropper extends Emitter
{
	constructor (canvas) {
		super(['pick', 'pickend']);

		this._canvas = canvas;
		this._ctx = canvas.getContext('2d');

		listenerutils.simplePointer(canvas, {
			contained: false,
			stopPropagation: true,
			preventDefault: true,

			down: e => this.sample('pick', e),
			move: e => this.sample('pick', e),
			up:   e => this.sample('pickend', e)
		})
	}

	sample (event, e) {
		if (e.altKey) {
			const rgba = canvasutils.getPixel(this._ctx, e.offsetX, e.offsetY);
			this.emit(event, {rgba: rgba, luv: colorutils.rgbToLuv(rgba)});
		}
	}

	setCanvas (canvas) {
		this._canvas = canvas;
	}
}