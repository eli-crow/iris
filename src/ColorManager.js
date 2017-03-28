const Emitter = require('./Emitter.js');
const IrisPanel = require('./IrisPanel.js');

module.exports = class ColorManager extends Emitter
{
	constructor () {
		super(['pick', 'pickend', 'toolselect']);

		this.panel = new IrisPanel();

		//init
		this.panel.iris.on('pickend', data => this.emit('pickend', data));
		this.panel.inspectorButton.on('click', () => this.emit('toolselect', 'eyedropper'));
	}

	setColorData (data) {
		this.panel.setColorData(data);
	}
};