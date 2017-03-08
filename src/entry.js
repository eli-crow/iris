const PanelGroup = require('./PanelGroup.js');
const IrisPanel = require('./IrisPanel.js');
const BrushPanel = require('./BrushPanel.js');
const ToolManager = require('./ToolManager.js');
const Surface = require('./Surface.js');
const InfoLogger = require('./InfoLogger.js');


//app
new InfoLogger().log();
const surface = new Surface(document.getElementById('art'));
document.getElementById('clear-canvas').addEventListener('click', () => surface.clear());

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