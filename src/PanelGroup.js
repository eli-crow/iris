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
		return this;
	}
	hideAll () {
		for (var i = 0, ii = this._panelElements.length; i < ii; i++) {
			this._panelElements[i].hide();
		}
	}
}

module.exports = PanelGroup;