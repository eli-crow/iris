//debug
const InfoLogger = require('./InfoLogger.js');
new InfoLogger().log();


//release
const InputManager = require('./InputManager.js');
const SurfaceManager = require('./SurfaceManager.js');
const ToolManager = require('./ToolManager.js');

const PanelGroup = require('./PanelGroup.js');
const IrisPanel = require('./IrisPanel.js');
const BrushPanel = require('./BrushPanel.js');
const ControlsPanel = require('./ControlsPanel.js');


//app
const inputManager   = new InputManager();
const surfaceManager = new SurfaceManager(document.getElementById('main-drawing-area'));
const toolManager    = new ToolManager(surfaceManager._selectedSurface); //TODO: remove this dependency

const panelGroup     = new PanelGroup(document.getElementById('panel-group'));
const irisPanel      = new IrisPanel();
const brushPanel     = new BrushPanel();
const controlsPanel  = new ControlsPanel();


const PointerStates = InputManager.PointerStates;


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

		default: 
			break;
	}
});

surfaceManager.on('select', smEvent => {
	toolManager.setSurface(smEvent.surface);
});

//setup panels
irisPanel.iris.on('pickend', data => toolManager.setColor(data));
brushPanel.setBrush(toolManager._currentTool);
controlsPanel.on('clear', () => surfaceManager.clearCurrentSurface());
panelGroup.add(controlsPanel)
	.add(irisPanel)
	.add(brushPanel);

toolManager.on('toolchanged', tool => brushPanel.brushPreview.draw());
toolManager.on('sample', data => irisPanel.setColorData(data));