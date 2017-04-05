const hsluv = require('hsluv');
const Emitter = require('./Emitter.js');
const domutils = require('./domutils.js');
const listenerutils = require('./listenerutils.js');
const mathutils = require('./mathutils.js');
const fnutils = require('./fnutils.js');

const __template = require('../templates/colorjack.svg.pug');

class Colorjack extends Emitter
{
	constructor(radius) {
		super(['adjust', 'adjustend']);

		const jackEl = domutils.HTMLToElements(__template({
			radius: 85,
			iconScale: 0.7
		}))[0];
		const els = {
			jackEl: jackEl,
			left: jackEl.querySelector('.colorjack-left'),
			right: jackEl.querySelector('.colorjack-right'),
			down: jackEl.querySelector('.colorjack-down'),
			up: jackEl.querySelector('.colorjack-up'),
			indicator: jackEl.querySelector('.colorjack-indicator'),
			hueIndicator: jackEl.querySelector('.colorjack-hue-indicator'),
			hueTransforms: jackEl.querySelector('.colorjack-hue-indicator-transforms'),
			bg: jackEl.querySelector('.colorjack-bg')
		};

		this._elements = els;
		this._bounds = null;
		this._color = [225, 100, 70]; //hsluv

		//init		
		els.left.addEventListener('click',  () => this.adjustChroma(-2), false);
		els.right.addEventListener('click', () => this.adjustChroma(2), false);
		els.down.addEventListener('click',  () => this.adjustLightness(-2), false);
		els.up.addEventListener('click',    () => this.adjustLightness(2), false);

		document.addEventListener('resize', () => this._onResize());

		listenerutils.addDnDListener(els.indicator, {
			down: () => els.indicator.classList.add('cursor-grabbing'),
			drag: (e, data) => {
				this.adjustLightness(-data.delta.y/30);
				this.adjustChroma(data.delta.x/30);
			},
			up: () => els.indicator.classList.remove('cursor-grabbing')
		});

		let _startHue;
		listenerutils.addDnDListener(els.bg, {
			down: () => {
				_startHue = this._color[0];
			},
			drag: (e, data) => {
				const cx = this._bounds.centerX;
				const cy = this._bounds.centerY;

				const startAngle = Math.atan2(
					data.downY - cy,
					data.downX - cx
				);
				const currAngle = Math.atan2(
					e.pageY - cy, 
					e.pageX - cx
				);

				this.setHue(_startHue + mathutils.degrees(currAngle - startAngle));
			}
		})

		document.body.insertAdjacentElement('beforeend', jackEl);
		this._onResize();
		this.draw(this._color);
	}

	draw (color) {
		const els = this._elements;

		const currColor = domutils.formatRgbaString(this.getRgb(color));
		els.indicator.style.fill = currColor;
		els.hueIndicator.style.fill = currColor;

		const desaturated = color.concat();
		desaturated[1] = mathutils.clamp(desaturated[1] - 2, 0, 100);
		els.left.style.fill = domutils.formatRgbaString(this.getRgb(desaturated));

		const saturated = color.concat();
		saturated[1] = mathutils.clamp(saturated[1] + 2, 0, 100);
		els.right.style.fill = domutils.formatRgbaString(this.getRgb(saturated));

		const darker = color.concat();
		darker[2] = mathutils.clamp(darker[2] - 2, 0, 100);
		els.down.style.fill = domutils.formatRgbaString(this.getRgb(darker));

		const lighter = color.concat();
		lighter[2] = mathutils.clamp(lighter[2] + 2, 0, 100);
		els.up.style.fill = domutils.formatRgbaString(this.getRgb(lighter));
	}

	getRgb (color = this._color) {
		return hsluv.hsluvToRgb(color).map(x => x*255 | 0);
	}
	
	adjustHue (amount) {
		this.setHue(this._color[0] + amount);
	}
	adjustChroma (amount) {
		this._color[1] = mathutils.clamp(this._color[1] + amount, 0, 100);
		this.draw(this._color);
		this.emit('adjustend', {rgb: this.getRgb()});
	}
	adjustLightness (amount) {
		this._color[2] = mathutils.clamp(this._color[2] + amount, 0, 100);
		this.draw(this._color);
		this.emit('adjustend', {rgb: this.getRgb()});
	}
	
	setHue(hue) {
		this._color[0] = mathutils.wrap(hue, 360);
		this.moveHueIndicator(this._color[0]);
		this.draw(this._color);
		this.emit('adjustend', {rgb: this.getRgb()});
	}
	
	moveHueIndicator(hue) {
		this._elements.hueTransforms.setAttribute('transform', 'rotate('+(hue + 90)+')');
	}

	_onResize() {
		const bounds = domutils.getBoundingPageRect(this._elements.jackEl);
		bounds.centerX = bounds.left + bounds.width/2;
		bounds.centerY = bounds.top + bounds.height/2;
		this._bounds = bounds;
	}
}

module.exports = Colorjack;