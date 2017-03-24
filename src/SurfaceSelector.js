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
	dropChild (surfaceListView, e) {

	}

	draw (surfaces) {
		this.empty();

		let i = surfaces.length;
		while (--i >= 0) {
			this.add( new SurfaceListView(surfaces[i])
				.on('up', surfaceListView => this.emit('reorder', {surface: surfaceListView.surface, change: 1}))
				.on('down', surfaceListView => this.emit('reorder', {surface: surfaceListView.surface, change: -1}))
				.on('remove', surfaceListView => this.emit('remove', surfaceListView.surface))
			);
		}

		return this;
	}
};