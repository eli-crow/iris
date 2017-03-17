const Emitter = require('./Emitter.js');
const Surface = require('./Surface.js');
const SurfacesPanel = require('./SurfacesPanel.js');
const SurfaceRenderer = require('./SurfaceRenderer.js');

const mathutils = require('./mathutils.js');

//todo: cache layers below current while drawing.

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
		this.add(new Surface(null, 'new surface'));
		this.panel.on('load', data => this.addFromDataUrl(data.dataUrl, data.name));
		this.panel.on('select', sse => this.select(sse.surface));
		this.panel.on('add', () => this.add(new Surface(null, 'new surface')));
		this.panel.on('remove', () => this.remove(this._selectedSurface));
	}

	draw () {
		this._renderer.draw(this._surfaces);

		return this;
	}

	add (surface) {
		surface.resize(this._renderer.width, this._renderer.height);
		this._surfaces.push(surface);
		this._selectedSurface = surface;

		this.draw();
		this.panel.drawSurfaceListView(this._surfaces);

		this.emit(['add', 'select'], {
			surfaces: this._surfaces,
			surface: surface
		});

		return this;
	}

	remove (surface) {
		const surfaces = this._surfaces;
		if (surfaces.length === 1) {
			console.warn("can't remove only surface");
			return this;
		}

		const index = surfaces.indexOf(surface);
		surfaces.splice(index, 1);

		const newIndex = mathutils.clamp(index, 0, surfaces.length -1);
		this.select(surfaces[newIndex]);

		this.draw();
		this.panel.drawSurfaceListView(this._surfaces);

		this.emit(['remove'], {
			surfaces: this._surfaces,
			surface: surfaces[index]
		})

		return this;
	}

	select(surface) {
		this.emit('select', {
			surfaces: this._surfaces,
			surface: surface
		});

		return this;
	}

	clearCurrentSurface () {
		this._selectedSurface.clear();
		this.draw();

		return this;
	}

	addFromDataUrl (dataUrl, name) {
		const s = Surface.fromDataUrl(dataUrl, name);
		s.on('load', () => {
			this.add(s);
			this.draw();
		})

		return this;
	}
}