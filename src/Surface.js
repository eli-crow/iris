
const Tool = require('./Tool.js');

module.exports = class Surface
{
	constructor(canvas) {
		this.canvas = canvas || document.createElement('canvas');
		this.ctx = canvas.getContext('2d');
		this._tool = null;

		this.resize();
		this._resizeListener = window.addEventListener('resize', () => {
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
