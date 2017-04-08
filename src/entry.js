import InfoLogger from './InfoLogger.js';
new InfoLogger().log();

import InputManager from './InputManager.js';
import SurfaceManager from './SurfaceManager.js';
import ToolManager from './ToolManager.js';
import ColorManager from './ColorManager.js';
import PanelGroup from './PanelGroup.js';
import ControlsPanel from './ControlsPanel.js';

//todo: es6 json?
const settings = require('./settings.json');

// app
const mainDrawingArea = document.getElementById('main-drawing-area');

const inputManager    = new InputManager(mainDrawingArea);
const surfaceManager  = new SurfaceManager(mainDrawingArea, settings);
const toolManager     = new ToolManager(surfaceManager._renderer); //TODO: remove this dependency
const colorManager    = new ColorManager();

const controlsPanel = new ControlsPanel();

const panelGroupLeft = new PanelGroup(document.getElementById('panel-group-left'))
	.add(colorManager.panel)
	.add(toolManager.panel)
const panelGroupRight = new PanelGroup(document.getElementById('panel-group-right'))
	.add(controlsPanel)
	.add(surfaceManager.panel);

toolManager.setSurface(surfaceManager._selectedSurface);

// toolManager.on('sample', data => colorManager.setColorData(data));
// toolManager.on('draw', () => surfaceManager.draw());

surfaceManager.on('select', smEvent => toolManager.setSurface(smEvent.surface));

controlsPanel.on('download', () => surfaceManager.downloadFlattened());