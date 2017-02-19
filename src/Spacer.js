const PanelElement = require('./PanelElement.js');

class Spacer extends PanelElement
{
	constructor () {
		super();
		this._element = document.createElement('hr');
	}
}

module.exports = Spacer;