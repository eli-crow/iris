const Emitter = require('./Emitter.js');
const listenerutils = require('./listenerutils.js');
const canvasutils = require('./canvasutils.js');
const hsluv = require('hsluv');

module.exports = class Eyedropper extends Emitter
{
	constructor () {
		super(['pick', 'pickend']);
	}

	sample (ctx, event, e) {
		// if (e.altKey) {
		// 	const p = canvasutils.getPixel(this._ctx, e.offsetX, e.offsetY);
		// 	if (p[3] > 0) {
		// 		const rgba = [p[0], p[1], p[2], 255];
		// 		this.emit(event, {rgba: rgba, hsl: hsluv.rgbToHsluv(rgba.map(x => x/255))});
		// 	}
		// 	e.preventDefault();
		// }
	}
}