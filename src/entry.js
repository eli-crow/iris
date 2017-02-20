const Iris = require('./Iris.js');
const Slider = require('./Slider.js');
const Button = require('./Button.js');
const ButtonGroup = require('./ButtonGroup.js');
const PanelGroup = require('./PanelGroup.js');
const Spacer = require('./Spacer.js');

const irisElement = document.getElementById('main-iris');
const irisInputs = document.getElementById('picker-inputs');
const irisModes = document.getElementById('picker-modes');
const irisIndicator = document.getElementById('picker-indicator');
const iris = new Iris(irisElement, irisInputs);

iris.on(['pick', 'pickend'], function (data) {
	irisIndicator.style.backgroundColor = `rgba(${data.slice(0,3).join(',')}, 1)`;
})

const lightnessSlider = new Slider(0.5, 0, 1, 1/255)
	.classes('lightness')
	.bind(iris.palettes['sameLightness'].uniforms, "lightness")
	.transform(x => x*1.17 - 0.17);
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
		hueSlider.hide();
		lightnessSlider.unhide();
		iris.setMode('sameLightness');
	});
const sameHueButton = new Button('Tones')
	.bind(() => {
		lightnessSlider.hide();
		hueSlider.unhide();
		iris.setMode('sameHue');
	});
const modeButtonGroup = new ButtonGroup()
	.add(sameLightnessButton)
	.add(sameHueButton);

const modes = new PanelGroup(irisModes)
	.add(modeButtonGroup);

window.iris = iris;