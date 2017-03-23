const Group = require('./Group.js');
const listenerutils = require('./listenerutils.js');

module.exports = class OrderedGroup extends Group
{
	constructor (groupElement, accepts, events) {
		super(groupElement, accepts, ['orderchanged'].concat(events || []));
	}

	onClickChild (panelElement, e) {

	}
	grabChild (panelElement, e) {

	}
	moveChild (panelElement, e) {

	}
	reorderChild (panelElement, e) {
		
	}

	add (panelElement) {
		listenerutils.simplePointer(panelElement._element, {
			preventDefault: true,
			stopPropagation: true,

			down:  e => this.grabChild(panelElement, e),
			move:  e => this.moveChild(panelElement, e),
			up:    e => this.reorderChild(panelElement, e),
			click: e => this.onClickChild(panelElement, e)
		});

		super.add(panelElement);
	}
}