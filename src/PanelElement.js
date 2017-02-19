class PanelElement
{
	constructor () {
		this._element = null;
	}
	appendTo (element) {
		element.appendChild(this._element);
	}
}

module.exports = PanelElement;