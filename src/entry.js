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

iris.on('pick', function (data) {
	irisIndicator.style.backgroundColor = `rgba(${data.slice(0,3).join(',')}, 1)`;
})

const modeButtonGroup = new ButtonGroup();
for (let paletteID in iris.palettes) {
	const btn = new Button(iris.palettes[paletteID].name)
		.bind(() => iris.setMode(paletteID));
	modeButtonGroup.add(btn);
}
const modes = new PanelGroup(irisModes)
	.add(modeButtonGroup);

const lightnessSlider = new Slider(0.5, 0, 1, 1/255)
	.classes('lightness')
	.bind(iris.palettes['sameLightness'].uniforms, "lightness")
	.transform(x => x*1.17 - 0.17);
const hueSlider = new Slider(0, 0, 360, 1)
	.classes('hue')
	.bind(iris.palettes['sameHue'].uniforms, "hue")
	.transform(x => x/180*Math.PI);
const inputs = new PanelGroup(irisInputs)
	.add(lightnessSlider)
	.add(hueSlider);

window.iris = iris;