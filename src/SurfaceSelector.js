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
		super(groupElement, SurfaceListView, ['select', 'remove', 'duplicate', 'reorder']);

		//init
		this.classes('iris-surface-selector');
	}

	onClickChild (surfaceListView, e) {
		surfaceListView.class('selected');
		this.each(surfaceListView, el => {
			el.unclass('selected');
			el.selected = false;
		});
		this.emit('select', {
			surface: surfaceListView.surface,
			panelElement: surfaceListView,
			event: e
		});
	}
	grabChild (surfaceListView, e) {

	}
	moveChild (surfaceListView, e) {

	}

	draw (surfaces) {
		this.empty();

		let i = surfaces.length;
		while (--i >= 0) {
			const s = new SurfaceListView(surfaces[i]);
			s.on('up', listView => this.emit('reorder', {surface: s.surface, change: 1}));
			s.on('down', listView => this.emit('reorder', {surface: s.surface, change: -1}));
			s.on('remove', listView => this.emit('remove', listView.surface));
			this.add(s);
		}

		return this;
	}
}