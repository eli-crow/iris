const Iris = require('./Iris.js');
const Slider = require('./Slider.js');
const Button = require('./Button.js');
const ButtonGroup = require('./ButtonGroup.js');
const PanelGroup = require('./PanelGroup.js');
const Spacer = require('./Spacer.js');
const Brush = require('./Brush.js');
const Surface = require('./Surface.js');
const fnutils = require('./fnutils.js');



//========================================================= Iris
const irisElement = document.getElementById('main-iris');
const irisInputs = document.getElementById('picker-inputs');
const irisModes = document.getElementById('picker-modes');
const irisIndicator = document.getElementById('picker-indicator');
const iris = new Iris(irisElement, irisInputs);
window.iris = iris;

const lightnessSlider = new Slider(50, 0, 100, 1/255)
	.classes('lightness')
	.bind(iris.palettes['sameLightness'].uniforms, "lightness");
const hueSlider = new Slider(0, 0, 360, 1)
	.classes('hue')
	.bind(iris.palettes['sameHue'].uniforms, "hue")
	.transform(x => x/180*Math.PI)
	.hide();
const inputs = new PanelGroup(irisInputs)
	.add(lightnessSlider)
	.add(hueSlider);

const sameLightnessButton = new Button('Colors')
	.bind(() => {
		selectedModeElement = sameLightnessButton._element;
		hueSlider.hide();
		lightnessSlider.unhide();
		sameLightnessButton._element.style.borderTopColor = currentColor;
		sameHueButton._element.style.borderTopColor = 'transparent';
		iris.setMode('sameLightness');
	});
const sameHueButton = new Button('Tones')
	.bind(() => {
		selectedModeElement = sameHueButton._element;
		lightnessSlider.hide();
		hueSlider.unhide();
		sameHueButton._element.style.borderTopColor = currentColor;
		sameLightnessButton._element.style.borderTopColor = 'transparent';
		iris.setMode('sameHue');
	});
const modeButtonGroup = new ButtonGroup()
	.add(sameLightnessButton)
	.add(sameHueButton);

const modes = new PanelGroup(irisModes)
	.add(modeButtonGroup);
	


//========================================================= Brush
const brush = new Brush();
brush.minSize = 2;
brush.pressureSensitivity = 4;
brush.speedSensitivity = 2;
brush.angleSensitivity = 0;
brush.setImage(document.getElementById('brush-shape-bristles'))



//========================================================= Surface
const surface = new Surface(document.getElementById('art'));
surface.setTool(brush);
document.getElementById('clear-canvas').addEventListener('click', function () {
	surface.clear();
});



//========================================================= Wiring
iris.on('pickend', brush.setColor.bind(brush));

let selectedModeElement = sameLightnessButton._element;
let currentColor;
iris.on(['pick', 'pickend'], function (data) {
	const rgba =`rgba(${data.slice(0,3).join(',')}, 1)`;
	irisIndicator.style.backgroundColor   = rgba;
	selectedModeElement.style.borderColor = rgba;
	currentColor = rgba;
})