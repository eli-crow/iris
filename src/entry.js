const Iris = require('./Iris.js');

const Panel = require('./Panel.js');
const ToolManager = require('./ToolManager.js');
const Surface = require('./Surface.js');

const mathutils = require('./mathutils.js');


//========================================================= Iris
const irisElement = document.getElementById('main-iris');
const irisInputs = document.getElementById('picker-inputs');
const irisModes = document.getElementById('picker-modes');
const irisIndicator = document.getElementById('picker-indicator');
const iris = new Iris(irisElement, irisInputs);

iris.on('pickend', data => toolManager.setColor(data));
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

modeButtonGroup
	.add(sameLightnessButton)
	.add(sameLightnessHSLButton)
	.add(sameHueButton);

setMode("Colors A", lightnessSlider, sameLightnessButton);

const modes = new Panel.Group(irisModes)
	.add(modeButtonGroup);


//========================================================= Surface
const surface = new Surface(document.getElementById('art'));
document.getElementById('clear-canvas').addEventListener('click', () => surface.clear());
surface.on('sample', c => lightnessSlider.value = c[0]);

const toolManager = new ToolManager(surface);


document.getElementById('download').addEventListener('click', function () {
	this.href = surface.getDataURL();
	this.download = "IrisDoodle.png";
});



//info dump
console.log('user agent:			' + navigator.userAgent);