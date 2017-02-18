const Iris = require('./Iris.js');
const Slider = require('./Slider.js');
const PanelGroup = require('./PanelGroup.js');

const iris = new Iris(document.getElementById('main-iris'));
const lightness = new Slider(0, 1, 1/255);

const inputs = new PanelGroup('picker-inputs');
inputs.add(lightness);

console.log(inputs);

// const lightnessSlider = new Slider(0, 1, 1/255);

// const inputs = new InputList('picker-inputs');
// // inputs.add(hueSlider);
// inputs.add(lightnessSlider);
// 
window.iris = iris;