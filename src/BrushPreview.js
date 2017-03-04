const Brush = require('./Brush.js');
const mathutils = require('./mathutils.js');

module.exports = class BrushPreview
{
	constructor(canvas, ctx) {
		this._canvas = canvas;
		this._ctx = canvas.getContext('2d');
		this._brush = null;
		this._pts = null;
		this._nPts = 100;

		//init
		this._ctx.imageSmoothingEnabled = true;
		this._ctx.fillStyle = COLORS.AMBIENT_GROOVE;
		this.resize();
	}

	resize() {
		const canvas = this._canvas;
		const cs = window.getComputedStyle(canvas);
		canvas.width = parseInt(cs.width);
		canvas.height = parseInt(cs.height);
		this._pts = mathutils.getSinePoints2d(
			canvas.width - 14, canvas.height/3 - 14,
			this._nPts,
			7 , canvas.height / 2
		);
		this._pts = mathutils.lerpMinDistance(this._pts, 2);
	}

	setBrush(brush) {
		this._brush = brush;
	}

	//TODO: fake the pressure, speed, along the curve
	draw() {
		if (this._brush.erase) {
			this._ctx.fillStyle = COLORS.AMBIENT_GROOVE;
			this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
		} else {
			this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
		}
		for (var i = 0, ii = this._pts.length; i < ii; i+=2) {
			this._brush.drawPoints(this._ctx, {
				lastPressure: 1-(Math.cos(i/ii * Math.PI * 2) * 0.5 + 0.5), 
				penPressure: 1-(Math.cos((i+1)/ii * Math.PI * 2) * 0.5 + 0.5),  
				squaredSpeed: 1000,
				direction: Math.cos(i/ii * Math.PI * 2) * 0.5 + 0.5,
			}, [this._pts[i], this._pts[i+1]]);
		}
	}
}