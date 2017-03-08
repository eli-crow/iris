const PanelElement = require('./PanelElement.js');

module.exports = class Group extends PanelElement
{
	constructor (groupElement, accepts, events) {
		super(events || []);

		this._accepts = accepts || PanelElement;
		this._element = groupElement || document.createElement('div');
		this._panelElements = [];

		//init
		this.classes('iris-panel-element-group');
	}

	item (index) {
		return this._panelElements[index];
	}

	add (panelElements) {
		if (!Array.isArray(panelElements)) panelElements = [panelElements];

		for (let i = 0, ii = panelElements.length; i < ii; i++) {
			const panelElement = panelElements[i];

			if (typeof panelElement === 'undefined') console.trace(panelElement);
			if (panelElement instanceof this._accepts || panelElement.prototype instanceof this._accepts) {
				this._element.appendChild(panelElement._element);
				this._panelElements.push(panelElement);
			} 
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