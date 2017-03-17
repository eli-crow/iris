const PanelElement = require('./PanelElement.js');

const __template = require('../templates/mixins/surface-list-view.pug');

module.exports = class SurfaceListView extends PanelElement 
{
	constructor (surface) {
		super(['remove'], __template({name}= surface));

		this.surface = surface;
		this._selected = surface.selected;
		this._remove = this._element.querySelector('.iris-surface-list-view-remove');


		//init
		this.class('iris-surface-list-view');
		if (this._selected) this.class('selected');
		this._remove.addEventListener('click', e=> this.emit('remove', this))
	}
};