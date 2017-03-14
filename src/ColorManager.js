const Emitter = require('./Emitter.js');
const IrisPanel = require('./IrisPanel.js');

module.exports = class ColorManager extends Emitter
{
	constructor () {
		super(['pick', 'pickend']);

		this.panel = new IrisPanel();

		//init
		this.panel.iris.on('pickend', data => this.emit('pickend', data));
	}

	setColorData (data) {
		this.panel.setColorData;
	}
};