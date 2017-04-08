import * as hsluv from 'hsluv';

import Iris from './Iris.js';
import IrisPanel from './IrisPanel.js';

import * as mathutils from './mathutils.js';

//TODO: this should be where colorData is stored and modified. It can also instruct its members to
//redraw their views. We can also keep the colorjack here, independent of the ColorInspector,

//in other words, ColorManager is the ViewController.
//it can have as many views as it needs, they all just send commands back to the manager.
export default class ColorManager
{
	constructor () {
		this.iris = new Iris();
		this.panel = new IrisPanel(this.iris);

		//init
		this.iris.on('pickend', rgba => {
			PubSub.publish(
				Events.Color.ActiveColorChangedCommit,
				{rgba: rgba, hsl: hsluv.rgbToHsluv(rgba.map(x => x/255))}
			);
		});

		PubSub.subscribe(Events.Tools.Sample, (msg, data) => this.setColorData(data));
	}

	setColorData (data) {
		const iris = this.iris;
		iris._highlight.movePolarNormal(-1 * mathutils.radians(data.hsl[0]), data.hsl[1]/100);
		iris.currentPalette.setProperty('lightness', data.hsl[2]);

		this.panel.setIndicatorColor(data.rgba);
	}
};