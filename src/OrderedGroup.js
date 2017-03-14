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
		this.emit('orderchanged', this._panelElements);
	}

	add (panelElement) {
		listenerutils.simplePointer(panelElement, {
			preventDefault: true,
			stopPropagation: true,

			down:  e => this.grabChild(panelElement, e),
			move:  e => this.moveChild(panelElement, e),
			up:    e => this.reorderChild(panelElement, e),
			click: e => this.onClick(panelElement, e)
		});

		super.add(panelElement);
	}
}