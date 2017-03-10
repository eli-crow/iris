const Panel = require('./Panel.js');
const Group = require('./Group.js');

module.exports = class PanelGroup extends Group
{
	constructor (groupElement, accepts, events) {
		super(groupElement, Panel);
		
		this.class('iris-panel-group');
		//todo: fix this nonsense;
		this.unclass('iris-panel-element-group');
	}

	add(panel) {
		super.add(panel);
		panel.onResize();

		return this;
	}
}