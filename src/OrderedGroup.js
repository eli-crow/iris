const Group = require('./Group.js');
const listenerutils = require('./listenerutils.js');

module.exports = class OrderedGroup extends Group
{
	constructor (groupElement, accepts, events) {
		super(groupElement, accepts, ['orderchanged'].concat(events || []));
	}

	onClickChild (panelElement, e) {
	}

	dragChild (panelElement, e) {
		panelElement.transform(`translate3d(${e.diffX}px,${e.diffY}px,0px)`);
	}
	dropChild (panelElement, e) {
		panelElement.transform('');
		this.emit('orderchanged');
	}

	add (panelElement) {
		listenerutils.simplePointer(panelElement._element, {
			preventDefault: true,
			stopPropagation: true,

			move:  e => this.dragChild(panelElement, e),
			up:    e => this.dropChild(panelElement, e),
			click: e => this.onClickChild(panelElement, e)
		});

		super.add(panelElement);
	}
}