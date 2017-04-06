import * as domutils from './domutils.js';
import * as glutils from './glutils.js';
import * as mathutils from './mathutils.js';

export default class Highlight
{
	constructor (canvas, gl) {
		const element = document.createElement('div');
		element.classList.add('iris-hilight');
		element.style.width  = HIGHLIGHT_RADIUS * 2 + 'px';
		element.style.height = HIGHLIGHT_RADIUS * 2 + 'px';
		canvas.insertAdjacentElement('afterend', element);

		this._element = element;
		this._canvas = canvas;
		this._gl = gl;
		this._x = 0;
		this._y = 0;
		this._angle = null;
		this._distance = null;

		this.movePolar(0,0);
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
		this._angle = mathutils.wrap(theta, Math.PI * 2);
		this._distance = mathutils.clamp(r, 0, this._canvas.width/2);
		this.updateStylePosition();
	}

	movePolarNormal (theta, r) {
		const cr = this._canvas.width/2;
		const R = r * cr * (1 - PUPIL_RADIUS) + (PUPIL_RADIUS * cr);
		this.movePolar(theta, R);
	}

	adjustPolar (theta, r) {
		this.movePolar(
			this.getAngle() + theta,
			this.getDistance() + r
		);
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
		const c = glutils.getPixel(this._canvas, this._gl, this._x + this._canvas.width/2, this._y + this._canvas.height/2);
		return c;
	}
}