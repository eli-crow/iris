const Panel = require('./Panel.js');

const __template = require('../templates/panel-brush.pug');

module.exports = class IrisPanel extends Panel
{
	constructor () {
		super();
		this._html = __template({nonsense: 'this nonsense.'});
		this._brushPreview = new BrushPreview(irisElement, irisInputs);
	}
}