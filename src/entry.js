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
	.bind(iris.palettes['Colors A'].uniforms, "lightness")
	.on('change', () => {
		iris.emitColors.call(iris, 'pickend', null, false);
	});
const lightnessHSLSlider = new Slider(.5, 0, 1, 1/255)
	.classes('lightness')
	.bind(iris.palettes['Colors B'].uniforms, "lightness")
	.on('change', () => {
		iris.emitColors.call(iris, 'pickend', null, false);
	})
	.hide();
const hueSlider = new Slider(0, 0, 360, 1)
	.classes('hue')
	.bind(iris.palettes['Tones'].uniforms, "hue")
	.transform(x => x/180*Math.PI)
	.hide();
const inputs = new PanelGroup(irisInputs)
	.add(lightnessSlider)
	.add(lightnessHSLSlider)
	.add(hueSlider);



const modeButtonGroup = new ButtonGroup();

function setMode (name, slider, button) {
	iris.setMode(name);
	slider.unhide();
	button._element.style.borderTopColor = '';
	inputs.each(slider, input => input.hide() );
	modeButtonGroup.each(button, btn => btn._element.style.borderTopColor = 'transparent');
}
const sameLightnessButton = new Button('Colors A')
	.bind(() => setMode("Colors A", lightnessSlider, sameLightnessButton));
const sameLightnessHSLButton = new Button('Colors B')
	.bind(() => setMode("Colors B", lightnessHSLSlider, sameLightnessHSLButton));
const sameHueButton = new Button('Shades')
	.bind(() => setMode("Tones", hueSlider, sameHueButton));

modeButtonGroup.add(sameLightnessButton)
	.add(sameLightnessHSLButton)
	.add(sameHueButton);

setMode("Colors A", lightnessSlider, sameLightnessButton)

const modes = new PanelGroup(irisModes)
	.add(modeButtonGroup);


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
brush.setImage("./img/brush.png")

// img.brush-data#brush-shape-bristles(src = "./img/brush.png")
// img.brush-data#brush-shape-inky(src = "./img/brush_inky.png")

// const angleEffector = new ToolEffector('angle', (brush, event) => {
// 	const symm = brush.hasSymmetricalEmphasis ? 2 : 1;
// 	return Math.cos((Math.PI - event.direction + brush.calligAngle) * symm) *.5 +.5;
// });
const angleEffector = new ToolEffector('angle', (brush, e) => e.direction);
const speedEffector = new ToolEffector('size', (brush, e) => {
	const s = Math.sqrt(e.squaredSpeed);
	return s/(s+brush.speedScale);
});
const pressureEffector = new ToolEffector('size', (brush, e) => {
	return e.penPressure;
});
const pressureFlowEffector = new ToolEffector('flow', (brush, e) => e.penPressure);

brush.addEffector([angleEffector, speedEffector, pressureFlowEffector], false);
brush.addEffector([pressureEffector], true);

const brushPreview = new BrushPreview(document.getElementById('brush-preview'));
brushPreview.setBrush(brush);
brushPreview.draw();
brush.on('changeend', x => brushPreview.draw.call(brushPreview));

const minSizeSlider = new Slider(3, 0, 5, 0.01, 'brushSize')
	.transform(x => Math.exp(x))
	.bind(val => brush.set.call(brush, 'minSize', val));
const pressureSlider = new Slider(0, -50, 50, 1, 'pressureSize')
	.bind(val => pressureEffector.set.call(pressureEffector, 'scale', val));
const pressureFlowSlider = new Slider(0, 0, 1, .01, 'pressureFlow')
	.bind(val => pressureFlowEffector.set.call(pressureFlowEffector, 'scale', val));
const brushInputs = new PanelGroup(document.getElementById('brush-inputs'))
	.add(minSizeSlider)
	.add(new Spacer())
	.add(pressureSlider)
	.add(pressureFlowSlider)
	.add(new Spacer())


const eyedropper = new Eyedropper(surface.canvas);

let __erase = false;
document.getElementById('eraser').addEventListener('click', function () {
	__erase = !__erase;
	brush.set('erase', __erase);
});

//========================================================= Wiring
iris.on('pickend', data => brush.setColor.call(brush, data));

iris.on(['pick', 'pickend'], data => {
	irisIndicator.style.backgroundColor = `rgba(${data.slice(0,3).join(',')}, 1)`;
})
eyedropper.on('pick', fnutils.throttle(data => {
	iris._highlight.movePolarNormal.call(iris._highlight, - mathutils.radians(data.hsl[0]), data.hsl[1]/100);
	iris.palettes['Colors A'].uniforms.lightness = data.hsl[2];
	irisIndicator.style.backgroundColor = `rgba(${data.rgba.slice(0,3).join(',')}, 1)`;
}), 50);
eyedropper.on('pickend', data => brush.setColor.call(brush, data.rgba));