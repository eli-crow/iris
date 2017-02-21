const Iris = require('./Iris.js');

const Slider = require('./Slider.js');
const Button = require('./Button.js');
const ButtonGroup = require('./ButtonGroup.js');
const PanelGroup = require('./PanelGroup.js');
const Spacer = require('./Spacer.js');

const Brush = require('./Brush.js');

const fnutils = require('./fnutils.js');


const UNDERLINE_COLOR = '#D3CDC9';



const irisElement = document.getElementById('main-iris');
const irisInputs = document.getElementById('picker-inputs');
const irisModes = document.getElementById('picker-modes');
const irisIndicator = document.getElementById('picker-indicator');
const iris = new Iris(irisElement, irisInputs);
window.iris = iris;

const lightnessSlider = new Slider(0.5, -.17, 1, 1/255)
	.classes('lightness')
	.bind(iris.palettes['sameLightness'].uniforms, "lightness")
const hueSlider = new Slider(0, 0, 360, 1)
	.classes('hue')
	.bind(iris.palettes['sameHue'].uniforms, "hue")
	.transform(x => x/180*Math.PI)
	.hide();
const inputs = new PanelGroup(irisInputs)
	.add(lightnessSlider)
	.add(hueSlider);

// for (let paletteID in iris.palettes) {
// 	const btn = new Button(iris.palettes[paletteID].name)
// 		.bind(() => iris.setMode(paletteID));
// 	modeButtonGroup.add(btn);
// }

//for now
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

let selectedModeElement = sameLightnessButton._element;
let currentColor;
iris.on(['pick', 'pickend'], function (data) {
	const rgba =`rgba(${data.slice(0,3).join(',')}, 1)`;
	irisIndicator.style.backgroundColor   = rgba;
	selectedModeElement.style.borderColor = rgba;
	currentColor = rgba;
})


const brushCanvas = document.getElementById('art');
const brushCtx = brushCanvas.getContext('2d');
brushCanvas.width = window.innerWidth;
brushCanvas.height = window.innerHeight;

const brush = new Brush(brushCanvas);
brush.minSize = 3;
brush.pressureSensitivity = 39;
brush.speedSensitivity = -50;
brush.angleSensitivity = 0;

iris.on('pickend', brush.setBrushColor);

var controls = {
  clear: function () {
    brushCtx.clearRect(0, 0, brushCanvas.width, brushCanvas.height);
  },
  resizeCanvas: function () {
    brushCanvas.width  = window.innerWidth;
    brushCanvas.height = window.innerHeight;
  }
};

controls.resizeCanvas();
window.addEventListener('resize', function() {
  controls.resizeCanvas();
});
document.getElementById('clear-canvas').addEventListener('click', function () {
	controls.clear();
});