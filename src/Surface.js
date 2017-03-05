const Emitter = require('./Emitter.js');
const listenerutils = require('./listenerutils.js');
const fnutils = require('./fnutils.js');
const canvasutils = require('./canvasutils.js');
const Tool = require('./Tool.js');

module.exports = class Surface extends Emitter
{
	constructor(canvas) {
		super(['sample']);

		this.canvas = canvas || document.createElement('canvas');
		this.ctx = canvas.getContext('2d');
		this._tempCanvas = document.createElement('canvas');
		this._tempCtx = this._tempCanvas.getContext('2d');
		this._tool = null;

		//init
		canvas.oncontextmenu = () => false;
		window.addEventListener('resize', fnutils.debounce(() => this.resize(), false), 300, true);
		this.resize();
	}

	clear () { 
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); 
	}

	resize() {
		//when layer systems come into play, refactor into a SurfaceCompositor, Surface will be a headless canvas.
		this._tempCanvas.width = this.canvas.width;
		this._tempCanvas.height = this.canvas.height;
		this._tempCtx.drawImage(this.canvas, 0, 0);
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.ctx.drawImage(this._tempCanvas, 0, 0);
	}

	appendTo (element) {
		element.appendChild(this.canvas);
	}

	getDataURL (filename) {
		return this.canvas.toDataURL();
	}
}
