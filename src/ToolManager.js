const Brush = require('./Brush.js');
const Eraser = require('./Eraser.js');
const Emitter = require('./Emitter.js');
const Panel = require('./Panel.js');
const Eyedropper = require('./Eyedropper.js');
const BrushPanel = require('./BrushPanel.js');
const SurfaceMover = require('./SurfaceMover.js');

const fnutils = require('./fnutils.js');
const mathutils = require('./mathutils.js');

let __instance = null;

module.exports = class ToolManager extends Emitter
{
	constructor() {
		super(['toolchanged', 'sample', 'draw', 'transform']);
		if (!__instance) __instance = this;

		const eyedropper = new Eyedropper()
			.on('pick', fnutils.throttle(data => this.emit('sample', data)), 50)
			.on('pickend', data => this.setColor(data.rgba));
		
		const brush = new Brush()
			.addEffector('Angle', 'size', 0, -50, 50, e => Math.sin(e.direction), false)
			.addEffector('Direction', 'angle', 1, 0, 1, e => e.direction, false)
			.addEffector('Pressure', 'size', 20, -50, 50, e => e.penPressure, true)
			.addEffector('Pressure', 'flow', 0, -1, 1, e => e.penPressure, true)
			.addEffector('Speed', 'size', 35, -50, 50, e => { const s = Math.sqrt(e.squaredSpeed); return s/(s+200); }, false)	
			.addEffector('Speed', 'flow', -0.5, -1, 1, e => { const s = Math.sqrt(e.squaredSpeed); return s/(s+200); }, false)
			.on('changeend', () => this.emit('toolchanged', brush))
			.on('draw', () => this.emit('draw'));

		const eraser = new Eraser()
			.addEffector('Angle', 'size', 0, -50, 50, e => Math.sin(e.direction), false)
			.addEffector('Direction', 'angle', 1, 0, 1, e => e.direction, false)
			.addEffector('Pressure', 'size', 20, -50, 50, e => e.penPressure, true)
			.addEffector('Pressure', 'flow', 0, -1, 1, e => e.penPressure, true)
			.addEffector('Speed', 'size', 15, -50, 50, e => { const s = Math.sqrt(e.squaredSpeed); return s/(s+200); }, false)	
			.addEffector('Speed', 'flow', -0.5, -1, 1, e => { const s = Math.sqrt(e.squaredSpeed); return s/(s+200); }, false)
			.on('changeend', () => this.emit('toolchanged', eraser))
			.on('draw', () => this.emit('draw'));

		const mover = new SurfaceMover()
			.on('move', () => this.emit(['draw']));

		this.tools = {
			brush: brush,
			eyedropper: eyedropper,
			eraser: eraser,
			move: mover
		};

		this.panel = new BrushPanel();
		this._currentTool = brush;
		this._color = [190,190,190,255];
		this._surface = null;

		//init
		this.panel.setBrush(brush);
		this.on('toolchanged', () => this.panel.brushPreview.draw());

		//singleton
		return __instance;
	}

	//e : IrisMouseEvent
	onDown (e, zoom) {
		e.relX /= zoom;
		e.relY /= zoom;
		this._currentTool.onDown(this._surface, e); 
	}

	onMove (e, zoom) {
		e.relX /= zoom;
		e.relY /= zoom;
		this._currentTool.onMove(this._surface, e); 
	}
	
	onUp (e, zoom)  { 
		e.relX /= zoom;
		e.relY /= zoom;
		this._currentTool.onUp(this._surface, e);
	}

	setTool (toolname) {
		const tool = this.tools[ toolname.toLowerCase() ];
		this._currentTool = tool;
		this.setColor(this._color);
		if (tool instanceof Brush) { 
			this.panel.setBrush(tool);
			this.panel.draw();
		}
	}

	setSurface(surface) {
		this._surface = surface;
	}

	setColor(colorArr) {
		this._color = colorArr;
		if (this._currentTool.setColor) this._currentTool.setColor(this._color);
	}
}