import Group from './Group.js';
import Button from './Button.js';
import PanelElement from './PanelElement.js';

import * as arrayutils from './arrayutils.js';

export default class TabbedView extends PanelElement
{
	constructor (hostElement) {
		super(['change']);

		this._element = hostElement || document.createElement('div');
		this._views = new Group();
		this._tabs = new Group()
			.classes('iris-tab-bar');
	}

	init (tabParent, viewParent) {
		this.classes('iris-tabbed-view');

		if (tabParent instanceof Group) {
			tabParent.add(this._tabs);
		} 
		else if (tabParent instanceof HTMLElement) {
			this._tabs.appendTo(tabParent);
		} 
		else {
			this._tabs.appendTo(this._element);
		}

		if (viewParent instanceof Group) {
			viewParent.add(this._views);
		} 
		else if (viewParent instanceof HTMLElement) {
			this._views.appendTo(viewParent);
		}
		else {
			this._views.appendTo(this._element);
		}

		this.switchView(this._tabs.item(0), this._views.item(0));

		return this;
	}

	addGroup (descriptor) {
		for (let name in descriptor) {
			this.add(name, descriptor[name]);
		}

		return this;
	}

	add(tabName, panelElements, options) {
		panelElements = arrayutils.flatten(panelElements);

		const view = new Group();
		for (let i = 0, ii = panelElements.length; i < ii; i++) {
			view.add(panelElements[i]);
		}
		view.hide();

		const tab = new Button(tabName)
			.classes('iris-tab')
			.unclass('iris-button')
			.bind(() => this.switchView(tab, view));

		if (options && options.onSwitch) {
			tab.bind(() => options.onSwitch());
		}

		this._tabs.add(tab);
		this._views.add(view);

		return this;
	}

	switchView(tab, view) {
		this.emit('change', {tab, view});

		view.unhide();
		tab.class('selected');
		this._tabs.each(tab, el => el.unclass('selected'));
		this._views.each(view, el => el.hide());

		return this;
	}
}