import * as hsluv from 'hsluv';
import Tool from './Tool.js';
import Colorjack from './Colorjack.js';
import * as canvasutils from './canvasutils.js';

export default class ColorInspector extends Tool
{
	constructor (surfaceRenderer) {
		super(['pick', 'pickend']);

		this.mergedSurface = surfaceRenderer.surface;
		this.shouldSampleFinal = true;

		this._colorjack = new Colorjack(85);
	}

	sample (surface, eventname, e) {
		const ctx = this.shouldSampleFinal ? 
			this.mergedSurface.ctx 
			: surface;

		//p:Uint8ClampedArray
		const x = e.relX - surface.position[0];
		const y = e.relY - surface.position[1];
		const p = canvasutils.getPixel(ctx, x, y);
		if (p[3] > 0) {
			p[3] = 255;

			const hsl = hsluv.rgbToHsluv([p[0]/255, p[1]/255, p[2]/255, 1]);
			this.emit(eventname, {rgba: p, hsl});
		}
		e.preventDefault();
	}

	onDown (surface, e) {
		this.sample(surface, 'pick', e);
	}

	onMove (surface, e) {
		this.sample(surface, 'pick', e);
	}

	onUp (surface, e) {
		this.sample(surface, 'pickend', e);
	}

	onToolEnable () {
		this._colorjack.show();
	}

	onToolDisable () {
		this._colorjack.hide();
	}
}