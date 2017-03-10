const OrderedGroup = require('./OrderedGroup.js');

module.exports = class ThingSelector extends OrderedGroup
{
	constructor (groupElement) {
		super(groupElement, null, ['select']);
	}

	onClick (panelElement, e) {
	}
}