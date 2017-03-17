const OrderedGroup = require('./OrderedGroup.js');
const PanelElement = require('./PanelElement.js');
const SurfaceListView = require('./SurfaceListView.js');

//interface SurfaceSelectorEvent 
//{
//	panelElement : PanelElement,
//	surface : Surface,
//	event : SimplePointerEvent
//}

module.exports = class SurfaceSelector extends OrderedGroup
{
	constructor (groupElement) {
		super(groupElement, SurfaceListView, ['select', 'remove', 'duplicate']);

		//init
		this.classes('iris-surface-selector');
	}

	onClickChild (listView, e) {
		listView.class('selected');
		this.each(listView, el => {
			el.unclass('selected');
			el.selected = false;
		});
		this.emit('select', {
			surface: listView.surface,
			panelElement: listView,
			event: e
		});
	}
	grabChild (listView, e) {

	}
	moveChild (listView, e) {

	}
	reorderChild (listView, e) {

	}

	draw (surfaces) {
		this.empty();

		let i = surfaces.length;
		while (--i >= 0) 
		this.add(
			new SurfaceListView(surfaces[i]).on('remove', listView => {
				this.emit('remove', listView.surface);
			})
		);

		return this;
	}
}