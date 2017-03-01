const Emitter = require('./Emitter.js');
const listenerutils = require('./listenerutils.js');
const canvasutils = require('./canvasutils.js');
const Tool = require('./Tool.js');

module.exports = class Surface extends Emitter
{
	constructor(canvas) {
		super(['sample']);

		this.canvas = canvas || document.createElement('canvas');
		this.ctx = canvas.getContext('2d');
		this._tool = null;

		this.resize();
		// this._resizeListener = window.addEventListener('resize', () => {
		//   this.resize();
		// });
	}

	clear () { this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); }

	resize() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	}

	appendTo (element) {
		element.appendChild(this.canvas);
	}
}
