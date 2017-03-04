const Iris = require('./Iris.js');

const Panel = require('./Panel.js');
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

iris.on('pickend', data => brush.setColor.call(brush, data));
iris.on(['pick', 'pickend'], data => irisIndicator.style.backgroundColor = `rgba(${data.slice(0,3).join(',')}, 1)`);

const lightnessSlider = new Panel.Slider(50, 0, 100, 1/255)
	.classes('lightness')
	.bind(iris.palettes['Colors A'].uniforms, "lightness")
	.on('change', () => iris.emitColors('pickend', null, false));
const lightnessHSLSlider = new Panel.Slider(.5, 0, 1, 1/255)
	.classes('lightness')
	.bind(iris.palettes['Colors B'].uniforms, "lightness")
	.on('change', () => iris.emitColors('pickend', null, false))
	.hide();
const hueSlider = new Panel.Slider(0, 0, 360, 1)
	.classes('hue')
	.bind(iris.palettes['Tones'].uniforms, "hue")
	.on('change', () => iris.emitColors('pickend', null, false))
	.transform(x => x/180*Math.PI)
	.hide();
const inputs = new Panel.Group(irisInputs)
	.add(lightnessSlider)
	.add(lightnessHSLSlider)
	.add(hueSlider);



const modeButtonGroup = new Panel.ButtonGroup();

function setMode (name, slider, button) {
	iris.setMode(name);
	slider.unhide();
	button._element.style.borderTopColor = '';
	inputs.each(slider, input => input.hide() );
	modeButtonGroup.each(button, btn => btn._element.style.borderTopColor = 'transparent');
}
const sameLightnessButton = new Panel.Button('Colors A')
	.bind(() => setMode("Colors A", lightnessSlider, sameLightnessButton));
const sameLightnessHSLButton = new Panel.Button('Colors B')
	.bind(() => setMode("Colors B", lightnessHSLSlider, sameLightnessHSLButton));
const sameHueButton = new Panel.Button('Shades')
	.bind(() => setMode("Tones", hueSlider, sameHueButton));

modeButtonGroup.add(sameLightnessButton)
	.add(sameLightnessHSLButton)
	.add(sameHueButton);

setMode("Colors A", lightnessSlider, sameLightnessButton);

const modes = new Panel.Group(irisModes)
	.add(modeButtonGroup);


//========================================================= Surface
const surface = new Surface(document.getElementById('art'));
document.getElementById('clear-canvas').addEventListener('click', () => surface.clear());
surface.on('sample', c => lightnessSlider.value = c[0]);



//========================================================= Brush
const brush = new Brush(surface, {shape: "./img/brush.png"});

const angleEffector = new ToolEffector('Angle', 'angle', e => e.direction);
const pressureSizeEffector = new ToolEffector('Pressure', 'size', e => e.penPressure);
const pressureFlowEffector = new ToolEffector('Pressure', 'flow', e => e.penPressure);
const speedSizeEffector = new ToolEffector('Speed', 'size', e => {
	const s = Math.sqrt(e.squaredSpeed);
	return s/(s+200);
});
const speedFlowEffector = new ToolEffector('Speed', 'flow', e => {
	const s = Math.sqrt(e.squaredSpeed);
	return s/(s+200);
});

brush.addEffector([angleEffector, speedSizeEffector, speedFlowEffector], false);
brush.addEffector([pressureSizeEffector, pressureFlowEffector], true);

//========================================================= Size
const baseSizeSlider = new Panel.Slider(3, 0, 5, 0.01, 'base')
	.transform(x => Math.exp(x))
	.bind(val => brush.set('baseSize', val));

//========================================================= Flow
const baseFlowSlider = new Panel.Slider(.4, 0, 1, 0.01, 'base')
	.bind(val => brush.set('baseFlow', val));

//========================================================= Shape
const brushShapeSelector = new Panel.BrushShapeSelector([
	'./img/brush.png',
	'./img/brush_smooth.png',
	'./img/brush_inky.png',
	'./img/brush_inky.png',
	'./img/brush_inky.png',
	'./img/brush_inky.png'
]);

brushShapeSelector.on('changeend', data => brush.setShape(data.brushSrc));

const brushInputs = new Panel.TabbedView(document.getElementById('brush-inputs'))
	.add("Size", [baseSizeSlider, pressureSizeEffector.getInputs(), speedSizeEffector.getInputs()])
	.add("Flow", [baseFlowSlider, pressureFlowEffector.getInputs(), speedFlowEffector.getInputs()])
	.add("Shape", [brushShapeSelector])
	.init();

const brushPreview = new BrushPreview(document.getElementById('brush-preview'));
brushPreview.setBrush(brush);
brushPreview.draw();
brush.on('changeend', x => brushPreview.draw.call(brushPreview));


const eyedropper = new Eyedropper(surface.canvas);

document.getElementById('download').addEventListener('click', function () {
	this.href = surface.getDataURL();
	this.download = "IrisDoodle.png";
});

let __erase = false;
document.getElementById('eraser').addEventListener('click', function () {
	__erase = !__erase;
	brush.set('erase', __erase);
});
eyedropper.on('pick', fnutils.throttle(data => {
	iris._highlight.movePolarNormal(-1 * mathutils.radians(data.hsl[0]), data.hsl[1]/100);
	iris.palettes['Colors A'].uniforms.lightness = data.hsl[2];
	irisIndicator.style.backgroundColor = `rgba(${data.rgba.slice(0,3).join(',')}, 1)`;
	lightnessSlider._input.value = data.hsl[2];
}), 50);
eyedropper.on('pickend', data => brush.setColor(data.rgba));


//========================================================= Wiring




//info dump
console.log('user agent:			' + navigator.userAgent);