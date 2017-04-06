import PanelElement from './PanelElement.js';

// abstract
export default class Panel extends PanelElement
{
	constructor (events, template) {
		super(events);

		const tempEl = document.createElement('div');
		tempEl.insertAdjacentHTML('beforeend', template());
		this._element = tempEl.children[0];
	}

	onResize(){}
}