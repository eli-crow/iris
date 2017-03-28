const Brush = require('./Brush.js');
const mathutils = require('./mathutils.js');
const Surface = require('./Surface.js');

module.exports = class BrushPreview
{
	constructor(canvas) {
		this._surface = new Surface(canvas);
		this._brush = null;
		this._pts = null;
		this._nPts = 100;
	}

	_calculatePoints (width, height) {
		this._pts = mathutils.getSinePoints2d(width - 90, height / 3 - 14, this._nPts, 22, height / 2);
		this._pts = mathutils.lerpMinDistance(this._pts, 2);
		this._pts.push(width - 30, height/2);
	}

	onResize() {
		const surface = this._surface;
		const cs = window.getComputedStyle(surface.canvas);
		const w = parseInt(cs.width);
		const h = parseInt(cs.height);

		surface.resize(w, h);
		this._calculatePoints(w, h);

		this.draw();
	}

	setBrush(brush) {
		this._brush = brush;
	}

	draw() {
		if (this._brush.erase) {
			this._surface.fill(COLORS.AMBIENT_GROOVE);
		} else {
			this._surface.clear();
		}
		
		//everything but the stamp preview
		for (let i = 0, ii = this._pts.length - 2; i < ii; i+=2) {
			this._brush.drawPoints(this._surface, {
				lastPressure: 1-(Math.cos(i/ii * Math.PI * 2) * 0.5 + 0.5), 
				penPressure: 1-(Math.cos((i+1)/ii * Math.PI * 2) * 0.5 + 0.5),  
				squaredSpeed: (1-(Math.cos(i/ii * Math.PI * 2) * 0.5 + 0.5)) * 10000 + 1,
				direction: Math.cos(i/ii * Math.PI * 2) * 0.5 + 0.5,
			}, [this._pts[i], this._pts[i+1]]);
		}

		// draw stamp preview
		this._brush.drawPoints(this._surface, {
			lastPressure: 1,
			penPressure: 1,
			squaredSpeed: 0.5,
			direction: 0,
		}, this._pts.slice(this._pts.length - 2, this._pts.length));
	}
}