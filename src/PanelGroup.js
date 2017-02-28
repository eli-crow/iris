const PanelElement = require('./PanelElement.js');

class PanelGroup extends PanelElement
{
	constructor (groupElement, accepts) {
		super();
		if (!groupElement) throw new Error('Argument isnt an element.');

		this._accepts = accepts || PanelElement;
		this._element = groupElement;
		this._panelElements = [];
	}
	add (panelElement) {
		if (panelElement instanceof this._accepts) {
			this._element.appendChild(panelElement._element);
			this._panelElements.push(panelElement);
		}
		return this;
	}
	each (exclude, fn) {
		for (let i = 0, ii = this._panelElements.length; i < ii; i++) {
			if (exclude === this._panelElements[i]) continue;
			fn(this._panelElements[i]);
		}
	}
}

module.exports = PanelGroup;