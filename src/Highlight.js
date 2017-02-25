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
		this._x = x; this._y = y;
		domutils.setVendorCss(this._element, 'transform', `translate3d(${x}px,${y}px, 0px)`);
	}

	movePolar (theta, r) {

	}

	sample () {
		return glutils.getPixel(this._canvas, this._x, this._y);
	}
}