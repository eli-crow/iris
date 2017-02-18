const Iris = require('./Iris.js');

const iris = new Iris(document.getElementById('main-iris'));

// const lightnessSlider = new Slider(0, 1, 1/255);

// const inputs = new InputList('picker-inputs');
// // inputs.add(hueSlider);
// inputs.add(lightnessSlider);
// 
window.iris = iris;