const OrderedGroup = require('./OrderedGroup.js');

module.exports = class SurfaceSelector extends OrderedGroup
{
	constructor (groupElement) {
		super(groupElement, null, ['select']);
	}

	onClick (panelElement, e) {
	}
}