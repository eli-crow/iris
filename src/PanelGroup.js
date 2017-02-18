const PanelElement = require('./PanelElement.js');

class PanelGroup
{
	constructor (parentId) {
		this._element = document.getElementById(parentId);
		this._panelElements = [];
	}
	add (panelElement) {
		if (panelElement instanceof PanelElement) {
			this._element.appendChild(panelElement._element);
		}
	}
}

module.exports = PanelGroup;