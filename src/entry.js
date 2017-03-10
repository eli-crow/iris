const PanelGroup = require('./PanelGroup.js');
const IrisPanel = require('./IrisPanel.js');
const BrushPanel = require('./BrushPanel.js');
const Surface = require('./Surface.js');
const InputManager = require('./InputManager.js');
const ToolManager = require('./ToolManager.js');
const InfoLogger = require('./InfoLogger.js');


//app
new InfoLogger().log();
const surface = new Surface(document.getElementById('art'));
document.getElementById('clear-canvas').addEventListener('click', () => surface.clear());

const inputManager = new InputManager();
inputManager.on('panstart', () => document.body.style.cursor = 'move !important');
inputManager.on('panend', () => document.body.style.cursor = '');

const toolManager = new ToolManager(surface);
toolManager.on('sample', data => irisPanel.setColorData(data));

//setup panels
const irisPanel = new IrisPanel();
irisPanel.iris.on('pickend', data => toolManager.setColor(data));

const brushPanel = new BrushPanel();
brushPanel.setBrush(toolManager._currentTool);
toolManager.on('toolchanged', tool => brushPanel.brushPreview.draw());

const panelGroup = new PanelGroup(document.getElementById('panel-group'))
	.add(irisPanel)
	.add(brushPanel);