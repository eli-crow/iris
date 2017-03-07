const Brush = require('./Brush.js');
const Emitter = require('./Emitter.js');
const Panel = require('./Panel.js');
const Eyedropper = require('./Eyedropper.js');
const BrushPreview = require('./BrushPreview.js');

const fnutils = require('./fnutils.js');

module.exports = class ToolManager extends Emitter
{
	constructor(surface) {
		super(['toolchanged']);

		const eyedropper = new Eyedropper(surface.canvas);
		const brush = new Brush({shape: "./img/brush.png"})
			.addEffector('Angle', 'size', -50, 50, e => Math.sin(e.direction), false)
			.addEffector('Direction', 'angle', 0, 1, e => e.direction, false)
			.addEffector('Pressure', 'size', -50, 50, e => e.penPressure, true)
			.addEffector('Pressure', 'flow', -1, 1, e => e.penPressure, true)
			.addEffector('Speed', 'size', -50, 50, e => { const s = Math.sqrt(e.squaredSpeed); return s/(s+200); }, false)	
			.addEffector('Speed', 'flow', -1, 1, e => { const s = Math.sqrt(e.squaredSpeed); return s/(s+200); }, false)
			.on('changeend', () => surface.setTool(brush));

		const brushInputs = new Panel.TabbedView(document.getElementById('brush-inputs'))
			.addGroup(brush.getInputs())
			.init();
		const brushPreview = new BrushPreview(document.getElementById('brush-preview'));
		brushPreview.setBrush(brush);
		brush.on('changeend', () => brushPreview.draw());

		eyedropper.on('pick', fnutils.throttle(data => {
			iris._highlight.movePolarNormal(-1 * mathutils.radians(data.hsl[0]), data.hsl[1]/100);
			iris.palettes['Colors A'].uniforms.lightness = data.hsl[2];
			irisIndicator.style.backgroundColor = `rgba(${data.rgba.slice(0,3).join(',')}, 1)`;
			lightnessSlider._input.value = data.hsl[2];
		}), 50);
		eyedropper.on('pickend', data => brush.setColor(data.rgba));

		let __erase = false;
		document.getElementById('eraser').addEventListener('click', function () {
			__erase = !__erase;
			brush.set('erase', __erase);
		});

		this._surface = surface;
		this._currentTool = brush;
	}

	setSurface(surface) {
		this._surface = surface;
	}

	setColor(colorArr) {
		this._currentTool.setColor(colorArr);
	}
}