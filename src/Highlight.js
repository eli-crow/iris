const domutils = require('./domutils.js');
const glutils = require('./glutils.js');

const HILIGHT_RADIUS = 7.5;
const PUPIL_RADIUS = 0.25;

module.exports = class Highlight {
	constructor (canvas) {
		const element = document.createElement('div');
		element.classList.add('iris-hilight');
		element.style.width  = HILIGHT_RADIUS * 2 + 'px';
		element.style.height = HILIGHT_RADIUS * 2 + 'px';
		canvas.insertAdjacentElement('afterend', element);

		this._element = element;
		this._canvas = canvas;
		this._x = 0;
		this._y = 0;
		this._angle = null;
		this._distance = null;
	}

	move (x, y) {
		this._x = x;
		this._y = y;
		this._angle = null;
		this._distance = null;
		this.updateStylePosition();
	}
	movePolar (theta, r) {
		this._x = Math.cos(theta) * r;
		this._y = Math.sin(theta) * r;
		this._angle = theta;
		this._distance = r;
		this.updateStylePosition();
	}
	movePolarNormal (theta, r) {
		const cr = this._canvas.width/2;
		const R = r * cr * (1 - PUPIL_RADIUS) + (PUPIL_RADIUS * cr) - 10;
		this._x = Math.cos(theta) * R;
		this._y = Math.sin(theta) * R;
		this._angle = theta
		this._distance = R;
		this.updateStylePosition();
	}

	getDistance () {
		if (this._distance === null) 
			this._distance = Math.sqrt( Math.pow(this._x, 2) + Math.pow(this._y, 2) );

		return this._distance;
	}
	getAngle () {
		if (this._angle === null) 
			this._angle = Math.atan2(this._y, this._x);

		return this._angle;
	}

	updateStylePosition () {
		domutils.setVendorCss(this._element, 'transform', 
			`translate3d(${this._canvas.width/2 + this._x}px,${this._canvas.height/2 + this._y}px, 0px)`);
	}

	sample () {
		return glutils.getPixel(this._canvas, this._x + this._canvas.width/2, this._y + this._canvas.height/2);
	}
}