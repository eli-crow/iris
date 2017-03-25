const Emitter = require('./Emitter.js');
const Surface = require('./Surface.js');
const SurfacesPanel = require('./SurfacesPanel.js');
const SurfaceSelector = require('./SurfaceSelector.js');
const SurfaceRenderer = require('./SurfaceRenderer.js');

const mathutils = require('./mathutils.js');
const arrayutils = require('./arrayutils.js');

//todo: cache layers below current while drawing.
//todo: look into caching methods for surfaces above. 
// at least consecutive source-over layers can be cached

// interface SurfaceManagerEvent {
//   surfaces : Surface[],
//   surface : Surface
// }

module.exports = class SurfaceManager extends Emitter
{
	constructor (containerElement, settings) {
		super(['select', 'add', 'remove', 'reorder', 'duplicate', 'download']);

		this._renderer = new SurfaceRenderer(containerElement, settings.document);
		this._surfaceSelector = new SurfaceSelector()
			.on('select', data => this.select(data.surface))
			.on('remove', data => this.remove(data.surface))
			.on('reorder', data => this.adjustSurfaceOrder(data.surface, data.change))
			.on('draw', () => this.draw());
		this.panel = new SurfacesPanel(this._surfaceSelector)
			.on('load', data => this.addFromDataUrl(data.dataUrl, data.name))
			.on('select', sse => this.select(sse.surface))
			.on('add', () => this.add(new Surface(null, 'new surface')))
			.on('remove', surface => this.remove(surface));

		this._selectedSurface = null;
		this._surfaces = [];
		this._drawingSurface = new Surface();
		
		//init
		this.add(new Surface(null, 'background'));
		this.draw();
	}

	draw () {
		this._renderer.draw(this._surfaces);

		return this;
	}

	setZoom (scale) {
		this._renderer.setZoom(scale);

		return this;
	}

	get zoom () { return this._renderer.zoom; }

	add (surface) {
		if (surface.contains(this._renderer.surface)) {
			surface.resize(this._renderer.width, this._renderer.height);
		} else {
			surface.resize(this._renderer.width, this._renderer.height, 0, 0, true);
		}

		this._surfaces.push(surface);
		this.emit('add', {
			surfaces: this._surfaces,
			surface: surface
		});

		this.select(surface);
		this._surfaceSelector.draw(this._surfaces);
		this.draw();
		
		return this;
	}

	adjustSurfaceOrder(surface, change) {
		const i = this._surfaces.indexOf(surface);

		if (change === 0) return false;
		if (change < 0 && i <= 0) return false;
		if (change > 0 && i >= this._surfaces.length-1) return false;

		arrayutils.swap(this._surfaces, i, i + change);

		this._surfaceSelector.draw(this._surfaces);
		this.draw();

		return this;
	}

	remove (surface) {
		const surfaces = this._surfaces;
		if (surfaces.length === 1) {
			console.warn("can't remove only surface");
			return this;
		}

		const index = surfaces.indexOf(surface || this._selectedSurface);
		surfaces.splice(index, 1);

		const selectionIndex = mathutils.clamp(index - 1, 0, surfaces.length - 1);
		console.log(selectionIndex);
		this.select(surfaces[selectionIndex]);

		this._surfaceSelector.draw(this._surfaces);
		this.draw();

		this.emit('remove', {
			surfaces: this._surfaces,
			surface: surfaces[index]
		});

		return this;
	}

	select(surface) {
		surface.selected = true;
		this._selectedSurface = surface;
		arrayutils.eachExcluding(this._surfaces, surface, s => s.selected = false);

		this.emit('select', {
			surfaces: this._surfaces,
			surface: surface
		});

		this._surfaceSelector.draw(this._surfaces);
		this.draw();

		return this;
	}

	clearCurrentSurface () {
		this._selectedSurface.clear();
		this._selectedSurface.resize(this._renderer.width, this._renderer.height);
		this.draw();

		return this;
	}

	downloadFlattened () {
		this._renderer.download();
	}

	addFromDataUrl (dataUrl, name) {
		const s = Surface.fromDataUrl(dataUrl, name);
		s.on('load', () => {
			this.add(s);
			this.draw();
		})

		return this;
	}
};