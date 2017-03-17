//debug
const InfoLogger = require('./InfoLogger.js');
new InfoLogger().log();



//release
const PanelGroup = require('./PanelGroup.js');
const InputManager = require('./InputManager.js');
const SurfaceManager = require('./SurfaceManager.js');
const ToolManager = require('./ToolManager.js');
const ColorManager = require('./ColorManager.js');

const settings = require('./settings.json');



//app
const mainDrawingArea = document.getElementById('main-drawing-area');
const panelGroup      = new PanelGroup(document.getElementById('panel-group'));

const inputManager    = new InputManager(mainDrawingArea);
const toolManager     = new ToolManager(); //TODO: remove this dependency
const surfaceManager  = new SurfaceManager(mainDrawingArea, settings);
const colorManager    = new ColorManager();



inputManager.on('pointerdown', e => toolManager.onDown(e));
inputManager.on('pointermove', e => toolManager.onMove(e));
inputManager.on('pointerup', e => toolManager.onUp(e));

const PointerStates = InputManager.PointerStates;
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



toolManager.setSurface(surfaceManager._selectedSurface);
toolManager.on('sample', data => colorManager.setColorData(data));
toolManager.on('draw', () => surfaceManager.draw());

surfaceManager.on('select', smEvent => toolManager.setSurface(smEvent.surface));

colorManager.on('pickend', data => toolManager.setColor(data));



panelGroup
	.add(colorManager.panel)
	.add(toolManager.panel)
	.add(surfaceManager.panel);