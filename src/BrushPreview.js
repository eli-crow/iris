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

		//init
		// this._ctx.fillStyle = COLORS.AMBIENT_GROOVE;
	}

	_calculatePoints () {
		const canvas = this._surface.canvas;
		const cs = window.getComputedStyle(canvas);

		canvas.width = parseInt(cs.width);
		canvas.height = parseInt(cs.height);
		
		this._pts = mathutils.getSinePoints2d(
			canvas.width - 90, canvas.height/3 - 14,
			this._nPts,
			22 , canvas.height / 2
		);
		this._pts = mathutils.lerpMinDistance(this._pts, 2);
		this._pts.push (canvas.width - 30, canvas.height/2);
	}

	onResize() {
		this._calculatePoints();

		this.draw();
	}

	setBrush(brush) {
		this._brush = brush;
	}

	//TODO: fake the pressure, speed, along the curve
	draw() {
		const canvas = this._surface.canvas;
		const ctx = this._surface.ctx;

		if (this._brush.erase) {
			ctx.fillStyle = `rgba(${this._brush._color.slice(0,3).join(',')},1)`;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		} else {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}
		
		for (var i = 0, ii = this._pts.length - 2; i < ii; i+=2) {
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