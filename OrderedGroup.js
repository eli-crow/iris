const Group = require('./Group.js');
const listenerutils = require('./listenerutils.js');

module.exports = class OrderedGroup extends Group
{
	constructor (groupElement, accepts, events) {
		super(groupElement, accepts, ['orderchanged'].concat(events || []));
	}

	onClick (panelElement, e) {

	}
	grabChild (panelElement, e) {

	}
	moveChild (panelElement, e) {

	}
	reorderChild (panelElement, e) {

	}


	add (panelElement) {
		super.add(panelElement);

		const self = this;
		listenerutils.simplePointer(panelElement, {
			preventDefault: true,
			stopPropagation: true,

			down:  e => self.grabChild(panelElement, e),
			move:  e => self.moveChild(panelElement, e),
			up:    e => self.reorderChild(panelElement, e),
			click: e => self.onClick(panelElement, e)
		});
	}
}