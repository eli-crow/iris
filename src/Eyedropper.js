const Tool = require('./Tool.js');
const canvasutils = require('./canvasutils.js');
const hsluv = require('hsluv');

module.exports = class Eyedropper extends Tool
{
	constructor () {
		super(['pick', 'pickend']);
	}

	sample (ctx, eventname, e) {
		const p = canvasutils.getPixel(ctx, e.offsetX, e.offsetY);
		if (p[3] > 0) {
			const rgba = [p[0], p[1], p[2], 255];
			this.emit(eventname, {rgba: rgba, hsl: hsluv.rgbToHsluv(rgba.map(x => x/255))});
		}
		e.preventDefault();
	}

	onDown (surface, e) {
		this.sample(surface.ctx, 'pick', e);
	}

	onMove (surface, e) {
		this.sample(surface.ctx, 'pick', e);
	}

	onUp (surface, e) {
		this.sample(surface.ctx, 'pickend', e);
	}
}