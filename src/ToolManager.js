const Brush = require('./Brush.js');
const Emitter = require('./Emitter.js');
const Panel = require('./Panel.js');
const Eyedropper = require('./Eyedropper.js');
const BrushPreview = require('./BrushPreview.js');

const fnutils = require('./fnutils.js');
const mathutils = require('./mathutils.js');

module.exports = class ToolManager extends Emitter
{
	constructor(surface) {
		super(['toolchanged', 'sample']);

		const eyedropper = new Eyedropper(surface.canvas);
		
		const brush = new Brush()
			.addEffector('Angle', 'size', -50, 50, e => Math.sin(e.direction), false)
			.addEffector('Direction', 'angle', 0, 1, e => e.direction, false)
			.addEffector('Pressure', 'size', -50, 50, e => e.penPressure, true)
			.addEffector('Pressure', 'flow', -1, 1, e => e.penPressure, true)
			.addEffector('Speed', 'size', -50, 50, e => { const s = Math.sqrt(e.squaredSpeed); return s/(s+200); }, false)	
			.addEffector('Speed', 'flow', -1, 1, e => { const s = Math.sqrt(e.squaredSpeed); return s/(s+200); }, false)
			.on('changeend', () => surface.setTool(brush));

		const eraser = new Brush()
			.addEffector('Angle', 'size', -50, 50, e => Math.sin(e.direction), false)
			.addEffector('Direction', 'angle', 0, 1, e => e.direction, false)
			.addEffector('Pressure', 'size', -50, 50, e => e.penPressure, true)
			.addEffector('Pressure', 'flow', -1, 1, e => e.penPressure, true)
			.addEffector('Speed', 'size', -50, 50, e => { const s = Math.sqrt(e.squaredSpeed); return s/(s+200); }, false)	
			.addEffector('Speed', 'flow', -1, 1, e => { const s = Math.sqrt(e.squaredSpeed); return s/(s+200); }, false)
			.on('changeend', () => surface.setTool(brush));
		eraser.erase = true;

		this._surface = surface;
		this._currentTool = brush;

		brush.on('changeend', e => this.emit('toolchanged', this._currentTool));
		eraser.on('changeend', e => this.emit('toolchanged', this._currentTool));
		this.emit('toolchanged', this._currentTool);

		eyedropper.on('pick', fnutils.throttle(data => this.emit('sample', data)), 50);
		eyedropper.on('pickend', data => this.setColor(data.rgba));
	}

	setSurface(surface) {
		this._surface = surface;
	}

	setColor(colorArr) {
		this._currentTool.setColor(colorArr);
	}
}