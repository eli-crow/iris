const Group = require('./Group.js');
const Button = require('./Button.js');
const PanelElement = require('./PanelElement.js');

module.exports = class TabbedView extends PanelElement
{
	constructor (hostElement) {
		super(['change']);

		this._element = hostElement || document.createElement('div');
		this._views = new Group();
		this._tabs = new Group();
	}

	init () {
		this.classes('iris-tabbed-view');
		this._tabs.appendTo(this._element);
		this._views.appendTo(this._element);
		this.switchView(this._tabs.item(0), this._views.item(0));
	}

	add(tabName, panelElements) {
		const view = new Group();
		for (let i = 0, ii = panelElements.length; i < ii; i++) {
			view.add(panelElements[i]);
		}
		view.hide();
		const tab = new Button(tabName)
			.classes('iris-tab')
			.bind(() => this.switchView(tab, view));

		this._tabs.add(tab);
		this._views.add(view);

		return this;
	}

	switchView(tab, view) {
		this.emit('change', {tab, view});

		view.unhide();
		tab.class('active');
		this._tabs.each(tab, el => el.unclass('active'));
		this._views.each(view, el => el.hide());

		return this;
	}
}