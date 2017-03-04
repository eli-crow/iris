const Emitter = require('./Emitter.js');

module.exports = class Panel extends Emitter
{
	constructor () {
		super();
		this._html = null;
	}

	appendTo (element) {
		element.insertAdjacentHTML('beforeend', this._html);
	}
}

module.exports.ButtonGroup = require('./ButtonGroup.js');
module.exports.Group = require('./Group.js');
module.exports.Button = require('./Button.js');
module.exports.Spacer = require('./Spacer.js');
module.exports.Slider = require('./Slider.js');
module.exports.TabbedView = require('./TabbedView.js');
module.exports.BrushShapeSelector = require('./BrushShapeSelector.js');