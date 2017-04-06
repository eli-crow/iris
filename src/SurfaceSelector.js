import OrderedGroup from './OrderedGroup.js';
import PanelElement from './PanelElement.js';
import SurfaceListView from './SurfaceListView.js';

//interface SurfaceSelectorEvent 
//{
//	panelElement : PanelElement,
//	surface : Surface,
//	event : SimplePointerEvent
//}

export default class SurfaceSelector extends OrderedGroup
{
	constructor (groupElement) {
		super(groupElement, SurfaceListView, ['select', 'remove', 'duplicate', 'reorder', 'draw']);

		this.dragging = false;

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
	
	downChild (surfaceListView, e) {
		super.dragChild(surfaceListView, e);
		this.dragging = true;
	}	
	dragChild (surfaceListView, e) {
		super.dragChild(surfaceListView, e);
		surfaceListView.surface.previewBackground = false;
		this.emit('draw');
	}
	dropChild (surfaceListView, e) {
		super.dropChild(surfaceListView, e);
		this.dragging = false;
	}
	enterChild (surfaceListView, e) {
		super.enterChild(surfaceListView, e);
		if (!this.dragging) {
			surfaceListView.surface.previewBackground = true;
			this.emit('draw');
		}
	}
	exitChild (surfaceListView, e) {
		super.exitChild(surfaceListView, e);
		if (!this.dragging) {
			surfaceListView.surface.previewBackground = false;
			this.emit('draw');
		}
	}

	draw (surfaces) {
		this.empty();

		let i = surfaces.length;
		while (--i >= 0) {
			this.add( new SurfaceListView(surfaces[i])
				.on('up', surfaceListView => this.emit('reorder', {surface: surfaceListView.surface, change: 1}))
				.on('down', surfaceListView => this.emit('reorder', {surface: surfaceListView.surface, change: -1}))
				.on('remove', surfaceListView => this.emit('remove', {surface: surfaceListView.surface}))
			);
		}

		return this;
	}
};