const Tool = require('./Tool.js');
const canvasutils = require('./canvasutils.js');
const hsluv = require('hsluv');

module.exports = class Eyedropper extends Tool
{
	constructor () {
		super(['pick', 'pickend']);
	}

	sample (ctx, eventname, e) {
		//p:Uint8ClampedArray
		const p = canvasutils.getPixel(ctx, e.relX, e.relY);
		if (p[3] > 0) {
			p[3] = 255;

			const hsl = hsluv.rgbToHsluv([p[0]/255, p[1]/255, p[2]/255, 1]);
			this.emit(eventname, {rgba: p, hsl});
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