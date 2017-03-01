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

		this.resize();
	}

	resize() {
		const canvas = this._canvas;
		const cs = window.getComputedStyle(canvas);
		canvas.width = parseInt(cs.width);
		canvas.height = parseInt(cs.height);
		this._pts = mathutils.getSinePoints2d(
			canvas.width - 10, canvas.height/3 - 10,
			this._nPts,
			5 , canvas.height / 2 + 5
		);
		this._pts = mathutils.lerpMinDistance(this._pts, 2);
	}

	setBrush(brush) {
		this._brush = brush;
	}

	//TODO: fake the pressure, speed, along the curve
	draw() {
		this.clear();
		this._brush.draw(this._ctx, {
			pts: this._pts,
			lastPressure: 0.0,         //interpolated end to end
			penPressure: 0.5,         //interpolated end to end
			squaredSpeed: 1000,       //interpolated end to end
			direction: 0,             //derivative of sine (cosine)
		}, this._pts);
	}

	clear () {
		this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
	}
}