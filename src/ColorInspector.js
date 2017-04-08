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

		this._colorjackActive = false;
		this._colorjack = new Colorjack(85)
			.on('adjust', data => {
				this._colorjackActive = true;
				this.emit('pick', data);
			})
			.on('adjustend', data => {
				this._colorjackActive = false;
				this.emit('pickend', data);
			});
	}

	sample (surface, eventname, e) {
		if (this._colorjackActive) {
			console.log(this._colorjackActive);
			return;
		}

		const ctx = this.shouldSampleFinal ? 
			this.mergedSurface.ctx 
			: surface.ctx;

		//rgba:Uint8ClampedArray
		const x = e.relX - surface.position[0];
		const y = e.relY - surface.position[1];
		const rgba = canvasutils.getPixel(ctx, x, y);
		if (rgba[3] > 0) {
			rgba[3] = 255;
			const hsl = hsluv.rgbToHsluv([rgba[0]/255, rgba[1]/255, rgba[2]/255, 1]);
			this.emit(eventname, {rgba, hsl});
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

	setColor(colorData) {
		this._colorjack.setColor(colorData);
	}
}