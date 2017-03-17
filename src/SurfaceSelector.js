const OrderedGroup = require('./OrderedGroup.js');
const PanelElement = require('./PanelElement.js');

const __surfaceListViewTemplate = require('../templates/mixins/surface-list-view.pug');

//interface SurfaceSelectorEvent 
//{
//	panelElement : PanelElement,
//	surface : Surface,
//	event : SimplePointerEvent
//}

module.exports = class SurfaceSelector extends OrderedGroup
{
	constructor (groupElement) {
		super(groupElement, null, ['select']);

		//init
		this.classes('iris-surface-selector');
	}

	onClickChild (panelElement, e) {
		panelElement.class('selected');
		panelElement.selected = true;
		this.each(panelElement, el => el.unclass('selected'));
		this.emit('select', {
			surface: panelElement.surface,
			panelElement: panelElement,
			event: e
		});
	}
	grabChild (panelElement, e) {

	}
	moveChild (panelElement, e) {

	}
	reorderChild (panelElement, e) {

	}

	draw (surfaces) {
		this.empty();

		let i = surfaces.length;
		while (--i >= 0) {
			const s = surfaces[i];
			const html = __surfaceListViewTemplate({ name }= s);
			const pe = new PanelElement(null, html);
			pe.class('iris-surface-list-view');
			if (s.selected) pe.class('selected');
			pe.surface = s;
			this.add(pe);
		}

		return this;
	}
}