import Emitter from './Emitter.js';
import Iris from './Iris.js';
import IrisPanel from './IrisPanel.js';

export default class ColorManager extends Emitter
{
	constructor () {
		super(['pick', 'pickend', 'toolselect']);

		this.iris = new Iris();
		this.panel = new IrisPanel(this.iris);

		//init
		this.iris.on('pickend', data => this.emit('pickend', data));
		this.panel.inspectorButton.on('click', () => this.emit('toolselect', 'eyedropper'));
	}

	setColorData (data) {
		const iris = this.iris;
		iris._highlight.movePolarNormal(-1 * mathutils.radians(data.hsl[0]), data.hsl[1]/100);
		iris.currentPalette.setProperty('lightness', data.hsl[2]);

		this.panel.setIndicatorColor(data.rgba);
	}
};