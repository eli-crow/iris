const Emitter = require('./Emitter.js');
const Surface = require('./Surface.js');
const SurfacesPanel = require('./SurfacesPanel.js');
const SurfaceRenderer = require('./SurfaceRenderer.js');

// interface SurfaceManagerEvent {
//   surfaces : Surface[],
//   surface : Surface
// }

module.exports = class SurfaceManager extends Emitter
{
	constructor (containerElement, settings) {
		super(['select', 'add', 'remove', 'reorder', 'duplicate']);

		this.panel = new SurfacesPanel();

		this._selectedSurface = null;
		this._surfaces = [];
		this._drawingSurface = new Surface();
		this._renderer = new SurfaceRenderer(containerElement, settings.document);

		//init
		this.add(new Surface());
		this.panel.on('load', dataUrl => this.addFromDataUrl(dataUrl));
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

	select(surface) {
		this.emit('select', {
			surfaces: this._surfaces,
			surface: surface
		});
	}

	clearCurrentSurface () {
		this._selectedSurface.clear();
		this.draw();
	}

	addFromDataUrl (dataUrl) {
		const s = Surface.fromDataUrl(dataUrl);
		s.on('load', () => {
			this.add(s);
			this.draw();
		})
	}
}