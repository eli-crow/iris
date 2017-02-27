const Iris = require('./Iris.js');
const Slider = require('./Slider.js');
const Button = require('./Button.js');
const ButtonGroup = require('./ButtonGroup.js');
const PanelGroup = require('./PanelGroup.js');
const Spacer = require('./Spacer.js');
const ToolEffector = require('./ToolEffector.js');
const Brush = require('./Brush.js');
const Eyedropper = require('./Eyedropper.js');
const BrushPreview = require('./BrushPreview.js');
const Surface = require('./Surface.js');
const fnutils = require('./fnutils.js');

const mathutils = require('./mathutils.js');



//========================================================= Iris
const irisElement = document.getElementById('main-iris');
const irisInputs = document.getElementById('picker-inputs');
const irisModes = document.getElementById('picker-modes');
const irisIndicator = document.getElementById('picker-indicator');
const iris = new Iris(irisElement, irisInputs);

const lightnessSlider = new Slider(50, 0, 100, 1/255)
	.classes('lightness')
	.bind(iris.palettes['sameLightness'].uniforms, "lightness")
	.on('change', () => {
		iris.emitColors.call(iris, 'pickend', null, false);
	});
const hueSlider = new Slider(0, 0, 360, 1)
	.classes('hue')
	.bind(iris.palettes['sameHue'].uniforms, "hue")
	.transform(x => x/180*Math.PI)
	.hide();
const inputs = new PanelGroup(irisInputs)
	.add(lightnessSlider)
	.add(hueSlider);


const modes = new PanelGroup(irisModes);
let selectedModeElement;
const sameLightnessButton = new Button('Colors')
	.bind(() => {
		selectedModeElement = sameLightnessButton._element;
		hueSlider.hide();
		lightnessSlider.unhide();
		sameLightnessButton._element.style.borderTopColor = '';
		sameHueButton._element.style.borderTopColor = 'transparent';
		iris.setMode('sameLightness');
	});
const sameHueButton = new Button('Shades')
	.bind(() => {
		selectedModeElement = sameHueButton._element;
		lightnessSlider.hide();
		hueSlider.unhide();
		sameHueButton._element.style.borderTopColor = '';
		sameLightnessButton._element.style.borderTopColor = 'transparent';
		iris.setMode('sameHue');
	});
const modeButtonGroup = new ButtonGroup()
	.add(sameLightnessButton)
	.add(sameHueButton);


modes.add(modeButtonGroup);
	


//========================================================= Surface
const surface = new Surface(document.getElementById('art'));
document.getElementById('clear-canvas').addEventListener('click', function () {
	surface.clear();
});
surface.on('sample', c => lightnessSlider.value = c[0]);



//========================================================= Brush
const brush = new Brush(surface, {
	smoothInputs: ['pressure']
});
brush.minSize = 2;
brush.setImage(document.getElementById('brush-shape-inky'))

// const angleEffector = new ToolEffector('angle', (brush, event) => {
// 	const symm = brush.hasSymmetricalEmphasis ? 2 : 1;
// 	return Math.cos((Math.PI - event.direction + brush.calligAngle) * symm) *.5 +.5;
// });
const angleEffector = new ToolEffector('angle', (brush, e) => e.direction);
const speedEffector = new ToolEffector('size', (brush, e) => {
	const s = Math.sqrt(e.squaredSpeed);
	return s/(s+brush.speedScale);
});
const pressureEffector = new ToolEffector('size', (brush, e) => mathutils.lerp(e.progress, e.penPressure, e.lastPressure));
const pressureFlowEffector = new ToolEffector('flow', (brush, e) => e.penPressure);

brush.addEffector([angleEffector, speedEffector, pressureFlowEffector], false);
brush.addEffector([pressureEffector], true);

const brushPreview = new BrushPreview(document.getElementById('brush-preview'));
brushPreview.setBrush(brush);
brushPreview.draw();
brush.on('changeend', x => brushPreview.draw.call(brushPreview));

const minSizeSlider = new Slider(3, 0, 5, 0.01)
	.transform(x => Math.exp(x))
	.bind(val => brush.set.call(brush, 'minSize', val));
const pressureSlider = new Slider(0, -50, 50, 1)
	.bind(val => pressureEffector.set.call(pressureEffector, 'scale', val));
const pressureFlowSlider = new Slider(0, 0, 1, .01)
	.bind(val => pressureFlowEffector.set.call(pressureFlowEffector, 'scale', val));
const brushInputs = new PanelGroup(document.getElementById('brush-inputs'))
	.add(minSizeSlider)
	.add(new Spacer())
	.add(pressureSlider)
	.add(pressureFlowSlider)


const eyedropper = new Eyedropper(surface.canvas);



//========================================================= Wiring
iris.on('pickend', e => brush.setColor.call(brush, e));

iris.on(['pick', 'pickend'], data => {
	irisIndicator.style.backgroundColor = `rgba(${data.slice(0,3).join(',')}, 1)`;
})
eyedropper.on('pick', data => {
	irisIndicator.style.backgroundColor = `rgba(${data.rgba.slice(0,3).join(',')}, 1)`;
});
eyedropper.on('pickend', fnutils.throttle(data => {
	iris._highlight.movePolarNormal.call(iris._highlight, - mathutils.radians(data.hsl[0]), data.hsl[1]/100);
	iris.palettes['sameLightness'].uniforms.lightness = data.hsl[2];
	brush.setColor(data.rgba);
}), 150);