const Brush = require('./Brush.js');
const Emitter = require('./Emitter.js');
const Panel = require('./Panel.js');
const Eyedropper = require('./Eyedropper.js');
const BrushPanel = require('./BrushPanel.js');

const fnutils = require('./fnutils.js');
const mathutils = require('./mathutils.js');

let __instance = null;

module.exports = class ToolManager extends Emitter
{
	constructor() {
		super(['toolchanged', 'sample', 'draw']);
		if (!__instance) __instance = this;

		const eyedropper = new Eyedropper()
			.on('pick', fnutils.throttle(data => this.emit('sample', data)), 50)
			.on('pickend', data => this.setColor(data.rgba));
		
		const brush = new Brush()
			.addEffector('Angle', 'size', -50, 50, e => Math.sin(e.direction), false)
			.addEffector('Direction', 'angle', 0, 1, e => e.direction, false)
			.addEffector('Pressure', 'size', -50, 50, e => e.penPressure, true)
			.addEffector('Pressure', 'flow', -1, 1, e => e.penPressure, true)
			.addEffector('Speed', 'size', -50, 50, e => { const s = Math.sqrt(e.squaredSpeed); return s/(s+200); }, false)	
			.addEffector('Speed', 'flow', -1, 1, e => { const s = Math.sqrt(e.squaredSpeed); return s/(s+200); }, false)
			.on('changeend', () => this.emit('toolchanged', brush))
			.on('draw', () => this.emit('draw'));

		const eraser = new Brush()
			.addEffector('Angle', 'size', -50, 50, e => Math.sin(e.direction), false)
			.addEffector('Direction', 'angle', 0, 1, e => e.direction, false)
			.addEffector('Pressure', 'size', -50, 50, e => e.penPressure, true)
			.addEffector('Pressure', 'flow', -1, 1, e => e.penPressure, true)
			.addEffector('Speed', 'size', -50, 50, e => { const s = Math.sqrt(e.squaredSpeed); return s/(s+200); }, false)	
			.addEffector('Speed', 'flow', -1, 1, e => { const s = Math.sqrt(e.squaredSpeed); return s/(s+200); }, false)
			.on('changeend', () => this.emit('toolchanged', eraser));
		eraser.erase = true;

		ToolManager.Tools = {
			Brush: brush,
			Eyedropper: eyedropper,
			Eraser: eraser,
			Move: brush
		};

		this.panel = new BrushPanel();
		this._currentTool = brush;

		//init
		this.panel.setBrush(brush);
		this.on('toolchanged', () => this.panel.brushPreview.draw());

		//singleton
		return __instance;
	}

	//e : IrisMouseEvent
	onDown (e) { 
		this._currentTool.onDown(this._surface, e); 
	}

	onMove (e) {
		this._currentTool.onMove(this._surface, e); 
	}
	
	onUp (e)   { 
		this._currentTool.onUp(this._surface, e); 
	}

	setSurface(surface) {
		this._surface = surface;
	}

	setColor(colorArr) {
		this._currentTool.setColor(colorArr);
	}
}