const Emitter = require('./Emitter.js');
const listenerutils = require('./listenerutils.js');
const canvasutils = require('./canvasutils.js');
const hsluv = require('hsluv');

module.exports = class Eyedropper extends Emitter
{
	constructor (canvas) {
		super(['pick', 'pickend']);

		this._canvas = canvas;
		this._ctx = canvas.getContext('2d');

		listenerutils.simplePointer(canvas, {
			contained: false,
			down: e => this.sample('pick', e),
			move: e => this.sample('pick', e),
			up:   e => this.sample('pickend', e)
		})
	}

	sample (event, e) {
		if (e.downButton === 2 || e.altKey) {
			const p = canvasutils.getPixel(this._ctx, e.offsetX, e.offsetY);
			if (p[3] > 0) {
				const rgba = [p[0], p[1], p[2], 255];
				this.emit(event, {rgba: rgba, hsl: hsluv.rgbToHsluv(rgba.map(x => x/255))});
			}
			e.preventDefault();
		}
	}

	setCanvas (canvas) {
		this._canvas = canvas;
	}
}