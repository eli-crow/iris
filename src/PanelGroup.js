const Panel = require('./Panel.js');
const Group = require('./Group.js');

module.exports = class PanelGroup extends Group
{
	constructor (groupElement, accepts, events) {
		super(groupElement, Panel);

		this.class('iris-panel-group');
	}

	add(panel) {
		super.add(panel);
		panel.onResize();

		return this;
	}
}