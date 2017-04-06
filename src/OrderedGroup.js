import Group from './Group.js';
import * as listenerutils from './listenerutils.js';

export default class OrderedGroup extends Group
{
	constructor (groupElement, accepts, events) {
		super(groupElement, accepts, ['orderchanged'].concat(events || []));
	}

	onClickChild (panelElement, e) {
	}
	downChild (panelElement, e) {
	}
	enterChild (panelElement, e) {
	}
	exitChild (panelElement, e) {
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

			down:  e => this.downChild(panelElement, e),
			enter: e => this.enterChild(panelElement, e),
			exit:  e => this.exitChild(panelElement, e),
			move:  e => this.dragChild(panelElement, e),
			up:    e => this.dropChild(panelElement, e),
			click: e => this.onClickChild(panelElement, e)
		});

		super.add(panelElement);
	}
}