import Brush from './Brush.js';
import Eraser from './Eraser.js';
import Emitter from './Emitter.js';
import Panel from './Panel.js';
import ColorInspector from './ColorInspector.js';
import BrushPanel from './BrushPanel.js';
import SurfaceMover from './SurfaceMover.js';
import ToolEffector from './ToolEffector.js';

import * as fnutils from './fnutils.js';
import * as mathutils from './mathutils.js';

export const __tools = {};
let __instance = null;

export default class ToolManager extends Emitter
{
	constructor(surfaceRenderer) {
		if (__instance) return __instance;
		super(['toolchanged', 'sample', 'draw', 'transform']);

		__tools.eyedropper = new ColorInspector(surfaceRenderer)
			.on('pick', fnutils.throttle(data => this.emit('sample', data)), 50)
			.on('pickend', data => this.setColor(data.rgba));
		

		__tools.brush = new Brush()
			.addEffectorGroup('pressure', [
				['Size', 'size', 20, -50, 50, e => e.penPressure, true],
				['Flow', 'flow', 0, -1, 1, e => e.penPressure, true],
			])
			.addEffectorGroup('speed', [
				['Size', 'size', 35, -50, 50, e => { const s = Math.sqrt(e.squaredSpeed); return s/(s+200); }, false],
				['Flow', 'flow', -0.5, -1, 1, e => { const s = Math.sqrt(e.squaredSpeed); return s/(s+200); }, false]
			])
			.addEffectorGroup('direction', [
				['Size', 'size', 0, -50, 50, e => Math.sin(e.direction), false],
				['Direction', 'angle', 1, 0, 1, e => e.direction, false],
			])
			.on('changeend', () => this.emit('toolchanged', __tools.brush))
			.on('draw', () => this.emit('draw'));


		__tools.eraser = new Eraser()
			.addEffectorGroup('pressure', [
				['Size', 'size', 20, -50, 50, e => e.penPressure, true],
				['Flow', 'flow', 0, -1, 1, e => e.penPressure, true],
			])
			.addEffectorGroup('speed', [
				['Size', 'size', 15, -50, 50, e => { const s = Math.sqrt(e.squaredSpeed); return s/(s+200); }, false],
				['Flow', 'flow', -0.5, -1, 1, e => { const s = Math.sqrt(e.squaredSpeed); return s/(s+200); }, false]
			])
			.addEffectorGroup('direction', [
				['Size', 'size', 0, -50, 50, e => Math.sin(e.direction), false],
				['Direction', 'angle', 1, 0, 1, e => e.direction, false],
			])
			.on('changeend', () => this.emit('toolchanged', __tools.eraser))
			.on('draw', () => this.emit('draw'));


		__tools.mover = new SurfaceMover()
			.on('move', () => this.emit(['draw']));


		this.panel = new BrushPanel();
		this._currentTool = __tools.brush;
		this._color = [190, 190, 190, 255];
		this._surface = null;

		//init
		this.panel.setBrush(__tools.brush);
		this.on('toolchanged', () => this.panel.brushPreview.draw());

		//singleton
		__instance = this;
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
	
	onUp (e, zoom) { 
		e.relX /= zoom;
		e.relY /= zoom;
		this._currentTool.onUp(this._surface, e);
	}

	setTool (toolName) {
		if (this._currentTool.onToolDisable) {
			this._currentTool.onToolDisable();
		}

		const tool = __tools[ toolName.toLowerCase() ];
		this._currentTool = tool;

		if (tool.onToolEnable) {
			tool.onToolEnable();
		}

		this.setColor(this._color);
		if (tool instanceof Brush) { 
			this.panel.setBrush(tool);
			this.panel.draw();
		}

		__setCursor(toolName);
	}

	setSurface(surface) {
		this._surface = surface;
	}

	setColor(colorArr) {
		this._color = colorArr;
		if (this._currentTool.setColor) this._currentTool.setColor(this._color);
	}
}

//see _cursors.scss
function __setCursor(toolName) {
	let cursor;

	switch (toolName) {
		case 'mover': cursor = 'cursor-move'; break;
		case 'eyedropper': cursor = 'cursor-color-inspector'; break;
		case 'brush': cursor = 'cursor-brush'; break;
		case 'eraser': cursor = 'cursor-brush'; break;
		default: return;
	}

	document.body.classList.remove(document.body.getAttribute('data-iris-cursor'));
	document.body.classList.add(cursor);
	document.body.setAttribute('data-iris-cursor', cursor);
}