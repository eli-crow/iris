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
const SurfacesPanel = require('./SurfacesPanel.js');
const ControlsPanel = require('./ControlsPanel.js');

const PointerStates = InputManager.PointerStates;
const settings = require('./settings.json');


const mainDrawingArea = document.getElementById('main-drawing-area');

//todo: place panels inside managers.
//app
const inputManager   = new InputManager(mainDrawingArea);
const toolManager    = new ToolManager(); //TODO: remove this dependency
const surfaceManager = new SurfaceManager(mainDrawingArea, settings);

const panelGroup     = new PanelGroup(document.getElementById('panel-group'));
const irisPanel      = new IrisPanel();
const brushPanel     = new BrushPanel();
const controlsPanel  = new ControlsPanel();
const surfacesPanel  = new SurfacesPanel();

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

surfaceManager.on('select', smEvent => {
	console.log(smEvent);
	toolManager.setSurface(smEvent.surface);
});

//setup panels
irisPanel.iris.on('pickend', data => toolManager.setColor(data));
brushPanel.setBrush(toolManager._currentTool);
controlsPanel.on('clear', () => surfaceManager.clearCurrentSurface());

surfacesPanel.on('load', dataUrl => surfaceManager.addFromDataUrl(dataUrl));

panelGroup.add(controlsPanel)
	.add(irisPanel)
	.add(brushPanel)
	.add(surfacesPanel);

toolManager.setSurface(surfaceManager._selectedSurface);
toolManager.on('toolchanged', tool => brushPanel.brushPreview.draw());
toolManager.on('sample', data => irisPanel.setColorData(data));
toolManager.on('draw', () => surfaceManager.draw());