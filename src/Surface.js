const SmoothPointer = require('./SmoothPointer.js');
const Tool = require('./Tool.js');

module.exports = class Surface
{
	constructor(canvas) {
		this.canvas = canvas || document.createElement('canvas');
		this.ctx = canvas.getContext('2d');
		this._tool = null;

		this.pointer = new SmoothPointer(canvas, {
		  minDistance: 2,
		  steps: 30,
		  smoothedProps: ['pressure'],
		  smoothing: 0.35,

		  down: e => this._tool.onDown.call(this._tool, this.ctx, e),
		  move: e => this._tool.onMove.call(this._tool, this.ctx, e),
		  up:   e => this._tool.onUp.call(this._tool, this.ctx, e)
		});

		this.resize();
		this._resizeListener = window.addEventListener('resize', function() {
		  this.resize();
		});
	}

	setTool(tool) {
		if (tool instanceof Tool) this._tool = tool;
		else console.warn(tool.toString() + ' is not of type Tool.');
	}

	clear() {
	  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	resize() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	}

	appendTo (element) {
		element.appendChild(this.canvas);
	}
}
