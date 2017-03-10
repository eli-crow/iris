const Emitter = require('./Emitter.js');
const listenerutils = require('./listenerutils.js');
const fnutils = require('./fnutils.js');
const canvasutils = require('./canvasutils.js');
const Tool = require('./Tool.js');
const SmoothPointer = require('./SmoothPointer.js');

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
		this.pointer = new SmoothPointer(this.canvas, {
		  minDistance: 4,
		  steps: 2,
		  smoothing: 0.5,
		  preventDefault: true,

		  down: e => this._tool.onDown(this.ctx, e),
		  move: e => this._tool.onMove(this.ctx, e),
		  up:   e => this._tool.onUp(this.ctx, e)
		});
		
		canvas.oncontextmenu = () => false;
		window.addEventListener('resize', fnutils.debounce(() => this.resize(), false), 300, false);
		this.resize();
	}

	clear () { 
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); 
	}

	setTool (tool) {
		this._tool = tool;
	}

	resize() {
		// when layer systems come into play, refactor into a SurfaceManager, Surface will be a headless canvas.
		this._tempCanvas.width = this.canvas.width;
		this._tempCanvas.height = this.canvas.height;
		this._tempCtx.drawImage(this.canvas, 0, 0);
		canvasutils.resizeCanvasComputed(this.canvas);
		this.ctx.drawImage(this._tempCanvas, 0, 0);
	}

	appendTo (element) {
		element.appendChild(this.canvas);
	}

	getDataURL (filename) {
		return this.canvas.toDataURL();
	}
}
