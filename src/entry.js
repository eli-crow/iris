const InfoLogger = require('./InfoLogger.js');
new InfoLogger().log();

const InputManager = require('./InputManager.js');
const SurfaceManager = require('./SurfaceManager.js');
const ToolManager = require('./ToolManager.js');
const ColorManager = require('./ColorManager.js');
const PanelGroup = require('./PanelGroup.js');
const ControlsPanel = require('./ControlsPanel.js');

const settings = require('./settings.json');


// app
const mainDrawingArea = document.getElementById('main-drawing-area');

const inputManager    = new InputManager(mainDrawingArea);
const toolManager     = new ToolManager(); //TODO: remove this dependency
const surfaceManager  = new SurfaceManager(mainDrawingArea, settings);
const colorManager    = new ColorManager();

const controlsPanel = new ControlsPanel();

const panelGroupLeft = new PanelGroup(document.getElementById('panel-group-left'))
	.add(colorManager.panel)
	.add(toolManager.panel)
const panelGroupRight = new PanelGroup(document.getElementById('panel-group-right'))
	.add(controlsPanel)
	.add(surfaceManager.panel);



// wiring
const PointerStates = InputManager.PointerStates;
inputManager.on('pointerstatechange', e => {
	switch (e.state) {
		case PointerStates.Pan:     console.log('panning state');         break;
		case PointerStates.Brush:   toolManager.setTool('brush');         break;
		case PointerStates.Erase:   toolManager.setTool('eraser');        break;
		case PointerStates.Sample:  toolManager.setTool('eyedropper');    break;
		case PointerStates.Move:    toolManager.setTool('move');          break;
	}
});
inputManager.on('clear', () => surfaceManager.clearCurrentSurface());
inputManager.on('pointerdown', e => toolManager.onDown(e, surfaceManager.zoom));
inputManager.on('pointermove', e => toolManager.onMove(e, surfaceManager.zoom));
inputManager.on('pointerup', e => toolManager.onUp(e, surfaceManager.zoom));
inputManager.on('zoom', () => {
	panelGroupLeft.resize();
	panelGroupRight.resize();
});

toolManager.setSurface(surfaceManager._selectedSurface);
toolManager.on('sample', data => colorManager.setColorData(data));
toolManager.on('draw', () => surfaceManager.draw());

surfaceManager.on('select', smEvent => toolManager.setSurface(smEvent.surface));

colorManager.on('pickend', data => toolManager.setColor(data));
colorManager.on('toolselect', name => toolManager.setTool(name));

controlsPanel.on('download', () => surfaceManager.downloadFlattened());