import Panel from './Panel.js';
import Group from './Group.js';
import * as listenerutils from './listenerutils.js';

export default class PanelGroup extends Group
{
	constructor (groupElement, accepts, events) {
		super(groupElement, Panel);

		//used to prevent zoom on cmd plus/minus
		this.zoom = 1;
		this.clientRect = null;

		//init
		this._element.addEventListener(listenerutils.events['down'], e => e.stopPropagation(), false);
	
		this.class('iris-panel-group');
		//todo: fix this nonsense;
		this.unclass('iris-panel-element-group');
	}

	add(panel) {
		super.add(panel);
		panel.onResize();

		this.clientRect = this._element.getBoundingClientRect();

		return this;
	}

	resize () {
		const newRect = this._element.getBoundingClientRect();
		const ratio = newRect.height / this.clientRect.height;

		if (Modernizr.testProp('zoom')) {
			this._element.style.zoom = this.zoom;
		} else {
			this._element.style.transform = `scale(${this.zoom})`;
		}

		this.clientRect = newRect;
	}
}