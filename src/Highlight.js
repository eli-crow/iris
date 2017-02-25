const domutils = require('./domutils.js');
const glutils = require('./glutils.js');

const HILIGHT_RADIUS = 7.5;

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
	}

	move (x, y) {
		this._x = this._canvas.width / 2 + x;
		this._y = this._canvas.height / 2 + y;
		this.updateStylePosition();
	}
	movePolar (theta, r) {
		this._x = this._canvas.width/2  + Math.cos(theta) * r;
		this._Y = this._canvas.height/2 + Math.sin(theta) * r;
		this.updateStylePosition();
	}

	getPolarPosition () {
		return {
			angle: Math.atan2(this._y - this._canvas.height/2, this._x - this._canvas.width/2),
			distance: Math.sqrt(Math.pow(this._x, 2) + Math.pow(this._y, 2))
		}
	}

	updateStylePosition () {
		domutils.setVendorCss(this._element, 'transform', 
			`translate3d(${this._x}px,${this._y}px, 0px)`);
	}

	sample () {
		return glutils.getPixel(this._canvas, this._x, this._y);
	}
}