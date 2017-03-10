const Button = require('./Button.js');

module.exports = class Toggle extends Button
{
	constructor(text, isToggled) {
		super(text);

		this._toggled = isToggled || false;


		//init
		if (isToggled) this._element.classList.add('toggled');
	}

	_onClick () {
		this._toggled = !this._toggled;

		if (this._toggled) this._element.classList.add('toggled');
		else               this._element.classList.remove('toggled');

		this.emit('click', this._toggled);
	}
}