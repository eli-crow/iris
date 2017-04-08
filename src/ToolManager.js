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

export default class ToolManager
{
	constructor(surfaceRenderer) {
		if (__instance) return __instance;

		__tools.eyedropper = new ColorInspector(surfaceRenderer)
			.on('pick', fnutils.throttle(data => PubSub.publish(Events.Tools.Sample, data)), 50)
			.on('pickend', data => this.setColor(data));
		

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
			.on('changeend', tool => this._publishModified(tool))
			.on('draw', () => PubSub.publish(Events.Tools.Draw));


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
			.on('changeend', tool => this._publishModified(tool))
			.on('draw', () => PubSub.publish(Events.Tools.Draw));


		__tools.mover = new SurfaceMover()
			.on('move', () => PubSub.publish(Events.Tools.Draw));


		this.panel = new BrushPanel();
		this._currentTool = __tools.brush;
		this._colorData = null;
		this._surface = null;

		//init
		this.panel.setBrush(__tools.brush);

		//todo: InputManager.PointerStates this fit into the global structure;
		const {PointerStates} = require('./InputManager.js');
		PubSub.subscribe(Events.Input.PointerStateChange, (msg, e) => {
			switch (e.state) {
				case PointerStates.Pan:    console.log('panning state'); break;
				case PointerStates.Brush:  this.setTool('brush');        break;
				case PointerStates.Erase:  this.setTool('eraser');       break;
				case PointerStates.Sample: this.setTool('eyedropper');   break;
				case PointerStates.Move:   this.setTool('mover');        break;
			}
		});

		PubSub.subscribe(Events.Input.PointerDown, (m, d) => this._onDown(d));
		PubSub.subscribe(Events.Input.PointerDrag, (m, d) => this._onMove(d));
		PubSub.subscribe(Events.Input.PointerUp, (m, d) => this._onUp(d));

		PubSub.subscribe(Events.Tools.Select, (m, d) => this.select(d));

		PubSub.subscribe(Events.Color.ActiveColorChangedCommit, (m, d) => this.setColor(d));

		//singleton
		__instance = this;
	}

	//e : IrisMouseEvent
	_onDown (e) {
		this._currentTool.onDown(this._surface, e); 
	}

	_onMove (e) {
		this._currentTool.onMove(this._surface, e); 
	}
	
	_onUp (e) { 
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

		// this.setColor(this._colorData);
		if (tool instanceof Brush) { 
			this.panel.setBrush(tool);
			this.panel.draw();
		}

		__setCursor(toolName);
	}

	setSurface(surface) {
		this._surface = surface;
	}

	setColor(colorData) {
		this._colorData = colorData;
		for (let name in __tools) {
			const tool = __tools[name];
			if (tool.setColor) {
				tool.setColor(this._colorData);
			}
		}
	}

	_publishModified (tool) {
		PubSub.publish(Events.Tools.Modified, tool);
		this.panel.draw();
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