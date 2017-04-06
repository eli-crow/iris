import Panel from './Panel.js';
import Button from './Button.js';
import Iris from './Iris.js';

import * as mathutils from './mathutils.js';

// todo: refactor inputs into iris.getinputs() <- irispalette.getinputs() so
// irispalette can bind sliders and configure internally.

module.exports = class IrisPanel extends Panel
{
	constructor () {
		super(null, require('../templates/panel-iris.pug'));

		this._wheel = this._element.querySelector('.iris-wheel');
		this._indicator = this._element.querySelector('.iris-indicator');
		this._modes = this._element.querySelector('.iris-modes');
		this._inputs = this._element.querySelector('.iris-input-group');

		this.inspectorButton = new Button(null, null, this._element.querySelector('.inspector-tool'));

		this.iris = new Iris(this._wheel);

		// init
		this.iris.on(['pick', 'pickend'], rgbArr => this.setIndicatorColor(rgbArr));

		const tabbedView = this.iris.getInputs();
		tabbedView._tabs.class('iris-tab-bar-side');
		tabbedView.init(this._modes, this._inputs);
	}

	setIndicatorColor(rgbArr) {
		this._indicator.style.backgroundColor = `rgba(${[rgbArr[0], rgbArr[1], rgbArr[2]].join(',')}, 1)`;
	}

	setColorData(data) {
		const iris = this.iris;
		iris._highlight.movePolarNormal(-1 * mathutils.radians(data.hsl[0]), data.hsl[1]/100);

		iris.currentPalette.setProperty('lightness', data.hsl[2]);

		this.setIndicatorColor(data.rgba);
	}

	onResize() {
		this.iris.onResize();
		this.iris.setMode('Colors');
		this.iris.emitColors('pick', null, null, false);
	}
}