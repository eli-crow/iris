import * as download from 'downloadjs';

import Surface from './Surface.js';
import Emitter from './Emitter.js';

import * as canvasutils from './canvasutils.js';
import * as domutils from './domutils.js';
import * as objutils from './objutils.js';


const __defaults = {
	width: 800,
	height: 1200
}

//todo: cache layers below current and consecutive compatible layers above.
// this._cache = {
// 	above: [],
// 	below: document.createElement('canvas'),
// 	dirty: true
// }
	
// the final drawing surface, combines and displays surfaces. 
export default class SurfaceRenderer extends Emitter
{
	constructor (containerElement, options) {
		super(['draw']);

		options = objutils.copyDefaults(options, __defaults);
		this.surface = new Surface();
		this.zoom = 1;
		this._element = containerElement || document.createElement('div');

		//init
		this.surface.resize( options.width, options.height );
		this.surface.appendTo( this._element );

		const offset = domutils.getAbsoluteOffset(containerElement);
		document.body.scrollTop = offset.top;
		document.body.scrollLeft = offset.left - 340;
		}

	get width () { return this.surface.width }
	get height () { return this.surface.height }

	setZoom (zoom) {
		this.zoom = zoom;
		domutils.setVendorCss(this._element, 'transform', 'scale('+ zoom +')');
	}

	download () {
		download(this.surface.canvas.toDataURL());
	}

	//todo: refactor this when adding rendering cache;
	draw (surfaces) {
		this.clear();
		this.surface.fill('white');

		let drawRestWithTint = false;

		for (let i = 0, ii = surfaces.length; i < ii; i++) {
			const s = surfaces[i];
			if (s.previewBackground) {
				canvasutils.drawCheckerboard(this.surface.canvas, 14, 'rgb(245, 245, 245)', 'white');
				s.previewBackground = false;
				SurfaceRenderer.compose(this.surface, s);
				break;
			} else {
				SurfaceRenderer.compose(this.surface, s);
			}

			if (s.needsResizing) {
				s.resizeToSurface(this.surface);
				s.needsResizing = false;
			}
		}

		this.emit('draw', this._compositeCanvas);
	}

	clear () {
		this.surface.clear();
	}

	static compose (targetSurface, surface, tint) {
		const ctx = targetSurface.ctx;

		if (tint) {
			ctx.globalCompositeOperation = 'source-over';
			canvasutils.stamp(
				ctx, 
				surface.canvas, 
				surface.position[0], 
				surface.position[1], 
				surface.width, 
				surface.height,
				tint,
				0.9
			);
		} else {
			ctx.globalCompositeOperation = surface.blendMode;
			ctx.drawImage(surface.canvas, surface.position[0], surface.position[1]);
		}
	}
}// do stuff