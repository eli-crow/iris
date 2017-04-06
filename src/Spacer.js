import PanelElement from './PanelElement.js';

export default class Spacer extends PanelElement
{
	constructor () {
		super();
		this._element = document.createElement('hr');
	}
}