//debug
const InfoLogger = require('./InfoLogger.js');
new InfoLogger().log();


//release
const InputManager = require('./InputManager.js');
const SurfaceManager = require('./SurfaceManager.js');
const ToolManager = require('./ToolManager.js');
const ColorManager = require('./ColorManager.js');

const PanelGroup = require('./PanelGroup.js');
const ControlsPanel = require('./ControlsPanel.js');

const PointerStates = InputManager.PointerStates;
const settings = require('./settings.json');


const mainDrawingArea = document.getElementById('main-drawing-area');

//todo: place panels inside managers.
//app
const inputManager   = new InputManager(mainDrawingArea);
const toolManager    = new ToolManager(); //TODO: remove this dependency
const surfaceManager = new SurfaceManager(mainDrawingArea, settings);
const colorManager   = new ColorManager();

const panelGroup     = new PanelGroup(document.getElementById('panel-group'));
const controlsPanel  = new ControlsPanel();

// e : IrisPointerEvent
inputManager.on('pointerdown', e => toolManager.onDown(e));
inputManager.on('pointermove', e => toolManager.onMove(e));
inputManager.on('pointerup', e => toolManager.onUp(e));

//wiring
inputManager.on('pointerstatechange', e => {
	switch (e.state) {
		case PointerStates.Pan:
			console.log('panning state');
			break;
		case PointerStates.Brush:
			console.log('brush state');
			break;
		case PointerStates.Sample:
			console.log('sample state');
			break;
	}
});

surfaceManager.on('select', smEvent => toolManager.setSurface(smEvent.surface));

//setup panels
colorManager.on('pickend', data => toolManager.setColor(data));
controlsPanel.on('clear', () => surfaceManager.clearCurrentSurface());

panelGroup.add(controlsPanel)
	.add(colorManager.panel)
	.add(toolManager.panel)
	.add(surfaceManager.panel);

toolManager.setSurface(surfaceManager._selectedSurface);
toolManager.on('sample', data => colorManager.setColorData(data));
toolManager.on('draw', () => surfaceManager.draw());