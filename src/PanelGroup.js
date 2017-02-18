const PanelElement = require('./PanelElement.js');

class PanelGroup
{
	constructor (groupElement) {
		this._element = groupElement;
		this._panelElements = [];
	}
	add (panelElement) {
		if (panelElement instanceof PanelElement) {
			this._element.appendChild(panelElement._element);
			this._panelElements.push(panelElement);
		}
	}
}

module.exports = PanelGroup;