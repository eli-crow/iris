const Panel = require('./Panel.js');

// generate template functions from pug.
const __template = require('../templates/panel-iris.pug');

module.exports = class IrisPanel extends Panel
{
	constructor () {
		super();
		this._iris = new Iris(irisElement, irisInputs);
		const html = __template({nonsense: 'this nonsense.'});
	}
}