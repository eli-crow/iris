const PanelElement = require('./PanelElement.js');

// abstract
module.exports = class Panel extends PanelElement
{
	constructor (events, template) {
		super(events);

		const tempEl = document.createElement('div');
		tempEl.insertAdjacentHTML('beforeend', template());
		this._element = tempEl.children[0];
	}

	onResize(){}
}

module.exports.Group = require('./Group.js');
module.exports.PanelGroup = require('./PanelGroup.js');
module.exports.ButtonGroup = require('./ButtonGroup.js');
module.exports.Button = require('./Button.js');
module.exports.Toggle = require('./Toggle.js');
module.exports.Spacer = require('./Spacer.js');
module.exports.Slider = require('./Slider.js');
module.exports.FileSelect = require('./FileSelect.js');
module.exports.TabbedView = require('./TabbedView.js');
module.exports.ToolShapeSelector = require('./ToolShapeSelector.js');