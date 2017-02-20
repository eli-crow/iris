class PanelElement
{
	constructor () {
		this._element = null;
	}
	appendTo (element) {
		element.appendChild(this._element);
		return this;
	}
	remove() {
		console.log(this._element);
		this._element.parentNode.removeChild(this._element);
		return this;
	}
	hide() {
		this._element.style.display = 'none';
		return this;
	}
	unhide() {
		this._element.style.display = '';
		return this;
	}
}

module.exports = PanelElement;