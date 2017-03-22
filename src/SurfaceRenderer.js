const Surface = require('./Surface.js');
const Emitter = require('./Emitter.js');
const canvasutils = require('./canvasutils.js');
const domutils = require('./domutils.js');
const objutils = require('./objutils.js');

const __defaults = {
	width: 800,
	height: 1200,
	gridSize: 10,
	gridColor1: 'rgb(255, 255, 255)',
	gridColor2: 'rgb(236, 236, 236)'
}

//todo: cache layers below current and consecutive compatible layers above.
// this._cache = {
// 	above: [],
// 	below: document.createElement('canvas'),
// 	dirty: true
// }
	
// the final drawing surface, combines and displays surfaces. 
module.exports = class SurfaceRenderer extends Emitter
{
	constructor (containerElement, options) {
		super(['draw']);

		options = objutils.copyDefaults(options, __defaults);
		this.surface = new Surface();
		this.zoom = 1;
		this._element = containerElement || document.createElement('div');
		// this._transparencySurface = new Surface();

		//init
		this.surface.resize( options.width, options.height );
		this.surface.appendTo( this._element );
		// this._transparencySurface.resize( options.width, options.height );
		// // canvasutils.drawTransparencyGrid(
		// // 	this._transparencySurface.canvas, 
		// // 	options['gridSize'],
		// // 	options['gridColor1'],
		// // 	options['gridColor2']
		// // );
		const offset = domutils.getAbsoluteOffset(containerElement);
		document.body.scrollTop = offset.top;
		document.body.scrollLeft = offset.left - 340;
		}

	get width () { return this.surface.width }
	get height () { return this.surface.height }

	setZoom (zoom) {
		this.zoom = zoom;
		domutils.setVendorCss(this._element, 'transform', 'scale('+ zoom +')');
		console.log (this._element.style);
		console.log ('scale('+ zoom +')');
		console.log('anything');
	}

	draw (surfaces) {

		//draw the grid
		// SurfaceRenderer.compose(this.surface, this._transparencySurface);
		this.surface.fill('white');

		//then the surfaces
		for (let i = 0, ii = surfaces.length; i < ii; i++) {
			const s = surfaces[i];
			SurfaceRenderer.compose(this.surface, s);
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

	static compose (targetSurface, surface) {
		const ctx = targetSurface.ctx;
		ctx.globalCompositeOperation = surface.blendMode;
		ctx.drawImage(surface.canvas, surface.position[0], surface.position[1]);
	}
}// do stuff