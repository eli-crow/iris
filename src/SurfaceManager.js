const Emitter = require('./Emitter.js');
const Surface = require('./Surface.js');
const SurfaceRenderer = require('./SurfaceRenderer.js');

// interface SurfaceManagerEvent {
//   surfaces : Surface[],
//   surface : Surface
// }

// is the entry point to maniputlating
module.exports = class SurfaceManager extends Emitter
{
	constructor (containerElement, settings) {
		super(['select', 'add', 'remove', 'reorder', 'duplicate']);

		this._selectedSurface = null;
		this._surfaces = [];
		this._renderer = new SurfaceRenderer(containerElement, settings.document);

		//init
		this.add(new Surface());
	}

	draw () {
		this._renderer.draw(this._surfaces);
	}

	add (surface) {
		surface.resize(this._renderer.width, this._renderer.height);
		this._surfaces.push(surface);
		this._selectedSurface = surface;

		this.draw();

		this.emit(['add', 'select'], {
			surfaces: this._surfaces,
			surface: surface
		});

		return this;
	}

	clearCurrentSurface () {
		this._selectedSurface.clear();
		this._renderer.draw(this._surfaces);
	}

	addFromDataUrl (dataUrl) {
		this.add(Surface.fromDataUrl(dataUrl));
	}
}