const Iris = require('./Iris.js');

const irisElement = document.getElementById('main-iris');
const irisInputs = document.getElementById('picker-inputs');
const iris = new Iris(irisElement, irisInputs);

window.iris = iris;